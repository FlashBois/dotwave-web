import type { ISortable } from '$src/tools/useAdvancedSorting';
import { get, writable } from 'svelte/store';
import { protocolStateStore } from './protocolStateStore';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';

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
	};
	tokenQuote: {
		symbol: string;
		name: string;
		logoURI: string;
	};
	walletBalance: number;
	deposited: number;
	locked: number;
	dailyAPY: number;
	weeklyAPY: number;
	yearlyAPY: number;
	utilization: number;
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
						id: 0,
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
							logoURI: baseTokenInfo.logoURI
						},
						tokenQuote: {
							symbol: quoteTokenInfo.symbol,
							name: quoteTokenInfo.name,
							logoURI: quoteTokenInfo.logoURI
						},
						walletBalance: 100.01,
						deposited: 20.01,
						locked: 100.01,
						dailyAPY: 2.01,
						weeklyAPY: 12.01,
						yearlyAPY: 1.01,
						utilization: 20.5,
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
