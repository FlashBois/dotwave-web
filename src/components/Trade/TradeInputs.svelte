<script lang="ts">
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';
	import Decimal from 'decimal.js';
	import { createEventDispatcher } from 'svelte';
	import type { Position, Side } from './types';

	const dispatch = createEventDispatcher()

	let long: number | undefined = undefined;
	let short: number | undefined = undefined;

	export let pnlOrcale: number = 0;
	export let side: Side | undefined;
	export let size: Decimal | undefined;
	export let position: Position | undefined;

	$: pnl = position ? pnlOrcale : 0

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

		dispatch('onSettle')
	}

	$: displaySettle = false;
</script>

<div class="inputs">
	<div class="strategy-row-details__input-container .pnl-box">
		<span>LONG</span>
		<DecimalInput
			bind:value={long}
			placeholder={position?.side == 'long' && side != 'short' ? position.size.toString() : '0'}
		/>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			on:click={pnlClick}
			class="strategy-row-details__input-center {pnl > 0 ? 'profit-button' : ''} {pnl < 0 ? 'loss-button' : ''}"
			on:mouseover={() => (displaySettle = true)}
			on:mouseout={() => (displaySettle = false)}
		>
			<span class="{pnl > 0 ? 'profit' : ''} {pnl < 0 ? 'loss' : ''}"
				>{!displaySettle ? (pnl != 0 ? pnl.toFixed(6) : 'Settle') : 'Settle'}</span
			>
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
			user-select: none;
			display: flex;
			justify-content: center;
			cursor: pointer;
			width: 45rem;
			overflow: hidden;
			font-weight: bold;
			padding: 0 2rem;
			transition: all 0.7s ease-in-out;
			margin: 1rem 0;
		}

		.profit {
			color: var(--color-primary-green);
		}

		.profit-button {
			&:hover {
				background-color: rgba(1, 157, 154, 0.2);
			}
		}

		.loss {
			color: var(--color-primary-red);
		}

		.loss-button {
			&:hover {
				background-color: rgba(176, 30, 98, 0.3)
			}
		}
	}
</style>
