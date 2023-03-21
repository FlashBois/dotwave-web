import type { IVaultSupport } from '$src/stores/protocolStateStore';
import type { PublicKey } from '@solana/web3.js';

export const findVaultId = (
	vaultsSupport: IVaultSupport[],
	address: PublicKey
): { id: number } | undefined => {
	let found = vaultsSupport.find(s => s.baseTokenAddress.equals(address))

	return found ? { id: found.id } : undefined
};
