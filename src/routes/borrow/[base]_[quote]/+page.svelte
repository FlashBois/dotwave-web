<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Borrow from '$components/Borrow-Repay/Borrow/Borrow.svelte';
	import BorrowList from '$components/Borrow-Repay/BorrowList/BorrowList.svelte';
	import Repay from '$components/Borrow-Repay/Repay/Repay.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { derived, get, writable } from 'svelte/store';

	$: ({ params } = $page);
	const borrowListVisible = writable(false);

	let backdrop: HTMLDivElement;

	$: vaultSupport = derived<[typeof page], IVaultSupport>([page], ([$page], set) => {
		if ($page.params) {
			const protocolSateCopy = get(protocolStateStore);

			const vault = protocolSateCopy.vaultsSupport.find(
				(e) => e.baseTokenInfo.symbol == params.base && e.quoteTokenInfo.symbol == params.quote
			);

			if (vault) {
				borrowListVisible.set(false);
				set(vault);
			} else goto('RAY_USDC');
		}
	});

	async function closeTokenList(e: MouseEvent) {
		if (e.target === backdrop) {
			borrowListVisible.set(false);
		}
	}
</script>

<div class="borrow-page">
	<div class="borrow-repay-section">
		<div class="borrow-select-section">
			<button
				on:click={() => {
					borrowListVisible.set(true);
				}}
				class="borrow__select"
			>
				<img src={$vaultSupport.baseTokenInfo.logoURI} alt={$vaultSupport.baseTokenInfo.symbol} />
				<p>{$vaultSupport.baseTokenInfo.symbol} - {$vaultSupport.quoteTokenInfo.symbol}</p>
				<img src={$vaultSupport.quoteTokenInfo.logoURI} alt={$vaultSupport.quoteTokenInfo.symbol} />
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-caret-down-fill"
					viewBox="0 0 16 16"
				>
					<path
						d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
					/>
				</svg>
			</button>
		</div>

		{#if $vaultSupport}
			<Borrow vaultSupport={$vaultSupport} />
			<Repay vaultSupport={$vaultSupport} />
		{/if}
	</div>

	{#if $borrowListVisible && $protocolStateStore.vaultsSupport.length > 0}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="borrow-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
			<BorrowList vaultsSupport={$protocolStateStore.vaultsSupport} />
		</div>
	{/if}
</div>
