import Decimal from 'decimal.js';

export const getDecimalFromBigint = (value: bigint, decimal = 0) => {
	if (decimal == 0) return new Decimal(value.toString());
	else return new Decimal(value.toString()).div(10 ** decimal);
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
