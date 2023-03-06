<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import Input from '$components/Inputs/Input/Input.svelte';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import type { ITokenList } from '$src/tools/getTokenList';
	import TradeInputs from '$components/Trade/TradeInputs/TradeInputs.svelte';

	export let token: ITokenList;

	function trade() {
		console.log('traded');
	}
</script>

<div class="trade-container">
	<div class="trade">
		<TradeInputs />
	</div>

	<div class="trade__button">
		{#if !$walletStore.wallet}
			<WalletMultiButton />
		{:else}
			<!-- <AnimateButton>{$simulation.msg}</AnimateButton> -->
			<!-- {:else} -->
			<AnimateButton on:onClick={trade}>EXCHANGE</AnimateButton>
		{/if}
	</div>
</div>
