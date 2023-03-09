import { StatementAccount } from '$src/pkg/protocol';
import {
	getWalletTokenAccounts,
	type ITokenAccount
} from '$src/tools/wallet/getWalletTokenAccounts';
import { useCreateStatementProgramAddress } from '$src/tools/web3/useCreateStatementProgramAddress';
import type { PublicKey } from '@solana/web3.js';
import { get, writable } from 'svelte/store';
import { anchorStore } from './anchorStore';
import { web3Store } from './web3Store';

export interface IUserStore {
	address: PublicKey | null;
	accounts: ITokenAccount[];
	getTokenAccountAddress: (mint: PublicKey) => PublicKey | null;
	statementAddress: PublicKey | null,
	statement: StatementAccount | null,
	statementBuffer: Uint8Array | null 
}

export const userStore = writable<IUserStore>({
	address: null,
	accounts: [],
	getTokenAccountAddress: function (mint: PublicKey) {
		const tokenInfo = this.accounts.find((e) => e.mint.equals(mint));
		if (tokenInfo?.publicKey) return tokenInfo.publicKey;
		else return null;
	},
	statement: null,
	statementAddress: null,
	statementBuffer: null
});

export function createUserStore(owner: PublicKey): void {
	const { program } = get(anchorStore)

	userStore.update((store) => {
		return {
			...store,
			address: owner,
			accounts: [],
			statementAddress: useCreateStatementProgramAddress(program, owner)
		};
	});
}

export async function loadUserStoreAccounts(): Promise<void> {
	const { address, statementAddress } = get(userStore);
	const { connection } = get(web3Store);
	let statement: StatementAccount | null
	let statementBuffer: Buffer | null

	if (address && statementAddress) {
		const { accounts } = await getWalletTokenAccounts({
			connection,
			owner: address
		});

		const statementAccountInfo = (await connection.getAccountInfo(statementAddress))?.data

		if(statementAccountInfo){
			statement = StatementAccount.load(statementAccountInfo)
			statementBuffer = statementAccountInfo
		}

		userStore.update((store) => {
			return {
				...store,
				accounts,
				statement,
				statementBuffer
			};
		});
	}
}

export function clearUserStore() {
	userStore.update((store) => {
		return {
			...store,
			accounts: [],
			address: null,
			statement: null,
			statementAddress: null,
			statementBuffer: null
		};
	});
}
