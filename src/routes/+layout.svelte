<script lang="ts">
	import '../sass/main.scss';

	import { onMount } from 'svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import type { Adapter } from '@solana/wallet-adapter-base';
	import {
		BraveWalletAdapter,
		LedgerWalletAdapter,
		PhantomWalletAdapter,
		TrustWalletAdapter
	} from '@solana/wallet-adapter-wallets';
	import Logo from '$src/assets/img/logo.png'

	import WalletProvider from '$components/Wallet/WalletProvider.svelte';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import ConnectionProvider from '$components/Web3/ConnectionProvider.svelte';
	import AnchorConnectionProvider from '$components/AnchorConnectionProvider/AnchorConnectionProvider.svelte';
	import Notifications from '$components/Notification/Notifications.svelte';
	import Notification from '$components/Notification/CustomNotification.svelte';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('devnet');
	let wallets: Adapter[];

	onMount(async () => {
		wallets = [
			new PhantomWalletAdapter(),
			new TrustWalletAdapter(),
			new BraveWalletAdapter(),
			new LedgerWalletAdapter()
		];
	});
</script>

<AnchorConnectionProvider {network} />
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />

<Notifications item={Notification}>
	<div class="container">
		<header class="header">
			<nav class="nav">
				<div class="logo-box">
					<a href="/swap/SOL_USDC" class="logo-box__link"><img src={Logo} alt="protocol-logo" class="logo-box__logo" /></a>
					<!-- <h1 style="color: white;font-size: 40px;">LOGO</h1> -->
				</div>

				<ul class="nav__list">
					<li class="nav__item">
						<a href="/swap/SOL_USDC" class="nav__link">Swap</a>
					</li>
					<li class="nav__item">
						<a href="/trade/SOL" class="nav__link">Trade</a>
					</li>
					<li class="nav__item">
						<a href="/borrow/SOL" class="nav__link">Borrow</a>
					</li>
					<li class="nav__item">
						<a href="/strategy" class="nav__link">Strategy</a>
					</li>
				</ul>
			</nav>

			<div class="wallet-wrapper">
				<WalletMultiButton />
			</div>
		</header>

		<slot />
	</div>
</Notifications>
