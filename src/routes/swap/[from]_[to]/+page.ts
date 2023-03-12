import { getTokenList } from '$src/tools/getTokenList';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { from: string; to: string } }) {
	const data = getTokenList();
	console.log(data)
	
	const from = data.find((e) => e.symbol == params.from);
	const to = data.find((e) => e.symbol == params.to);

	if (from && to) {
		return {
			from,
			to
		};
	}
}
