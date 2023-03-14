import type { ITokenInfo, IVaultSupport } from '$src/stores/protocolStateStore';

export function getUniqTokensFromVaultsSupport(
	vaultsSupport: IVaultSupport[],
	// eslint-disable-next-line @typescript-eslint/no-inferrable-types
	withQuote = true,
	hasTrade = false,
	hasSwap = false,
	hasLend = false
) {
	const tokens: ITokenInfo[] = [];

	for (const el of vaultsSupport) {
		if (hasTrade && !el.hasTrade) continue;
		if (hasSwap && !el.hasSwap) continue;
		if (hasLend && !el.hasLend) continue;

		tokens.push(el.baseTokenInfo);
		if (withQuote)
			if (tokens.findIndex((e) => e.symbol == el.quoteTokenInfo.symbol) == -1)
				tokens.push(el.quoteTokenInfo);
	}

	return tokens;
}
