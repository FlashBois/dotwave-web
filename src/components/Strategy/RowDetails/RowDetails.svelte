<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import type { IStrategyTable } from '$src/stores/strategyStore';
	import { derived, get, writable } from 'svelte/store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import Decimal from 'decimal.js';
	import { walletStore } from '$src/stores/walletStore';
	import { useDeposit } from '$src/tools/instructions/useDeposit';
	import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js';
	import { useCreateStatement } from '$src/tools/instructions/useCreateStatement';
	import { anchorStore } from '$src/stores/anchorStore';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { BN } from '@project-serum/anchor';
	import { useSignAndSendTransaction } from '$src/tools/wallet/useSignAndSendTransaction';
	import { web3Store } from '$src/stores/web3Store';
	import { delay } from 'lodash';

	export let row: IStrategyTable;

	$: ({ publicKey } = $walletStore);

	$: buttonMessage = { message: 'Enter a value', disabled: true };

	let baseDepositValue = writable<number>(undefined);
	let quoteDepositValue = writable<number>(undefined);
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

	async function onDepositClick(vaultId: number, strategyId: number) {
		const anchorCopy = get(anchorStore);
		const walletCopy = get(walletStore);
		const web3Copy = get(web3Store);
		const userStoreCopy = get(userStore);
		const { vaultsAccounts, vaultsAddress, stateAddress, vaultsSupport } = get(protocolStateStore);

		if (anchorCopy && walletCopy.publicKey && vaultsAccounts && userStoreCopy.statementAddress) {
			const { program } = anchorCopy;
			const { publicKey } = walletCopy;

			const tx = new Transaction();

			if (!userStoreCopy.statement) {
				const userStatemantAccount = await web3Copy.connection.getAccountInfo(
					userStoreCopy.statementAddress
				);
				if (!userStatemantAccount) {
					tx.add(await useCreateStatement(program, { payer: walletCopy.publicKey! }));
				}
			}

			tx.add(
				ComputeBudgetProgram.setComputeUnitLimit({
					units: 400000
				})
			);

			tx.add(
				await useDeposit(
					program,
					vaultId,
					strategyId,
					{
						statement: userStoreCopy.statementAddress,
						accountBase: userStoreCopy.getTokenAccountAddress(
							vaultsSupport[vaultId].baseTokenAddress
						)!,
						accountQuote: userStoreCopy.getTokenAccountAddress(
							vaultsSupport[vaultId].quoteTokenAddress
						)!,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(vaultId)),
						reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(vaultId)),
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey,
						baseOracle: vaultsSupport[vaultId].baseOracle,
						quoteOracle: vaultsSupport[vaultId].quoteOracle
					},
					new BN($baseDepositValue * 10 ** row.tokenBase.decimals)
				)
			);

			await useSignAndSendTransaction(web3Copy.connection, walletCopy, tx);
			clearInputs();
			delay(async () => {
				await loadUserStoreAccounts();
			}, 3000);
		}
	}

	function onBaseDepositChange() {
		quoteDepositValue.set(
			Number(
				$protocolStateStore.vaultsAccounts?.deposit(
					row.vaultId,
					row.strategyId,
					BigInt($baseDepositValue * 10 ** row.tokenBase.decimals),
					true,
					Math.floor(Date.now() / 1000)
				)
			) /
				10 ** row.tokenQuote.decimals
		);
		checkDepositInput();
	}

	function onQuoteDepositChange() {
		baseDepositValue.set(
			Number(
				$protocolStateStore.vaultsAccounts?.deposit(
					row.vaultId,
					row.strategyId,
					BigInt($quoteDepositValue * 10 ** row.tokenQuote.decimals),
					false,
					Math.floor(Date.now() / 1000)
				)
			) /
				10 ** row.tokenBase.decimals
		);
		checkDepositInput();
	}

	function checkDepositInput() {
		if ($baseDepositValue == 0 || $quoteDepositValue == 0) buttonMessage = { message: 'Enter a value', disabled: true };
		if ($baseDepositValue > 0 && $quoteDepositValue > 0)
			buttonMessage = { message: '', disabled: false };
		if (
			$baseDepositValue > baseAmount.toNumber() ||
			$quoteDepositValue > quoteAmount.toNumber()
		)
			buttonMessage = { message: 'Insufficient funds', disabled: true };
	}

	// function onHalfDepositClick() {
	// 	depositValue = Number(baseToken.amount.mul(0.5).toFixed(9));
	// }

	// function onMaxDepositClick() {
	// 	depositValue = Number(baseToken.amount.toFixed(9));
	// }

	function clearInputs() {
		baseDepositValue.set(0);
		quoteDepositValue.set(0);
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
								baseDepositValue.set(baseAmount.toNumber());
								onBaseDepositChange();
							}
						}}
						>Balance: {#if !publicKey} -- {:else} {baseAmount.toString()} {/if}</span
					>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							if (publicKey) {
								quoteDepositValue.set(quoteAmount.toNumber());
								onQuoteDepositChange();
							}
						}}
						>Balance: {#if !publicKey} -- {:else} {quoteAmount.toString()} {/if}</span
					>
				</div>
				<div class="strategy-row-details__input-container">
					<DecimalInput bind:value={$baseDepositValue} on:keyup={onBaseDepositChange} />
					<div class="strategy-row-details__input-center">
						<img src={row.tokenBase.logoURI} alt={`${row.tokenBase.symbol} logo`} />
						<img src={row.tokenQuote.logoURI} alt={`${row.tokenQuote.symbol} logo`} />
					</div>
					<DecimalInput
						class="strategy-row-details__input--right"
						bind:value={$quoteDepositValue}
						on:keyup={onQuoteDepositChange}
					/>
				</div>
				<!-- <div class="strategy-row-details__tools">
					<span class="strategy-row-details__tools__item"><span>MAX</span><span>HALF</span></span>
					<span class="strategy-row-details__tools__item"><span>HALF</span><span>MAX</span></span>
				</div> -->
			</div>
			<div class="strategy-row-details__button-box">
				{#if buttonMessage.disabled}
					<GradientButton disabled>{buttonMessage.message}</GradientButton>
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
					<span>Balance: -- </span>
					<span>Balance: -- </span>
				</div>
				<div class="strategy-row-details__input-container">
					<DecimalInput bind:value={baseWithdrawValue} />
					<div class="strategy-row-details__input-center">
						<img src={row.tokenBase.logoURI} alt={`${row.tokenBase.symbol} logo`} />
						<img src={row.tokenQuote.logoURI} alt={`${row.tokenQuote.symbol} logo`} />
					</div>
					<DecimalInput
						bind:value={quoteWithdrawValue}
						class="strategy-row-details__input--right"
					/>
				</div>
			</div>
			<div class="strategy-row-details__button-box">
				<GradientButton>Withdraw</GradientButton>
			</div>
		</div>
	</div>
</div>

<!-- <div>
	<span on:click={onHalfDepositClick}>HALF</span>
	<span on:click={onMaxDepositClick}>MAX</span>
</div> -->
