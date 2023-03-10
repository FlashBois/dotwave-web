import type { Protocol } from '$src/utils/Idl/protocol';
import type { BN, Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js';

interface IWithdrawAccounts {
	state: PublicKey;
	vaults: PublicKey;
	accountBase: PublicKey;
	accountQuote: PublicKey;
	statement: PublicKey;
	signer: PublicKey;
	reserveBase: PublicKey;
	reserveQuote: PublicKey;
}

export async function useWithdraw(
	program: Program<Protocol>,
	vaultId: number,
	strategyId: number,
	accounts: IWithdrawAccounts,
	remainingAccounts: AccountMeta[],
	amount: BN,
	direction = true
): Promise<TransactionInstruction> {
	return await program.methods
		.withdraw(vaultId, strategyId, amount, direction)
		.accountsStrict({
			...accounts,
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.remainingAccounts(remainingAccounts)
		.instruction();
}
