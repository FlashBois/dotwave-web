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
export class BorrowPositionInfo {
  free(): void;
/**
*/
  borrowed_quantity: bigint;
/**
*/
  owed_quantity: bigint;
/**
*/
  vault_id: number;
}
/**
*/
export class LpPositionInfo {
  free(): void;
/**
*/
  deposited_base_quantity: bigint;
/**
*/
  deposited_quote_quantity: bigint;
/**
*/
  earned_base_quantity: bigint;
/**
*/
  earned_quote_quantity: bigint;
/**
*/
  max_withdraw_base: bigint;
/**
*/
  max_withdraw_quote: bigint;
/**
*/
  max_withdraw_value: bigint;
/**
*/
  position_value: bigint;
/**
*/
  strategy_id: number;
/**
*/
  vault_id: number;
}
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
* @param {Uint8Array} account_info
*/
  reload(account_info: Uint8Array): void;
/**
* @returns {Uint8Array}
*/
  buffer(): Uint8Array;
/**
* @returns {number}
*/
  get_bump(): number;
/**
* @param {number} current
* @returns {Array<any>}
*/
  vaults_to_refresh(current: number): Array<any>;
/**
* @param {Uint8Array} vaults
*/
  refresh(vaults: Uint8Array): void;
/**
* @returns {number}
*/
  positions_len(): number;
/**
* @returns {Uint8Array}
*/
  owner(): Uint8Array;
/**
* @returns {bigint}
*/
  remaining_permitted_debt(): bigint;
/**
* @returns {bigint}
*/
  permitted_withdraw(): bigint;
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
export class TradingPositionInfo {
  free(): void;
/**
*/
  fees: bigint;
/**
*/
  fees_value: bigint;
/**
*/
  locked: bigint;
/**
*/
  long: boolean;
/**
*/
  open_price: bigint;
/**
*/
  open_value: bigint;
/**
*/
  pnl: bigint;
/**
*/
  pnl_value: bigint;
/**
*/
  size: bigint;
/**
*/
  size_value: bigint;
/**
*/
  vault_id: number;
}
/**
*/
export class VaultsAccount {
  free(): void;
/**
* @param {number} index
* @returns {number}
*/
  timestamp(index: number): number;
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
* @param {number} vault_index
* @param {Uint8Array} statement
* @param {number} current_time
* @returns {BorrowPositionInfo | undefined}
*/
  get_borrow_position_info(vault_index: number, statement: Uint8Array, current_time: number): BorrowPositionInfo | undefined;
/**
* @param {number} vault_index
* @param {number} strategy_index
* @param {Uint8Array} statement
* @param {number} current_time
* @returns {LpPositionInfo | undefined}
*/
  get_lp_position_info(vault_index: number, strategy_index: number, statement: Uint8Array, current_time: number): LpPositionInfo | undefined;
/**
* @param {number} vault_index
* @param {Uint8Array} statement
* @param {number} current_time
* @returns {TradingPositionInfo | undefined}
*/
  get_trading_position_info(vault_index: number, statement: Uint8Array, current_time: number): TradingPositionInfo | undefined;
/**
* @param {number} id
* @param {bigint} value
* @returns {bigint}
*/
  max_borrow_for(id: number, value: bigint): bigint;
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
* @returns {boolean}
*/
  does_trade(vault: number, strategy: number): boolean;
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
* @param {Uint8Array} account_info
*/
  reload(account_info: Uint8Array): void;
/**
* @returns {Uint8Array}
*/
  buffer(): Uint8Array;
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
* @returns {boolean}
*/
  has_trading(index: number): boolean;
/**
* @param {number} index
* @param {number} current_time
*/
  refresh(index: number, current_time: number): void;
/**
* @param {number} index
* @returns {bigint}
*/
  borrow_limit(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  available_lend(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  utilization_lend(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  max_utilization(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  current_fee(index: number): bigint;
/**
* @param {number} index
* @param {number} duration_in_secs
* @returns {bigint}
*/
  lending_apy(index: number, duration_in_secs: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  max_leverage(index: number): bigint;
/**
* @param {number} index
* @returns {bigint}
*/
  trading_open_fee(index: number): bigint;
/**
* @param {number} index
* @param {boolean} long
* @returns {bigint}
*/
  trading_fee(index: number, long: boolean): bigint;
/**
* @param {number} current_time
*/
  refresh_lend_fees(current_time: number): void;
/**
* @param {number} vault
* @param {number} strategy
* @param {bigint} amount
* @param {boolean} withdraw_base
* @param {Uint8Array} statement
* @returns {WithdrawAmounts}
*/
  withdraw(vault: number, strategy: number, amount: bigint, withdraw_base: boolean, statement: Uint8Array): WithdrawAmounts;
/**
* @param {number} vault
* @param {number} strategy
* @param {bigint} amount
* @param {boolean} deposit_base
* @param {number} current_time
* @returns {bigint}
*/
  deposit(vault: number, strategy: number, amount: bigint, deposit_base: boolean, current_time: number): bigint;
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
/**
*/
export class WithdrawAmounts {
  free(): void;
/**
*/
  base: bigint;
/**
*/
  quote: bigint;
}
