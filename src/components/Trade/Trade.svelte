<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import type { ITokenList } from '$src/tools/getTokenList';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { findVault } from '$src/tools/findVault';
	import { PublicKey } from '@solana/web3.js';
	import {
		getDecimalFromFraction,
		getDecimalFromPrice
	} from '$src/tools/decimal/getDecimalFromBigInt';

	export let token: ITokenList;

	$: vaults = $protocolStateStore?.vaultsAccounts;
	$: index = findVault($protocolStateStore?.vaultsSupport, new PublicKey(token.address))?.index;

	$: price =
		vaults && index !== undefined ? getDecimalFromPrice(vaults.get_price(index)) : undefined;

	$: maxLeverage = undefined;
	// vaults && index !== undefined ? getDecimalFromFraction(vaults.max_leverage(index)) : undefined;

	$: collateral = undefined;
	$: position = undefined;

	let actionName: 'Open' | 'Close' | 'Increase' | 'Decrease' | 'Reverse' = 'Open';

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
