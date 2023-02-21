import tokenList from '$src/assets/data/token-list.json';
import { PublicKey } from '@solana/web3.js';

export interface ITokenList {
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	logoURI: string;
}

export const getTokenList = (): ITokenList[] =>
	tokenList.map((e) => {
		return {
			address: e.address,
			decimals: e.decimals,
			name: e.name,
			symbol: e.symbol,
			logoURI: e.logoURI
		};
	});
