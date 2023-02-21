<script lang="ts">
	import tokenlist from '$src/assets/data/token-list.json';
	import Fuse from 'fuse.js';

	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import SearchInput from '../Search/SearchInput.svelte';
	import { getTokenList } from '$src/tools/getTokenList';
	import { PublicKey } from '@solana/web3.js';

	export let filteredTokenList = getTokenList();

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
</script>

<div class="token-list">
	<div class="token-list__search">
		<SearchInput on:inputChange={(value) => onSearchChange(value.detail)} />
	</div>
	<div class="token-list__popular" />
	<div class="token-list__box">
		<ul>
			{#each filteredTokenList as { symbol, logoURI }, i}
				<li><ImageLoader src={logoURI} alt={symbol} /></li>
			{/each}
		</ul>
	</div>
</div>
