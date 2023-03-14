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
	earned_base_quantity: number;
	earned_quote_quantity: number;
	max_withdraw_base: number;
	max_withdraw_quote: number;
	max_withdraw_value: number;
	permitted_withdraw: number;
	position_value: number;
	withDetails: boolean;
}

export const strategyStore = writable<IStrategyStore>({
	sort: null,
	strategyTable: []
});

export async function loadStrategies(): Promise<void> {
	const { vaultsSupport, vaultsAccounts } = get(protocolStateStore);
	const { statementBuffer, statement } = get(userStore);
	const { strategyTable } = get(strategyStore);

	const extractStrategy: IStrategyTable[] = [];
	let id = 0;

	if (vaultsAccounts) {
		for (const vault of vaultsSupport) {
			const countStrategy = vaultsAccounts.count_strategies(vault.id);

			for (let strategyId = 0; strategyId < countStrategy; strategyId++) {
				let wasWithDetails = false;
				if (strategyTable.length > 0) {
					const oldStrategy = strategyTable.find(
						(e) => e.vaultId == vault.id && e.strategyId == strategyId
					);
					if (oldStrategy && oldStrategy.withDetails) wasWithDetails = true;
				}

				const strategyInfo = vaultsAccounts.strategy_info(vault.id, strategyId);
				const baseTokenInfo = tokenListDevnet.find(
					(e) => e.address == vault.baseTokenAddress.toString()
				);
				const quoteTokenInfo = tokenListDevnet.find(
					(e) => e.address == vault.quoteTokenAddress.toString()
				);

				let depositToken = 0;
				let depositStable = 0;
				let earned_base_quantity = 0;
				let earned_quote_quantity = 0;
				let max_withdraw_base = 0;
				let max_withdraw_quote = 0;
				let max_withdraw_value = 0;
				let position_value = 0;


				if (vaultsAccounts && statementBuffer) {
					const lpPositionInfo = vaultsAccounts.get_lp_position_info(
						vault.id,
						strategyId,
						statementBuffer,
						getCurrentUnixTime()
					);

					if (lpPositionInfo) {
						depositToken = getNumberFromBigInt(
							lpPositionInfo.deposited_base_quantity,
							baseTokenInfo?.decimals
						);
						depositStable = getNumberFromBigInt(
							lpPositionInfo.deposited_quote_quantity,
							quoteTokenInfo?.decimals
						);
						earned_base_quantity = getNumberFromBigInt(
							lpPositionInfo.earned_base_quantity,
							quoteTokenInfo?.decimals
						);
						earned_quote_quantity = getNumberFromBigInt(
							lpPositionInfo.earned_quote_quantity,
							quoteTokenInfo?.decimals
						);
						max_withdraw_base = getNumberFromBigInt(
							lpPositionInfo.max_withdraw_base,
							quoteTokenInfo?.decimals
						);
						max_withdraw_quote = getNumberFromBigInt(
							lpPositionInfo.max_withdraw_quote,
							quoteTokenInfo?.decimals
						);
						position_value = getNumberFromBigInt(
							lpPositionInfo.position_value,
							9
						);
						max_withdraw_value = getNumberFromBigInt(
							lpPositionInfo.max_withdraw_value,
							9
						);
					}
				}

				const providedToken = getNumberFromBigInt(
					strategyInfo.balance_base,
					baseTokenInfo?.decimals
				);
				const providedStable = getNumberFromBigInt(
					strategyInfo.balance_quote,
					quoteTokenInfo?.decimals
				);

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
						dailyAPY: getNumberFromBigInt(vaultsAccounts.lending_apy(vault.id, 24 * 60 * 60), 4),
						APY: getNumberFromBigInt(vaultsAccounts.lending_apy(vault.id, 24 * 60 * 60 * 365), 4),
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
						earned_base_quantity,
						earned_quote_quantity,
						max_withdraw_base,
						max_withdraw_quote,
						max_withdraw_value,
						permitted_withdraw: statement ? getNumberFromBigInt(statement.permitted_withdraw(strategyInfo.collateral_ratio), 9) : 0,
						position_value,
						withDetails: wasWithDetails
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

export function clearStrategyStore() {
	strategyStore.set({
		sort: null,
		strategyTable: []
	});
}
