<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import {
		getDecimalFromFraction,
		getDecimalFromPrice,
		getDecimalFromValue
	} from '$src/tools/decimal/getDecimalFromBigInt';
	import { pricesStore } from '$src/stores/oracleStore';
	import type { Position, Side } from './types';
	import Decimal from 'decimal.js';
	import TokenList from '$components/TokenList/TokenList.svelte';
	import { goto } from '$app/navigation';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { useChangePosition } from '$src/tools/instructions/useChangePosition';
	import { anchorStore } from '$src/stores/anchorStore';
	import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';

	export let support: IVaultSupport | undefined;

	$: vaults = $protocolStateStore?.vaultsAccounts;
	$: price = support ? $pricesStore?.get(support.baseOracle.toBase58()) : undefined;
	$: support ? pricesStore.fetch([support.baseOracle]) : undefined;

	$: positionInfo =
		$userStore.statementBuffer && support
			? $protocolStateStore.vaultsAccounts?.get_trading_position_info(
					support.id,
					$userStore.statementBuffer,
					getCurrentUnixTime()
			  )
			: undefined;

	$: maxLeverage =
		vaults && support ? getDecimalFromFraction(vaults.max_leverage(support.id)) : undefined;

	$: collateral = $userStore.statement
		? getDecimalFromValue($userStore.statement?.remaining_permitted_debt())
		: undefined;

	$: position =
		positionInfo && support && collateral
			? ({
					side: positionInfo.long ? 'long' : 'short',
					size: new Decimal(positionInfo.size.toString()).div(10 ** support.baseTokenInfo.decimals),
					leverage: getDecimalFromValue(positionInfo.size_value).div(collateral),
					openPrice: getDecimalFromPrice(positionInfo.open_price)
			  } as Position)
			: undefined;

	$: {
		console.log('positionInfo', positionInfo);
		console.log('statement', $userStore.statement);
		console.log('support', support);
		console.log('position', position);
		console.log('should', positionInfo && support && collateral);
	}

	let side: Side | undefined = undefined;
	let size: Decimal | undefined = undefined;
	let message = '';

	$: if (!side || !size || (side == position?.side && size == position?.size && size)) {
		message = 'Enter values';
	} else if (!support) {
		message = 'Select token';
	} else if (!position) {
		message = `Open ${side} position`;
	} else if (position && position.side == side && size > position.size) {
		message = `Increase ${side} position`;
	} else if (position && position.side == side && position.size < size) {
		message = `Decrease ${position.side} position`;
	} else if (position && position.side != side) {
		message = `Reverse position to ${side}`;
	} else {
		message = 'Close position';
	}

	async function trade() {
		if (size && side && support) {
			await useChangePosition($anchorStore.connection, size, side, support, position);
			await loadUserStoreAccounts();
		} else console.log("couldn't trade");
	}

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
		<TradeInputs bind:size bind:side {position} />
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
			withQuote={false}
		/>
	{/if}
</div>
