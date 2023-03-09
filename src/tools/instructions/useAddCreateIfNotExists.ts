import { userStore } from '$src/stores/userStore';
import { walletStore } from '$src/stores/walletStore';
import {
	createAssociatedTokenAccountInstruction,
	getAssociatedTokenAddress
} from '@solana/spl-token';
import type { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { get } from 'svelte/store';

export async function useAddCreateIfNotExists(
	tx: Transaction,
	connection: Connection,
	tokens: PublicKey[]
) {
	const wallet = get(walletStore);
	const user = get(userStore);

	if (!user.statementAddress || !wallet?.publicKey) throw new Error('Statement not loaded');

	for (const token of tokens) {
		const account = await getAssociatedTokenAddress(token, wallet.publicKey);

		if (!account) throw new Error("Couldn't find token account");

		if ((await connection.getAccountInfo(account)) === null) {
			tx.add(
				createAssociatedTokenAccountInstruction(wallet.publicKey, account, wallet.publicKey, token)
			);
		}
	}
}
