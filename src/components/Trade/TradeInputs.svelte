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
	}

	function pnlClick() {
		side = undefined;
		long = undefined;
		short = undefined;

		dispatch('onSettle')
	}

	$: displaySettle = false;
</script>

<div class="pnl-control-wrapper">
    <div class="pnl-bar">
        <div class="pnl-side">
            <span class="pnl-label">LONG</span>
            <DecimalInput
                bind:value={long}
                placeholder={position?.side == 'long' && side != 'short' ? position.size.toString() : '0'}
            />
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div
            on:click={pnlClick}
            class="pnl-action-trigger {pnl > 0 ? 'is-profit' : ''} {pnl < 0 ? 'is-loss' : ''}"
            on:mouseover={() => (displaySettle = true)}
            on:mouseout={() => (displaySettle = false)}
        >
            <span class="pnl-value">
                {!displaySettle ? (pnl != 0 ? pnl.toFixed(6) : 'Settle') : 'Settle'}
            </span>
        </div>

        <div class="pnl-side">
            <DecimalInput
                bind:value={short}
                class="input-right"
                placeholder={position?.side == 'short' && side != 'long' ? position.size.toString() : '0'}
            />
            <span class="pnl-label">SHORT</span>
        </div>
    </div>
</div>

<style lang="scss">
	.pnl-control-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 2.5rem;
	}

	.pnl-bar {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 65rem;
		height: 5.5rem;
		
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 100px;
		padding: 0.5rem;
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		transition: all 0.3s ease;
	}

	.pnl-side {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 0 1.5rem;
		gap: 1rem;

		.pnl-label {
			font-size: 1.2rem;
			font-weight: 800;
			color: rgba(255, 255, 255, 0.4);
			letter-spacing: 1px;
		}
	}

	.pnl-action-trigger {
		min-width: 14rem;
		height: 100%;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		user-select: none;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		border: 1px solid rgba(255, 255, 255, 0.05);

		.pnl-value {
			font-size: 1.4rem;
			font-weight: 700;
			color: #fff;
		}

		&.is-profit {
			border-color: rgba(var(--color-primary-green-rgb), 0.3);
			.pnl-value { color: var(--color-primary-green); }
			
			&:hover {
				background: rgba(var(--color-primary-green-rgb), 0.15);
				transform: scale(1.05);
				box-shadow: 0 0 20px rgba(var(--color-primary-green-rgb), 0.2);
			}
		}

		&.is-loss {
			border-color: rgba(var(--color-primary-red-rgb), 0.3);
			.pnl-value { color: var(--color-primary-red); }

			&:hover {
				background: rgba(var(--color-primary-red-rgb), 0.15);
				transform: scale(1.05);
				box-shadow: 0 0 20px rgba(var(--color-primary-red-rgb), 0.2);
			}
		}

		&:hover:not(.is-profit):not(.is-loss) {
			background: rgba(255, 255, 255, 0.1);
		}
	}
</style>
