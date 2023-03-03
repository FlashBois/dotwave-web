import { protocolStateStore } from '$src/stores/protocolStateStore';
import type { WalletStore } from '$src/stores/walletStore';
import {
	createAssociatedTokenAccountInstruction,
	createMintToInstruction,
	getAssociatedTokenAddress,
	mintTo
} from '@solana/spl-token';
import { Keypair, PublicKey, Transaction, type Connection } from '@solana/web3.js';
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

export async function useMintDevnetTokens(connection: Connection, wallet: WalletStore) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const walletAddress = wallet.publicKey!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const vaults = get(protocolStateStore).vaultsAccounts!;

	const solBalance = await connection.getBalance(walletAddress);

	if (solBalance < 0.01 * 1e9) {
		await connection.requestAirdrop(walletAddress, 0.1 * 1e9);
	}

	const tokens = [new PublicKey(vaults.quote_token(0))];

	for (let i = 0; i < vaults.vaults_len() && i < MAX_TOKENS_TO_MINT; i++) {
		tokens.push(new PublicKey(vaults.base_token(i)));
	}

	console.log('Minting tokens', tokens);

	const accountAddresses = await Promise.all(
		tokens.map((token) => getAssociatedTokenAddress(token, walletAddress))
	);

	const accounts = await Promise.all(
		accountAddresses.map((token) => connection.getAccountInfo(token))
	);

	const tx = new Transaction();

	accountAddresses
		.map((address, i) =>
			createAssociatedTokenAccountInstruction(walletAddress, address, walletAddress, tokens[i])
		)
		.filter((_, i) => !accounts[i])
		.forEach((instruction) => tx.add(instruction));

	accountAddresses.forEach((address, i) => {
		tx.add(createMintToInstruction(tokens[i], address, minter.publicKey, 1e7));
	});

	const signature = await signAndSendTransaction(connection, wallet, tx, [minter]);
	console.log('Minted tokens', tx, signature);
}
