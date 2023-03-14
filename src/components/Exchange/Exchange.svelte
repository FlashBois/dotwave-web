<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { walletStore } from '$stores/walletStore';
	import { derived, get, writable } from 'svelte/store';
	import Decimal from 'decimal.js';

	import Input from '$components/Inputs/Input/Input.svelte';
	import ReadonlyInput from '$components/Inputs/Input/ReadonlyInput.svelte';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import { swapOutput } from '$src/tools/swapOutput';
	import { useSwap } from '$src/tools/instructions/useSwap';
	import { anchorStore } from '$src/stores/anchorStore';
	import {
		createNotification,
		updateNotification
	} from '$components/Notification/notificationsStore';
	import { loadProtocolState, type ITokenInfo } from '$src/stores/protocolStateStore';

	export let fromToken: ITokenInfo;
	export let toToken: ITokenInfo;

	$: ({ wallet } = $walletStore);

	$: {
		if (fromToken && toToken) {
			swapStore.set({
				from: fromToken!,
				to: toToken!,
				slippagePercentage: 0.5,
				tokenList: {
					visible: false,
					type: null
				}
			});
		}
	}

	interface ISimulationData {
		in: number;
		out: number;
		ok: boolean;
		msg: string;
	}

	const fromValue = writable(0);
	const simulation = derived<typeof fromValue, ISimulationData>(fromValue, ($fromValue, set) => {
		try {
			let out = 0;
			if ($fromValue != 0) {
				const swapOut = swapOutput($fromValue);
				if (swapOut) out = swapOut;
			}

			set({
				in: $fromValue,
				out: Number(out),
				ok: true,
				msg: ''
			});
		} catch (error: any) {
			let msg;

			if (error.message.includes('[DecimalError]')) {
				msg = 'Invalid input amount';
			}

			switch (error.message) {
				case 'Not enough available quote quantity':
					msg = 'Not enough liquidity';
					break;
				case 'Vault not found':
					msg = 'There is not vault for this token yet';
					break;

				case 'Cannot swap a token for itself':
					msg = error.message;
					break;

				case 'invalid BigInt syntax':
					msg = 'Input quantity is too great';
					break;

				case 'recursive use of an object detected which would lead to unsafe aliasing in rust':
					msg = 'Simulation failed';
					break;

				case 'To be defined':
					msg = 'End of curve reached';
					break;

				default:
					if (error.message.includes('[DecimalError]')) {
						msg = 'Invalid input amount';
					} else {
						msg = 'Simulation failed';
						console.error(error);
					}
			}

			console.log(error.message);
			set({
				in: $fromValue,
				out: 0,
				ok: false,
				msg
			});
		}
	});

	$: userData = derived<
		[typeof userStore, typeof page],
		{ from: { amount: Decimal }; to: { amount: Decimal } }
	>([userStore, page], ([$userStore, $page], set) => {
		if ($userStore.accounts) {
			const from = $userStore.accounts.find((e) => e.mint.toString() == fromToken.address);
			const to = $userStore.accounts.find((e) => e.mint.toString() == toToken.address);

			set({
				from: {
					amount: from?.amount ?? new Decimal(0)
				},
				to: {
					amount: to?.amount ?? new Decimal(0)
				}
			});
		}
	});
	$: ({ from, to } = $userData);

	function replaceTokens() {
		goto(`${toToken.symbol}_${fromToken.symbol}`);
	}

	function displayTokenList(type: TokenListType) {
		swapStore.update((e) => {
			return {
				...e,
				tokenList: { type, visible: true }
			};
		});
	}

	async function swap() {
		const gotWalletStore = get(walletStore);
		const connection = get(anchorStore).connection;
		const to = get(simulation);
		const signature = await useSwap(connection, gotWalletStore, to.in, to.out);

		if (signature != 'signing error') {
			const notificationId = createNotification({
				text: 'Swap',
				type: 'loading',
				signature
			});
			const tx = await connection.confirmTransaction(signature, 'confirmed');

			if (tx.value.err)
				updateNotification(notificationId, { text: 'Swap', type: 'failed', removeAfter: 3000, signature });
			else updateNotification(notificationId, { text: 'Swap', type: 'success', removeAfter: 3000, signature });

			await loadProtocolState();
			await loadUserStoreAccounts();
			fromValue.set(0);
		}
	}
</script>

<div class="exchange-container">
	<div class="exchange">
		<div class="exchange__input-box exchange__input-box--from">
			<div class="exchange__label">
				<span>From</span>
				<span
					>Balance: {#if !wallet}
						--
					{:else}
						{from.amount.div(new Decimal(10).pow(fromToken.decimals))}
					{/if}</span
				>
			</div>
			<div class="exchange__input">
				<Input bind:value={$fromValue} />
				<button on:click={() => displayTokenList(TokenListType.FROM)} class="exchange__select">
					<img src={fromToken.logoURI} alt={fromToken.symbol} />
					<p>{fromToken.symbol}</p>
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
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="exchange__replace" on:click={replaceTokens}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				class="bi bi-arrow-down-up"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"
				/>
			</svg>
		</div>
		<div class="exchange__input-box exchange__input-box--to">
			<div class="exchange__label">
				<span>To</span>
				<span
					>Balance: {#if !wallet}
						--
					{:else}
						{to.amount.div(new Decimal(10).pow(toToken.decimals))}
					{/if}</span
				>
			</div>
			<div class="exchange__input exchange__input--readonly">
				<ReadonlyInput value={$simulation.out} />
				<button on:click={() => displayTokenList(TokenListType.TO)} class="exchange__select">
					<img src={toToken.logoURI} alt={toToken.symbol} />
					<p>{toToken.symbol}</p>
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
			</div>
		</div>
	</div>
	<div class="exchange__button">
		{#if !wallet}
			<WalletMultiButton />
		{:else if $simulation.ok == false}
			<AnimateButton>{$simulation.msg}</AnimateButton>
		{:else}
			<AnimateButton on:onClick={swap}>EXCHANGE</AnimateButton>
		{/if}
	</div>
</div>
