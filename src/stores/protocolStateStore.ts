import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { writable } from 'svelte/store';
import * as anchor from '@project-serum/anchor';
import { get } from 'svelte/store';
import { StateAccount, VaultsAccount } from '$src/pkg';

const STATE_SEED = 'state';

export interface IVaultSupport {
	id: number;
	baseTokenAddress: PublicKey;
	oracleAddress: PublicKey;
	// updateOracle: () => void;
}

export interface IProtocolStateStore {
	stateAddress: PublicKey;
	vaultsAddress: PublicKey;
	vaultsAccounts: VaultsAccount | null;
	vaultsSupport: IVaultSupport[]
}

export const protocolStateStore = writable<IProtocolStateStore>(undefined);

export async function createProtocolState(): Promise<void> {
	const connection = new Connection(clusterApiUrl('devnet'))

	const [stateAddress, _] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
		new PublicKey('3wnPHyMvFaAMQoHYmkQ52erfYocW5f4GmkmdNzu3Couv')
	);

	const stateAccountInfo = (await connection.getAccountInfo(stateAddress))?.data;

	if (stateAccountInfo) {
		const state = StateAccount.load(stateAccountInfo);
		const vaultsAddress = new PublicKey(state.get_vaults_account());

		protocolStateStore.set({
			stateAddress,
			vaultsAddress,
			vaultsAccounts: null,
			vaultsSupport: []
		});
	}
}

export async function loadProtocolState(): Promise<void> {
	const connection = new Connection(clusterApiUrl('devnet'))
	const { vaultsAddress } = get(protocolStateStore);

	if (vaultsAddress) {
		const vaultAccountInfo = (await connection.getAccountInfo(vaultsAddress))?.data;

		if (vaultAccountInfo) {
			const vaultsAccounts = VaultsAccount.load(vaultAccountInfo);

			const vaults = vaultsAccounts.base_token_with_id()
			const vaultsSupport: IVaultSupport[] = vaults.map(item => {
				return {
					baseTokenAddress: new PublicKey(item.key),
					id: item.index,
					oracleAddress: new PublicKey(vaultsAccounts.oracle_base(item.index))
				}
			})

			protocolStateStore.update((store) => {
				return {
					...store,
					vaultsAccounts,
					vaultsSupport
				};
			});
		}
	}
}
