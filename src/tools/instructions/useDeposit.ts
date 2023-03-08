import type { Protocol } from '$src/utils/Idl/protocol';
import type { BN, Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ComputeBudgetProgram, type PublicKey, type TransactionInstruction } from '@solana/web3.js';

interface IDepositAccounts {
	state: PublicKey;
	vaults: PublicKey;
	accountBase: PublicKey;
	accountQuote: PublicKey;
	statement: PublicKey;
	signer: PublicKey;
	reserveBase: PublicKey;
	reserveQuote: PublicKey;
	baseOracle: PublicKey;
	quoteOracle: PublicKey;
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
		.preInstructions([
			ComputeBudgetProgram.setComputeUnitLimit({
			  units: 1000000
			})
		  ])
		.accountsStrict({
			...accounts,
			tokenProgram: TOKEN_PROGRAM_ID
		})
		.remainingAccounts([
			{
				isSigner: false,
				isWritable: false,
				pubkey: accounts.baseOracle
			},
			{
				isSigner: false,
				isWritable: false,
				pubkey: accounts.quoteOracle
			}
		])
		.instruction();
}
