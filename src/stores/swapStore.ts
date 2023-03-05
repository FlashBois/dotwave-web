import type { ITokenList } from '$src/tools/getTokenList';
import type Decimal from 'decimal.js';
import { writable } from 'svelte/store';

export enum TokenListType {
	FROM,
	TO
}

export const swapStore = writable<{
	from: ITokenList;
	to: ITokenList;
	slippagePercentage: number;
	tokenList: {
		visible: boolean;
		type: TokenListType | null;
	};
}>(undefined);
