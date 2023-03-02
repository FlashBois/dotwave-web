import tokenList from '$src/assets/data/token-list.json';
import { protocolStateStore } from '$src/stores/protocolStateStore';
import { get } from 'svelte/store';

export interface ITokenList {
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	logoURI: string;
}

const devnetTokensPriority = ['USDC', 'SOL', 'ETH', 'WBTC'];

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
			const found = tokenList.find((t) => t.symbol === devnetTokensPriority[i]);
			if (!found) throw new Error('Token not found');
			return {
				...found,
				address
			};
		});
	} else {
		throw new Error('Chain not supported');
	}
};
