import Decimal from 'decimal.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getDecimalFromBigint = (value: BigInt) => {
	return new Decimal(value.toString())
}

