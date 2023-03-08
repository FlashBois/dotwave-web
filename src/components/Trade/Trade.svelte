<script lang="ts">
	import { walletStore } from '$stores/walletStore';
	import Input from '$components/Inputs/Input/Input.svelte';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import AnimateButton from '$components/Buttons/AnimateButton/AnimateButton.svelte';
	import type { ITokenList } from '$src/tools/getTokenList';
	import TradeInputs from '$components/Trade/TradeInputs.svelte';
	import TradeInfo from './TradeInfo.svelte';
	import { derived } from 'svelte/store';
	import type { StatementAccount, VaultsAccount } from '$src/pkg/protocol';
	import { protocolStateStore } from '$src/stores/protocolStateStore';
	import { findVault } from '$src/tools/findVault';
	import { PublicKey } from '@solana/web3.js';

	export let token: ITokenList;
	const vaultsAccounts = $protocolStateStore?.vaultsAccounts;

	const data = derived(protocolStateStore, ($protocolStateStore) => {
		const vaultsAccounts = $protocolStateStore?.vaultsAccounts;
		const vaultsSupport = $protocolStateStore?.vaultsSupport;
		const index = findVault(vaultsSupport, new PublicKey(token.address))?.index;

		return {
			collateral: undefined,
			price: index ? vaultsAccounts?.get_price(index) : undefined,
			maxLeverage: undefined,
			size: undefined,
			pnl: undefined
		};
	});

	let actionName: 'Open' | 'Close' | 'Increase' | 'Decrease' | 'Reverse' = 'Open';

	function trade() {
		console.log('traded');
	}
</script>

<div class="trade-container">
	<div class="trade">
		<TradeInfo {data} />
		<TradeInputs />
	</div>

	<div class="trade__button">
		{#if !$walletStore.wallet}
			<WalletMultiButton />
		{:else}
			<!-- <AnimateButton>{$simulation.msg}</AnimateButton> -->
			<!-- {:else} -->
			<AnimateButton on:onClick={trade}>{actionName}</AnimateButton>
		{/if}
	</div>
</div>
