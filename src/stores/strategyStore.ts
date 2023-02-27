import type { ISortable } from '$src/tools/useAdvancedSorting';
import { writable } from 'svelte/store';

export interface IStrategyStore {
	sort: { property: keyof IStrategyTable; type: ISortable } | null;
	strategyTable: IStrategyTable[];
}

export interface IStrategyTable {
    id: number,
	strategy: string;
	token: {
		symbol: string;
		name: string;
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
	strategyStore.update((store) => {
		store.strategyTable = [
			{
                id: 0,
				strategy: '',
				token: {
					symbol: '',
					name: ''
				},
				walletBalance: 100.01,
				deposited: 20.01,
				locked: 100.01,
				dailyAPY: 2.01,
				weeklyAPY: 12.01,
				yearlyAPY: 1.01,
				utilization: 20.5,
				withDetails: false
			},
			{
                id: 1,
				strategy: '',
				token: {
					symbol: '',
					name: ''
				},
				walletBalance: 100.01,
				deposited: 100.01,
				locked: 100.01,
				dailyAPY: 10.01,
				weeklyAPY: 4.01,
				yearlyAPY: 1.01,
				utilization: 20.5,
				withDetails: false
			},
            {
                id: 2,
				strategy: '',
				token: {
					symbol: '',
					name: ''
				},
				walletBalance: 100.01,
				deposited: 100.01,
				locked: 100.01,
				dailyAPY: 1.01,
				weeklyAPY: 8.01,
				yearlyAPY: 1.01,
				utilization: 20.5,
				withDetails: false
			}
		];

		return store;
	});
}

export function clearUserStore() {
	strategyStore.set({
        sort: null,
        strategyTable: []
    });
}
