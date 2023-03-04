<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import Input from '$components/Inputs/Input/Input.svelte';

	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { useCreateStatementProgramAddress } from '$src/tools/web3/useCreateStatementProgramAddress';
	import { useCreateStatement } from '$src/tools/instructions/useCreateStatement';
	import { useBorrow } from '$src/tools/instructions/useBorrow';
	import { BN } from '@project-serum/anchor';
	import { useSignAndSendTransaction } from '$src/tools/wallet/useSignAndSendTransaction';
	import { delay } from 'lodash';

	export let vaultSupport: IVaultSupport;
	let borrowInputValue: number;

	async function onBorrowClick() {
		const anchorCopy = get(anchorStore);
		const walletCopy = get(walletStore);
		const web3Copy = get(web3Store);
		const userStoreCopy = get(userStore);
		const { vaultsAccounts, vaultsAddress, stateAddress } = get(protocolStateStore);

		if (anchorCopy && walletCopy.publicKey && vaultsAccounts) {
			const { program } = anchorCopy;
			const { publicKey } = walletCopy;

			const tx = new Transaction();
			const statementProgramAddress = useCreateStatementProgramAddress(program, publicKey);

			const userStatemantAccount = await web3Copy.connection.getAccountInfo(
				statementProgramAddress
			);
			if (!userStatemantAccount) {
				tx.add(await useCreateStatement(program, { payer: walletCopy.publicKey! }));
			}

			tx.add(
				await useBorrow(
					program,
					0,
					{
						statement: statementProgramAddress,
						accountBase: userStoreCopy.getTokenAccountAddress(vaultSupport.baseTokenAddress)!,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(0)),
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey
					},
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
			<div class="borrow__input">
				<Input bind:value={borrowInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="borrow__button-box">
				<GradientButton on:click={onBorrowClick}>Borrow</GradientButton>
			</div>
		</div>
	</div>
</div>
