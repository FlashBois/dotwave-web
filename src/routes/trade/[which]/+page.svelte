<script lang="ts">
	import Trade from '$components/Trade/Trade.svelte';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { page } from '$app/stores';

	$: selected = $protocolStateStore.vaultsSupport.find(
		(s) =>
			s.baseTokenInfo.symbol === $page.params?.which &&
			$protocolStateStore.vaultsAccounts?.has_trading(s.id)
	);

	$: if (!selected) console.log('!selected', $page.params?.which);
</script>

<svelte:head><title>Trade</title></svelte:head>

<div class="swap-page">
	{#if $protocolStateStore}
		<div class="trade-section">
			<Trade support={selected} />
		</div>
	{/if}
</div>

<style lang="scss">
	.trade-section {
		width: 80rem;
		height: 48rem;
	}
</style>
