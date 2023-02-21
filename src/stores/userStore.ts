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

// export const userData = derived<
// 	[typeof userStore, typeof swapStore],
// 	{ fromToken: { amount: number | bigint }; toToken: { amount: number | bigint } }
// >([userStore, swapStore], ([$userStore, $swapStore], set) => {
// 	if ($userStore.accounts) {
// 		const fromToken = $userStore.accounts.find((e) => e.mint.equals($swapStore.from.address));
// 		const toToken = $userStore.accounts.find((e) => e.mint.equals($swapStore.to.address));

// 		set({
// 			fromToken: {
// 				amount: fromToken?.amount ?? 1
// 			},
// 			toToken: {
// 				amount: toToken?.amount ?? 1
// 			}
// 		});
// 	}
// });
