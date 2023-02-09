<script lang="ts">
	import '../sass/main.scss';

	import { onMount } from 'svelte';
	import WalletProvider from '../components/Wallet/WalletProvider.svelte';

	import {
		BraveWalletAdapter,
		LedgerWalletAdapter,
		PhantomWalletAdapter,
		TrustWalletAdapter
	} from '@solana/wallet-adapter-wallets';

	const localStorageKey = 'walletAdapter';
	let wallets: (
		| PhantomWalletAdapter
		| TrustWalletAdapter
		| BraveWalletAdapter
		| LedgerWalletAdapter
	)[];

	onMount(async () => {
		wallets = [
			new PhantomWalletAdapter(),
			new TrustWalletAdapter(),
			new BraveWalletAdapter(),
			new LedgerWalletAdapter()
		];
	});
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />

<div>
	<slot />
</div>
