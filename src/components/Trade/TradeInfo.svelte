<script lang="ts">
	import type Decimal from 'decimal.js';
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
			<li>Price: {price?.toString() ?? '-'}</li>
			<li>Max Leverage: {maxLeverage?.toString() ?? '-'}</li>
		</ul>
	</div>
	<div class="info">
		<ul>
			<li>Collateral: {collateral?.toString() ?? '-'}</li>
			<li>Open price: {position?.openPrice ?? '-'}</li>
			{#if position != undefined}
				<li>Open position: {position.size} {position.side}</li>
			{:else}
				<li>Position: -</li>
			{/if}
			<li>
				Leverage: {position?.leverage === undefined ? '-' : position.leverage + 'x'}
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
