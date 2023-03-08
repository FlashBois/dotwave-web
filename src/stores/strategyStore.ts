import type { ISortable } from '$src/tools/useAdvancedSorting';
import { get, writable } from 'svelte/store';
import { protocolStateStore } from './protocolStateStore';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';
import type { PublicKey } from '@solana/web3.js';
import { userStore } from './userStore';
import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
import { getNumberFromBigInt } from '$src/tools/getNumberFromBigInt';
import { getDecimalFromBigint } from '$src/tools/decimal/getDecimalFromBigInt';

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

	// eslint-disable-next-line prefer-const
	let extractStrategy: IStrategyTable[] = [];
	let id = 0;

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

				let depositToken = 0;
				let depositStable = 0;

				if (vaultsAccounts && statementBuffer) {
					const lpPositionInfo = vaultsAccounts.get_lp_position_info(vault.id, strategyId, statementBuffer, getCurrentUnixTime())
					depositToken = getNumberFromBigInt(lpPositionInfo.deposited_base_quantity, baseTokenInfo?.decimals)
					depositStable = getNumberFromBigInt(lpPositionInfo.deposited_quote_quantity, quoteTokenInfo?.decimals)
				}

				const providedToken = getNumberFromBigInt(vaultsAccounts.balance_base(vault.id, strategyId), baseTokenInfo?.decimals);
				const providedStable = getNumberFromBigInt(vaultsAccounts.balance_quote(vault.id, strategyId), quoteTokenInfo?.decimals);

				if (strategyInfo && baseTokenInfo && quoteTokenInfo) {
					extractStrategy.push({
						id: id++,
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
						dailyAPY: 1,
						// dailyAPY: getNumberFromBigInt(vaultsAccounts.lending_apy(vault.id, getCurrentUnixTime()), 6),
						// APY: getNumberFromBigInt(vaultsAccounts.lending_apy(vault.id, getCurrentUnixTime()), 6),
						APY: 1,
						provided: [providedToken, providedStable],
						utilizationToken: getDecimalFromBigint(strategyInfo.utilization_base)
							.div(10 ** 6)
							.mul(100)
							.toDecimalPlaces(2)
							.toNumber(),
						utilizationStable: getDecimalFromBigint(strategyInfo.utilization_quote)
							.div(10 ** 6)
							.mul(100)
							.toDecimalPlaces(2)
							.toNumber(),
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
