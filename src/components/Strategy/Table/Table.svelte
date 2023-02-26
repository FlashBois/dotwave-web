<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import Input from '$components/Inputs/Input/Input.svelte';
	import Decimal from 'decimal.js';

	interface IStrategyTable {
		strategy: string;
		token: {
			symbol: string;
			name: string;
		};
		walletBalance: Decimal;
		deposited: Decimal;
		locked: Decimal;
		dailyAPY: Decimal;
		weeklyAPY: Decimal;
		yearlyAPY: Decimal;
		utilization: Decimal;
		withDetails: boolean;
	}

	let withDetails = false;
	let data: IStrategyTable[] = [
		{
			strategy: '',
			token: {
				symbol: '',
				name: ''
			},
			walletBalance: new Decimal(100.01),
			deposited: new Decimal(100.01),
			locked: new Decimal(100.01),
			dailyAPY: new Decimal(1.01),
			weeklyAPY: new Decimal(1.01),
			yearlyAPY: new Decimal(1.01),
			utilization: new Decimal(20.5),
			withDetails: false
		},
		{
			strategy: '',
			token: {
				symbol: '',
				name: ''
			},
			walletBalance: new Decimal(100.01),
			deposited: new Decimal(100.01),
			locked: new Decimal(100.01),
			dailyAPY: new Decimal(1.01),
			weeklyAPY: new Decimal(1.01),
			yearlyAPY: new Decimal(1.01),
			utilization: new Decimal(20.5),
			withDetails: false
		},
		{
			strategy: '',
			token: {
				symbol: '',
				name: ''
			},
			walletBalance: new Decimal(100.01),
			deposited: new Decimal(100.01),
			locked: new Decimal(100.01),
			dailyAPY: new Decimal(1.01),
			weeklyAPY: new Decimal(1.01),
			yearlyAPY: new Decimal(1.01),
			utilization: new Decimal(20.5),
			withDetails: false
		},
		{
			strategy: '',
			token: {
				symbol: '',
				name: ''
			},
			walletBalance: new Decimal(100.01),
			deposited: new Decimal(100.01),
			locked: new Decimal(100.01),
			dailyAPY: new Decimal(1.01),
			weeklyAPY: new Decimal(1.01),
			yearlyAPY: new Decimal(1.01),
			utilization: new Decimal(20.5),
			withDetails: false
		}
	];
</script>

<div class="strategy-table">
	<div class="strategy-table__header">
		<div class="strategy-table__header-item--strategy">Strategy</div>
		<div class="strategy-table__header-item--cell">Wallet balance</div>
		<div class="strategy-table__header-item--cell">Deposited</div>
		<div class="strategy-table__header-item--cell">Locked</div>
		<div class="strategy-table__header-item--cell">Daily APY</div>
		<div class="strategy-table__header-item--cell">Weekly APY</div>
		<div class="strategy-table__header-item--cell">Yearly APY</div>
		<div class="strategy-table__header-item--cell">Utilization</div>
		<div class="strategy-table__header-item--arrow">-</div>
	</div>
	{#each data as row}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="strategy-table__row with-details" class:with-details={row.withDetails}>
			<div
				class="strategy-table__row-items"
				on:click={() => {
					row.withDetails = !row.withDetails;
				}}
			>
				<div class="strategy-table__row-item--strategy">-</div>
				<div class="strategy-table__row-item--cell">{row.walletBalance}</div>
				<div class="strategy-table__row-item--cell">{row.deposited}</div>
				<div class="strategy-table__row-item--cell">{row.locked}</div>
				<div class="strategy-table__row-item--cell">{row.dailyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.weeklyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.yearlyAPY}%</div>
				<div class="strategy-table__row-item--cell">{row.utilization}</div>
				<div class="strategy-table__row-item--arrow">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-chevron-down"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</div>
			</div>
			<div class="strategy-table__row-details">
				{#if row.withDetails}
					<div class="strategy-table__row-details__info" />
					<div class="strategy-table__row-details__inputs">
						<div class="strategy-table__row-details__input">
							<Input />
							<div class="strategy-table__row-details__button-box">
								<GradientButton>Deposit</GradientButton>
							</div>
						</div>
						<div class="strategy-table__row-details__input">
							<Input />
							<div class="strategy-table__row-details__button-box">
								<GradientButton>Withdraw</GradientButton>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
