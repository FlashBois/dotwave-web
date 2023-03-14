<script lang="ts">
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';
	import Decimal from 'decimal.js';
	import type { Position, Side } from './types';

	export let pnl: number = 1;

	let long: number | undefined = undefined;
	let short: number | undefined = undefined;
	export let side: Side | undefined;
	export let size: Decimal | undefined;
	export let position: Position | undefined;

	$: if (side == 'long') {
		size = long ? new Decimal(long) : undefined;
	} else if (side == 'short') {
		size = short ? new Decimal(short) : undefined;
	} else {
		size = undefined;
	}

	$: {
		if (long && side != 'long') {
			side = 'long';
			short = undefined;
		} else if (short && side != 'short') {
			side = 'short';
			long = undefined;
		} else if (!long && !short) {
			side = undefined;
		}
		console.log(long, short, side);
	}

	function pnlClick() {
		side = undefined;
		long = undefined;
		short = undefined;
	}
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
		<DecimalInput
			bind:value={long}
			placeholder={position?.side == 'long' && side != 'short' ? position.size.toString() : '0'}
		/>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={pnlClick} class="strategy-row-details__input-center">
			<span class="{pnl > 0 ? 'profit' : ''} {pnl < 0 ? 'loss' : ''}">{pnl ?? 'Settle'}</span>
		</div>
		<DecimalInput
			bind:value={short}
			class="strategy-row-details__input--right"
			placeholder={position?.side == 'short' && side != 'long' ? position.size.toString() : '0'}
		/>
		<span>SHORT</span>
	</div>
</div>

<style lang="scss">
	.inputs {
		position: relative;
		width: 60%;
		height: 10%;
		margin-bottom: 2rem;

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
