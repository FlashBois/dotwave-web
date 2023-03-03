import { anchorStore } from '$src/stores/anchorStore';
import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { userStore } from '$src/stores/userStore';
import type { WalletStore } from '$src/stores/walletStore';
import { BN } from '@project-serum/anchor';
import { createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, TransactionInstruction, type Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { findVault } from '../findVault';
import { signAndSendTransaction } from '../wallet/sending';

export async function useSingleSwap(
	connection: Connection,
	wallet: WalletStore,
	amount: number,
	expectedAmount: number
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const walletAddress = wallet.publicKey!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { vaultsSupport, stateAddress, vaultsAddress, vaultsAccounts } = get(protocolStateStore)!;
	const { from, slippagePercentage } = get(swapStore);
	const { program } = get(anchorStore);
	const gotUserStore = get(userStore);

	if (!vaultsAccounts) throw new Error('Vaults not loaded');

	const found = findVault(vaultsSupport, new PublicKey(from.address));
	if (!found) {
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

	const accountBase = gotUserStore.getTokenAccountAddress(
		vaultsSupport[found.index].baseTokenAddress
	);
	const accountQuote = gotUserStore.getTokenAccountAddress(
		vaultsSupport[found.index].quoteTokenAddress
	);

	if (!accountBase || !accountQuote) throw new Error("Couldn't find token account");

	const preInstructions: TransactionInstruction[] = [];
	if (found.base) {
		if ((await connection.getAccountInfo(accountBase)) === null)
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					walletAddress,
					accountBase,
					walletAddress,
					vaultsSupport[found.index].baseTokenAddress
				)
			);
	} else {
		if ((await connection.getAccountInfo(accountQuote)) === null)
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					walletAddress,
					accountQuote,
					walletAddress,
					vaultsSupport[found.index].quoteTokenAddress
				)
			);
	}

	const tx = await program.methods
		.singleSwap(found.index, new BN(parsedAmount), new BN(parsedExpectedAmount), found.base, false)
		.accounts({
			state: stateAddress,
			vaults: vaultsAddress,
			signer: walletAddress,
			accountBase,
			accountQuote,
			reserveBase: new PublicKey(vaultsAccounts.base_reserve(found.index)),
			reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(found.index)),
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.preInstructions(preInstructions)
		.transaction();

	const signature = await signAndSendTransaction(connection, wallet, tx);
	console.log('Swapped', tx, signature);
}
