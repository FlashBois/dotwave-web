<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import Input from '$components/Inputs/Input/Input.svelte';
	import Sortable from '$components/Sortable/Sortable.svelte';
	import { strategyStore, type IStrategyTable } from '$src/stores/strategyStore';
	import { walletStore } from '$src/stores/walletStore';
	import { ISortable, useAdvancedSorting } from '$src/tools/useAdvancedSorting';
	import { derived } from 'svelte/store';
	import { cloneDeep } from 'lodash';

	$: ({ publicKey } = $walletStore);

	interface IHeader {
		name: string;
		sortingType: ISortable;
		isSorted: boolean;
		needWallet: boolean;
		nameExt: keyof IStrategyTable;
	}

	let header: IHeader[] = [
		{
			name: 'Wallet balance',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: true,
			nameExt: 'walletBalance'
		},
		{
			name: 'Deposited',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: true,
			nameExt: 'deposited'
		},
		{
			name: 'Locked',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: true,
			nameExt: 'locked'
		},
		{
			name: 'Daily APY',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'dailyAPY'
		},
		{
			name: 'Weekly APY',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'weeklyAPY'
		},
		{
			name: 'Yearly APY',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'yearlyAPY'
		},
		{
			name: 'Utilization',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'utilization'
		}
	];

	$: filteredStrategies = derived<[typeof strategyStore], IStrategyTable[]>(
		[strategyStore],
		([$strategyStore], set) => {
			const { sort, strategyTable } = $strategyStore;
			const strategyTableCopy = cloneDeep(strategyTable);
			let result: IStrategyTable[] = [];
			if (sort) result = useAdvancedSorting(strategyTableCopy, sort.property, sort.type);
			else result = strategyTableCopy;

			set(result);
		}
	);

	function onSortChange(index: number) {
		const currentSortType = header[index].sortingType;

		const currentSortedIndex = header.findIndex((e) => e.isSorted == true);
		if (currentSortedIndex != -1 && currentSortedIndex != index) {
			header[currentSortedIndex].isSorted = false;
			header[currentSortedIndex].sortingType = ISortable.NONE;
		}

		if (currentSortType == ISortable.DESC) {
			header[index].sortingType = ISortable.ASC;
		} else if (currentSortType == ISortable.ASC) {
			header[index].sortingType = ISortable.NONE;
			header[index].isSorted = false;
		} else if (currentSortType == ISortable.NONE) {
			header[index].sortingType = ISortable.DESC;
			header[index].isSorted = true;
		}

		if (header[index].sortingType != ISortable.NONE) {
			strategyStore.update((store) => {
				store.sort = { property: header[index].nameExt, type: header[index].sortingType };
				return store;
			});
		} else {
			strategyStore.update((store) => {
				store.sort = null;
				return store;
			});
		}
	}

	function displayDetails(id: number) {
		strategyStore.update((store) => {
			store.strategyTable[id].withDetails = !store.strategyTable[id].withDetails;
			return store;
		});
	}
</script>

<div class="strategy-table">
	<div class="strategy-table__header">
		<div class="strategy-table__header-item--strategy">Strategy</div>
		{#each header as headerRow, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="strategy-table__header-item--cell"
				class:sortable-div={!headerRow.needWallet || (headerRow.needWallet && publicKey)}
				on:click={() => onSortChange(i)}
			>
				{headerRow.name}
				{#if !headerRow.needWallet || (headerRow.needWallet && publicKey)}<Sortable
						sortType={headerRow.sortingType}
					/>{/if}
			</div>
		{/each}
		<div class="strategy-table__header-item--arrow">-</div>
	</div>
	{#each $filteredStrategies as row}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="strategy-table__row with-details" class:with-details={row.withDetails}>
			<div class="strategy-table__row-items" on:click={() => displayDetails(row.id)}>
				<div class="strategy-table__row-item--strategy">-</div>
				<div class="strategy-table__row-item--cell">{row.walletBalance}</div>
				<div class="strategy-table__row-item--cell">{row.deposited}</div>
				<div class="strategy-table__row-item--cell">{row.locked}</div>
				<div class="strategy-table__row-item--cell">{row.dailyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.weeklyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.yearlyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.utilization}</div>
				<div class="strategy-table__row-item--arrow">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-chevron-down"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</div>
			</div>
			<div class="strategy-table__row-details" class:delay-animation={row.withDetails}>
				{#if row.withDetails}
					<div class="strategy-table__row-details__info" />
					<div class="strategy-table__row-details__inputs">
						<div class="strategy-table__row-details__input">
							<Input />
							<div class="strategy-table__row-details__button-box">
								<GradientButton>Deposit</GradientButton>
							</div>
						</div>
						<div class="strategy-table__row-details__input">
							<Input />
							<div class="strategy-table__row-details__button-box">
								<GradientButton>Withdraw</GradientButton>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
