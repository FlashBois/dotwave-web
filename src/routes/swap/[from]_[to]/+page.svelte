<script lang="ts">
	import TokenList from '$components/TokenList/TokenList.svelte';
	import Exchange from '$components/Exchange/Exchange.svelte';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { protocolStateStore, type ITokenInfo } from '$src/stores/protocolStateStore';
	import { goto } from '$app/navigation';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { getTokenList } from '$src/tools/getTokenList';

	$: ({ params } = $page);

	$: swapRoute = derived<[typeof page], { fromToken: ITokenInfo; toToken: ITokenInfo }>(
		[page],
		([$page], set) => {
			if ($page.params) {
				const data = getTokenList();

				const fromToken = data.find((e) => e.symbol == params.from);
				const toToken = data.find((e) => e.symbol == params.to);

				if (fromToken && toToken) {
					set({ fromToken, toToken });
				} else goto('SOL_USDC');
			}
		}
	);
	$: ({ fromToken, toToken } = $swapRoute);

	function onCloseTokenList() {
		swapStore.update((e) => {
			return {
				...e,
				tokenList: { type: null, visible: false }
			};
		});
	}

	function onTokenClick(token: string) {
		if ($swapStore.tokenList.type == TokenListType.FROM) goto(`${token}_${$swapStore.to.symbol}`);
		else if ($swapStore.tokenList.type == TokenListType.TO) {
			goto(`${$swapStore.from.symbol}_${token}`);
		}
	}
</script>

<svelte:head><title>Swap - {fromToken.symbol}/{toToken.symbol}</title></svelte:head>

<div class="swap-page">
	<div class="exchange-section">
		<Exchange {fromToken} {toToken} />
	</div>

	{#if $swapStore}
		<TokenList
			on:onTokenClick={(e) => onTokenClick(e.detail)}
			on:onClose={() => onCloseTokenList()}
			visible={$swapStore.tokenList.visible}
			vaultsSupport={$protocolStateStore.vaultsSupport}
			withQuote={true}
		/>
	{/if}
</div>
