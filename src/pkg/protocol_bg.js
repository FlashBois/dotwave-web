let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @returns {bigint}
*/
export function price_denominator() {
    const ret = wasm.price_denominator();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function fraction_denominator() {
    const ret = wasm.fraction_denominator();
    return BigInt.asUintN(64, ret);
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
*/
export class BorrowPositionInfo {

    static __wrap(ptr) {
        const obj = Object.create(BorrowPositionInfo.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_borrowpositioninfo_free(ptr);
    }
    /**
    * @returns {number}
    */
    get vault_id() {
        const ret = wasm.__wbg_get_borrowpositioninfo_vault_id(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set vault_id(arg0) {
        wasm.__wbg_set_borrowpositioninfo_vault_id(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get borrowed_quantity() {
        const ret = wasm.__wbg_get_borrowpositioninfo_borrowed_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set borrowed_quantity(arg0) {
        wasm.__wbg_set_borrowpositioninfo_borrowed_quantity(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get owed_quantity() {
        const ret = wasm.__wbg_get_borrowpositioninfo_owed_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set owed_quantity(arg0) {
        wasm.__wbg_set_borrowpositioninfo_owed_quantity(this.ptr, arg0);
    }
}
/**
*/
export class LpPositionInfo {

    static __wrap(ptr) {
        const obj = Object.create(LpPositionInfo.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_lppositioninfo_free(ptr);
    }
    /**
    * @returns {number}
    */
    get vault_id() {
        const ret = wasm.__wbg_get_lppositioninfo_vault_id(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set vault_id(arg0) {
        wasm.__wbg_set_lppositioninfo_vault_id(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get strategy_id() {
        const ret = wasm.__wbg_get_lppositioninfo_strategy_id(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set strategy_id(arg0) {
        wasm.__wbg_set_lppositioninfo_strategy_id(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get position_value() {
        const ret = wasm.__wbg_get_lppositioninfo_position_value(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set position_value(arg0) {
        wasm.__wbg_set_lppositioninfo_position_value(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get deposited_base_quantity() {
        const ret = wasm.__wbg_get_lppositioninfo_deposited_base_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set deposited_base_quantity(arg0) {
        wasm.__wbg_set_lppositioninfo_deposited_base_quantity(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get deposited_quote_quantity() {
        const ret = wasm.__wbg_get_lppositioninfo_deposited_quote_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set deposited_quote_quantity(arg0) {
        wasm.__wbg_set_lppositioninfo_deposited_quote_quantity(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get earned_base_quantity() {
        const ret = wasm.__wbg_get_lppositioninfo_earned_base_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set earned_base_quantity(arg0) {
        wasm.__wbg_set_lppositioninfo_earned_base_quantity(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get earned_quote_quantity() {
        const ret = wasm.__wbg_get_lppositioninfo_earned_quote_quantity(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set earned_quote_quantity(arg0) {
        wasm.__wbg_set_lppositioninfo_earned_quote_quantity(this.ptr, arg0);
    }
}
/**
*/
export class StateAccount {

    static __wrap(ptr) {
        const obj = Object.create(StateAccount.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stateaccount_free(ptr);
    }
    /**
    * @param {Uint8Array} account_info
    * @returns {StateAccount}
    */
    static load(account_info) {
        try {
            const ret = wasm.stateaccount_load(addBorrowedObject(account_info));
            return StateAccount.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    get_bump() {
        const ret = wasm.stateaccount_get_bump(this.ptr);
        return ret;
    }
    /**
    * @returns {Uint8Array}
    */
    get_vaults_account() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stateaccount_get_vaults_account(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class StatementAccount {

    static __wrap(ptr) {
        const obj = Object.create(StatementAccount.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statementaccount_free(ptr);
    }
    /**
    * @param {Uint8Array} account_info
    * @returns {StatementAccount}
    */
    static load(account_info) {
        try {
            const ret = wasm.statementaccount_load(addBorrowedObject(account_info));
            return StatementAccount.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Uint8Array} account_info
    */
    reload(account_info) {
        try {
            wasm.statementaccount_reload(this.ptr, addBorrowedObject(account_info));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    buffer() {
        const ret = wasm.statementaccount_buffer(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {number}
    */
    get_bump() {
        const ret = wasm.statementaccount_get_bump(this.ptr);
        return ret;
    }
    /**
    * @returns {Array<any>}
    */
    vaults_to_refresh() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.statementaccount_vaults_to_refresh(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} vaults
    */
    refresh(vaults) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.statementaccount_refresh(retptr, this.ptr, addBorrowedObject(vaults));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    positions_len() {
        const ret = wasm.statementaccount_positions_len(this.ptr);
        return ret;
    }
    /**
    * @returns {Uint8Array}
    */
    owner() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.statementaccount_owner(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {bigint}
    */
    remaining_permitted_debt() {
        const ret = wasm.statementaccount_remaining_permitted_debt(this.ptr);
        return BigInt.asUintN(64, ret);
    }
}
/**
*/
export class StrategyInfo {

    static __wrap(ptr) {
        const obj = Object.create(StrategyInfo.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_strategyinfo_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get has_lend() {
        const ret = wasm.__wbg_get_strategyinfo_has_lend(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set has_lend(arg0) {
        wasm.__wbg_set_strategyinfo_has_lend(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get has_swap() {
        const ret = wasm.__wbg_get_strategyinfo_has_swap(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set has_swap(arg0) {
        wasm.__wbg_set_strategyinfo_has_swap(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get has_trade() {
        const ret = wasm.__wbg_get_strategyinfo_has_trade(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set has_trade(arg0) {
        wasm.__wbg_set_strategyinfo_has_trade(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get balance_base() {
        const ret = wasm.__wbg_get_strategyinfo_balance_base(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set balance_base(arg0) {
        wasm.__wbg_set_strategyinfo_balance_base(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get balance_quote() {
        const ret = wasm.__wbg_get_strategyinfo_balance_quote(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set balance_quote(arg0) {
        wasm.__wbg_set_strategyinfo_balance_quote(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get locked_base() {
        const ret = wasm.__wbg_get_strategyinfo_locked_base(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set locked_base(arg0) {
        wasm.__wbg_set_strategyinfo_locked_base(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get locked_quote() {
        const ret = wasm.__wbg_get_strategyinfo_locked_quote(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set locked_quote(arg0) {
        wasm.__wbg_set_strategyinfo_locked_quote(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get utilization_base() {
        const ret = wasm.__wbg_get_strategyinfo_utilization_base(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set utilization_base(arg0) {
        wasm.__wbg_set_strategyinfo_utilization_base(this.ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get utilization_quote() {
        const ret = wasm.__wbg_get_strategyinfo_utilization_quote(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set utilization_quote(arg0) {
        wasm.__wbg_set_strategyinfo_utilization_quote(this.ptr, arg0);
    }
}
/**
*/
export class VaultsAccount {

    static __wrap(ptr) {
        const obj = Object.create(VaultsAccount.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vaultsaccount_free(ptr);
    }
    /**
    * @param {number} index
    * @returns {number}
    */
    timestamp(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_timestamp(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {bigint}
    */
    get_price(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_price(retptr, this.ptr, index);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {bigint}
    */
    get_confidence(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_confidence(retptr, this.ptr, index);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {bigint}
    */
    get_price_quote(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_price_quote(retptr, this.ptr, index);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {bigint}
    */
    get_confidence_quote(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_confidence_quote(retptr, this.ptr, index);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @param {bigint} price
    * @param {bigint} confidence
    * @param {number} time
    */
    update_oracle(index, price, confidence, time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_update_oracle(retptr, this.ptr, index, price, confidence, time);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @param {bigint} price
    * @param {bigint} confidence
    * @param {number} time
    */
    update_quote_oracle(index, price, confidence, time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_update_quote_oracle(retptr, this.ptr, index, price, confidence, time);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} id
    * @param {bigint} value
    * @returns {bigint}
    */
    max_borrow_for(id, value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_max_borrow_for(retptr, this.ptr, id, value);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault_index
    * @param {Uint8Array} statement
    * @param {number} current_time
    * @returns {BorrowPositionInfo}
    */
    get_borrow_position_info(vault_index, statement, current_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_borrow_position_info(retptr, this.ptr, vault_index, addBorrowedObject(statement), current_time);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BorrowPositionInfo.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} vault_index
    * @param {number} strategy_index
    * @param {Uint8Array} statement
    * @param {number} current_time
    * @returns {LpPositionInfo}
    */
    get_lp_position_info(vault_index, strategy_index, statement, current_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_get_lp_position_info(retptr, this.ptr, vault_index, strategy_index, addBorrowedObject(statement), current_time);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LpPositionInfo.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {StrategyInfo}
    */
    strategy_info(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_strategy_info(retptr, this.ptr, vault, strategy);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return StrategyInfo.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @returns {number}
    */
    count_strategies(vault) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_count_strategies(retptr, this.ptr, vault);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {boolean}
    */
    does_lend(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_does_lend(retptr, this.ptr, vault, strategy);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {boolean}
    */
    does_swap(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_does_swap(retptr, this.ptr, vault, strategy);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    balance_base(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_balance_base(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    balance_quote(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_balance_quote(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    lock_base(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_lock_base(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    lock_quote(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_lock_quote(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    utilization_base(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_utilization_base(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @returns {bigint}
    */
    utilization_quote(vault, strategy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_utilization_quote(retptr, this.ptr, vault, strategy);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {bigint} amount
    * @param {boolean} from_base
    * @param {boolean} by_amount_out
    * @param {number} now
    * @returns {bigint}
    */
    swap(vault, amount, from_base, by_amount_out, now) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_swap(retptr, this.ptr, vault, amount, from_base, by_amount_out, now);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return r0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {boolean} base
    * @returns {bigint}
    */
    liquidity(vault, base) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_liquidity(retptr, this.ptr, vault, base);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} account_info
    * @returns {VaultsAccount}
    */
    static load(account_info) {
        try {
            const ret = wasm.vaultsaccount_load(addBorrowedObject(account_info));
            return VaultsAccount.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Uint8Array} account_info
    */
    reload(account_info) {
        try {
            wasm.vaultsaccount_reload(this.ptr, addBorrowedObject(account_info));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    buffer() {
        const ret = wasm.vaultsaccount_buffer(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {number}
    */
    vaults_len() {
        const ret = wasm.vaultsaccount_vaults_len(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    static size() {
        const ret = wasm.vaultsaccount_size();
        return ret >>> 0;
    }
    /**
    * @returns {Array<any>}
    */
    vaults_keys_with_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_vaults_keys_with_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    base_token(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_base_token(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    quote_token(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_quote_token(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    base_reserve(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_base_reserve(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    quote_reserve(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_quote_reserve(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    oracle_base(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_oracle_base(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {Uint8Array}
    */
    oracle_quote(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_oracle_quote(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {boolean}
    */
    base_oracle_enabled(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_base_oracle_enabled(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {boolean}
    */
    quote_oracle_enabled(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_quote_oracle_enabled(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {boolean}
    */
    has_lending(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_has_lending(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {boolean}
    */
    has_swap(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_has_swap(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @param {number} current_time
    */
    refresh(index, current_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_refresh(retptr, this.ptr, index, current_time);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @param {number} timestamp
    * @returns {bigint}
    */
    lending_apy(index, timestamp) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_lending_apy(retptr, this.ptr, index, timestamp);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} index
    * @returns {number}
    */
    timestamp(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_timestamp(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} vault
    * @param {number} strategy
    * @param {bigint} amount
    * @param {boolean} deposit_base
    * @param {number} current_time
    * @returns {bigint}
    */
    deposit(vault, strategy, amount, deposit_base, current_time) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vaultsaccount_deposit(retptr, this.ptr, vault, strategy, amount, deposit_base, current_time);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class VaultsKeysWithId {

    static __wrap(ptr) {
        const obj = Object.create(VaultsKeysWithId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vaultskeyswithid_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    get base_key() {
        const ret = wasm.__wbg_get_vaultskeyswithid_base_key(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} arg0
    */
    set base_key(arg0) {
        wasm.__wbg_set_vaultskeyswithid_base_key(this.ptr, addHeapObject(arg0));
    }
    /**
    * @returns {Uint8Array}
    */
    get quote_key() {
        const ret = wasm.__wbg_get_vaultskeyswithid_quote_key(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} arg0
    */
    set quote_key(arg0) {
        wasm.__wbg_set_vaultskeyswithid_quote_key(this.ptr, addHeapObject(arg0));
    }
    /**
    * @returns {number}
    */
    get index() {
        const ret = wasm.__wbg_get_vaultskeyswithid_index(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set index(arg0) {
        wasm.__wbg_set_vaultskeyswithid_index(this.ptr, arg0);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbg_vaultskeyswithid_new(arg0) {
    const ret = VaultsKeysWithId.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return addHeapObject(ret);
};

export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export function __wbg_new_b525de17f44a8943() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_push_49c286f04dd3bf59(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export function __wbg_buffer_cf65c07de34b9a08(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_537b7341ce90bb31(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_newwithlength_b56c882b57805732(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_length_27a2afe8ab42b09f(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_set_17499e8aa4003ebd(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

