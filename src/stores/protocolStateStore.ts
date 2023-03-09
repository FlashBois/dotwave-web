import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { writable } from 'svelte/store';
import * as anchor from '@project-serum/anchor';
import { get } from 'svelte/store';
import { StateAccount, VaultsAccount } from '$src/pkg';
import tokenListDevnet from '$src/assets/data/devnet-token-list.json';

const STATE_SEED = 'state';
export const PROGRAM_ID = new PublicKey('AiGz15UrwCR6bpSLUhjPNXWQ84FmJ9q2y2ka7XzaZZFH');

export interface ITokenInfo {
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	logoURI: string;
}

export interface IVaultSupport {
	id: number;
	baseTokenAddress: PublicKey;
	baseTokenInfo: ITokenInfo;
	quoteTokenAddress: PublicKey;
	quoteTokenInfo: ITokenInfo;
	baseOracle: PublicKey;
	quoteOracle: PublicKey;
}

export interface IProtocolStateStore {
	stateAddress: PublicKey;
	vaultsAddress: PublicKey;
	vaultsAccounts: VaultsAccount | null;
	vaultsSupport: IVaultSupport[];
}

export const protocolStateStore = writable<IProtocolStateStore>(undefined);

export async function createProtocolState(): Promise<void> {
	const connection = new Connection(clusterApiUrl('devnet'));

	const [stateAddress, _] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
		PROGRAM_ID
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
	const connection = new Connection(clusterApiUrl('devnet'));
	const { vaultsAddress } = get(protocolStateStore);

	if (vaultsAddress) {
		const vaultAccountInfo = (await connection.getAccountInfo(vaultsAddress))?.data;

		if (vaultAccountInfo) {
			const vaultsAccounts = VaultsAccount.load(vaultAccountInfo);

			const vaults = vaultsAccounts.vaults_keys_with_id();

			const vaultsSupport: IVaultSupport[] = vaults.map((item) => {
				const baseTokenAddress = new PublicKey(item.base_key);
				const quoteTokenAddress = new PublicKey(item.quote_key);

				const baseTokenInfo = tokenListDevnet.find((e) => e.address == baseTokenAddress.toString());
				const quoteTokenInfo = tokenListDevnet.find(
					(e) => e.address == quoteTokenAddress.toString()
				);

				if (baseTokenInfo && quoteTokenInfo) {
					return {
						baseTokenAddress,
						quoteTokenAddress,
						baseTokenInfo: {
							address: baseTokenInfo.address,
							decimals: baseTokenInfo.decimals,
							logoURI: baseTokenInfo.logoURI,
							name: baseTokenInfo.name,
							symbol: baseTokenInfo.symbol
						},
						quoteTokenInfo: {
							address: quoteTokenInfo.address,
							decimals: quoteTokenInfo.decimals,
							logoURI: quoteTokenInfo.logoURI,
							name: quoteTokenInfo.name,
							symbol: quoteTokenInfo.symbol
						},
						id: item.index,
<<<<<<< HEAD
						oracleAddress: new PublicKey(vaultsAccounts.oracle_base(item.id))
=======
						baseOracle: new PublicKey(vaultsAccounts.oracle_base(item.index)),
						quoteOracle: new PublicKey(vaultsAccounts.oracle_quote(item.index))
>>>>>>> 560ee8cd2c23b50e24f3fffc494dde4c2f43fb0f
					};
				} else throw Error('Token address does not exist in the token list');
			});

			protocolStateStore.update((store) => {
				return {
					...store,
					vaultsAccounts,
					vaultsSupport,
					ready: true
				};
			});
		}
	}
}
