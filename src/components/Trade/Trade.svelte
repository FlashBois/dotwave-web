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
	import Decimal from 'decimal.js';
	import TokenList from '$components/TokenList/TokenList.svelte';
	import { goto } from '$app/navigation';

	export let support: IVaultSupport | undefined;

	$: vaults = $protocolStateStore?.vaultsAccounts;
	$: price = support ? $pricesStore?.get(support.oracleAddress.toBase58()) : undefined;
	$: support ? pricesStore.fetch([support.oracleAddress]) : undefined;

	$: maxLeverage =
		vaults && support ? getDecimalFromFraction(vaults.max_leverage(support.id)) : undefined;

	$: collateral = new Decimal(324.234234);
	$: position = {
		side: 'long' as Side,
		size: new Decimal(2),
		leverage: 3,
		openPrice: new Decimal(4.543534)
	};

	let side: Side | undefined = undefined;
	let size: Decimal | undefined = undefined;
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

	let visibleTokenList = false;
	function onCloseTokenList() {
		visibleTokenList = false;
	}
	function onTokenClick(token: CustomEvent) {
		goto(`${token}`);
		visibleTokenList = false;
	}
</script>

<div class="trade-container">
	<div class="trade">
		<button
			on:click={() => {
				visibleTokenList = true;
			}}
			class="trade__select"
		>
			<img
				src={support?.baseTokenInfo.logoURI}
				alt={support?.baseTokenInfo.symbol ?? 'Select token'}
			/>
			<p>{support?.baseTokenInfo.symbol}</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-caret-down-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
				/>
			</svg>
		</button>
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

	{#if $protocolStateStore.vaultsSupport}
		<TokenList
			on:onTokenClick={(e) => onTokenClick(e.detail)}
			on:onClose={() => onCloseTokenList()}
			vaultsSupport={$protocolStateStore.vaultsSupport}
			visible={visibleTokenList}
			on:click={onTokenClick}
		/>
	{/if}
</div>
