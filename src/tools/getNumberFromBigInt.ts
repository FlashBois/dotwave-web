import Decimal from "decimal.js";
import { getDecimalFromBigint } from "./decimal/getDecimalFromBigInt";

export function getNumberFromBigInt(value: bigint, decimal = 1) {
    if(Number(value) == 0)
        return 0
    
    return getDecimalFromBigint(value).div(new Decimal(10).pow(decimal)).toNumber()
}