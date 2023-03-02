import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { PublicKey } from '@solana/web3.js';
import { get } from 'svelte/store';

export const swapOutput = (input: bigint) => {
	const { vaultsSupport, vaultsAccounts, ready } = get(protocolStateStore);
	const { from, to } = get(swapStore);

	if (!from || !to || !ready || !vaultsSupport || !vaultsAccounts) {
		return;
	}

	const address = new PublicKey(from.address);
	console.log('swapOutput', input, address, vaultsSupport);
	const vault = vaultsSupport.find(
		(s) => s.baseTokenAddress.equals(address) || s.quoteTokenAddress.equals(address)
	);

	if (!vault) {
		throw new Error('Vault not found');
	}

	const fromBase = vault.baseTokenAddress.equals(new PublicKey(from.address));

	console.log('swap params', vault.id, BigInt(input), fromBase, false, 0);

	return vaultsAccounts?.swap(vault.id, BigInt(input), fromBase, false, 0);
};
