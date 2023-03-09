<script lang="ts">
	import { loadProtocolState, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts } from '$src/stores/userStore';
	import type Decimal from 'decimal.js';
	import { useRepayTransaction } from '$src/tools/transactions/useRepayTransaction';

	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	$: ({ connection } = $web3Store);
	$: ({ publicKey } = $walletStore);

	export let vaultSupport: IVaultSupport;
	export let maxRepayAmount: Decimal | undefined;
	
	let repayInputValue: number;

	async function onRepayClick() {
		const signature = await useRepayTransaction(connection, vaultSupport, repayInputValue);
		await connection.confirmTransaction(signature, 'confirmed');
		await loadProtocolState();
		await loadUserStoreAccounts();
		repayInputValue = 0;
	}
</script>

<div class="repay">
	<div class="repay__operation">
		<div class="repay__operation-box">
			<div class="borrow__label">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() =>
						publicKey && maxRepayAmount ? (repayInputValue = maxRepayAmount.toNumber()) : null}
					>To repay: {maxRepayAmount?.toString() ?? '--'}
				</span>
			</div>
			<div class="repay__input">
				<DecimalInput bind:value={repayInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="repay__button-box">
				<GradientButton on:click={onRepayClick}>Repay</GradientButton>
			</div>
		</div>
	</div>
</div>
