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
			}
			else goto('RAY_USDC');
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
		<div
			class="borrow-select-section"
			on:click={() => {
				borrowListVisible.set(true);
			}}
		>
			{params.base}
		</div>

		{#if $vaultSupport}
			<Borrow vaultSupport={$vaultSupport} />
			<Repay vaultSupport={$vaultSupport} />
		{/if}
	</div>

	{#if $borrowListVisible}
		<div class="borrow-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
			<BorrowList />
		</div>
	{/if}
</div>
