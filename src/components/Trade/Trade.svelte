<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { swapStore, TokenListType } from '$src/stores/swapStore';
	import { userStore } from '$src/stores/userStore';
	import { walletStore } from '$stores/walletStore';
	import { derived, get, writable } from 'svelte/store';
	import Decimal from 'decimal.js';

	import Input from '$components/Inputs/Input/Input.svelte';
	import ReadonlyInput from '$components/Inputs/Input/ReadonlyInput.svelte';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { PublicKey } from '@solana/web3.js';
	import { swapOutput } from '$src/tools/swapOutput';
	import { useSwap } from '$src/tools/instructions/useSwap';
	import { anchorStore } from '$src/stores/anchorStore';
</script>

<div class="exchange-container">
	<div class="exchange">
		<div class="exchange__input-box exchange__input-box--from">
			<div class="exchange__label">
				<span>From</span>
			</div>
			<div class="exchange__input">
				<!-- <Input bind:value={$fromValue} /> -->
				<!-- <button on:click={() => displayTokenList(TokenListType.FROM)} class="exchange__select">
					<img src={data.from.logoURI} alt={data.from.symbol} />
					<p>USDC</p>
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
				</button> -->
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="exchange__input-box exchange__input-box--to">
			<div class="exchange__label">
				<span>To</span>
				<span />
			</div>
			<div class="exchange__input">
				<!-- <ReadonlyInput value={$simulation.out} />
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
				</button> -->
			</div>
		</div>
	</div>
	<div class="exchange__button">
		<!-- {#if !wallet} -->
		<WalletMultiButton />
		<!-- {:else if $simulation.ok == false} -->
		<!-- <AnimateButton>{$simulation.msg}</AnimateButton> -->
		<!-- {:else} -->
		<!-- <AnimateButton on:onClick={swap}>EXCHANGE</AnimateButton> -->
		<!-- {/if} -->
	</div>
</div>
