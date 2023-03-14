<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { pricesStore } from '$src/stores/oracleStore';
	import { userStore } from '$src/stores/userStore';
	import { getDecimalFromBigintWithDecimals } from '$src/tools/decimal/getDecimalFromBigInt';
	import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
	import { derived, get } from 'svelte/store';

	import Borrow from '$components/Borrow-Repay/Borrow/Borrow.svelte';
	import BorrowRepayInfo from '$components/Borrow-Repay/BorrowRepayInfo/BorrowRepayInfo.svelte';
	import Repay from '$components/Borrow-Repay/Repay/Repay.svelte';
	import TokenList from '$components/TokenList/TokenList.svelte';
	import Decimal from 'decimal.js';
	// import { validateAccounts } from '@project-serum/anchor';

	$: ({ params } = $page);
	$: ({ statement, statementBuffer } = $userStore);
	$: ({ vaultsAccounts } = $protocolStateStore);

	let borrowListVisible = false

	$: vaultSupport = derived<[typeof page], IVaultSupport>([page], ([$page], set) => {
		if ($page.params) {
			const protocolSateCopy = get(protocolStateStore);

			const vault = protocolSateCopy.vaultsSupport.find(
				(e) => e.baseTokenInfo.symbol == params.token
			);

			if (vault) {
				borrowListVisible = false;
				set(vault);
			} else goto('RAY');
		}
	});

	$: ({ id, baseTokenInfo, baseOracle } = $vaultSupport);


	$: maxBorrowAmount =
		vaultsAccounts && statement
			? getDecimalFromBigintWithDecimals(
					vaultsAccounts.max_borrow_for(id, statement.remaining_permitted_debt()),
					6
			  )
			: undefined;

	$: userBorrowInfo =
		vaultsAccounts && statementBuffer
			? vaultsAccounts.get_borrow_position_info(id, statementBuffer, getCurrentUnixTime())
			: undefined;

	$: owedQuantity = userBorrowInfo
		? getDecimalFromBigintWithDecimals(userBorrowInfo.owed_quantity, baseTokenInfo.decimals)
		: undefined;

	$: borrowedQuantity = userBorrowInfo
		? getDecimalFromBigintWithDecimals(userBorrowInfo.borrowed_quantity, baseTokenInfo.decimals)
		: undefined;

	$: utilization = vaultsAccounts ? getDecimalFromBigintWithDecimals(vaultsAccounts.utilization_lend(id), 4) : undefined
	$: borrowFee = vaultsAccounts ? getDecimalFromBigintWithDecimals(vaultsAccounts.current_fee(id), 4) : undefined
	$: maxUtilization = vaultsAccounts ?  getDecimalFromBigintWithDecimals(vaultsAccounts.max_utilization(id), 4) : undefined

	$: pricesStore.fetch([baseOracle])
	$: price = $pricesStore?.get(baseOracle.toBase58())


	$: userData = derived<[typeof userStore], { baseAmount: Decimal }>(
		[userStore],
		([$userStore], set) => {
			if ($userStore.accounts) {
				const from = $userStore.accounts.find(
					(e) => e.mint.toString() == $vaultSupport.baseTokenInfo.address
				);

				set({
					baseAmount: from?.amount
						? from.amount.div(new Decimal(10).pow($vaultSupport.baseTokenInfo.decimals))
						: new Decimal(0)
				});
			}
		}
	);
	$: ({ baseAmount } = $userData);

	async function onTokenClick(token: string) {
		goto(`${token}`);
	}
</script>

<svelte:head><title>Borrow - {baseTokenInfo.symbol}</title></svelte:head>

<div class="borrow-page">
	<div class="borrow-repay-section">
		<div class="borrow-header-section">
			<!-- <p>Borrow</p> -->
		</div>

		{#if $vaultSupport}
			<Borrow vaultSupport={$vaultSupport} {maxBorrowAmount} />
			<Repay vaultSupport={$vaultSupport} maxRepayAmount={owedQuantity} {baseAmount} />
		{/if}

		<div class="borrow-info-section">
			<BorrowRepayInfo {maxUtilization} {baseTokenInfo} {maxBorrowAmount} {owedQuantity} {borrowedQuantity} {utilization} {borrowFee} {price} on:click={() => borrowListVisible = true} />
		</div>
	</div>

	<TokenList
		on:onTokenClick={(e) => onTokenClick(e.detail)}
		on:onClose={() => borrowListVisible = false}
		visible={borrowListVisible}
		vaultsSupport={$protocolStateStore.vaultsSupport}
		withQuote={false}
	/>
</div>
