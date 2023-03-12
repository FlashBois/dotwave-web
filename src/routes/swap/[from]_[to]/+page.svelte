<script lang="ts">
	import TokenList from '$components/TokenList/TokenList.svelte';
	import Exchange from '$components/Exchange/Exchange.svelte';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { goto } from '$app/navigation';

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

<div class="swap-page">
	<div class="exchange-section">
		<Exchange />
	</div>

	<TokenList
		on:onTokenClick={(e) => onTokenClick(e.detail)}
		on:onClose={() => onCloseTokenList()}
		visible={$swapStore.tokenList.visible}
		vaultsSupport={$protocolStateStore.vaultsSupport}
		withQuote={true}
	/>
</div>
