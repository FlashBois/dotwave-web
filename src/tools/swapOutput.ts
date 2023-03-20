import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { findVaultId } from './findVault';

export const swapOutput = (input: number) => {
	const { vaultsSupport, vaultsAccounts } = get(protocolStateStore);
	const { from, to } = get(swapStore);

	if (!from || !to || !vaultsSupport || !vaultsAccounts) {
		return;
	}

	const foundFrom = findVaultId(vaultsSupport, new PublicKey(from.address));
	const foundTo = findVaultId(vaultsSupport, new PublicKey(to.address));

	if (!foundFrom && !foundTo) {
		throw new Error('Vault not found');
	}

	const parsedAmount = new Decimal(input)
		.mul(10 ** from.decimals)
		.floor()
		.toString();


	const quoteQuantity = foundFrom
		? vaultsAccounts.swap(foundFrom.id, BigInt(parsedAmount), true, false, 0)
		: BigInt(parsedAmount);

	const result = foundTo
		? vaultsAccounts.swap(foundTo.id, quoteQuantity, false, false, 0)
		: quoteQuantity;

	return new Decimal(result.toString()).div(10 ** to.decimals).toNumber();
};
