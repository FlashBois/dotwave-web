import tokenListDevnet from '$src/assets/data/devnet-token-list.json';

export interface ITokenList {
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	logoURI: string;
}

export const getTokenList = (chain: 'devnet' = 'devnet'): ITokenList[] => {
	if (chain === 'devnet') {
		return tokenListDevnet
	} else {
		throw new Error('Chain not supported');
	}
};
