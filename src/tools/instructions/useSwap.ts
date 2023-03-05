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

	const accountBase = gotUserStore.getTokenAccountAddress(
		vaultsSupport[foundFrom.index].baseTokenAddress
	);
	const accountQuote = gotUserStore.getTokenAccountAddress(
		vaultsSupport[foundFrom.index].quoteTokenAddress
	);

	if (!accountBase || !accountQuote) throw new Error("Couldn't find token account");

	const preInstructions: TransactionInstruction[] = [];
	if (foundFrom.base) {
		if ((await connection.getAccountInfo(accountBase)) === null)
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					walletAddress,
					accountBase,
					walletAddress,
					vaultsSupport[foundFrom.index].baseTokenAddress
				)
			);
	} else {
		if ((await connection.getAccountInfo(accountQuote)) === null)
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					walletAddress,
					accountQuote,
					walletAddress,
					vaultsSupport[foundFrom.index].quoteTokenAddress
				)
			);
	}

	const tx = await program.methods
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
			accountBase,
			accountQuote,
			reserveBase: new PublicKey(vaultsAccounts.base_reserve(foundFrom.index)),
			reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(foundFrom.index)),
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.preInstructions(preInstructions)
		.transaction();

	const signature = await signAndSendTransaction(connection, wallet, tx);
	console.log('Swapped', tx, signature);
}
