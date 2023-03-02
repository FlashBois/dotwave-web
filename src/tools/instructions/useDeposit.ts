import type { Protocol } from '$src/utils/Idl/protocol';
import type { BN, Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { PublicKey, TransactionInstruction } from '@solana/web3.js';

interface IDepositAccounts {
	state: PublicKey;
	vaults: PublicKey;
	accountBase: PublicKey;
	accountQuote: PublicKey;
	statement: PublicKey;
	signer: PublicKey;
	reserveBase: PublicKey;
	reserveQuote: PublicKey;
}

export async function useDeposit(
	program: Program<Protocol>,
	vaultId: number,
	strategyId: number,
	accounts: IDepositAccounts,
	amount: BN,
	direction = true
): Promise<TransactionInstruction> {
	return await program.methods
		.deposit(vaultId, strategyId, amount, direction)
		.accountsStrict({
			...accounts,
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.instruction();
}
