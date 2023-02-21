<script lang="ts">
	import TokenList from '$components/Exchange/TokenList/TokenList.svelte';
	import Exchange from '$components/Exchange/Exchange.svelte';
 
	$: tokenListVisible = false;
	let backdrop: HTMLDivElement;

	async function closeTokenList(e: MouseEvent) {
		if (e.target === backdrop) {
			tokenListVisible = false;
		}
	}
</script>

<div class="swap-page">
	<div class="exchange-section">
		<Exchange bind:tokenListVisible />
	</div>

	{#if tokenListVisible}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="token-list-section" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
			<TokenList />
		</div>
	{/if}
</div>
