import { PublicKey, type Connection, type GetTokenAccountsByOwnerConfig } from '@solana/web3.js';
import { getAssociatedTokenAccountSync } from './getAssociatedTokenAccountSync';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface ITokenAccount {
    publicKey?: PublicKey,
    mint: PublicKey,
    isAssociated?: boolean,
    amount: bigint,
    isNative: boolean
}

export async function getWalletTokenAccounts({
	connection,
	owner,
	config
}: {
	connection: Connection;
	owner: PublicKey;
	config?: GetTokenAccountsByOwnerConfig;
}): Promise<{ accounts: ITokenAccount[]; }> {
	const txConfig = { ...{}, ...config };

	const solReq = connection.getAccountInfo(owner, txConfig.commitment);
	const tokenReq = connection.getTokenAccountsByOwner(
		owner,
		{ programId: TOKEN_PROGRAM_ID },
		txConfig.commitment
	);

	const [solResp, tokenResp] = await Promise.all([solReq, tokenReq]);

	const accounts: ITokenAccount[] = [];

	for (const { pubkey, account } of tokenResp.value) {
		if (account.data.length !== AccountLayout.span) {
			throw new Error('Invalid token account layout length');
		}

		const rawResult = AccountLayout.decode(account.data);
		const { mint, amount } = rawResult;

		const associatedTokenAddress = getAssociatedTokenAccountSync(owner, mint);
		accounts.push({
			publicKey: pubkey,
			mint,
			isAssociated: associatedTokenAddress.equals(pubkey),
			amount,
			isNative: false
		});
	}

	accounts.push({
		amount: BigInt(solResp ? String(solResp.lamports) : 0),
		isNative: true,
		mint: new PublicKey('So11111111111111111111111111111111111111112')
	});

	return { accounts };
}
