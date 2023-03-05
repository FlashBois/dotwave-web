import type { Protocol } from '$src/utils/Idl/protocol';
import type { Program } from '@project-serum/anchor';
import {
	PublicKey,
	SystemProgram,
	SYSVAR_RENT_PUBKEY,
	type TransactionInstruction
} from '@solana/web3.js';
import { useCreateStatementProgramAddress } from '../web3/useCreateStatementProgramAddress';

interface ICreateStatementAccounts {
	payer: PublicKey;
}

export async function useCreateStatement(
	program: Program<Protocol>,
	accounts: ICreateStatementAccounts
): Promise<TransactionInstruction> {
	return await program.methods
		.createStatement()
		.accountsStrict({
			statement: useCreateStatementProgramAddress(program, accounts.payer),
			...accounts,
			systemProgram: SystemProgram.programId,
			rent: SYSVAR_RENT_PUBKEY
		})
		.instruction();
}
