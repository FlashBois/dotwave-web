import Decimal from 'decimal.js';

export const getDecimalFromBigint = (value: bigint, decimal = 1) => {
	if(decimal == 1) return new Decimal(value.toString())
	else return new Decimal(value.toString()).div(10 ** decimal)
}

