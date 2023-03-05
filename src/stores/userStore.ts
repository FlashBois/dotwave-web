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
	getTokenAccountAddress: (mint: PublicKey) => PublicKey | null;
}

export const userStore = writable<IUserStore>({
	address: null,
	accounts: [],
	getTokenAccountAddress: function (mint: PublicKey) {
		const tokenInfo = this.accounts.find((e) => e.mint.equals(mint));
		if (tokenInfo?.publicKey) return tokenInfo.publicKey;
		else return null;
	}
});

export function createUserStore(owner: PublicKey): void {
	userStore.update((store) => {
		return {
			address: owner,
			accounts: [],
			getTokenAccountAddress: store.getTokenAccountAddress
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

		userStore.update((store) => {
			return {
				accounts,
				address,
				getTokenAccountAddress: store.getTokenAccountAddress
			};
		});
	}
}

export function clearUserStore() {
	userStore.update((store) => {
		return {
			accounts: [],
			address: null,
			getTokenAccountAddress: store.getTokenAccountAddress
		};
	});
}
