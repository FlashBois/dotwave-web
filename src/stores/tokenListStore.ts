import { readable } from 'svelte/store';

export const tokenListStore = readable<
	{
		symbol: string;
		price: number;
		change: number;
	}[]
>([], (set) => {
	let data = -1
	const interval = setInterval(() => {
		set([
			{
				symbol: 'BTC/USDC',
				price: 25000.0,
				change: -200 + data
			},
			{
				symbol: 'BTC/USDC',
				price: 25000.0,
				change: -10 + data
			},
			{
				symbol: 'BTC/USDC',
				price: 25000.0,
				change: -50
			}
		]);
		data ++
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
