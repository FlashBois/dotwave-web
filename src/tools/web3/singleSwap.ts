import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import type { WalletStore } from '$src/stores/walletStore';
import {
	createAssociatedTokenAccountInstruction,
	createMintToInstruction,
	getAssociatedTokenAddress,
	mintTo
} from '@solana/spl-token';
import { Keypair, PublicKey, Transaction, type Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { signAndSendTransaction } from '../wallet/sending';

export const minter = Keypair.fromSecretKey(
	Uint8Array.from(
		Buffer.from(
			'5e7ef659746de5b63e8a215f2c72cf4a293603cfb312545158e59907f269878c10bf87918327eb281d0e0e98725fce76ebb3a7bb530003d591115d49b5a8431d',
			'hex'
		)
	)
);

const MAX_TOKENS_TO_MINT = 6;

export async function useSingleSwap(connection: Connection, wallet: WalletStore, amount: number) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const walletAddress = wallet.publicKey!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const vaults = get(protocolStateStore).vaultsAccounts!;
	const { from, to } = get(swapStore);

	const rounded = new Decimal(amount).mul(10 ** from.decimals).floor();
	const parsedAmount = BigInt(rounded.toString());

	const tx = new Transaction();

	const signature = await signAndSendTransaction(connection, wallet, tx);
	console.log('Swapped', tx, signature);
}
