<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { protocolStateStore, type IVaultSupport } from '$src/stores/protocolStateStore';
	import { userStore } from '$src/stores/userStore';
	import { getDecimalFromBigint } from '$src/tools/decimal/getDecimalFromBigInt';
	import { getCurrentUnixTime } from '$src/tools/getCurrentUnixTime';
	import { derived, get } from 'svelte/store';

	import Borrow from '$components/Borrow-Repay/Borrow/Borrow.svelte';
	import BorrowRepayInfo from '$components/Borrow-Repay/BorrowRepayInfo/BorrowRepayInfo.svelte';
	import Repay from '$components/Borrow-Repay/Repay/Repay.svelte';
	import TokenList from '$components/TokenList/TokenList.svelte';

	$: ({ params } = $page);
	$: ({ statement, statementBuffer } = $userStore);
	$: ({ vaultsAccounts } = $protocolStateStore);

	$: borrowListVisible = false;

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
	$: ({ id, baseTokenInfo } = $vaultSupport)

	$: maxBorrowAmount =
		vaultsAccounts && statement
			? getDecimalFromBigint(vaultsAccounts.max_borrow_for(id, statement.remaining_permitted_debt()), 6)
			: undefined;

	$: userBorrowInfo = vaultsAccounts && statementBuffer ? vaultsAccounts.get_borrow_position_info(id, statementBuffer, getCurrentUnixTime()) : undefined
	$: maxRepayAmount = userBorrowInfo ? getDecimalFromBigint(userBorrowInfo.owed_quantity, 6) : undefined

	async function onTokenClick(token: string) {
		goto(`${token}`);
	}
</script>

<div class="borrow-page">
	<div class="borrow-repay-section">
		{#if $vaultSupport}
			<Borrow vaultSupport={$vaultSupport} {maxBorrowAmount} />
			<div class="borrow-repay-section__select-box">
				<button
					on:click={() => borrowListVisible = true}
					class="borrow-repay-section__select"
				>
					<img src={baseTokenInfo.logoURI} alt={baseTokenInfo.symbol} />
					<p>{baseTokenInfo.symbol}</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-caret-down-fill"
						viewBox="0 0 16 16"
					>
						<path
							d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
						/>
					</svg>
				</button>
			</div>
			<Repay vaultSupport={$vaultSupport} {maxRepayAmount} />
		{/if}

		<div class="borrow-info-section">
			<BorrowRepayInfo />
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
