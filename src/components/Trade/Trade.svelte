<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import {
		loadProtocolState,
		protocolStateStore,
		type IVaultSupport
	} from '$src/stores/protocolStateStore';
	import {
		getDecimalFromBigintWithDecimals,
		getDecimalFromFraction,
		getDecimalFromPrice,
		getDecimalFromValue
	} from '$src/tools/decimal/getDecimalFromBigInt';
	import { pricesStore } from '$src/stores/oracleStore';
	import type { Position, Side } from './types';
	import Decimal from 'decimal.js';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { useChangePosition } from '$src/tools/instructions/useChangePosition';
	import { anchorStore } from '$src/stores/anchorStore';
	import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
	import { createEventDispatcher } from 'svelte';
	import {
		createNotification,
		updateNotification
	} from '$components/Notification/notificationsStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadStrategies } from '$src/stores/strategyStore';

	const dispatch = createEventDispatcher();

	export let support: IVaultSupport | undefined;

	$: ({ connection } = $web3Store);

	$: vaults = $protocolStateStore?.vaultsAccounts;
	$: price = support ? $pricesStore?.get(support.baseOracle.toBase58()) : undefined;
	$: support ? pricesStore.fetch([support.baseOracle]) : undefined;
	$: baseTokenInfo = support ? support.baseTokenInfo : undefined;

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
					openPrice: getDecimalFromPrice(positionInfo.open_price),
					pnl: getDecimalFromValue(positionInfo.pnl_value),
					openFee: getDecimalFromBigintWithDecimals(
						positionInfo.fees,
						support.baseTokenInfo.decimals
					)
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
			const signature = await useChangePosition(
				$anchorStore.connection,
				size,
				side,
				support,
				position
			);

			if (signature != 'signing error') {
				const notificationId = createNotification({
					text: 'Trade',
					type: 'loading',
					signature
				});
				const tx = await connection.confirmTransaction(signature, 'confirmed');

				if (tx.value.err)
					updateNotification(notificationId, {
						text: 'Trade',
						type: 'failed',
						removeAfter: 3000,
						signature
					});
				else
					updateNotification(notificationId, {
						text: 'Trade',
						type: 'success',
						removeAfter: 3000,
						signature
					});

				await loadProtocolState();
				await loadUserStoreAccounts();
				await loadStrategies();
			}
		} else console.log("couldn't trade");
	}

	function onShowTokenList() {
		dispatch('onShowTokenList');
	}
</script>

<div class="trade-section">
	<div class="trade-info-section">
		<TradeInfo
			{baseTokenInfo}
			{price}
			{maxLeverage}
			{collateral}
			{position}
			on:click={onShowTokenList}
		/>
	</div>
	<div class="trade-container">
		<div class="trade">
			<TradeInputs bind:size bind:side {position} pnl={position?.pnl.toNumber()} />
		</div>
	</div>
</div>

<div class="trade__button">
	{#if !$walletStore.wallet}
		<WalletMultiButton />
	{:else}
		<AnimateButton on:onClick={trade}>{message}</AnimateButton>
	{/if}
</div>
