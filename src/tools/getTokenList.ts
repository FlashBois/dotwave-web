import tokenList from '$src/assets/data/token-list.json';
import { protocolStateStore } from '$src/stores/protocolStateStore';
import { get } from 'svelte/store';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';

export interface ITokenList {
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	logoURI: string;
}

export const getTokenList = (chain: 'devnet' = 'devnet'): ITokenList[] => {
	const { vaultsSupport, ready } = get(protocolStateStore);
	if (!ready || !vaultsSupport) return [];

	const vaultTokens = new Set<string>();

	for (const vault of vaultsSupport) {
		vaultTokens.add(vault.quoteTokenAddress.toString());
		vaultTokens.add(vault.baseTokenAddress.toString());
	}

	const uniqueTokens = Array.from(vaultTokens.values());

	if (chain === 'devnet') {
		return uniqueTokens.map((address: string, i) => {
			const found = tokenListDevnet.find((t) => t.address === address);
			if (!found) throw new Error('Token not found');
			return {
				...found
			};
		});
	} else {
		throw new Error('Chain not supported');
	}
};
