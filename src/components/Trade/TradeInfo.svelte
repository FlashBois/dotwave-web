<script lang="ts">
	import Decimal from 'decimal.js';
	import type { ITradeInfo, Position } from './types';

	export let price: Decimal | undefined;
	export let maxLeverage: Decimal | undefined;
	export let collateral: Decimal | undefined;
	export let position: Position | undefined;

	let size: string;
</script>

<div class="both-infos">
	<div class="info">
		<ul>
			<li>Price: <b>{price?.toPrecision(6) ?? '-'}</b></li>
			<li>Max Leverage: <b>{maxLeverage?.toPrecision(2) ?? '-'}</b></li>
		</ul>
	</div>
	<div class="info">
		<ul>
			<li>Collateral: <b>{collateral?.toPrecision(6) ?? '0'}$</b></li>
			<li>Open price: <b>{position?.openPrice.toPrecision(6) ?? '-'}</b></li>
			{#if position != undefined}
				<li>Open position: <b>{position.size} {position.side}</b></li>
			{:else}
				<li>Position: -</li>
			{/if}

			<li>
				Leverage: <b>
					{#if position?.leverage.lt(new Decimal(0.1))}
						&lt; 0.1x
					{:else}
						{position?.leverage === undefined ? '-' : position.leverage.toPrecision(2) + 'x'}
					{/if}
				</b>
			</li>
		</ul>
	</div>
</div>

<style lang="scss">
	.both-infos {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 80%;

		.info {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
			font-size: 1.7rem;
			width: 45%;
			height: 100%;
			border-radius: 20px;
			padding: 2rem;
			border: 2px solid var(--color-grey-dark-2);

			ul {
				list-style: none;
				padding: 0;
				margin: 0;
				display: flex;
				flex-direction: column;
				gap: 0.8rem;

				li {
					font-size: 1.3rem;
					color: var(--color-primary-white);
				}
			}
		}
	}
</style>
