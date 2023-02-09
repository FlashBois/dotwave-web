<script lang="ts">
	import WalletMultiButton from '../components/Wallet/WalletMultiButton.svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
</script>

<div class="wrapper-app">
	<div class="address">
		<WalletMultiButton />
	</div>

	{#if $walletStore?.connected}
		<p class="warning">You are connected to DevNet!</p>
	{:else}
		<p class="warning">You are not connected...</p>
	{/if}
</div>

<style lang="scss">
	:global(body) {
		padding: 100px;
		margin: 0;
		background-color: #333333;
	}

	.wrapper-app {
		height: 100vh;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

		.address {
			position: absolute;
			right: 30px;
			top: 30px;
			border-radius: 5px;
			padding: 10px;
		}

		.warning {
			color: #ca4b4b;
			text-align: center;
			padding: 40px;
			font-size: 20px;
		}
	}
</style>
