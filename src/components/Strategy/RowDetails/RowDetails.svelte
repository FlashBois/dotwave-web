<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import Input from '$components/Inputs/Input/Input.svelte';
	import type { IStrategyTable } from '$src/stores/strategyStore';
	import Switch from '$components/Inputs/Switch/Switch.svelte';
	import { derived, get } from 'svelte/store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import Decimal from 'decimal.js';
	import { walletStore } from '$src/stores/walletStore';
	import { useDeposit } from '$src/tools/instructions/useDeposit';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { useCreateStatement } from '$src/tools/instructions/useCreateStatement';
	import { anchorStore } from '$src/stores/anchorStore';
	import { useCreateStatementProgramAddress } from '$src/tools/web3/useCreateStatementProgramAddress';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { BN } from '@project-serum/anchor';
	import { useSignAndSendTransaction } from '$src/tools/wallet/useSignAndSendTransaction';
	import { web3Store } from '$src/stores/web3Store';
	import { delay } from 'lodash';

	export let row: IStrategyTable;

	$: ({ publicKey } = $walletStore);

	let checked: boolean = false;
	let baseDepositValue: number;
	let quoteDepositValue: number;
	let withdrawValue: number;

	$: userData = derived<
		[typeof userStore],
		{ baseToken: { amount: Decimal }; quoteToken: { amount: Decimal } }
	>([userStore], ([$userStore], set) => {
		if ($userStore.accounts) {
			const from = $userStore.accounts.find((e) => e.mint.equals(row.tokenBase.address));
			const to = $userStore.accounts.find((e) => e.mint.equals(row.tokenQuote.address));

			set({
				baseToken: {
					amount: from?.amount
						? from.amount.div(new Decimal(10).pow(row.tokenBase.decimals))
						: new Decimal(0)
				},
				quoteToken: {
					amount: to?.amount
						? to.amount.div(new Decimal(10).pow(row.tokenBase.decimals))
						: new Decimal(0)
				}
			});
		}
	});
	$: ({ baseToken, quoteToken } = $userData);

	async function onDepositClick(vaultId: number, strategyId: number) {
		const anchorCopy = get(anchorStore);
		const walletCopy = get(walletStore);
		const web3Copy = get(web3Store);
		const userStoreCopy = get(userStore);
		const { vaultsAccounts, vaultsAddress, stateAddress, vaultsSupport } = get(protocolStateStore);

		if (anchorCopy && walletCopy.publicKey && vaultsAccounts) {
			const { program } = anchorCopy;
			const { publicKey } = walletCopy;

			const tx = new Transaction();
			const statementProgramAddress = useCreateStatementProgramAddress(program, publicKey);

			const userStatemantAccount = await web3Copy.connection.getAccountInfo(
				statementProgramAddress
			);
			if (!userStatemantAccount) {
				tx.add(await useCreateStatement(program, { payer: walletCopy.publicKey! }));
			}

			tx.add(
				await useDeposit(
					program,
					vaultId,
					strategyId,
					{
						statement: statementProgramAddress,
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
						signer: publicKey
					},
					new BN(baseDepositValue * 10 ** row.tokenBase.decimals)
				)
			);

			await useSignAndSendTransaction(web3Copy.connection, walletCopy, tx);
			delay(async () => {
				await loadUserStoreAccounts();
			}, 3000);
		}
	}

	function onBaseDepositChange() {
		quoteDepositValue = 0;
	}

	function onQuoteDepositChange() {
		baseDepositValue = 0;
	}

	// function onHalfDepositClick() {
	// 	depositValue = Number(baseToken.amount.mul(0.5).toFixed(9));
	// }

	// function onMaxDepositClick() {
	// 	depositValue = Number(baseToken.amount.toFixed(9));
	// }
</script>

<div class="strategy-row-details" class:delay-animation={row.withDetails}>
	<div class="strategy-row-details__info-box">
		<div class="strategy-row-details__info">
			<div class="strategy-row-details__info__col">
				<!-- <p>{row.tokenBase.symbol} balance: {baseToken.amount}</p>
				<p>{row.tokenQuote.symbol} balance: {quoteToken.amount}</p> -->
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
					<span
						>Balance: {#if !publicKey} -- {:else} {baseToken.amount.toString()} {/if}</span
					>
					<span
						>Balance: {#if !publicKey} -- {:else} {quoteToken.amount.toString()} {/if}</span
					>
				</div>
				<div class="strategy-row-details__input-container">
					<Input bind:value={baseDepositValue} on:change={onBaseDepositChange} />
					<Switch />
					<Input
						class="strategy-row-details__input--right"
						bind:value={quoteDepositValue}
						on:change={onQuoteDepositChange}
					/>
				</div>
			</div>
			<div class="strategy-row-details__button-box">
				<GradientButton on:click={() => onDepositClick(row.vaultId, row.strategyId)}
					>Deposit</GradientButton
				>
			</div>
		</div>
		<div class="strategy-row-details__operation">
			<div class="strategy-row-details__operation-box">
				<div class="strategy-row-details__label">
					<span>Balance: -- </span>
					<span>Balance: -- </span>
				</div>
				<div class="strategy-row-details__input-container">
					<Input />
					<Switch />
					<Input class="strategy-row-details__input--right" />
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
