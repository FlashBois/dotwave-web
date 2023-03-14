import type { Position, Side } from '$components/Trade/types';
import { anchorStore } from '$src/stores/anchorStore';
import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
import { userStore } from '$src/stores/userStore';
import { walletStore } from '$src/stores/walletStore';
import { BN } from '@project-serum/anchor';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ComputeBudgetProgram, PublicKey, Transaction, type Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { useSignAndSendTransaction } from '../wallet/useSignAndSendTransaction';
import { useAddCreateIfNotExists } from './useAddCreateIfNotExists';
import { useCreateStatement } from './useCreateStatement';

export async function useChangePosition(
	connection: Connection,
	amount: Decimal,
	side: Side,
	support: IVaultSupport,
	position?: Position
) {
	const { program } = get(anchorStore);

	const parsed = new Decimal(amount)
		.mul(10 ** support.baseTokenInfo.decimals)
		.floor()
		.toString();

	const wallet = get(walletStore);
	const protocolState = get(protocolStateStore);
	const user = get(userStore);
	if (!wallet.publicKey) throw new Error('Wallet not connected');
	if (!protocolState?.vaultsAccounts) throw new Error('Vaults not loaded');

	if (!user.statementAddress) throw new Error('Statement not loaded');

	const tx = new Transaction()

	tx.add(
		ComputeBudgetProgram.setComputeUnitLimit({
			units: 1000000
		})
	);

	console.log(user.statementAddress, program.programId.toBase58());

	const accountBase = await getAssociatedTokenAddress(support.baseTokenAddress, wallet.publicKey);
	const accountQuote = await getAssociatedTokenAddress(support.quoteTokenAddress, wallet.publicKey);
	if (!accountBase || !accountQuote) throw new Error("Couldn't find token account");

	await useAddCreateIfNotExists(tx, connection, [
		support.baseTokenAddress,
		support.quoteTokenAddress
	]);

	if (!(await connection.getAccountInfo(user.statementAddress)))
		tx.add(await useCreateStatement(program, { payer: wallet.publicKey }));

	const remainingAccounts = (user.statement?.vaults_to_refresh(support.id) ?? [])
		.reduce(
			(acc: PublicKey[], v: number) =>
				acc.concat(
					protocolState.vaultsSupport[v].baseOracle,
					protocolState.vaultsSupport[v].quoteOracle
				),
			[]
		)
		.map((pubkey: PublicKey) => {
			return {
				isSigner: false,
				isWritable: false,
				pubkey
			};
		});

	if (position)
		tx.add(
			await program.methods
				.closePosition(support.id)
				.accounts({
					state: protocolState.stateAddress,
					vaults: protocolState.vaultsAddress,
					statement: user.statementAddress,
					signer: wallet.publicKey,
					accountBase,
					accountQuote,
					reserveBase: new PublicKey(protocolState.vaultsAccounts.base_reserve(support.id)),
					reserveQuote: new PublicKey(protocolState.vaultsAccounts.quote_reserve(support.id)),
					tokenProgram: TOKEN_PROGRAM_ID
				})
				.remainingAccounts(remainingAccounts)
				.instruction()
		);

	if (amount.gt(0))
		tx.add(
			await program.methods
				.openPosition(support.id, new BN(parsed), side === 'long' ? true : false)
				.accounts({
					state: protocolState.stateAddress,
					vaults: protocolState.vaultsAddress,
					statement: user.statementAddress,
					signer: wallet.publicKey
				})
				.remainingAccounts(remainingAccounts)
				.instruction()
		);

	const signature = await useSignAndSendTransaction(connection, wallet, tx, undefined, true);
	console.log('Opened position', tx, signature);
}
