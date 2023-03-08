<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';

	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { ComputeBudgetProgram, PublicKey, Transaction, type AccountMeta } from '@solana/web3.js';
	import { useCreateStatementProgramAddress } from '$src/tools/web3/useCreateStatementProgramAddress';
	import { useCreateStatement } from '$src/tools/instructions/useCreateStatement';
	import { useBorrow } from '$src/tools/instructions/useBorrow';
	import { BN } from '@project-serum/anchor';
	import { useSignAndSendTransaction } from '$src/tools/wallet/useSignAndSendTransaction';
	import { delay } from 'lodash';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	export let vaultSupport: IVaultSupport;
	let borrowInputValue: number;

	async function onBorrowClick() {
		const anchorCopy = get(anchorStore);
		const walletCopy = get(walletStore);
		const web3Copy = get(web3Store);
		const userStoreCopy = get(userStore);
		const { vaultsAccounts, vaultsAddress, stateAddress, vaultsSupport } = get(protocolStateStore);

		if (anchorCopy && walletCopy.publicKey && vaultsAccounts && userStoreCopy.statementAddress) {
			const { program } = anchorCopy;
			const { publicKey } = walletCopy;

			const tx = new Transaction();
			const statementProgramAddress = useCreateStatementProgramAddress(program, publicKey);

			if (!userStoreCopy.statement) {
				const userStatemantAccount = await web3Copy.connection.getAccountInfo(
					userStoreCopy.statementAddress
				);
				if (!userStatemantAccount) {
					tx.add(await useCreateStatement(program, { payer: walletCopy.publicKey! }));
				}
			}

			tx.add(
				ComputeBudgetProgram.setComputeUnitLimit({
					units: 1000000
				})
			);

			const vaultsToRefresh = userStoreCopy.statement?.vaults_to_refresh();
			let remainingAccounts: AccountMeta[] = [];

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

			tx.add(
				await useBorrow(
					program,
					vaultSupport.id,
					{
						statement: statementProgramAddress,
						accountBase: userStoreCopy.getTokenAccountAddress(vaultSupport.baseTokenAddress)!,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(vaultSupport.id)),
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey,
					},
					remainingAccounts,
					new BN(borrowInputValue * 10 ** vaultSupport.baseTokenInfo.decimals)
				)
			);

			await useSignAndSendTransaction(web3Copy.connection, walletCopy, tx);
			delay(async () => {
				await loadUserStoreAccounts();
			}, 3000);
		}
	}
</script>

<div class="borrow">
	<div class="borrow__operation">
		<div class="borrow__operation-box">
			<div class="borrow__label">
				<span>Max borrow: -- </span>
			</div>
			<div class="borrow__input">
				<DecimalInput bind:value={borrowInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="borrow__button-box">
				<GradientButton on:click={onBorrowClick}>Borrow</GradientButton>
			</div>
		</div>
	</div>
</div>
