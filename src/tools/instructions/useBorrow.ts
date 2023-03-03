import type { Protocol } from '$src/utils/Idl/protocol';
import type { BN, Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { PublicKey, TransactionInstruction } from '@solana/web3.js';

interface IBorrowAccounts {
	state: PublicKey;
	vaults: PublicKey;
	accountBase: PublicKey;
	statement: PublicKey;
	signer: PublicKey;
	reserveBase: PublicKey;
}

export async function useBorrow(
	program: Program<Protocol>,
	vaultId: number,
	accounts: IBorrowAccounts,
	amount: BN
): Promise<TransactionInstruction> {
	return await program.methods
		.borrow(vaultId, amount)
		.accountsStrict({
			...accounts,
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.instruction();
}
