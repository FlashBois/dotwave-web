<script lang="ts">
	import { BN } from '@project-serum/anchor';
	import { delay } from 'lodash';
	import { useRepay } from '$src/tools/instructions/useRepay';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { derived, get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { loadUserStoreAccounts, userStore } from '$src/stores/userStore';
	import { PublicKey, Transaction } from '@solana/web3.js';

	import GradientButton from '$components/Buttons/GradientButton/GradientButton.svelte';
	import DecimalInput from '$components/Inputs/DecimalInput/DecimalInput.svelte';

	import { useCreateStatementProgramAddress } from '$src/tools/web3/useCreateStatementProgramAddress';
	import { useCreateStatement } from '$src/tools/instructions/useCreateStatement';
	import { useSignAndSendTransaction } from '$src/tools/wallet/useSignAndSendTransaction';
	import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
	import Decimal from 'decimal.js';

	$: ({ publicKey } = $walletStore);
	export let vaultSupport: IVaultSupport;
	let repayInputValue: number;

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

	$: userData = derived<[typeof userStore], { baseTokenAmount: Decimal }>(
		[userStore],
		([$userStore], set) => {
			if ($userStore.accounts) {
				const baseAccount = $userStore.accounts.find(
					(e) => e.mint.toString() == vaultSupport.baseTokenInfo.address
				);

				set({
					baseTokenAmount: baseAccount?.amount
						? baseAccount.amount.div(new Decimal(10).pow(vaultSupport.baseTokenInfo.decimals))
						: new Decimal(0)
				});
			}
		}
	);
	$: ({ baseTokenAmount } = $userData);
</script>

<div class="repay">
	<div class="repay__operation">
		<div class="repay__operation-box">
			<div class="borrow__label">
				<span
					>Balance: {#if !publicKey}
						--
					{:else}
						{baseTokenAmount}
					{/if}</span
				>
			</div>
			<div class="repay__input">
				<DecimalInput bind:value={repayInputValue} />
				<img src={vaultSupport.baseTokenInfo.logoURI} alt={vaultSupport.baseTokenInfo.symbol} />
			</div>
			<div class="repay__button-box">
				<GradientButton on:click={onRepayClick}>Repay</GradientButton>
			</div>
		</div>
	</div>
</div>
