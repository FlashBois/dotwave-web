import type Decimal from 'decimal.js';

export interface ITradeInfo {
	price?: Decimal;
	maxLeverage?: number;
	collateral?: number;
	position?: Position;
}

export interface Position {
	leverage: Decimal;
	size: Decimal;
	side: Side;
	openPrice: Decimal;
}

export type Side = 'long' | 'short';
