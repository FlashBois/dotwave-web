import { anchorStore } from '$src/stores/anchorStore';
import { protocolStateStore } from '$src/stores/protocolStateStore';
import { userStore } from '$src/stores/userStore';
import { walletStore } from '$src/stores/walletStore';
import { BN } from '@project-serum/anchor';
import { ComputeBudgetProgram, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { get } from 'svelte/store';
import { useCreateStatement } from '../instructions/useCreateStatement';
import { useWithdraw } from '../instructions/useWithdraw';
import { useSignAndSendTransaction } from '../wallet/useSignAndSendTransaction';
import { useCreateStatementProgramAddress } from '../web3/useCreateStatementProgramAddress';

export async function useWithdrawransaction(
	connection: Connection,
	vaultId: number,
	strategyId: number,
	amount: number
): Promise<string> {
	const anchorCopy = get(anchorStore);
	const walletCopy = get(walletStore);
	const userStoreCopy = get(userStore);
	const { vaultsAccounts, vaultsAddress, stateAddress, vaultsSupport } = get(protocolStateStore);
	const { publicKey } = walletCopy;
	const vaultSupport = vaultsSupport[vaultId];

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
				units: 1000000
			})
		);

		const userAccountBase = userStoreCopy.getTokenAccountAddress(vaultSupport.baseTokenAddress);
		const userAccountQuote = userStoreCopy.getTokenAccountAddress(vaultSupport.quoteTokenAddress);

		if (userAccountBase && userAccountQuote) {
			tx.add(
				await useWithdraw(
					program,
					vaultSupport.id,
					strategyId,
					{
						statement: statementProgramAddress,
						accountBase: userAccountBase,
						accountQuote: userAccountQuote,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(vaultSupport.id)),
						reserveQuote: new PublicKey(vaultsAccounts.quote_reserve(vaultSupport.id)),
						baseOracle: vaultSupport.baseOracle,
						quoteOracle: vaultSupport.quoteOracle,
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey
					},
					new BN(amount * 10 ** vaultSupport.baseTokenInfo.decimals)
				)
			);

			return await useSignAndSendTransaction(connection, walletCopy, tx);
		} else throw Error('User token account not exists');
	} else throw Error('Incomplete protocol state');
}
