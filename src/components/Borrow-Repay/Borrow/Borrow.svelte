<script lang="ts">
	import { loadProtocolState, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts } from '$src/stores/userStore';
	import type Decimal from 'decimal.js';
	import { useBorrowTransaction } from '$src/tools/transactions/useBorrowTransaction';
	import { walletStore } from '$src/stores/walletStore';

	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import { delay } from 'lodash';
	import { clearNotifications, createNotification, updateNotification } from '$components/Notification/notificationsStore';

	$: ({ connection } = $web3Store);
	$: ({ publicKey } = $walletStore);
	$: buttonMessage = { message: 'Borrow', disabled: true };

	export let vaultSupport: IVaultSupport;
	export let maxBorrowAmount: Decimal | undefined;

	let borrowInputValue: number;

	$: if (borrowInputValue == 0) buttonMessage = { message: 'Borrow', disabled: true };
	else if (maxBorrowAmount && borrowInputValue > maxBorrowAmount.toNumber())
		buttonMessage = { message: 'Max borrow exceeded', disabled: true };
	else if (borrowInputValue > 0) buttonMessage = { message: '', disabled: false };

	async function onBorrowClick() {
		const signature = await useBorrowTransaction(connection, vaultSupport, borrowInputValue);
		const notificationId = createNotification({
			text: 'Notification',
			type: 'loading'
		});
		await connection.confirmTransaction(signature, 'confirmed');
		updateNotification(notificationId, { type: 'success', removeAfter: 3000 })
		await loadProtocolState();
		await loadUserStoreAccounts();
		borrowInputValue = 0;
	}
</script>

<div class="borrow">
	<div class="borrow__operation">
		<div class="borrow__operation-box">
			<div class="borrow__label">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() =>
						publicKey && maxBorrowAmount ? (borrowInputValue = maxBorrowAmount.toNumber()) : null}
					>Max borrow: {maxBorrowAmount?.toString() ?? '--'}
				</span>
			</div>
			<div class="borrow__input">
				<DecimalInput bind:value={borrowInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="borrow__button-box">
				{#if buttonMessage.disabled}
					<GradientButton disabled>{buttonMessage.message}</GradientButton>
				{:else}
					<GradientButton on:click={onBorrowClick}>Borrow</GradientButton>
				{/if}
			</div>
		</div>
	</div>
</div>
