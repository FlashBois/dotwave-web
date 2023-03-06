<script lang="ts">
	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import { goto } from '$app/navigation';
	import UnderlineInput from '$components/Inputs/UnderlineInput/UnderlineInput.svelte';
	import type { IVaultSupport } from '$src/stores/protocolStateStore';

	export let vaultsSupport: IVaultSupport[];

	function onSearchChange({ value }: { value: string }) {

	}

	function onTokenClick(baseToken: string, quoteToken: string) {
		goto(`${baseToken}_${quoteToken}`);
	}
</script>

<div class="borrow-list">
	<div class="borrow-list__search">
		<UnderlineInput
			on:inputChange={(value) => onSearchChange(value.detail)}
			placeholder="Search by token"
		/>
	</div>
	<div class="borrow-list__box">
		<ul>
			{#each vaultsSupport as { baseTokenInfo, quoteTokenInfo }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li
					class="borrow-list__item"
					on:click={() => onTokenClick(baseTokenInfo.symbol, quoteTokenInfo.symbol)}
				>
					<div class="borrow-list__item-image">
						<ImageLoader src={baseTokenInfo.logoURI} alt={baseTokenInfo.symbol} />
						<ImageLoader src={quoteTokenInfo.logoURI} alt={quoteTokenInfo.symbol} />
					</div>
					<div class="borrow-list__item-name">
						<span class="borrow-list__item-name--symbol"
							>{baseTokenInfo.symbol} - {quoteTokenInfo.symbol}</span
						>
						<span class="borrow-list__item-name--full"
							>{baseTokenInfo.name} - {quoteTokenInfo.name}</span
						>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
