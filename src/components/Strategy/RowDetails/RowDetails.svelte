<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import { loadStrategies, type IStrategyTable } from '$src/stores/strategyStore';
	import { derived } from 'svelte/store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import Decimal from 'decimal.js';
	import { walletStore } from '$src/stores/walletStore';
	import { loadProtocolState, protocolStateStore } from '$src/stores/protocolStateStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useDepositTransaction } from '$src/tools/transactions/useDepositTransaction';
	import { useWithdrawTransaction } from '$src/tools/transactions/useWithdrawTransaction';
	import {
		createNotification,
		updateNotification
	} from '$components/Notification/notificationsStore';

	export let row: IStrategyTable;

	$: ({ connection } = $web3Store);
	$: ({ publicKey } = $walletStore);

	$: depositButtonMessage = { message: 'Deposit', disabled: true };
	$: withdrawButtonMessage = { message: 'Withdraw', disabled: true };

	let baseDepositValue: number;
	let quoteDepositValue: number;
	let baseWithdrawValue: number;
	let quoteWithdrawValue: number;

	$: userData = derived<[typeof userStore], { baseAmount: Decimal; quoteAmount: Decimal }>(
		[userStore],
		([$userStore], set) => {
			if ($userStore.accounts) {
				const from = $userStore.accounts.find((e) => e.mint.equals(row.tokenBase.address));
				const to = $userStore.accounts.find((e) => e.mint.equals(row.tokenQuote.address));

				set({
					baseAmount: from?.amount
						? from.amount.div(new Decimal(10).pow(row.tokenBase.decimals))
						: new Decimal(0),
					quoteAmount: to?.amount
						? to.amount.div(new Decimal(10).pow(row.tokenBase.decimals))
						: new Decimal(0)
				});
			}
		}
	);
	$: ({ baseAmount, quoteAmount } = $userData);

	$: if (baseDepositValue == 0 || quoteDepositValue == 0)
		depositButtonMessage = { message: 'Deposit', disabled: true };
	else if (baseDepositValue > baseAmount.toNumber())
		depositButtonMessage = {
			message: `Insufficient funds (${row.tokenBase.symbol})`,
			disabled: true
		};
	else if (quoteDepositValue > quoteAmount.toNumber())
		depositButtonMessage = {
			message: `Insufficient funds (${row.tokenQuote.symbol})`,
			disabled: true
		};
	else if (baseDepositValue > 0 && quoteDepositValue > 0)
		depositButtonMessage = { message: '', disabled: false };

	$: if (baseWithdrawValue == 0 || quoteWithdrawValue == 0)
		withdrawButtonMessage = { message: 'Withdraw', disabled: true };
	else if (baseWithdrawValue > row.max_withdraw_base || quoteWithdrawValue > row.max_withdraw_quote)
		withdrawButtonMessage = { message: 'Max withdraw exceeded', disabled: true };
	else if (
		(row.max_withdraw_base == baseWithdrawValue || row.max_withdraw_quote == quoteWithdrawValue) &&
		row.max_withdraw_value > row.permitted_withdraw
	)
		withdrawButtonMessage = { message: 'Max value exceeded', disabled: true };
	else if (baseWithdrawValue > 0 && quoteWithdrawValue > 0)
		withdrawButtonMessage = { message: '', disabled: false };

	// else

	$: profit_base = row.deposit[0] > 0 ? row.earned_base_quantity - row.deposit[0] : undefined;
	$: profit_quote = row.deposit[1] > 0 ? row.earned_quote_quantity - row.deposit[1] : undefined;
	$: base_profit_percents =
		row.deposit[0] > 0 && profit_base ? (profit_base / row.deposit[0]) * 100 : undefined;
	$: quote_profit_percents =
		row.deposit[1] > 0 && profit_quote ? (profit_quote / row.deposit[1]) * 100 : undefined;

	async function onDepositClick(vaultId: number, strategyId: number) {
		const signature = await useDepositTransaction(
			connection,
			vaultId,
			strategyId,
			baseDepositValue
		);

		if (signature != 'signing error') {
			const notificationId = createNotification({
				text: 'Deposit',
				type: 'loading',
				signature
			});
			const tx = await connection.confirmTransaction(signature, 'confirmed');

			if (tx.value.err)
				updateNotification(notificationId, {
					text: 'Deposit',
					type: 'failed',
					removeAfter: 3000,
					signature
				});
			else
				updateNotification(notificationId, {
					text: 'Deposit',
					type: 'success',
					removeAfter: 3000,
					signature
				});

			await loadProtocolState();
			await loadUserStoreAccounts();
			await loadStrategies();
			clearInputs();
		}
	}

	async function onWithdrawClick(vaultId: number, strategyId: number) {
		const signature = await useWithdrawTransaction(
			connection,
			vaultId,
			strategyId,
			baseWithdrawValue
		);

		if (signature != 'signing error') {
			const notificationId = createNotification({
				text: 'Withdraw',
				type: 'loading',
				signature
			});
			const tx = await connection.confirmTransaction(signature, 'confirmed');

			if (tx.value.err)
				updateNotification(notificationId, {
					text: 'Withdraw',
					type: 'failed',
					removeAfter: 3000,
					signature
				});
			else
				updateNotification(notificationId, {
					text: 'Withdraw',
					type: 'success',
					removeAfter: 3000,
					signature
				});

			await loadProtocolState();
			await loadUserStoreAccounts();
			await loadStrategies();
			clearInputs();
		}
	}

	function onBaseDepositChange() {
		if (baseDepositValue != 0) {
			quoteDepositValue =
				Number(
					$protocolStateStore.vaultsAccounts?.deposit(
						row.vaultId,
						row.strategyId,
						BigInt(baseDepositValue * 10 ** row.tokenBase.decimals),
						true,
						Math.floor(Date.now() / 1000)
					)
				) /
				10 ** row.tokenQuote.decimals;
		} else quoteDepositValue = 0;
	}

	function onQuoteDepositChange() {
		if (quoteDepositValue != 0) {
			baseDepositValue =
				Number(
					$protocolStateStore.vaultsAccounts?.deposit(
						row.vaultId,
						row.strategyId,
						BigInt(quoteDepositValue * 10 ** row.tokenQuote.decimals),
						false,
						Math.floor(Date.now() / 1000)
					)
				) /
				10 ** row.tokenBase.decimals;
		} else baseDepositValue = 0;
	}

	function onBaseWithdrawChange() {
		try {
			if (baseWithdrawValue != 0) {
				quoteWithdrawValue =
					Number(
						$protocolStateStore.vaultsAccounts?.withdraw(
							row.vaultId,
							row.strategyId,
							BigInt(baseWithdrawValue * 10 ** row.tokenBase.decimals),
							true,
							$userStore.statementBuffer!
						).quote
					) /
					10 ** row.tokenQuote.decimals;
			} else quoteWithdrawValue = 0;
		} catch {}
	}

	function onQuoteWithdrawChange() {
		try {
			if (quoteWithdrawValue != 0) {
				baseWithdrawValue =
					Number(
						$protocolStateStore.vaultsAccounts?.withdraw(
							row.vaultId,
							row.strategyId,
							BigInt(quoteWithdrawValue * 10 ** row.tokenQuote.decimals),
							false,
							$userStore.statementBuffer!
						).base
					) /
					10 ** row.tokenBase.decimals;
			} else baseWithdrawValue = 0;
		} catch {}
	}

	function clearInputs() {
		baseDepositValue = 0;
		quoteDepositValue = 0;
		baseWithdrawValue = 0;
		quoteWithdrawValue = 0;
	}
</script>

<div class="strategy-row-details" class:delay-animation={row.withDetails}>
	<div class="strategy-row-details__info-box">
		<div class="strategy-row-details__info">
			<p>
				Profit {row.tokenBase.symbol}:
				<span
					>{profit_base?.toFixed(6) ?? 0}
					/ {base_profit_percents?.toFixed(2) ?? 0.0}%
				</span>
			</p>
			<p>
				Profit {row.tokenQuote.symbol}:
				<span
					>{profit_quote?.toFixed(6) ?? 0}
					/ {quote_profit_percents?.toFixed(2) ?? 0.0}%</span
				>
			</p>
			<p>Withdraw limit {row.tokenBase.symbol}: <span>{row.max_withdraw_base}</span></p>
			<p>Withdraw limit {row.tokenQuote.symbol}: <span>{row.max_withdraw_quote}</span></p>
			<p>Withdraw limit value: <span>{row.max_withdraw_value.toFixed(2)}$</span></p>
			<p>Healthy withdraw value: <span>{row.permitted_withdraw.toFixed(2)}$</span></p>
		</div>
	</div>
	<div class="strategy-row-details__operations">
		<div class="strategy-row-details__operation">
			<div class="strategy-row-details__operation-box">
				<div class="strategy-row-details__label">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							if (publicKey) {
								baseDepositValue = baseAmount.toNumber();
								onBaseDepositChange();
							}
						}}
						>Balance: {#if !publicKey} -- {:else} {baseAmount.toString()} {/if}</span
					>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							if (publicKey) {
								quoteDepositValue = quoteAmount.toNumber();
								onQuoteDepositChange();
							}
						}}
						>Balance: {#if !publicKey} -- {:else} {quoteAmount.toString()} {/if}</span
					>
				</div>
				<div class="strategy-row-details__input-container">
					<DecimalInput bind:value={baseDepositValue} on:keyup={onBaseDepositChange} />
					<div class="strategy-row-details__input-center">
						<img src={row.tokenBase.logoURI} alt={`${row.tokenBase.symbol} logo`} />
						<img src={row.tokenQuote.logoURI} alt={`${row.tokenQuote.symbol} logo`} />
					</div>
					<DecimalInput
						class="strategy-row-details__input--right"
						bind:value={quoteDepositValue}
						on:keyup={onQuoteDepositChange}
					/>
				</div>
				<!-- <div class="strategy-row-details__tools">
					<span class="strategy-row-details__tools__item"><span>MAX</span><span>HALF</span></span>
					<span class="strategy-row-details__tools__item"><span>HALF</span><span>MAX</span></span>
				</div> -->
			</div>
			<div class="strategy-row-details__button-box">
				{#if depositButtonMessage.disabled}
					<GradientButton disabled>{depositButtonMessage.message}</GradientButton>
				{:else}
					<GradientButton on:click={() => onDepositClick(row.vaultId, row.strategyId)}
						>Deposit</GradientButton
					>
				{/if}
			</div>
		</div>
		<div class="strategy-row-details__operation">
			<div class="strategy-row-details__operation-box">
				<div class="strategy-row-details__label">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							if (publicKey && row.max_withdraw_base != 0) {
								baseWithdrawValue = row.max_withdraw_base;
								onBaseWithdrawChange();
							}
						}}
						>Max: {#if !publicKey || row.max_withdraw_base == 0}
							--
						{:else}
							{row.max_withdraw_base}
						{/if}</span
					>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							if (publicKey && row.max_withdraw_quote != 0) {
								quoteWithdrawValue = row.max_withdraw_quote;
								onQuoteWithdrawChange();
							}
						}}
						>Max: {#if !publicKey || row.max_withdraw_quote == 0}
							--
						{:else}
							{row.max_withdraw_quote}
						{/if}</span
					>
				</div>
				<div class="strategy-row-details__input-container">
					<DecimalInput
						bind:value={baseWithdrawValue}
						on:keyup={onBaseWithdrawChange}
						disabled={row.max_withdraw_base == 0 ? true : false}
					/>
					<div class="strategy-row-details__input-center">
						<img src={row.tokenBase.logoURI} alt={`${row.tokenBase.symbol} logo`} />
						<img src={row.tokenQuote.logoURI} alt={`${row.tokenQuote.symbol} logo`} />
					</div>
					<DecimalInput
						bind:value={quoteWithdrawValue}
						on:keyup={onQuoteWithdrawChange}
						disabled={row.max_withdraw_quote == 0 ? true : false}
						class="strategy-row-details__input--right"
					/>
				</div>
			</div>
			<div class="strategy-row-details__button-box">
				{#if withdrawButtonMessage.disabled}
					<GradientButton disabled>{withdrawButtonMessage.message}</GradientButton>
				{:else}
					<GradientButton on:click={() => onWithdrawClick(row.vaultId, row.strategyId)}
						>Withdraw</GradientButton
					>
				{/if}
			</div>
		</div>
	</div>
</div>
