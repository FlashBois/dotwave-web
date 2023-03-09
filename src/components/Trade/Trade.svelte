<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { getDecimalFromFraction } from '$src/tools/decimal/getDecimalFromBigInt';
	import { pricesStore } from '$src/stores/oracleStore';
	import type { Side } from './types';

	export let support: IVaultSupport | undefined;

	$: vaults = $protocolStateStore?.vaultsAccounts;
	$: price = support ? $pricesStore?.get(support.oracleAddress.toBase58()) : undefined;
	$: support ? pricesStore.fetch([support.oracleAddress]) : undefined;

	$: maxLeverage =
		vaults && support ? getDecimalFromFraction(vaults.max_leverage(support.id)) : undefined;

	$: collateral = 324.234234;
	$: position = {
		side: 'long',
		size: 2,
		leverage: 3,
		openPrice: 4.543534
	};

	let side: Side | undefined = undefined;
	let size: number | undefined = undefined;
	let message = '';

	$: if (!side || !size) {
		message = 'Enter values';
	} else if (!position) {
		message = `Open ${side} position`;
	} else if (position && position.side == side) {
		message = `Increase ${side} position`;
	} else if (position && position.side != side && position.size > size) {
		message = `Decrease ${side} position`;
	} else if (position && position.side != side && position.size < size) {
		message = `Reverse position to ${side}`;
	} else {
		message = 'Close position';
	}

	function trade() {}
</script>

<div class="trade-container">
	<div class="trade">
		<TradeInfo {price} {maxLeverage} {collateral} {position} />
		<TradeInputs bind:size bind:side />
	</div>

	<div class="trade__button">
		{#if !$walletStore.wallet}
			<WalletMultiButton />
		{:else}
			<AnimateButton on:onClick={trade}>{message}</AnimateButton>
		{/if}
	</div>
</div>
