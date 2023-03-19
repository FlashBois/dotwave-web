import { anchorStore } from '$src/stores/anchorStore';
import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
import { userStore } from '$src/stores/userStore';
import { walletStore } from '$src/stores/walletStore';
import { BN } from '@project-serum/anchor';
import {
	ComputeBudgetProgram,
	Connection,
	PublicKey,
	Transaction,
	type AccountMeta
} from '@solana/web3.js';
import { get } from 'svelte/store';
import { useCreateStatement } from '../instructions/useCreateStatement';
import { useRepay } from '../instructions/useRepay';
import { useSignAndSendTransaction } from '../wallet/useSignAndSendTransaction';
import { useCreateStatementProgramAddress } from '../web3/useCreateStatementProgramAddress';

export async function useRepayTransaction(
	connection: Connection,
	vaultSupport: IVaultSupport,
	amount: number
): Promise<string> {
	const anchorCopy = get(anchorStore);
	const walletCopy = get(walletStore);
	const userStoreCopy = get(userStore);
	const { vaultsAccounts, vaultsAddress, stateAddress, vaultsSupport } = get(protocolStateStore);
	const { publicKey } = walletCopy;

	if (anchorCopy && publicKey && vaultsAccounts && userStoreCopy.statementAddress) {
		const { program } = anchorCopy;

		const tx = new Transaction();
		const statementProgramAddress = useCreateStatementProgramAddress(program, publicKey);

		if (!userStoreCopy.statement) {
			const userStatemantAccount = await connection.getAccountInfo(userStoreCopy.statementAddress);

			if (!userStatemantAccount) {
				tx.add(await useCreateStatement(program, { payer: publicKey }));
			}
		}

		tx.add(
			ComputeBudgetProgram.setComputeUnitLimit({
				units: 1400000
			})
		);

		const vaultsToRefresh = userStoreCopy.statement?.vaults_to_refresh(vaultSupport.id);
		const remainingAccounts: AccountMeta[] = [];

		if (vaultsToRefresh) {
			const refresh = vaultsToRefresh.filter(
				(value, index) => vaultsToRefresh.indexOf(value) === index
			);

			for (const id of refresh) {
				remainingAccounts.push(
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[id].baseOracle
					},
					{
						isSigner: false,
						isWritable: false,
						pubkey: vaultsSupport[id].quoteOracle
					}
				);
			}
		}

		const userAccountBase = userStoreCopy.getTokenAccountAddress(vaultSupport.baseTokenAddress);

		if (userAccountBase) {
			tx.add(
				await useRepay(
					program,
					vaultSupport.id,
					{
						statement: statementProgramAddress,
						accountBase: userAccountBase,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(vaultSupport.id)),
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey
					},
					remainingAccounts,
					new BN(amount * 10 ** vaultSupport.baseTokenInfo.decimals)
				)
			);

			return await useSignAndSendTransaction(connection, walletCopy, tx);
		} else throw Error('User token account not exists');
	} else throw Error('Incomplete protocol state');
}
