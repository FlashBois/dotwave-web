<script lang="ts">
	import TokenList from '$components/Exchange/TokenList/TokenList.svelte';
	import Exchange from '$components/Exchange/Exchange.svelte';
	import { swapStore } from '$src/stores/swapStore';

	let backdrop: HTMLDivElement;

	async function closeTokenList(e: MouseEvent) {
		if (e.target === backdrop) {
			swapStore.update((e) => {
				return {
					...e,
					tokenList: { type: null, visible: false }
				};
			});
		}
	}
</script>

<div class="swap-page">
	<div class="exchange-section">
		<Exchange />
	</div>

	{#if $swapStore.tokenList}
		{#if $swapStore.tokenList.visible}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="token-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
				<TokenList />
			</div>
		{/if}
	{/if}
</div>
