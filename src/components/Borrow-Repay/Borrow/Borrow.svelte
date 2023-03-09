<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import type { IVaultSupport } from '$src/stores/protocolStateStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts } from '$src/stores/userStore';
	import { delay } from 'lodash';
	import type Decimal from 'decimal.js';
	import { useBorrowTransaction } from '$src/tools/transactions/useBorrowTransaction';

	$: ({ connection } = $web3Store);

	export let vaultSupport: IVaultSupport;
	export let maxBorrowAmount: Decimal | undefined;

	let borrowInputValue: number;

	async function onBorrowClick() {
		await useBorrowTransaction(connection, vaultSupport, borrowInputValue);
		
		delay(async () => {
			await loadUserStoreAccounts();
		}, 3000);
	}
</script>

<div class="borrow">
	<div class="borrow__operation">
		<div class="borrow__operation-box">
			<div class="borrow__label">
				<span>Max borrow: {maxBorrowAmount?.toString() ?? '--'} </span>
			</div>
			<div class="borrow__input">
				<DecimalInput bind:value={borrowInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="borrow__button-box">
				<GradientButton on:click={onBorrowClick}>Borrow</GradientButton>
			</div>
		</div>
	</div>
</div>
