import { PythHttpClient } from '@pythnetwork/client';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { remove } from 'lodash';
import { get, writable } from 'svelte/store';

export const oracle = writable<Map<string, number>>(new Map());

export const pyth = new PythHttpClient(
	new Connection(clusterApiUrl('devnet')),
	new PublicKey('FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH')
);

function createPrices() {
	const { subscribe, set, update } = writable<Map<string, Decimal>>(new Map<string, Decimal>());

	setInterval(() => {
		const oracles = Array.from(get(pricesStore).keys()).map((e) => new PublicKey(e));
		pyth.getAssetPricesFromAccounts(oracles).then((priceData) => {
			update((n) => {
				for (const i in oracles) {
					n.set(oracles[i].toBase58(), new Decimal(priceData[i].price ?? 0));
				}
				return n;
			});
		});
	}, 10000);

	return {
		subscribe,
		fetch: async (oracles: PublicKey[]) => {
			const priceData = await pyth.getAssetPricesFromAccounts(oracles);
			update((n) => {
				for (const i in oracles) {
					n.set(oracles[i].toBase58(), new Decimal(priceData[i].price ?? 0));
				}
				return n;
			});
		},
		reset: () => {
			set(new Map<string, Decimal>());
		},
		remove: (key: PublicKey) => {
			update((n) => {
				n.delete(key.toBase58());
				return n;
			});
		}
	};
}

export const pricesStore = createPrices();
