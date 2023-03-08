<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { findVault } from '$src/tools/findVault';
	import { PublicKey } from '@solana/web3.js';
	import {
		getDecimalFromFraction,
		getDecimalFromPrice
	} from '$src/tools/decimal/getDecimalFromBigInt';

	export let support: IVaultSupport | undefined;

	$: vaults = $protocolStateStore?.vaultsAccounts;

	$: price = vaults && support ? getDecimalFromPrice(vaults.get_price(support.id)) : undefined;

	$: maxLeverage =
		vaults && support ? getDecimalFromFraction(vaults.max_leverage(support.id)) : undefined;

	$: collateral = undefined;
	$: position = undefined;

	let message = 'Open';

	function trade() {
		console.log('traded');
	}
</script>

<div class="trade-container">
	<div class="trade">
		<TradeInfo {price} {maxLeverage} {collateral} {position} />
		<TradeInputs />
	</div>

	<div class="trade__button">
		{#if !$walletStore.wallet}
			<WalletMultiButton />
		{:else}
			<AnimateButton on:onClick={trade}>{actionName}</AnimateButton>
		{/if}
	</div>
</div>
