<script lang="ts">
	import tokenlist from '$src/assets/data/token-list.json';
	import Fuse from 'fuse.js';

	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import SearchInput from '../Search/SearchInput.svelte';
	import { getTokenList } from '$src/tools/getTokenList';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { goto } from '$app/navigation';

	export let filteredTokenList = getTokenList();

	$: ({ tokenList, from, to } = $swapStore)

	const fuse = new Fuse(tokenlist, {
		includeScore: true,
		keys: ['symbol'],
		shouldSort: true,
		threshold: 0.1,
		location: 0
	});

	function onSearchChange({ value }: { value: string }) {
		const result = fuse.search(value);
		if (value == '') {
			filteredTokenList = getTokenList();
		} else {
			filteredTokenList = result.map((e) => {
				return {
					address: e.item.address,
					decimals: e.item.decimals,
					logoURI: e.item.logoURI,
					name: e.item.name,
					symbol: e.item.symbol
				};
			});
		}
	}

	function onTokenClick(token: string) {
		if(tokenList.type == TokenListType.FROM)
			goto(`${token}_${to.symbol}`)
		else if(tokenList.type == TokenListType.TO){
			goto(`${from.symbol}_${token}`)
		}
	}
</script>

<div class="token-list">
	<div class="token-list__search">
		<SearchInput on:inputChange={(value) => onSearchChange(value.detail)} />
	</div>
	<div class="token-list__popular" />
	<div class="token-list__box">
		<ul>
			{#each filteredTokenList as { symbol, logoURI }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={() => onTokenClick(symbol)}><ImageLoader src={logoURI} alt={symbol} /></li>
			{/each}
		</ul>
	</div>
</div>
