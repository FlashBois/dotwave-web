import type { ISortable } from '$src/tools/useAdvancedSorting';
import { get, writable } from 'svelte/store';
import { loadProtocolState, protocolStateStore } from './protocolStateStore';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';
import type { PublicKey } from '@solana/web3.js';
import { userStore } from './userStore';
import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
import { getNumberFromBigInt } from '$src/tools/getNumberFromBigInt';

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
	deposit: [number, number];
	dailyAPY: number;
	APY: number;
	provided: [number, number];
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
	const { statementBuffer } = get(userStore);
	// await loadProtocolState()

	// eslint-disable-next-line prefer-const
	let extractStrategy: IStrategyTable[] = [];

	if (vaultsAccounts) {
		// console.log('here', vaultsAccounts.strategy_info(0, 0).balance_base.toString());
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

				const depositToken = 0;
				const depositStable = 0;
				
				if (vaultsAccounts && statementBuffer) {
					// const lpPositionInfo = vaultsAccounts.get_lp_position_info(0, 0, statementBuffer, getCurrentUnixTime())
					// depositToken = getNumberFromBigInt(lpPositionInfo.base_quantity, 6)
					// depositStable = getNumberFromBigInt(lpPositionInfo.quote_quantity, 6)
				}

				const providedToken = getNumberFromBigInt(vaultsAccounts.balance_base(0, 0), 6);
				const providedStable = getNumberFromBigInt(vaultsAccounts.balance_quote(0, 0), 6);

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
						deposit: [depositToken, depositStable],
						dailyAPY: getNumberFromBigInt(vaultsAccounts.lending_apy(0, true), 6),
						APY: getNumberFromBigInt(vaultsAccounts.lending_apy(0, false), 6),
						provided: [providedToken, providedStable],
						utilizationToken: getNumberFromBigInt(strategyInfo.utilization_base),
						utilizationStable: getNumberFromBigInt(strategyInfo.utilization_quote),
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
