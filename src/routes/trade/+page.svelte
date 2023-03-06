<script lang="ts">
	import Trade from '$components/Trade/Trade.svelte';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import TokenList from '$components/Exchange/TokenList/TokenList.svelte';
	import type { ITokenList } from '$src/tools/getTokenList';

	let backdrop: HTMLDivElement;
	let visibleTokenList = false;
	let selected: ITokenList;

	async function closeTokenList(e: MouseEvent) {
		console.log('here');
		if (e.target === backdrop) {
			visibleTokenList = false;
		}
	}
</script>

<div class="swap-page">
	{#if $protocolStateStore.ready}
		<div class="exchange-section">
			<Trade token={selected} />
		</div>

		{#if visibleTokenList}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="token-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
				<TokenList bind:selected />
			</div>
		{/if}
	{/if}
</div>
