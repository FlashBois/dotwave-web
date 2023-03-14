<script lang="ts">
	// import PrograssBar from '$components/ProgressBar/PrograssBar.svelte';
	import type { ITokenInfo } from '$src/stores/protocolStateStore';
	import type Decimal from 'decimal.js';

	export let baseTokenInfo: ITokenInfo;
	export let maxBorrowAmount: Decimal | undefined;
	export let owedQuantity: Decimal | undefined;
	export let borrowedQuantity: Decimal | undefined;
	export let utilization: Decimal | undefined;
	export let borrowFee: Decimal | undefined
	export let maxUtilization: Decimal | undefined;
	export let price: Decimal | undefined
</script>

<div class="borrow-repay-info">
	<div class="borrow-repay-info__select-box">
		<button on:click class="borrow-repay-info__select">
			<img src={baseTokenInfo.logoURI} alt={baseTokenInfo.symbol} />
			<p>{baseTokenInfo.symbol}</p>
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
	<div class="borrow-repay-info__stats">
		<p>{baseTokenInfo.symbol} price: <span>{price?.toFixed(2) ?? '-'}</span></p>
		<p>Fee: <span>{borrowFee?.toNumber() ?? '-'} %</span></p>
		<p>User max borrow: <span>{maxBorrowAmount?.toNumber() ?? '-'}</span></p>
		<p>User borrowed: <span>{borrowedQuantity?.toNumber() ?? '-'}</span></p>
		<p>User owed: <span>{owedQuantity?.toNumber() ?? '-'}</span></p>
		<p>
			User fee: <span>{borrowedQuantity && owedQuantity ? owedQuantity.sub(borrowedQuantity).toNumber() : '-'}</span>
		</p>
		<p>Utilization: <span>{utilization?.toPrecision(3) ?? '-'}%</span></p>
		<!-- <p>Utilization: <span><PrograssBar percent={20} /> 20%</span></p> -->
		<p>Max utilization: <span>{maxUtilization?.toPrecision(3) ?? '-'} %</span></p>
	</div>
</div>
