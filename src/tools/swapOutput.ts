import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { result } from 'lodash';
import { get } from 'svelte/store';
import { findVault } from './findVault';

export const swapOutput = (input: number) => {
	const { vaultsSupport, vaultsAccounts, ready } = get(protocolStateStore);
	const { from, to } = get(swapStore);

	if (!from || !to || !ready || !vaultsSupport || !vaultsAccounts) {
		return;
	}

	const foundFrom = findVault(vaultsSupport, new PublicKey(from.address));
	const foundTo = findVault(vaultsSupport, new PublicKey(from.address));

	if (!foundFrom || !foundTo) {
		throw new Error('Vault not found');
	}

	const parsedAmount = new Decimal(input)
		.mul(10 ** from.decimals)
		.floor()
		.toString();

	const quoteQuantity = foundFrom.base
		? vaultsAccounts.swap(foundFrom.index, BigInt(parsedAmount), true, false, 0)
		: BigInt(parsedAmount);

	const result = foundTo.base
		? vaultsAccounts.swap(foundTo.index, quoteQuantity, false, false, 0)
		: quoteQuantity;

	return new Decimal(result.toString()).div(10 ** to.decimals).toNumber();
};
