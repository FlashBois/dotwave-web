import {
	getWalletTokenAccounts,
	type ITokenAccount
} from '$src/tools/wallet/getWalletTokenAccounts';
import type { PublicKey } from '@solana/web3.js';
import { get, writable } from 'svelte/store';
import { web3Store } from './web3Store';

export interface IUserStore {
	address: PublicKey | null;
	accounts: ITokenAccount[];
}

export const userStore = writable<IUserStore>({
	address: null,
	accounts: []
});

export function createUserStore(owner: PublicKey): void {
	userStore.update(() => {
		return {
			address: owner,
			accounts: []
		};
	});
}

export async function loadUserStoreAccounts(): Promise<void> {
	const { address } = get(userStore);
	const { connection } = get(web3Store);

	if (address) {
		const { accounts } = await getWalletTokenAccounts({
			connection,
			owner: address
		});

		userStore.update(() => {
			return {
				accounts,
				address
			};
		});
	}
}

export function clearUserStore() {
	userStore.set({
		address: null,
		accounts: []
	});
}
