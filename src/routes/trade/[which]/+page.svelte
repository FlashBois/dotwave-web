<script lang="ts">
	import Trade from '$components/Trade/Trade.svelte';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { page } from '$app/stores';

	let backdrop: HTMLDivElement;

	$: selected = $protocolStateStore.vaultsSupport.find(
		(s) =>
			s.baseTokenInfo.symbol === $page.params?.which &&
			$protocolStateStore.vaultsAccounts?.does_any_trade(s.id)
	);

	let visibleTokenList = false;
	$: if (!!selected) visibleTokenList = true;

	$: if (selected) console.log('selected');
	$: if (!selected) console.log('!selected', $page.params?.which);

	async function closeTokenList(e: MouseEvent) {
		if (e.target === backdrop) {
			visibleTokenList = false;
		}
	}
</script>

<div class="swap-page">
	{#if $protocolStateStore.ready}
		<div class="exchange-section">
			<Trade support={selected} />
		</div>

		{#if visibleTokenList}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="token-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)} />
		{/if}
	{/if}
</div>
