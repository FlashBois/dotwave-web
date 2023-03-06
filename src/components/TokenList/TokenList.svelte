<script lang="ts">
	import Fuse from 'fuse.js';

	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import UnderlineInput from '$components/Inputs/UnderlineInput/UnderlineInput.svelte';
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import { popularTokens } from '$src/assets/data/popularToken';
	import type { ITokenInfo, IVaultSupport } from '$src/stores/protocolStateStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getUniqTokensFromVaultsSupport } from '$src/tools/getUniqTokensFromVaultSupport';

	export let vaultsSupport: IVaultSupport[];
	export let visible: boolean;
	export let withQuote: boolean = true;
	let filteredTokenList: ITokenInfo[] = [];
	let fuse: Fuse<ITokenInfo>;
	let backdrop: HTMLDivElement;

	const dispatch = createEventDispatcher();

	onMount(() => {
		filteredTokenList = getUniqTokensFromVaultsSupport(vaultsSupport, withQuote);
		fuse = new Fuse(filteredTokenList, {
			includeScore: true,
			keys: ['symbol'],
			shouldSort: true,
			threshold: 0.1,
			location: 0
		});
	});

	function onSearchChange({ value }: { value: string }) {
		const result = fuse.search(value);
		if (value == '') {
			filteredTokenList = getUniqTokensFromVaultsSupport(vaultsSupport, withQuote);
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
		dispatch('onTokenClick', token);
	}

	async function closeTokenList(e: MouseEvent) {
		if (e.target === backdrop) {
			dispatch('onClose');
		}
	}

	async function onAddressCopy(address: string) {
		await navigator.clipboard.writeText(address);
	}
</script>

{#if visible}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="token-list-background" bind:this={backdrop} on:click={(e) => closeTokenList(e)}>
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
								<span class="token-list__item-address--copy" on:click={() => onAddressCopy(address)}
									>{address.substring(0, 6)}...</span
								>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}
