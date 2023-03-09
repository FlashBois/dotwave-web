import { PythConnection, getPythProgramKeyForCluster, PythHttpClient } from '@pythnetwork/client';
import type { PublicKey, Cluster, Connection } from '@solana/web3.js';

export type PythCluster = Cluster | 'pythtest' | 'pythnet' | 'localnet';

export function getPythConnection(
	connection: Connection,
	pythCluster: PythCluster,
	accounts: PublicKey[]
) {
	const pythConnection = new PythConnection(
		connection,
		getPythProgramKeyForCluster(pythCluster),
		'confirmed',
		accounts
	);

	return pythConnection;
}
