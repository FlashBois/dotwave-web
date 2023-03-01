/* tslint:disable */
/* eslint-disable */
/**
* @returns {bigint}
*/
export function price_denominator(): bigint;
/**
* @returns {bigint}
*/
export function fraction_denominator(): bigint;
/**
*/
export class StateAccount {
  free(): void;
/**
* @param {Uint8Array} account_info
* @returns {StateAccount}
*/
  static load(account_info: Uint8Array): StateAccount;
/**
* @returns {number}
*/
  get_bump(): number;
/**
* @returns {Uint8Array}
*/
  get_vaults_account(): Uint8Array;
}
/**
*/
export class StatementAccount {
  free(): void;
/**
* @param {Uint8Array} account_info
* @returns {StatementAccount}
*/
  static load(account_info: Uint8Array): StatementAccount;
/**
* @returns {number}
*/
  get_bump(): number;
}
/**
*/
export class StrategyInfo {
  free(): void;
/**
*/
  balance_base: bigint;
/**
*/
  balance_quote: bigint;
/**
*/
  has_lend: boolean;
/**
*/
  has_swap: boolean;
/**
*/
  has_trade: boolean;
/**
*/
  locked_base: bigint;
/**
*/
  locked_quote: bigint;
/**
*/
  utilization_base: bigint;
/**
*/
  utilization_quote: bigint;
}
/**
*/
export class VaultsAccount {
  free(): void;
/**
* @param {number} index
* @returns {bigint}
*/
  get_price(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  get_confidence(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  get_price_quote(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  get_confidence_quote(index: number): bigint;
/**
* @param {number} index
* @param {bigint} price
* @param {bigint} confidence
* @param {number} time
*/
  update_oracle(index: number, price: bigint, confidence: bigint, time: number): void;
/**
* @param {number} index
* @param {bigint} price
* @param {bigint} confidence
* @param {number} time
*/
  update_quote_oracle(index: number, price: bigint, confidence: bigint, time: number): void;
/**
* @param {number} vault
* @param {number} strategy
* @returns {StrategyInfo}
*/
  strategy_info(vault: number, strategy: number): StrategyInfo;
/**
* @param {number} vault
* @returns {number}
*/
  count_strategies(vault: number): number;
/**
* @param {number} vault
* @param {number} strategy
* @returns {boolean}
*/
  does_lend(vault: number, strategy: number): boolean;
/**
* @param {number} vault
* @param {number} strategy
* @returns {boolean}
*/
  does_swap(vault: number, strategy: number): boolean;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  balance_base(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  balance_quote(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  lock_base(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  lock_quote(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  utilization_base(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {number} strategy
* @returns {bigint}
*/
  utilization_quote(vault: number, strategy: number): bigint;
/**
* @param {number} vault
* @param {bigint} amount
* @param {boolean} from_base
* @param {boolean} by_amount_out
* @param {number} now
* @returns {bigint}
*/
  swap(vault: number, amount: bigint, from_base: boolean, by_amount_out: boolean, now: number): bigint;
/**
* @param {number} vault
* @param {boolean} base
* @returns {bigint}
*/
  liquidity(vault: number, base: boolean): bigint;
/**
* @param {Uint8Array} account_info
* @returns {VaultsAccount}
*/
  static load(account_info: Uint8Array): VaultsAccount;
/**
* @returns {number}
*/
  vaults_len(): number;
/**
* @returns {number}
*/
  static size(): number;
/**
* @returns {Array<any>}
*/
  vaults_keys_with_id(): Array<any>;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  base_token(index: number): Uint8Array;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  quote_token(index: number): Uint8Array;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  base_reserve(index: number): Uint8Array;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  quote_reserve(index: number): Uint8Array;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  oracle_base(index: number): Uint8Array;
/**
* @param {number} index
* @returns {Uint8Array}
*/
  oracle_quote(index: number): Uint8Array;
/**
* @param {number} index
* @returns {boolean}
*/
  base_oracle_enabled(index: number): boolean;
/**
* @param {number} index
* @returns {boolean}
*/
  quote_oracle_enabled(index: number): boolean;
/**
* @param {number} index
* @returns {boolean}
*/
  has_lending(index: number): boolean;
/**
* @param {number} index
* @returns {boolean}
*/
  has_swap(index: number): boolean;
/**
* @param {number} index
* @param {number} current_time
*/
  refresh(index: number, current_time: number): void;
/**
* @param {number} index
* @returns {bigint}
*/
  lending_apy(index: number): bigint;
}
/**
*/
export class VaultsKeysWithId {
  free(): void;
/**
*/
  base_key: Uint8Array;
/**
*/
  index: number;
/**
*/
  quote_key: Uint8Array;
}
