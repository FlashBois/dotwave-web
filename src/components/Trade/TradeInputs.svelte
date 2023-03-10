<script lang="ts">
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';
	import Decimal from 'decimal.js';
	import type { Side } from './types';

	export let pnl: number = 0;

	let long = 0;
	let short = 0;
	export let side: Side | undefined = undefined;
	export let size: Decimal | undefined = undefined;

	$: if (side == 'long') {
		size = new Decimal(long);
	} else if (side == 'short') {
		size = new Decimal(short);
	} else {
		size = undefined;
	}

	$: {
		if (long > 0 && side != 'long') {
			side = 'long';
			short = 0;
		} else if (short > 0 && side != 'short') {
			side = 'short';
			long = 0;
		} else if (long == 0 && short == 0) {
			side = undefined;
		}
		console.log(long, short, side);
	}

	let baseWithdrawValue;
	let quoteWithdrawValue;
</script>

<div class="inputs">
	<!-- <div class="input-box">
		<span> Short </span>

		<DecimalInput placeholder="0" bind:value={short} />
	</div> -->

	<!-- <div class="input-box">
		<span> Long </span>
		<DecimalInput bind:value={long} />
	</div> -->
	<div class="strategy-row-details__input-container .pnl-box">
		<span>LONG</span>
		<DecimalInput bind:value={long} />
		<div class="strategy-row-details__input-center">
			<span class="{pnl > 0 ? 'profit' : ''} {pnl < 0 ? 'loss' : ''}">Settle</span>
		</div>
		<DecimalInput bind:value={short} class="strategy-row-details__input--right" />
		<span>SHORT</span>
	</div>
</div>

<style lang="scss">
	.inputs {
		position: relative;
		width: 65%;

		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;

		span {
			margin: 10px;
			font-size: 1.7rem;
			color: var(--color-primary-white);
		}

		.strategy-row-details__input-center {
			cursor: pointer;
		}

		.pnl {
			border: 1px solid var(--color-primary-green);
			border-radius: 10px;
			backdrop-filter: blur(50px);

			padding: 1rem;
			font-size: 1.7rem;
			color: var(--color-primary-white);
			border: 1px solid var(--color-primary-green);
		}

		.profit {
			color: var(--color-primary-green);
		}

		.loss {
			color: var(--color-primary-red);
		}
	}
</style>
