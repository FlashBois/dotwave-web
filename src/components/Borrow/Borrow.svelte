<script lang="ts">
	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import Input from '$components/Inputs/Input/Input.svelte';

	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
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
	import { useRepay } from '$src/tools/instructions/useRepay';

	$: ({ params } = $page);

	let vaultSupport: IVaultSupport;
	let borrowInputValue: number;
	let repayInputValue: number

	onMount(() => {
		const protocolSateCopy = get(protocolStateStore);

		const vault = protocolSateCopy.vaultsSupport.find(
			(e) => e.baseTokenInfo.symbol == params.base && e.quoteTokenInfo.symbol == params.quote
		);

		if (vault) vaultSupport = vault;
		else goto('RAY_USDC');
	});

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

	async function onRepayClick() {
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
				await useRepay(
					program,
					vaultSupport.id,
					{
						statement: statementProgramAddress,
						accountBase: userStoreCopy.getTokenAccountAddress(vaultSupport.baseTokenAddress)!,
						reserveBase: new PublicKey(vaultsAccounts.base_reserve(vaultSupport.id)),
						vaults: vaultsAddress,
						state: stateAddress,
						signer: publicKey
					},
					new BN(repayInputValue * 10 ** vaultSupport.baseTokenInfo.decimals)
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
	{#if vaultSupport}
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
		<div class="borrow__operation">
			<div class="borrow__operation-box">
				<div class="borrow__input">
					<Input bind:value={repayInputValue}/>
					<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
				</div>
				<div class="borrow__button-box">
					<GradientButton on:click={onRepayClick}>Repay</GradientButton>
				</div>
			</div>
		</div>
	{/if}
</div>
