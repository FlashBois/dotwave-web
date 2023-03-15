import type { ITokenList } from '$src/tools/getTokenList';
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
