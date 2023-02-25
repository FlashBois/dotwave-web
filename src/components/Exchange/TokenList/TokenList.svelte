<script lang="ts">
	import tokenlist from '$src/assets/data/token-list.json';
	import Fuse from 'fuse.js';

	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import { getTokenList } from '$src/tools/getTokenList';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { goto } from '$app/navigation';
	import UnderlineInput from '$components/Inputs/UnderlineInput/UnderlineInput.svelte';
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import { popularTokens } from '$src/assets/data/popularToken';

	export let filteredTokenList = getTokenList();

	$: ({ tokenList, from, to } = $swapStore);

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
		if (tokenList.type == TokenListType.FROM) goto(`${token}_${to.symbol}`);
		else if (tokenList.type == TokenListType.TO) {
			goto(`${from.symbol}_${token}`);
		}
	}

	async function onAddressCopy(address: string) {
		await navigator.clipboard.writeText(address);
	}
</script>

<div class="token-list">
	<div class="token-list__search">
		<UnderlineInput
			on:inputChange={(value) => onSearchChange(value.detail)}
			placeholder="Search by token"
		/>
	</div>
	<div class="token-list__popular">
		{#each popularTokens as { symbol, logoURI }}
			<div class="token-list__popular-item">
				<GradientButton class="btn__popular" on:click={() => onTokenClick(symbol)}>
					<svelte:fragment slot="icon">
						<img src={logoURI} alt={symbol} />
					</svelte:fragment>
					{symbol}
				</GradientButton>
			</div>
		{/each}
	</div>
	<div class="token-list__box">
		<ul>
			{#each filteredTokenList as { symbol, logoURI, address, name }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="token-list__item" on:click={() => onTokenClick(symbol)}>
					<div class="token-list__item-image">
						<ImageLoader src={logoURI} alt={symbol} />
					</div>
					<div class="token-list__item-name">
						<span class="token-list__item-name--symbol">{symbol}</span>
						<span class="token-list__item-name--full">{name}</span>
					</div>
					<div class="token-list__item-address">
						<span class="token-list__item-address--copy" on:click={() => onAddressCopy(address)}>{address.substring(0, 6)}...</span>
						<!-- <a href={`https://solscan.io/token/${address}`} target="_blank" rel="noreferrer"><img src="https://solscan.io/favicon.png" style="width: 20px; height: 20px;" alt="solsc"></a> -->
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
