import { protocolStateStore } from '$src/stores/protocolStateStore';
import { swapStore } from '$src/stores/swapStore';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { get } from 'svelte/store';
import { findVault } from './findVault';

export const swapOutput = (input: number) => {
	const { vaultsSupport, vaultsAccounts, ready } = get(protocolStateStore);
	const { from, to } = get(swapStore);

	if (!from || !to || !ready || !vaultsSupport || !vaultsAccounts) {
		return;
	}

	const found = findVault(vaultsSupport, new PublicKey(from.address));
	if (!found) {
		throw new Error('Vault not found');
	}

	const parsedAmount = new Decimal(input)
		.mul(10 ** from.decimals)
		.floor()
		.toString();

	const simulationResult = vaultsAccounts?.swap(
		found.index,
		BigInt(parsedAmount),
		found.base,
		false,
		0
	);

	return new Decimal(simulationResult.toString()).div(10 ** to.decimals).toNumber();
};
