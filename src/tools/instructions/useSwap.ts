import { anchorStore } from '$src/stores/anchorStore';
import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { userStore } from '$src/stores/userStore';
import type { WalletStore } from '$src/stores/walletStore';
import { BN } from '@project-serum/anchor';
import { createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ComputeBudgetProgram, PublicKey, Transaction, type Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { findVaultId } from '../findVault';
import { useSignAndSendTransaction } from '../wallet/useSignAndSendTransaction';

export async function useSwap(
	connection: Connection,
	wallet: WalletStore,
	amount: number,
	expectedAmount: number
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const walletAddress = wallet.publicKey!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { vaultsSupport, stateAddress, vaultsAddress, vaultsAccounts } = get(protocolStateStore)!;
	const { from, to, slippagePercentage } = get(swapStore);
	const { program } = get(anchorStore);
	const gotUserStore = get(userStore);

	if (!vaultsAccounts) throw new Error('Vaults not loaded');

	const foundFrom = findVaultId(vaultsSupport, new PublicKey(from.address));
	const foundTo = findVaultId(vaultsSupport, new PublicKey(to.address));

	if (!foundFrom && !foundTo) {
		throw new Error('Vault not found');
	}

	const parsedAmount = new Decimal(amount)
		.mul(10 ** from.decimals)
		.floor()
		.toString();

	const parsedExpectedAmount = new Decimal(expectedAmount)
		.mul(new Decimal(1).sub(new Decimal(slippagePercentage).div(100)))
		.floor()
		.toString();

	const double = foundFrom && foundTo;

	const mintFrom = foundFrom
		? vaultsSupport[foundFrom.id].baseTokenAddress
		: vaultsSupport[foundTo!.id].quoteTokenAddress

	const mintTo = foundTo
		? vaultsSupport[foundTo.id].baseTokenAddress
		: vaultsSupport[foundFrom!.id].quoteTokenAddress

	const accountFrom = gotUserStore.getTokenAccountAddress(mintFrom);
	const accountTo = gotUserStore.getTokenAccountAddress(mintTo);

	if (!accountFrom || !accountTo) throw new Error("Couldn't find token account");

	const tx = new Transaction();

	tx.add(
		ComputeBudgetProgram.setComputeUnitLimit({
			units: 1400000
		})
	);

	if ((await connection.getAccountInfo(accountTo)) === null) {
		tx.add(
			createAssociatedTokenAccountInstruction(
				walletAddress,
				accountTo,
				walletAddress,
				mintTo
			)
		);
	}


	if (!double) {
		const vault = foundFrom ? foundFrom.id : foundTo!.id

		tx.add(
			await program.methods
				.singleSwap(
					vault,
					new BN(parsedAmount),
					new BN(parsedExpectedAmount),
					foundFrom ? true : false,
					false
				)
				.accounts({
					state: stateAddress,
					vaults: vaultsAddress,
					signer: walletAddress,
					accountBase: foundFrom ? accountFrom : accountTo,
					accountQuote: foundFrom ? accountTo : accountFrom,
					reserveBase: new PublicKey(vaultsAccounts.base_reserve(vault)),
					reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(vault)),
					tokenProgram: TOKEN_PROGRAM_ID
				})
				.remainingAccounts([
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[vault].baseOracle
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[vault].quoteOracle
					}
				])
				.instruction()
		);
	} else {
		tx.add(
			await program.methods
				.doubleSwap(
					foundFrom.id,
					foundTo.id,
					new BN(parsedAmount),
					new BN(parsedExpectedAmount),
					false
				)
				.accounts({
					state: stateAddress,
					vaults: vaultsAddress,
					signer: walletAddress,
					accountIn: accountFrom,
					accountOut: accountTo,
					reserveIn: new PublicKey(vaultsAccounts.base_reserve(foundFrom.id)),
					reserveInQuote: new PublicKey(vaultsAccounts.quote_reserve(foundFrom.id)),
					reserveOut: new PublicKey(vaultsAccounts.base_reserve(foundTo.id)),
					reserveOutQuote: new PublicKey(vaultsAccounts.quote_reserve(foundTo.id)),
					tokenProgram: TOKEN_PROGRAM_ID
				})
				.remainingAccounts([
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[foundFrom.id].baseOracle
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[foundFrom.id].quoteOracle
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[foundTo.id].baseOracle
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[foundTo.id].quoteOracle
					}
				])
				.instruction()
		);
	}

	const signature = await useSignAndSendTransaction(connection, wallet, tx);
	return signature
}
