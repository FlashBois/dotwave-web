export interface ITradeInfo {
	price?: number;
	maxLeverage?: number;
	collateral?: number;
	position?: Position;
}

export interface Position {
	leverage: number;
	size: number;
	side: Side;
	openPrice?: number;
}

export type Side = 'long' | 'short';
