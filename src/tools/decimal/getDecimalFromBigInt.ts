import Decimal from 'decimal.js';

export const getDecimalFromBigintWithDecimals = (value: bigint, decimal = 1) => {
	if (decimal == 1) return new Decimal(value.toString());
	else return new Decimal(value.toString()).div(10 ** decimal);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getDecimalFromBigint = (value: BigInt) => {
	return new Decimal(value.toString());
};

export const getDecimalFromPrice = (value: bigint) => {
	return getDecimalFromPlaces(value, 9);
};

export const getDecimalFromValue = (value: bigint) => {
	return getDecimalFromPlaces(value, 9);
};

export const getDecimalFromFraction = (value: bigint) => {
	return getDecimalFromPlaces(value, 6);
};

export const getDecimalFromPlaces = (value: bigint, decimalPlaces: number) => {
	return getDecimalFromBigint(value).div(10 ** decimalPlaces);
};
