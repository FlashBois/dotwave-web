import type { IVaultSupport } from '$src/stores/protocolStateStore';
import { PublicKey } from '@solana/web3.js';

export const findVault = (
	vaultsSupport: IVaultSupport[],
	address: PublicKey
): { index: number; base: boolean } | undefined => {
	const vault = vaultsSupport.find(
		(s) => s.baseTokenAddress.equals(address) || s.quoteTokenAddress.equals(address)
	);

	if (!vault) return;

	return {
		index: vault?.id,
		base: vault.baseTokenAddress.equals(new PublicKey(address))
	};
};
