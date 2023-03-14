<script lang="ts">
	import Trade from '$components/Trade/Trade.svelte';
	import TokenList from '$components/TokenList/TokenList.svelte';

	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: selected = $protocolStateStore.vaultsSupport.find(
		(s) =>
			s.baseTokenInfo.symbol === $page.params?.which &&
			$protocolStateStore.vaultsAccounts?.has_trading(s.id)
	);

	$: if (!selected) console.log('!selected', $page.params?.which);

	let visibleTokenList = false;
	function onCloseTokenList() {
		visibleTokenList = false;
	}

	function onTokenClick(token: CustomEvent) {
		goto(`${token}`);
		visibleTokenList = false;
	}
</script>

<svelte:head><title>Trade</title></svelte:head>

<div class="trade-page">
	<div class="trade-page-container">
		<Trade support={selected} on:onShowTokenList={() => visibleTokenList = true}/>
	</div>

	<TokenList
		on:onTokenClick={(e) => onTokenClick(e.detail)}
		on:onClose={() => onCloseTokenList()}
		vaultsSupport={$protocolStateStore.vaultsSupport}
		visible={visibleTokenList}
		hasTrade={true}
		on:click={onTokenClick}
		withQuote={false}
	/>
</div>
