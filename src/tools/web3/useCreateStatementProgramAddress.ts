import type { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import type { Protocol } from '$src/utils/Idl/protocol';

export const STATEMENT_SEED = 'statement';

export function useCreateStatementProgramAddress(program: Program<Protocol>, user: PublicKey) {
	const [statement] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(STATEMENT_SEED)), user.toBuffer()],
		program.programId
	);

	return statement;
}
