<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import { clearStrategyStore, loadStrategies, type IStrategyTable } from '$src/stores/strategyStore';
	import { derived } from 'svelte/store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import Decimal from 'decimal.js';
	import { walletStore } from '$src/stores/walletStore';
	import { loadProtocolState, protocolStateStore } from '$src/stores/protocolStateStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useDepositTransaction } from '$src/tools/transactions/useDepositTransaction';
	import { useWithdrawTransaction } from '$src/tools/transactions/useWithdrawTransaction';
	import { createNotification, updateNotification } from '$components/Notification/notificationsStore';

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
		depositButtonMessage = { message: `Insufficient funds (${row.tokenBase.symbol})`, disabled: true };
	else if (quoteDepositValue > quoteAmount.toNumber())
		depositButtonMessage = { message: `Insufficient funds (${row.tokenQuote.symbol})`, disabled: true };
	else if (baseDepositValue > 0 && quoteDepositValue > 0)
		depositButtonMessage = { message: '', disabled: false };

	$: if (baseWithdrawValue == 0 || quoteWithdrawValue == 0)
		withdrawButtonMessage = { message: 'Withdraw', disabled: true };
	else if (baseWithdrawValue > row.max_withdraw_base || quoteWithdrawValue > row.max_withdraw_quote)
		withdrawButtonMessage = { message: 'Max withdraw exceeded', disabled: true };
	else if (baseWithdrawValue > 0 && quoteWithdrawValue > 0)
		withdrawButtonMessage = { message: '', disabled: false };

	async function onDepositClick(vaultId: number, strategyId: number) {
		const signature = await useDepositTransaction(
			connection,
			vaultId,
			strategyId,
			baseDepositValue
		);
		const notificationId = createNotification({
			text: 'Deposit',
			type: 'loading'
		});
		const tx = await connection.confirmTransaction(signature, 'confirmed');

		if (tx.value.err) updateNotification(notificationId, { text: 'Deposit', type: 'failed', removeAfter: 3000 });
		else updateNotification(notificationId, { text: 'Deposit', type: 'success', removeAfter: 3000 });

		await loadProtocolState();
		await loadUserStoreAccounts();
		await loadStrategies();
		clearInputs();
	}

	async function onWithdrawClick(vaultId: number, strategyId: number) {
		const signature = await useWithdrawTransaction(
			connection,
			vaultId,
			strategyId,
			baseWithdrawValue
		);
		const notificationId = createNotification({
			text: 'Withdraw',
			type: 'loading'
		});
		const tx = await connection.confirmTransaction(signature, 'confirmed');

		if (tx.value.err) updateNotification(notificationId, { text: 'Withdraw', type: 'failed', removeAfter: 3000 });
		else updateNotification(notificationId, { text: 'Withdraw', type: 'success', removeAfter: 3000 });

		await loadProtocolState();
		await loadUserStoreAccounts();
		await loadStrategies();
		clearInputs();
	}

	function onBaseDepositChange() {
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
	}

	function onQuoteDepositChange() {
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
	}

	function onBaseWithdrawChange() {
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
	}

	function onQuoteWithdrawChange() {
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
			<div class="strategy-row-details__info__col">
				<p>{row.tokenBase.symbol} deposited: 0</p>
				<p>{row.tokenQuote.symbol} deposited: 0</p>
				<p>{row.tokenBase.symbol} locked: 0</p>
				<p>{row.tokenQuote.symbol} locked: 0</p>
				<p>Max {row.tokenBase.symbol} withdraw: 0</p>
				<p>Max {row.tokenQuote.symbol} withdraw: 0</p>
			</div>
			<div class="strategy-row-details__info__col">
				<span class="strategy-row-details__switch" />
			</div>
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
