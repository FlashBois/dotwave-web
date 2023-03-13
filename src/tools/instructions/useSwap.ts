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
import { findVault } from '../findVault';
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

	const foundFrom = findVault(vaultsSupport, new PublicKey(from.address));
	const foundTo = findVault(vaultsSupport, new PublicKey(to.address));
	if (!foundFrom || !foundTo) {
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

	const double = foundFrom.base && foundTo.base;

	const accountFrom = gotUserStore.getTokenAccountAddress(
		foundFrom.base
			? vaultsSupport[foundFrom.index].baseTokenAddress
			: vaultsSupport[foundFrom.index].quoteTokenAddress
	);
	const accountTo = gotUserStore.getTokenAccountAddress(
		foundTo.base
			? vaultsSupport[foundTo.index].baseTokenAddress
			: vaultsSupport[foundFrom.index].quoteTokenAddress
	);
	if (!accountFrom || !accountTo) throw new Error("Couldn't find token account");

	const tx = new Transaction();

	tx.add(
		ComputeBudgetProgram.setComputeUnitLimit({
			units: 1000000
		})
	);

	if ((await connection.getAccountInfo(accountTo)) === null) {
		tx.add(
			createAssociatedTokenAccountInstruction(
				walletAddress,
				accountTo,
				walletAddress,
				foundTo.base
					? vaultsSupport[foundTo.index].baseTokenAddress
					: vaultsSupport[foundFrom.index].quoteTokenAddress
			)
		);
	}

	if (!double) {
		tx.add(
			await program.methods
				.singleSwap(
					foundFrom.index,
					new BN(parsedAmount),
					new BN(parsedExpectedAmount),
					foundFrom.base,
					false
				)
				.accounts({
					state: stateAddress,
					vaults: vaultsAddress,
					signer: walletAddress,
					accountBase: foundFrom.base ? accountFrom : accountTo,
					accountQuote: foundFrom.base ? accountTo : accountFrom,
					reserveBase: new PublicKey(vaultsAccounts.base_reserve(foundFrom.index)),
					reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(foundFrom.index)),
					tokenProgram: TOKEN_PROGRAM_ID
				})
				.remainingAccounts([
					{
						isSigner: false,
						isWritable: false,
						pubkey: new PublicKey(vaultsAccounts.oracle_base(foundFrom.index))
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: new PublicKey(vaultsAccounts.oracle_quote(foundFrom.index))
					}
				])
				.instruction()
		);
	} else {
		tx.add(
			await program.methods
				.doubleSwap(
					foundFrom.index,
					foundTo.index,
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
					reserveIn: new PublicKey(vaultsAccounts.base_reserve(foundFrom.index)),
					reserveInQuote: new PublicKey(vaultsAccounts.quote_reserve(foundFrom.index)),
					reserveOut: new PublicKey(vaultsAccounts.base_reserve(foundTo.index)),
					reserveOutQuote: new PublicKey(vaultsAccounts.quote_reserve(foundTo.index)),
					tokenProgram: TOKEN_PROGRAM_ID
				})
				.remainingAccounts([
					{
						isSigner: false,
						isWritable: false,
						pubkey: new PublicKey(vaultsAccounts.base_reserve(foundFrom.index))
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: new PublicKey(vaultsAccounts.quote_reserve(foundFrom.index))
					}
				])
				.instruction()
		);
	}

	const signature = await useSignAndSendTransaction(connection, wallet, tx);
	console.log('Swapped', tx, signature);
	return signature
}
