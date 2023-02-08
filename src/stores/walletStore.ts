import { writable } from 'svelte/store';
import type { Connection } from '@solana/web3.js';

type WalletStore = {
	connection: Connection;
};

export const walletStore = writable<WalletStore>(undefined);

export default {
	subscribe: walletStore.subscribe,
	set: walletStore.set
};