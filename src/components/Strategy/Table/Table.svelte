<script lang="ts">
	import { ISortable, useAdvancedSorting } from '$src/tools/useAdvancedSorting';
	import { derived } from 'svelte/store';
	import { cloneDeep } from 'lodash';
	import { tweened } from 'svelte/motion';

	import { strategyStore, type IStrategyTable } from '$src/stores/strategyStore';
	import { walletStore } from '$src/stores/walletStore';

	import Sortable from '$components/Sortable/Sortable.svelte';
	import CircleProgressBar from '$components/CircleProgressBar/CircleProgressBar.svelte';
	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import StrategyType from '../StrategyType/StrategyType.svelte';
	import RowDetails from '../RowDetails/RowDetails.svelte';

	$: ({ publicKey } = $walletStore);

	let timer = tweened(60);

	setInterval(async () => {
		if ($timer > 0) $timer--;
		else {
			timer.set(60);
		}
	}, 1000);

	interface IHeader {
		name: string;
		sortingType: ISortable;
		isSorted: boolean;
		needWallet: boolean;
		nameExt: keyof IStrategyTable;
	}

	let header: IHeader[] = [
		{
			name: 'Deposit token',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: true,
			nameExt: 'depositToken'
		},
		{
			name: 'Deposit stable',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: true,
			nameExt: 'depositStable'
		},
		{
			name: 'Daily APY',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'dailyAPY'
		},
		{
			name: 'APY',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'dailyAPY'
		},
		{
			name: 'Utilization token',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'utilizationToken'
		},
		{
			name: 'Utilization stable',
			sortingType: ISortable.NONE,
			isSorted: false,
			needWallet: false,
			nameExt: 'utilizationStable'
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
		<div class="strategy-table__header-item--arrow">
			<CircleProgressBar max={60} value={$timer} />
		</div>
	</div>
	{#each $filteredStrategies as row, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="strategy-table__row with-details" class:with-details={row.withDetails}>
			<div class="strategy-table__row-items" on:click={() => displayDetails(row.vaultId)}>
				<div class="strategy-table__row-item--strategy">
					<div class="strategy-table__strategy-cell">
						<div class="strategy-table__strategy-cell__img-box">
							<ImageLoader
								class="strategy-table__strategy-cell__img-box--base-token"
								src={row.tokenBase.logoURI}
								alt={row.tokenBase.symbol}
							/>
							<ImageLoader
								class="strategy-table__strategy-cell__img-box--quote-token"
								src={row.tokenQuote.logoURI}
								alt={row.tokenQuote.symbol}
							/>
						</div>
						<div class="strategy-table__strategy-cell__details">
							<span class="strategy-table__strategy-cell__details__name">
								{row.tokenBase.symbol} - {row.tokenQuote.symbol}
							</span>
							<span class="strategy-table__strategy-cell__details__strategy-type">
								<StrategyType strategy={row.strategy} />
							</span>
						</div>
					</div>
				</div>
				<div class="strategy-table__row-item--cell">{row.depositToken}</div>
				<div class="strategy-table__row-item--cell">{row.depositStable}</div>
				<div class="strategy-table__row-item--cell">{row.dailyAPY}</div>
				<div class="strategy-table__row-item--cell">{row.APY}%</div>
				<div class="strategy-table__row-item--cell">{row.utilizationToken}%</div>
				<div class="strategy-table__row-item--cell">{row.utilizationStable}%</div>
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
			{#if row.withDetails}
				<RowDetails {row} />
			{/if}
		</div>
	{/each}
</div>
