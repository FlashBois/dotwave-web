<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { userStore } from '$src/stores/userStore';
	import { walletStore } from '$stores/walletStore';
	import { derived, writable } from 'svelte/store';

	import Input from '$components/Input/Input.svelte';
	import ReadonlyInput from '$components/Input/ReadonlyInput.svelte';

	$: ({ wallet } = $walletStore);
	$: ({ data } = $page);

	$: {
		if (data) {
			swapStore.set({
				from: data.from,
				to: data.to,
				tokenList: {
					visible: false,
					type: null
				}
			});
		}
	}

	const fromValue = writable(0);
	const toValue = derived<typeof fromValue, number>(fromValue, ($fromValue, set) => {
		set($fromValue);
	});

	$: userData = derived<
		[typeof userStore, typeof page],
		{ from: { amount: number | bigint }; to: { amount: number | bigint } }
	>([userStore, page], ([$userStore, $page], set) => {
		if ($userStore.accounts) {
			const from = $userStore.accounts.find((e) => e.mint.toString() == $page.data.from.address);
			const to = $userStore.accounts.find((e) => e.mint.toString() == $page.data.to.address);

			set({
				from: {
					amount: from?.amount ?? 0
				},
				to: {
					amount: to?.amount ?? 0
				}
			});
		}
	});
	$: ({ from, to } = $userData);

	function replaceTokens() {
		goto(`${data.to.symbol}_${data.from.symbol}`);
	}

	function displayTokenList(type: TokenListType) {
		swapStore.update((e) => {
			return {
				...e,
				tokenList: { type, visible: true }
			};
		});
	}
</script>

<div class="exchange">
	<div class="exchange__input-box exchange__input-box--from">
		<div class="exchange__label">
			<span>From</span>
			<span
				>Balance: {#if !wallet} -- {:else} {from.amount.toString()} {/if}</span
			>
		</div>
		<div class="exchange__input">
			<Input bind:value={$fromValue} />
			<button on:click={() => displayTokenList(TokenListType.FROM)} class="exchange__select">
				<img src={data.from.logoURI} alt={data.from.symbol} />
				<p>{data.from.symbol}</p>
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
				>Balance: {#if !wallet} -- {:else} {to.amount.toString()} {/if}</span
			>
		</div>
		<div class="exchange__input">
			<ReadonlyInput value={$toValue} />
			<button on:click={() => displayTokenList(TokenListType.TO)} class="exchange__select">
				<img src={data.to.logoURI} alt={data.to.symbol} />
				<p>{data.to.symbol}</p>
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
