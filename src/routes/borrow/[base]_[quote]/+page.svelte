<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Borrow from '$components/Borrow-Repay/Borrow/Borrow.svelte';
	import Repay from '$components/Borrow-Repay/Repay/Repay.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	$: ({ params } = $page);

	let vaultSupport: IVaultSupport;

	onMount(() => {
		const protocolSateCopy = get(protocolStateStore);

		const vault = protocolSateCopy.vaultsSupport.find(
			(e) => e.baseTokenInfo.symbol == params.base && e.quoteTokenInfo.symbol == params.quote
		);

		if (vault) vaultSupport = vault;
		else goto('RAY_USDC');
	});
</script>

<div class="borrow-page">
	<div class="borrow-repay-section">
		{#if vaultSupport}
			<Borrow {vaultSupport} />
			<Repay {vaultSupport} />
		{/if}
	</div>
</div>
