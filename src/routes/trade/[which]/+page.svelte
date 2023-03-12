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

<div class="swap-page">
	{#if $protocolStateStore}
		<div class="exchange-section">
			<Trade support={selected} />
		</div>
	{/if}
</div>

<style lang="scss">
	.exchange-section {
		width: 75rem;
	}
</style>
