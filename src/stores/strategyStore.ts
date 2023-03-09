import type { ISortable } from '$src/tools/useAdvancedSorting';
import { get, writable } from 'svelte/store';
import { protocolStateStore } from './protocolStateStore';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';
import type { PublicKey } from '@solana/web3.js';

export interface IStrategyStore {
	sort: { property: keyof IStrategyTable; type: ISortable } | null;
	strategyTable: IStrategyTable[];
}

export interface IStrategyTable {
	id: number;
	vaultId: number;
	strategyId: number;
	strategy: {
		hasLend: boolean;
		hasSwap: boolean;
		hasTrade: boolean;
	};
	tokenBase: {
		symbol: string;
		name: string;
		logoURI: string;
		address: PublicKey;
		decimals: number;
	};
	tokenQuote: {
		symbol: string;
		name: string;
		logoURI: string;
		address: PublicKey;
		decimals: number;
	};
	depositToken: number;
	depositStable: number;
	dailyAPY: number;
	APY: number;
	utilizationToken: number;
	utilizationStable: number;
	withDetails: boolean;
}

export const strategyStore = writable<IStrategyStore>({
	sort: null,
	strategyTable: []
});

export async function loadStrategies(): Promise<void> {
	const { vaultsSupport, vaultsAccounts } = get(protocolStateStore);

	// eslint-disable-next-line prefer-const
	let extractStrategy: IStrategyTable[] = [];

	if (vaultsAccounts) {
		for (const vault of vaultsSupport) {
			const countStrategy = vaultsAccounts.count_strategies(vault.id);

			for (let strategyId = 0; strategyId < countStrategy; strategyId++) {
				const strategyInfo = vaultsAccounts.strategy_info(vault.id, strategyId);
				const baseTokenInfo = tokenListDevnet.find(
					(e) => e.address == vault.baseTokenAddress.toString()
				);
				const quoteTokenInfo = tokenListDevnet.find(
					(e) => e.address == vault.quoteTokenAddress.toString()
				);

				if (strategyInfo && baseTokenInfo && quoteTokenInfo) {
					extractStrategy.push({
						id: vault.id,
						vaultId: vault.id,
						strategyId,
						strategy: {
							hasLend: strategyInfo.has_lend,
							hasSwap: strategyInfo.has_swap,
							hasTrade: strategyInfo.has_trade
						},
						tokenBase: {
							symbol: baseTokenInfo.symbol,
							name: baseTokenInfo.name,
							logoURI: baseTokenInfo.logoURI,
							address: vault.baseTokenAddress,
							decimals: baseTokenInfo.decimals
						},
						tokenQuote: {
							symbol: quoteTokenInfo.symbol,
							name: quoteTokenInfo.name,
							logoURI: quoteTokenInfo.logoURI,
							address: vault.quoteTokenAddress,
							decimals: quoteTokenInfo.decimals
						},
						depositToken: 2,
						depositStable: 1,
						dailyAPY: 2.01,
						APY: 2.0,
						utilizationToken: 20.5,
						utilizationStable: 20.5,
						withDetails: false
					});
				}
			}
		}

		strategyStore.update((store) => {
			store.strategyTable = extractStrategy;

			return store;
		});
	}
}

export function clearUserStore() {
	strategyStore.set({
		sort: null,
		strategyTable: []
	});
}
