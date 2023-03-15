<script lang="ts">
	import type { ITokenInfo } from '$src/stores/protocolStateStore';
	import Decimal from 'decimal.js';
	import type { Position } from './types';

	export let baseTokenInfo: ITokenInfo | undefined;
	export let price: Decimal | undefined;
	export let maxLeverage: Decimal | undefined;
	export let collateral: Decimal | undefined;
	export let position: Position | undefined;
	export let openFee: Decimal | undefined;
</script>

<div class="trade-info">
	<div class="trade-info__stats">
			<p>Price: <span>{price?.toPrecision(6) ?? '-'} $</span></p>
			<p>Max Leverage: <span>{maxLeverage?.toPrecision(2) ?? '-'}</span></p>
			<p>Open fee: <span>{openFee ?? '-'} %</span></p>
	</div>

	<button on:click class="trade-info__select">
		<img src={baseTokenInfo?.logoURI} alt={baseTokenInfo?.symbol ?? 'Select token'} />
		<p>{baseTokenInfo?.symbol}</p>
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

	<div class="trade-info__stats">
			<p>Collateral: <span>{collateral?.toPrecision(6) ?? '-'} $</span></p>
			<p>Open price: <span>{position?.openPrice.toPrecision(6) ?? '-'}</span></p>
			{#if position != undefined}
				<p>Open position: <span>{position.size} {position.side}</span></p>
			{:else}
				<p>Position: <span>-</span></p>
			{/if}

			<p>
				Leverage: <span>
					{#if position?.leverage.lt(new Decimal(0.1))}
						&lt; 0.1x
					{:else}
						{position?.leverage === undefined ? '-' : position.leverage.toPrecision(2) + 'x'}
					{/if}
				</span>
			</p>
	</div>
</div>