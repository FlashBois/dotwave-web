<script lang="ts">
	import Fuse from 'fuse.js';

	import ImageLoader from '$components/Image/ImageLoader.svelte';
	import { goto } from '$app/navigation';
	import UnderlineInput from '$components/Inputs/UnderlineInput/UnderlineInput.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';

	$: ({ vaultsSupport } = $protocolStateStore)
	let filteredBorrowList: IVaultSupport[] = vaultsSupport;

	const fuse = new Fuse(vaultsSupport, {
		includeScore: true,
		keys: ['baseTokenInfo.symbol'],
		shouldSort: true,
		threshold: 0.1,
		location: 0
	});

	function onSearchChange({ value }: { value: string }) {
		const result = fuse.search(value);
		if (value == '') {
			filteredBorrowList = vaultsSupport;
		} else {
			filteredBorrowList = result.map((e) => {
				return {
					baseTokenAddress: e.item.baseTokenAddress,
					baseTokenInfo: e.item.baseTokenInfo,
					id: e.item.id,
					oracleAddress: e.item.oracleAddress,
					quoteTokenAddress: e.item.quoteTokenAddress,
					quoteTokenInfo: e.item.quoteTokenInfo
				};
			});
		}
	}

	function onTokenClick(baseToken: string, quoteToken: string) {
		goto(`${baseToken}_${quoteToken}`);
	}
</script>

<div class="token-list">
	<div class="token-list__search">
		<UnderlineInput
			on:inputChange={(value) => onSearchChange(value.detail)}
			placeholder="Search by token"
		/>
	</div>
	<div class="token-list__box">
		<ul>
			{#each vaultsSupport as { baseTokenInfo, quoteTokenInfo }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li class="token-list__item" on:click={() => onTokenClick(baseTokenInfo.symbol, quoteTokenInfo.symbol)}>
					<div class="token-list__item-image">
						<ImageLoader src={baseTokenInfo.logoURI} alt={baseTokenInfo.symbol} />
						<ImageLoader src={quoteTokenInfo.logoURI} alt={quoteTokenInfo.symbol} />
					</div>
					<div class="token-list__item-name">
						<span class="token-list__item-name--symbol">{baseTokenInfo.symbol} - {quoteTokenInfo.symbol}</span>
						<span class="token-list__item-name--full">{baseTokenInfo.name} - {quoteTokenInfo.name}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
