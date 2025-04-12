let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

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
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}
/**
 * @returns {Symbol}
 */
export function getSomePattern() {
    const ret = wasm.getSomePattern();
    return ret;
}

/**
 * @returns {Symbol}
 */
export function getNonePattern() {
    const ret = wasm.getNonePattern();
    return ret;
}

/**
 * @returns {Symbol}
 */
export function getOkPattern() {
    const ret = wasm.getOkPattern();
    return ret;
}

/**
 * @returns {Symbol}
 */
export function getErrPattern() {
    const ret = wasm.getErrPattern();
    return ret;
}

/**
 * @returns {Symbol}
 */
export function getWildcardPattern() {
    const ret = wasm.getWildcardPattern();
    return ret;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {any} value
 * @param {any} pattern
 * @returns {boolean}
 */
export function matchesPattern(value, pattern) {
    const ret = wasm.matchesPattern(value, pattern);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {any} value
 * @param {any} pattern
 * @returns {any}
 */
export function extractValue(value, pattern) {
    const ret = wasm.extractValue(value, pattern);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @param {any} patterns
 * @returns {any}
 */
export function matchValue(value, patterns) {
    const ret = wasm.matchValue(value, patterns);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {object}
 */
export function createPatternMatcherIs() {
    const ret = wasm.createPatternMatcherIs();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {any} value
 * @returns {boolean}
 */
export function isMergeableObjectRust(value) {
    const ret = wasm.isMergeableObjectRust(value);
    return ret !== 0;
}

export function noopRust() {
    wasm.noopRust();
}

/**
 * @param {any} value
 * @returns {any}
 */
export function identityRust(value) {
    const ret = wasm.identityRust(value);
    return ret;
}

/**
 * @param {boolean} value
 * @returns {boolean}
 */
export function notRust(value) {
    const ret = wasm.notRust(value);
    return ret !== 0;
}

/**
 * @param {any} obj
 * @param {any} key
 * @returns {any}
 */
export function propAccessRust(obj, key) {
    const ret = wasm.propAccessRust(obj, key);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} obj
 * @param {any} key
 * @param {any} value
 * @returns {boolean}
 */
export function propEqRust(obj, key, value) {
    const ret = wasm.propEqRust(obj, key, value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {Map<any, any>} map
 * @param {any} key
 * @returns {boolean}
 */
export function mapHasRust(map, key) {
    const ret = wasm.mapHasRust(map, key);
    return ret !== 0;
}

/**
 * @param {Map<any, any>} map
 * @param {any} key
 * @returns {any}
 */
export function mapGetRust(map, key) {
    const ret = wasm.mapGetRust(map, key);
    return ret;
}

/**
 * @param {Map<any, any>} map
 * @param {any} key
 * @param {any} value
 */
export function mapSetRust(map, key, value) {
    wasm.mapSetRust(map, key, value);
}

/**
 * @param {number} last_call
 * @param {number} wait_ms
 * @returns {boolean}
 */
export function shouldThrottleExecuteRust(last_call, wait_ms) {
    const ret = wasm.shouldThrottleExecuteRust(last_call, wait_ms);
    return ret !== 0;
}

/**
 * @param {any} args
 * @returns {string}
 */
export function createCacheKeyRust(args) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.createCacheKeyRust(args);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} iterable
 * @param {Function} key_value_fn
 * @returns {any}
 */
export function toHashMapRust(iterable, key_value_fn) {
    const ret = wasm.toHashMapRust(iterable, key_value_fn);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} iterable
 * @returns {any}
 */
export function toHashSetRust(iterable) {
    const ret = wasm.toHashSetRust(iterable);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} iterable
 * @returns {Vec}
 */
export function toVecRust(iterable) {
    const ret = wasm.toVecRust(iterable);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Vec.__wrap(ret[0]);
}

/**
 * @param {any} obj
 * @param {Function} fn_val
 * @returns {any}
 */
export function mapObjectRust(obj, fn_val) {
    const ret = wasm.mapObjectRust(obj, fn_val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} obj
 * @param {Function} fn_val
 * @returns {any}
 */
export function filterObjectRust(obj, fn_val) {
    const ret = wasm.filterObjectRust(obj, fn_val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Array<any>} fns
 * @param {any} arg
 * @returns {any}
 */
export function pipeRust(fns, arg) {
    const ret = wasm.pipeRust(fns, arg);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Array<any>} fns
 * @param {any} arg
 * @returns {any}
 */
export function composeRust(fns, arg) {
    const ret = wasm.composeRust(fns, arg);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Array<any>} predicates
 * @param {any} value
 * @returns {boolean}
 */
export function allOfRust(predicates, value) {
    const ret = wasm.allOfRust(predicates, value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {Array<any>} predicates
 * @param {any} value
 * @returns {boolean}
 */
export function anyOfRust(predicates, value) {
    const ret = wasm.anyOfRust(predicates, value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {Function} fn_val
 * @param {Vec} as_vec
 * @param {Vec} bs_vec
 * @returns {Vec}
 */
export function zipWithRust(fn_val, as_vec, bs_vec) {
    _assertClass(as_vec, Vec);
    _assertClass(bs_vec, Vec);
    const ret = wasm.zipWithRust(fn_val, as_vec.__wbg_ptr, bs_vec.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Vec.__wrap(ret[0]);
}

/**
 * @param {Function} after
 * @param {Array<any>} fns
 * @param {Array<any>} args
 * @returns {any}
 */
export function convergeRust(after, fns, args) {
    const ret = wasm.convergeRust(after, fns, args);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {number | null} [capacity]
 * @returns {Array<any>}
 */
export function createChannel(capacity) {
    const ret = wasm.createChannel(isLikeNone(capacity) ? 0x100000001 : (capacity) >>> 0);
    return ret;
}

/**
 * @param {boolean} condition
 * @param {string | null} [error_message]
 */
export function requires(condition, error_message) {
    var ptr0 = isLikeNone(error_message) ? 0 : passStringToWasm0(error_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.requires(condition, ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {boolean} condition
 * @param {string | null} [error_message]
 */
export function ensures(condition, error_message) {
    var ptr0 = isLikeNone(error_message) ? 0 : passStringToWasm0(error_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.ensures(condition, ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {Function} _function
 * @param {Function | null} [precondition]
 * @param {Function | null} [postcondition]
 * @param {string | null} [pre_error_msg]
 * @param {string | null} [post_error_msg]
 * @returns {Function}
 */
export function contract(_function, precondition, postcondition, pre_error_msg, post_error_msg) {
    var ptr0 = isLikeNone(pre_error_msg) ? 0 : passStringToWasm0(pre_error_msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(post_error_msg) ? 0 : passStringToWasm0(post_error_msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.contract(_function, isLikeNone(precondition) ? 0 : addToExternrefTable0(precondition), isLikeNone(postcondition) ? 0 : addToExternrefTable0(postcondition), ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} disposable
 * @returns {ManagedResource}
 */
export function asResource(disposable) {
    const ret = wasm.asResource(disposable);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ManagedResource.__wrap(ret[0]);
}

/**
 * @returns {DisposableGroup}
 */
export function createDisposableGroup() {
    const ret = wasm.createDisposableGroup();
    return DisposableGroup.__wrap(ret);
}

/**
 * @param {Promise<any>} promise
 * @returns {Task}
 */
export function createTask(promise) {
    const ret = wasm.createTask(promise);
    return Task.__wrap(ret);
}

/**
 * @param {Task} task
 * @param {Function} mapper
 * @returns {Task}
 */
export function mapTask(task, mapper) {
    _assertClass(task, Task);
    const ret = wasm.mapTask(task.__wbg_ptr, mapper);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Task.__wrap(ret[0]);
}

/**
 * @param {Task} task
 * @param {Function} mapper
 * @returns {Task}
 */
export function flatMapTask(task, mapper) {
    _assertClass(task, Task);
    const ret = wasm.flatMapTask(task.__wbg_ptr, mapper);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Task.__wrap(ret[0]);
}

/**
 * @param {Task} task
 * @param {Function} handler
 * @returns {Task}
 */
export function catchTask(task, handler) {
    _assertClass(task, Task);
    const ret = wasm.catchTask(task.__wbg_ptr, handler);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Task.__wrap(ret[0]);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isDefined(value) {
    const ret = wasm.isDefined(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value) {
    const ret = wasm.isObject(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isVec(value) {
    const ret = wasm.isVec(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isStr(value) {
    const ret = wasm.isStr(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isNumeric(value) {
    const ret = wasm.isNumeric(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isBoolean(value) {
    const ret = wasm.isBoolean(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isFunction(value) {
    const ret = wasm.isFunction(value);
    return ret !== 0;
}

/**
 * @param {any} value
 * @returns {any}
 */
export function identity(value) {
    const ret = wasm.identity(value);
    return ret;
}

/**
 * @param {any} iterable
 * @returns {Vec}
 */
export function iterableToVec(iterable) {
    const ret = wasm.iterableToVec(iterable);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Vec.__wrap(ret[0]);
}

/**
 * @returns {object}
 */
export function createTypes() {
    const ret = wasm.createTypes();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
 * @param {string} message
 * @returns {any}
 */
export function createAppError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createAppError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createValidationError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createValidationError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createNetworkError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createNetworkError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createAuthenticationError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createAuthenticationError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @param {string | null} [resource_type]
 * @returns {any}
 */
export function createNotFoundError(message, resource_type) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(resource_type) ? 0 : passStringToWasm0(resource_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.createNotFoundError(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createUnauthorizedError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createUnauthorizedError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createForbiddenError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createForbiddenError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createDatabaseError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createDatabaseError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createServerError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createServerError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createBusinessLogicError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createBusinessLogicError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createResourceConflictError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createResourceConflictError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @returns {any}
 */
export function createConfigurationError(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createConfigurationError(ptr0, len0);
    return ret;
}

/**
 * @param {string} message
 * @param {number | null} [retry_after_seconds]
 * @returns {any}
 */
export function createRateLimitError(message, retry_after_seconds) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createRateLimitError(ptr0, len0, isLikeNone(retry_after_seconds) ? 0x100000001 : (retry_after_seconds) >>> 0);
    return ret;
}

/**
 * @param {string} error_class_name
 * @param {string} default_message
 * @returns {ErrorFactory}
 */
export function createErrorFactory(error_class_name, default_message) {
    const ptr0 = passStringToWasm0(error_class_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(default_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.createErrorFactory(ptr0, len0, ptr1, len1);
    return ErrorFactory.__wrap(ret);
}

/**
 * @returns {object}
 */
export function createDomainErrorsNamespace() {
    const ret = wasm.createDomainErrorsNamespace();
    return ret;
}

/**
 * @param {any} value
 * @returns {Ref}
 */
export function createRef(value) {
    const ret = wasm.createRef(value);
    return Ref.__wrap(ret);
}

/**
 * @param {any} value
 * @returns {ResultWrapper}
 */
export function createOkResultWrapper(value) {
    const ret = wasm.createOkResultWrapper(value);
    return ResultWrapper.__wrap(ret);
}

/**
 * @param {any} error
 * @returns {ResultWrapper}
 */
export function createErrResultWrapper(error) {
    const ret = wasm.createErrResultWrapper(error);
    return ResultWrapper.__wrap(ret);
}

/**
 * @param {Function} fn_call
 * @param {Function | null} [error_handler]
 * @returns {ResultWrapper}
 */
export function tryCatchWrapper(fn_call, error_handler) {
    const ret = wasm.tryCatchWrapper(fn_call, isLikeNone(error_handler) ? 0 : addToExternrefTable0(error_handler));
    return ResultWrapper.__wrap(ret);
}

/**
 * @param {any} value
 * @returns {Owned}
 */
export function createOwned(value) {
    const ret = wasm.createOwned(value);
    return Owned.__wrap(ret);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Uint8Array} data
 * @returns {object}
 */
export function compressHuffman(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compressHuffman(ptr0, len0);
    return ret;
}

/**
 * @param {Uint8Array} compressed_data
 * @param {Uint8Array} tree_data
 * @returns {Uint8Array}
 */
export function decompressHuffman(compressed_data, tree_data) {
    const ptr0 = passArray8ToWasm0(compressed_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(tree_data, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.decompressHuffman(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @returns {RefMut}
 */
export function createRefMut(value) {
    const ret = wasm.createRefMut(value);
    return RefMut.__wrap(ret);
}

/**
 * @param {any} value
 * @param {Function} dispose_fn
 * @returns {ManagedResource}
 */
export function createManagedResource(value, dispose_fn) {
    const ret = wasm.createManagedResource(value, dispose_fn);
    return ManagedResource.__wrap(ret);
}

/**
 * @param {ManagedResource} resource
 * @param {Function} fn_callback
 * @returns {Promise<any>}
 */
export function withManagedResource(resource, fn_callback) {
    _assertClass(resource, ManagedResource);
    const ret = wasm.withManagedResource(resource.__wbg_ptr, fn_callback);
    return ret;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @param {Vec} vec
 * @returns {Iter}
 */
export function fromVec(vec) {
    _assertClass(vec, Vec);
    const ret = wasm.fromVec(vec.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Iter.__wrap(ret[0]);
}

/**
 * @returns {Iter}
 */
export function empty() {
    const ret = wasm.empty();
    return Iter.__wrap(ret);
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @returns {Iter}
 */
export function range(start, end, step) {
    const ret = wasm.range(start, end, step);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Iter.__wrap(ret[0]);
}

/**
 * @param {number} _start
 * @param {number} _end
 * @param {number} step
 * @returns {boolean}
 */
export function checkIterableRange(_start, _end, step) {
    const ret = wasm.checkIterableRange(_start, _end, step);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {any} value
 * @returns {Option}
 */
export function createSome(value) {
    const ret = wasm.createSome(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Option.__wrap(ret[0]);
}

/**
 * @returns {Option}
 */
export function createNone() {
    const ret = wasm.None();
    return Option.__wrap(ret);
}

/**
 * @param {any} value
 * @returns {Option}
 */
export function Some(value) {
    const ret = wasm.Some(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Option.__wrap(ret[0]);
}

/**
 * @returns {Option}
 */
export function None() {
    const ret = wasm.None();
    return Option.__wrap(ret);
}

/**
 * @param {any} value
 * @returns {Option}
 */
export function from(value) {
    const ret = wasm.from(value);
    return Option.__wrap(ret);
}

/**
 * @param {Array<any>} options
 * @returns {Option}
 */
export function firstSome(options) {
    const ret = wasm.firstSome(options);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Option.__wrap(ret[0]);
}

/**
 * @param {Array<any>} options
 * @returns {Option}
 */
export function all(options) {
    const ret = wasm.all(options);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Option.__wrap(ret[0]);
}

/**
 * @param {any} value
 * @param {Function} invariant_fn
 * @param {string | null} [error_msg]
 * @returns {Invariant}
 */
export function createInvariant(value, invariant_fn, error_msg) {
    var ptr0 = isLikeNone(error_msg) ? 0 : passStringToWasm0(error_msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.createInvariant(value, invariant_fn, ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Invariant.__wrap(ret[0]);
}

/**
 * @param {any} value
 * @returns {MatchBuilder}
 */
export function createMatchBuilder(value) {
    const ret = wasm.createMatchBuilder(value);
    return MatchBuilder.__wrap(ret);
}

/**
 * @returns {Symbol}
 */
export function getWildcardSymbol() {
    const ret = wasm.getWildcardSymbol();
    return ret;
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm.closure59_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_45(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdfb7e73fb3f378ab(arg0, arg1);
}

function __wbg_adapter_815(arg0, arg1, arg2, arg3) {
    wasm.closure97_externref_shim(arg0, arg1, arg2, arg3);
}

const BrandTypesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_brandtypes_free(ptr >>> 0, 1));

export class BrandTypes {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrandTypesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_brandtypes_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.brandtypes_new();
        this.__wbg_ptr = ret >>> 0;
        BrandTypesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Str}
     */
    get JSON() {
        const ret = wasm.brandtypes_JSON(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get POSITIVE() {
        const ret = wasm.brandtypes_POSITIVE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get NEGATIVE() {
        const ret = wasm.brandtypes_NEGATIVE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get NON_NEGATIVE() {
        const ret = wasm.brandtypes_NON_NEGATIVE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get PERCENTAGE() {
        const ret = wasm.brandtypes_PERCENTAGE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
}

const ChannelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_channel_free(ptr >>> 0, 1));

export class Channel {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChannelFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channel_free(ptr, 0);
    }
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        const ret = wasm.channel_new(capacity);
        this.__wbg_ptr = ret >>> 0;
        ChannelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} value
     * @returns {Promise<any>}
     */
    send(value) {
        const ret = wasm.channel_send(this.__wbg_ptr, value);
        return ret;
    }
    /**
     * @param {any} value
     * @returns {boolean}
     */
    trySend(value) {
        const ret = wasm.channel_trySend(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @returns {Promise<any>}
     */
    receive() {
        const ret = wasm.channel_receive(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    tryReceive() {
        const ret = wasm.channel_tryReceive(this.__wbg_ptr);
        return ret;
    }
    close() {
        wasm.channel_close(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    get closed() {
        const ret = wasm.channel_closed(this.__wbg_ptr);
        return ret !== 0;
    }
}

const CompressionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_compressions_free(ptr >>> 0, 1));

export class Compressions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CompressionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressions_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} data
     * @param {number | null} [level]
     * @returns {Uint8Array}
     */
    static compressGzip(data, level) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_compressGzip(ptr0, len0, isLikeNone(level) ? 0x100000001 : (level) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static decompressGzip(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_decompressGzip(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @param {number | null} [level]
     * @returns {Uint8Array}
     */
    static compressZlib(data, level) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_compressZlib(ptr0, len0, isLikeNone(level) ? 0x100000001 : (level) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static decompressZlib(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_decompressZlib(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @param {number | null} [level]
     * @returns {Uint8Array}
     */
    static compressDeflate(data, level) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_compressDeflate(ptr0, len0, isLikeNone(level) ? 0x100000001 : (level) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static decompressDeflate(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_decompressDeflate(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} data
     * @param {number | null} [window_size]
     * @returns {Uint8Array}
     */
    static compressLZ77(data, window_size) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_compressLZ77(ptr0, len0, isLikeNone(window_size) ? 0x100000001 : (window_size) >>> 0);
        return ret;
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static decompressLZ77(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressions_decompressLZ77(ptr0, len0);
        return ret;
    }
}

const ContractErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contracterror_free(ptr >>> 0, 1));

export class ContractError {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contracterror_free(ptr, 0);
    }
    /**
     * @param {string} message
     */
    constructor(message) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.contracterror_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        ContractErrorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contracterror_message(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contracterror_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const CryptoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_crypto_free(ptr >>> 0, 1));

export class Crypto {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_crypto_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static sha256(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_sha256(ptr0, len0);
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
    /**
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static sha512(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_sha512(ptr0, len0);
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static hmac256(key, data) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_hmac256(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v3;
    }
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    static hmac512(key, data) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_hmac512(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v3;
    }
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} plaintext
     * @returns {Uint8Array}
     */
    static aesGcmEncrypt(key, plaintext) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(plaintext, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_aesGcmEncrypt(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} ciphertext
     * @returns {Uint8Array}
     */
    static aesGcmDecrypt(key, ciphertext) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.crypto_aesGcmDecrypt(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} length
     * @returns {Uint8Array}
     */
    static randomBytes(length) {
        const ret = wasm.crypto_randomBytes(length);
        return ret;
    }
}

const DisposableGroupFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_disposablegroup_free(ptr >>> 0, 1));

export class DisposableGroup {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DisposableGroup.prototype);
        obj.__wbg_ptr = ptr;
        DisposableGroupFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DisposableGroupFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_disposablegroup_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.createDisposableGroup();
        this.__wbg_ptr = ret >>> 0;
        DisposableGroupFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} disposable
     * @returns {DisposableGroup}
     */
    add(disposable) {
        const ret = wasm.disposablegroup_add(this.__wbg_ptr, disposable);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DisposableGroup.__wrap(ret[0]);
    }
    /**
     * @returns {Promise<any>}
     */
    dispose() {
        const ret = wasm.disposablegroup_dispose(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get isDisposed() {
        const ret = wasm.disposablegroup_isDisposed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get size() {
        const ret = wasm.disposablegroup_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.disposablegroup_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ErrorFactoryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_errorfactory_free(ptr >>> 0, 1));

export class ErrorFactory {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ErrorFactory.prototype);
        obj.__wbg_ptr = ptr;
        ErrorFactoryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ErrorFactoryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_errorfactory_free(ptr, 0);
    }
    /**
     * @param {string} name
     * @param {string} default_message
     */
    constructor(name, default_message) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(default_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.errorfactory_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        ErrorFactoryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} message
     * @returns {any}
     */
    createAppError(message) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.errorfactory_createAppError(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {string}
     */
    getName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.errorfactory_getName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    getDefaultMessage() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.errorfactory_getDefaultMessage(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const GraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_graph_free(ptr >>> 0, 1));

export class Graph {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GraphFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_graph_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.graph_new();
        this.__wbg_ptr = ret >>> 0;
        GraphFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} vertex
     */
    addVertex(vertex) {
        const ptr0 = passStringToWasm0(vertex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.graph_addVertex(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} from
     * @param {string} to
     * @param {number | null} [weight]
     */
    addEdge(from, to, weight) {
        const ptr0 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.graph_addEdge(this.__wbg_ptr, ptr0, len0, ptr1, len1, !isLikeNone(weight), isLikeNone(weight) ? 0 : weight);
    }
    /**
     * @param {string} vertex
     */
    removeVertex(vertex) {
        const ptr0 = passStringToWasm0(vertex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.graph_removeVertex(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} from
     * @param {string} to
     */
    removeEdge(from, to) {
        const ptr0 = passStringToWasm0(from, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.graph_removeEdge(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @returns {Array<any>}
     */
    getVertices() {
        const ret = wasm.graph_getVertices(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    getEdges() {
        const ret = wasm.graph_getEdges(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    getAdjacencyList() {
        const ret = wasm.graph_getAdjacencyList(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} start
     * @param {string | null} [end]
     * @returns {any}
     */
    dijkstra(start, end) {
        const ptr0 = passStringToWasm0(start, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(end) ? 0 : passStringToWasm0(end, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.graph_dijkstra(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
     * @param {string} start
     * @returns {Array<any>}
     */
    breadthFirstSearch(start) {
        const ptr0 = passStringToWasm0(start, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.graph_breadthFirstSearch(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} start
     * @returns {Array<any>}
     */
    depthFirstSearch(start) {
        const ptr0 = passStringToWasm0(start, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.graph_depthFirstSearch(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    kruskalMST() {
        const ret = wasm.graph_kruskalMST(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} start
     * @param {string} end
     * @returns {Array<any> | undefined}
     */
    getShortestPath(start, end) {
        const ptr0 = passStringToWasm0(start, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(end, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.graph_getShortestPath(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
}

const HashMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hashmap_free(ptr >>> 0, 1));

export class HashMap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HashMap.prototype);
        obj.__wbg_ptr = ptr;
        HashMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hashmap_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.hashmap_empty();
        this.__wbg_ptr = ret >>> 0;
        HashMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Array<any>} entries
     * @returns {HashMap}
     */
    static from(entries) {
        const ret = wasm.hashmap_from(entries);
        return HashMap.__wrap(ret);
    }
    /**
     * @param {any} fn_val
     * @returns {HashMap}
     */
    map(fn_val) {
        const ret = wasm.hashmap_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return HashMap.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {HashMap}
     */
    filter(fn_val) {
        const ret = wasm.hashmap_filter(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return HashMap.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {any}
     */
    find(fn_val) {
        const ret = wasm.hashmap_find(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.hashmap_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {HashMap}
     */
    static empty() {
        const ret = wasm.hashmap_empty();
        return HashMap.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    size() {
        const ret = wasm.hashmap_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.hashmap_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {any} key
     * @returns {any}
     */
    get(key) {
        const ret = wasm.hashmap_get(this.__wbg_ptr, key);
        return ret;
    }
    /**
     * @param {any} key
     * @returns {boolean}
     */
    contains(key) {
        const ret = wasm.hashmap_contains(this.__wbg_ptr, key);
        return ret !== 0;
    }
    /**
     * @param {any} key
     * @param {any} value
     * @returns {HashMap}
     */
    insert(key, value) {
        const ret = wasm.hashmap_insert(this.__wbg_ptr, key, value);
        return HashMap.__wrap(ret);
    }
    /**
     * @param {any} key
     * @returns {HashMap}
     */
    remove(key) {
        const ret = wasm.hashmap_remove(this.__wbg_ptr, key);
        return HashMap.__wrap(ret);
    }
    /**
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.hashmap_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    values() {
        const ret = wasm.hashmap_values(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    entries() {
        const ret = wasm.hashmap_entries(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {HashMap} other
     * @returns {HashMap}
     */
    extend(other) {
        _assertClass(other, HashMap);
        const ret = wasm.hashmap_extend(this.__wbg_ptr, other.__wbg_ptr);
        return HashMap.__wrap(ret);
    }
    /**
     * @returns {HashMap}
     */
    clear() {
        const ret = wasm.hashmap_clear(this.__wbg_ptr);
        return HashMap.__wrap(ret);
    }
    /**
     * @returns {Array<any>}
     */
    toArray() {
        const ret = wasm.hashmap_toArray(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.hashmap_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const HashSetFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hashset_free(ptr >>> 0, 1));

export class HashSet {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HashSet.prototype);
        obj.__wbg_ptr = ptr;
        HashSetFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashSetFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hashset_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.hashset_empty();
        this.__wbg_ptr = ret >>> 0;
        HashSetFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Array<any>} values
     * @returns {HashSet}
     */
    static from(values) {
        const ret = wasm.hashset_from(values);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {any} fn_val
     * @returns {HashSet}
     */
    map(fn_val) {
        const ret = wasm.hashset_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return HashSet.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {HashSet}
     */
    filter(fn_val) {
        const ret = wasm.hashset_filter(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return HashSet.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {any}
     */
    find(fn_val) {
        const ret = wasm.hashset_find(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.hashset_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {HashSet}
     */
    static empty() {
        const ret = wasm.hashset_empty();
        return HashSet.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    size() {
        const ret = wasm.hashset_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.hashset_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        const ret = wasm.hashset_contains(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @param {any} value
     * @returns {HashSet}
     */
    insert(value) {
        const ret = wasm.hashset_insert(this.__wbg_ptr, value);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {any} value
     * @returns {HashSet}
     */
    remove(value) {
        const ret = wasm.hashset_remove(this.__wbg_ptr, value);
        return HashSet.__wrap(ret);
    }
    /**
     * @returns {Array<any>}
     */
    values() {
        const ret = wasm.hashset_values(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {HashSet} other
     * @returns {HashSet}
     */
    union(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_union(this.__wbg_ptr, other.__wbg_ptr);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {HashSet} other
     * @returns {HashSet}
     */
    intersection(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_intersection(this.__wbg_ptr, other.__wbg_ptr);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {HashSet} other
     * @returns {HashSet}
     */
    difference(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_difference(this.__wbg_ptr, other.__wbg_ptr);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {HashSet} other
     * @returns {HashSet}
     */
    symmetricDifference(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_symmetricDifference(this.__wbg_ptr, other.__wbg_ptr);
        return HashSet.__wrap(ret);
    }
    /**
     * @param {HashSet} other
     * @returns {boolean}
     */
    isSubset(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_isSubset(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {HashSet} other
     * @returns {boolean}
     */
    isSuperset(other) {
        _assertClass(other, HashSet);
        const ret = wasm.hashset_isSuperset(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {HashSet}
     */
    clear() {
        const ret = wasm.hashset_clear(this.__wbg_ptr);
        return HashSet.__wrap(ret);
    }
    /**
     * @returns {Array<any>}
     */
    toArray() {
        const ret = wasm.hashset_toArray(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.hashset_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ImageProcessingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_imageprocessing_free(ptr >>> 0, 1));

export class ImageProcessing {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ImageProcessingFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_imageprocessing_free(ptr, 0);
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @returns {Uint8ClampedArray}
     */
    static grayscale(image_data) {
        const ret = wasm.imageprocessing_grayscale(image_data);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @returns {Uint8ClampedArray}
     */
    static invert(image_data) {
        const ret = wasm.imageprocessing_invert(image_data);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @param {number} factor
     * @returns {Uint8ClampedArray}
     */
    static brightness(image_data, factor) {
        const ret = wasm.imageprocessing_brightness(image_data, factor);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @param {number} width
     * @param {number} height
     * @param {number} radius
     * @returns {Uint8ClampedArray}
     */
    static blur(image_data, width, height, radius) {
        const ret = wasm.imageprocessing_blur(image_data, width, height, radius);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @param {number} width
     * @param {number} height
     * @returns {Uint8ClampedArray}
     */
    static edgeDetection(image_data, width, height) {
        const ret = wasm.imageprocessing_edgeDetection(image_data, width, height);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @param {number} source_width
     * @param {number} source_height
     * @param {number} target_width
     * @param {number} target_height
     * @returns {Uint8ClampedArray}
     */
    static resize(image_data, source_width, source_height, target_width, target_height) {
        const ret = wasm.imageprocessing_resize(image_data, source_width, source_height, target_width, target_height);
        return ret;
    }
    /**
     * @param {Uint8ClampedArray} image_data
     * @param {number} width
     * @param {number} height
     * @param {number} angle_degrees
     * @returns {object}
     */
    static rotate(image_data, width, height, angle_degrees) {
        const ret = wasm.imageprocessing_rotate(image_data, width, height, angle_degrees);
        return ret;
    }
}

const InvariantFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_invariant_free(ptr >>> 0, 1));

export class Invariant {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Invariant.prototype);
        obj.__wbg_ptr = ptr;
        InvariantFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InvariantFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_invariant_free(ptr, 0);
    }
    /**
     * @param {any} value
     * @param {Function} invariant_fn
     * @param {string | null} [error_msg]
     */
    constructor(value, invariant_fn, error_msg) {
        var ptr0 = isLikeNone(error_msg) ? 0 : passStringToWasm0(error_msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.invariant_new(value, invariant_fn, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        InvariantFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get() {
        const ret = wasm.invariant_get(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} map_fn
     * @param {Function} new_invariant_fn
     * @param {string | null} [error_msg]
     * @returns {Invariant}
     */
    map(map_fn, new_invariant_fn, error_msg) {
        var ptr0 = isLikeNone(error_msg) ? 0 : passStringToWasm0(error_msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.invariant_map(this.__wbg_ptr, map_fn, new_invariant_fn, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Invariant.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.invariant_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const IterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_iter_free(ptr >>> 0, 1));

export class Iter {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Iter.prototype);
        obj.__wbg_ptr = ptr;
        IterFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IterFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_iter_free(ptr, 0);
    }
    /**
     * @param {any} iterable
     */
    constructor(iterable) {
        const ret = wasm.iter_new(iterable);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        IterFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Option}
     */
    next() {
        const ret = wasm.iter_next(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Option.__wrap(ret[0]);
    }
    /**
     * @param {Function} fn_val
     * @returns {Iter}
     */
    map(fn_val) {
        const ret = wasm.iter_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Iter.__wrap(ret[0]);
    }
    /**
     * @param {Function} fn_val
     * @returns {Iter}
     */
    filter(fn_val) {
        const ret = wasm.iter_filter(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Iter.__wrap(ret[0]);
    }
    /**
     * @param {number} n
     * @returns {Iter}
     */
    take(n) {
        const ret = wasm.iter_take(this.__wbg_ptr, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Iter.__wrap(ret[0]);
    }
    /**
     * @param {number} n
     * @returns {Iter}
     */
    skip(n) {
        const ret = wasm.iter_skip(this.__wbg_ptr, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Iter.__wrap(ret[0]);
    }
    /**
     * @returns {Vec}
     */
    collect() {
        const ret = wasm.iter_collect(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Vec.__wrap(ret[0]);
    }
    /**
     * @param {Function} predicate
     * @returns {Option}
     */
    find(predicate) {
        const ret = wasm.iter_find(this.__wbg_ptr, predicate);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Option.__wrap(ret[0]);
    }
    /**
     * @param {Function} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.iter_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    count() {
        const ret = wasm.iter_count(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] >>> 0;
    }
    /**
     * @param {any} initial
     * @param {Function} fn_val
     * @returns {any}
     */
    fold(initial, fn_val) {
        const ret = wasm.iter_fold(this.__wbg_ptr, initial, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} predicate
     * @returns {boolean}
     */
    all(predicate) {
        const ret = wasm.iter_all(this.__wbg_ptr, predicate);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @param {Function} predicate
     * @returns {boolean}
     */
    any(predicate) {
        const ret = wasm.iter_any(this.__wbg_ptr, predicate);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
}

const JsArcMutexNumFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsarcmutexnum_free(ptr >>> 0, 1));

export class JsArcMutexNum {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsArcMutexNumFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsarcmutexnum_free(ptr, 0);
    }
    /**
     * @param {number} initial
     */
    constructor(initial) {
        const ret = wasm.jsarcmutexnum_new(initial);
        this.__wbg_ptr = ret >>> 0;
        JsArcMutexNumFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get() {
        const ret = wasm.jsarcmutexnum_get(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} updater
     */
    set(updater) {
        const ret = wasm.jsarcmutexnum_set(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Function} updater
     * @param {number | null} [retries]
     * @param {Function | null} [fallback]
     */
    setAsync(updater, retries, fallback) {
        const ret = wasm.jsarcmutexnum_setAsync(this.__wbg_ptr, updater, isLikeNone(retries) ? 0x100000001 : (retries) >>> 0, isLikeNone(fallback) ? 0 : addToExternrefTable0(fallback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    isLocked() {
        const ret = wasm.jsarcmutexnum_isLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsarcmutexnum_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsArcMutexStrFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsarcmutexstr_free(ptr >>> 0, 1));

export class JsArcMutexStr {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsArcMutexStrFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsarcmutexstr_free(ptr, 0);
    }
    /**
     * @param {string} initial
     */
    constructor(initial) {
        const ptr0 = passStringToWasm0(initial, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsarcmutexstr_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsArcMutexStrFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsarcmutexstr_get(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Function} updater
     */
    set(updater) {
        const ret = wasm.jsarcmutexstr_set(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Function} updater
     * @param {number | null} [retries]
     * @param {Function | null} [fallback]
     */
    setAsync(updater, retries, fallback) {
        const ret = wasm.jsarcmutexstr_setAsync(this.__wbg_ptr, updater, isLikeNone(retries) ? 0x100000001 : (retries) >>> 0, isLikeNone(fallback) ? 0 : addToExternrefTable0(fallback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    isLocked() {
        const ret = wasm.jsarcmutexnum_isLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsarcmutexstr_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsAsyncEffectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsasynceffect_free(ptr >>> 0, 1));

export class JsAsyncEffect {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsAsyncEffectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsasynceffect_free(ptr, 0);
    }
    /**
     * @param {Function} effect
     */
    constructor(effect) {
        const ret = wasm.jsasynceffect_new(effect);
        this.__wbg_ptr = ret >>> 0;
        JsAsyncEffectFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    cancel() {
        wasm.jsasynceffect_cancel(this.__wbg_ptr);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsasynceffect_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsComputedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jscomputed_free(ptr >>> 0, 1));

export class JsComputed {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsComputedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jscomputed_free(ptr, 0);
    }
    /**
     * @param {Function} compute
     * @param {Array<any>} watch_values
     */
    constructor(compute, watch_values) {
        const ret = wasm.jscomputed_new(compute, watch_values);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        JsComputedFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get() {
        const ret = wasm.jscomputed_get(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} new_watch_values
     */
    update(new_watch_values) {
        const ret = wasm.jscomputed_update(this.__wbg_ptr, new_watch_values);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {any}
     */
    toJSON() {
        const ret = wasm.jscomputed_toJSON(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jscomputed_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsMutexNumFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsmutexnum_free(ptr >>> 0, 1));

export class JsMutexNum {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsMutexNumFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsmutexnum_free(ptr, 0);
    }
    /**
     * @param {number} initial
     */
    constructor(initial) {
        const ret = wasm.jsarcmutexnum_new(initial);
        this.__wbg_ptr = ret >>> 0;
        JsMutexNumFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Function} updater
     */
    lock(updater) {
        const ret = wasm.jsmutexnum_lock(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    get() {
        const ret = wasm.jsarcmutexnum_get(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    isLocked() {
        const ret = wasm.jsarcmutexnum_isLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsmutexnum_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsMutexStrFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsmutexstr_free(ptr >>> 0, 1));

export class JsMutexStr {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsMutexStrFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsmutexstr_free(ptr, 0);
    }
    /**
     * @param {string} initial
     */
    constructor(initial) {
        const ptr0 = passStringToWasm0(initial, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsarcmutexstr_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsMutexStrFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Function} updater
     */
    lock(updater) {
        const ret = wasm.jsmutexstr_lock(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {string}
     */
    get() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsmutexstr_get(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    isLocked() {
        const ret = wasm.jsarcmutexnum_isLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsmutexstr_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsNumArcFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsnumarc_free(ptr >>> 0, 1));

export class JsNumArc {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JsNumArc.prototype);
        obj.__wbg_ptr = ptr;
        JsNumArcFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsNumArcFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsnumarc_free(ptr, 0);
    }
    /**
     * @param {number} value
     */
    constructor(value) {
        const ret = wasm.jsnumarc_new(value);
        this.__wbg_ptr = ret >>> 0;
        JsNumArcFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get() {
        const ret = wasm.jsnumarc_get(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} updater
     */
    set(updater) {
        const ret = wasm.jsnumarc_set(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {JsNumArc}
     */
    clone() {
        const ret = wasm.jsnumarc_clone(this.__wbg_ptr);
        return JsNumArc.__wrap(ret);
    }
}

const JsNumRcFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsnumrc_free(ptr >>> 0, 1));

export class JsNumRc {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JsNumRc.prototype);
        obj.__wbg_ptr = ptr;
        JsNumRcFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsNumRcFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsnumrc_free(ptr, 0);
    }
    /**
     * @param {number} value
     */
    constructor(value) {
        const ret = wasm.jsnumrc_new(value);
        this.__wbg_ptr = ret >>> 0;
        JsNumRcFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    borrow() {
        const ret = wasm.jsnumrc_borrow(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} updater
     */
    borrowMut(updater) {
        const ret = wasm.jsnumrc_borrowMut(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {JsNumRc}
     */
    clone() {
        const ret = wasm.jsnumrc_clone(this.__wbg_ptr);
        return JsNumRc.__wrap(ret);
    }
    drop() {
        wasm.jsnumrc_drop(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    refCount() {
        const ret = wasm.jsnumrc_refCount(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const JsNumRefCellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsnumrefcell_free(ptr >>> 0, 1));

export class JsNumRefCell {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsNumRefCellFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsnumrefcell_free(ptr, 0);
    }
    /**
     * @param {number} value
     */
    constructor(value) {
        const ret = wasm.jsnumrefcell_new(value);
        this.__wbg_ptr = ret >>> 0;
        JsNumRefCellFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    borrow() {
        const ret = wasm.jsnumrefcell_borrow(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} updater
     */
    borrowMut(updater) {
        const ret = wasm.jsnumrefcell_borrowMut(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const JsNumWeakFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsnumweak_free(ptr >>> 0, 1));

export class JsNumWeak {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsNumWeakFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsnumweak_free(ptr, 0);
    }
    /**
     * @param {number} value
     */
    constructor(value) {
        const ret = wasm.jsnumweak_new(value);
        this.__wbg_ptr = ret >>> 0;
        JsNumWeakFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} default_value
     * @returns {number}
     */
    getOrDefault(default_value) {
        const ret = wasm.jsnumweak_getOrDefault(this.__wbg_ptr, default_value);
        return ret;
    }
    drop() {
        wasm.jsnumweak_drop(this.__wbg_ptr);
    }
}

const JsRwLockNumFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsrwlocknum_free(ptr >>> 0, 1));

export class JsRwLockNum {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsRwLockNumFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsrwlocknum_free(ptr, 0);
    }
    /**
     * @param {number} initial
     */
    constructor(initial) {
        const ret = wasm.jsrwlocknum_new(initial);
        this.__wbg_ptr = ret >>> 0;
        JsRwLockNumFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    read() {
        const ret = wasm.jsrwlocknum_read(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    releaseRead() {
        wasm.jsrwlocknum_releaseRead(this.__wbg_ptr);
    }
    /**
     * @param {Function} updater
     */
    write(updater) {
        const ret = wasm.jsrwlocknum_write(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    getReaders() {
        const ret = wasm.jsrwlocknum_getReaders(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isWriteLocked() {
        const ret = wasm.jsrwlocknum_isWriteLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsrwlocknum_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsRwLockStrFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsrwlockstr_free(ptr >>> 0, 1));

export class JsRwLockStr {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsRwLockStrFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsrwlockstr_free(ptr, 0);
    }
    /**
     * @param {string} initial
     */
    constructor(initial) {
        const ptr0 = passStringToWasm0(initial, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsrwlockstr_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsRwLockStrFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    read() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.jsrwlockstr_read(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    releaseRead() {
        wasm.jsrwlocknum_releaseRead(this.__wbg_ptr);
    }
    /**
     * @param {Function} updater
     */
    write(updater) {
        const ret = wasm.jsrwlockstr_write(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    getReaders() {
        const ret = wasm.jsrwlocknum_getReaders(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isWriteLocked() {
        const ret = wasm.jsrwlocknum_isWriteLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsrwlockstr_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const JsStrArcFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsstrarc_free(ptr >>> 0, 1));

export class JsStrArc {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JsStrArc.prototype);
        obj.__wbg_ptr = ptr;
        JsStrArcFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsStrArcFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsstrarc_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsstrarc_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsStrArcFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsstrarc_get(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Function} updater
     */
    set(updater) {
        const ret = wasm.jsstrarc_set(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {JsStrArc}
     */
    clone() {
        const ret = wasm.jsstrarc_clone(this.__wbg_ptr);
        return JsStrArc.__wrap(ret);
    }
}

const JsStrRcFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsstrrc_free(ptr >>> 0, 1));

export class JsStrRc {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JsStrRc.prototype);
        obj.__wbg_ptr = ptr;
        JsStrRcFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsStrRcFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsstrrc_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsstrrc_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsStrRcFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    borrow() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsstrrc_borrow(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Function} updater
     */
    borrowMut(updater) {
        const ret = wasm.jsstrrc_borrowMut(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {JsStrRc}
     */
    clone() {
        const ret = wasm.jsstrrc_clone(this.__wbg_ptr);
        return JsStrRc.__wrap(ret);
    }
    drop() {
        wasm.jsstrrc_drop(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    refCount() {
        const ret = wasm.jsnumrc_refCount(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const JsStrRefCellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsstrrefcell_free(ptr >>> 0, 1));

export class JsStrRefCell {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsStrRefCellFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsstrrefcell_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsstrrefcell_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsStrRefCellFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    borrow() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jsstrrefcell_borrow(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Function} updater
     */
    borrowMut(updater) {
        const ret = wasm.jsstrrefcell_borrowMut(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const JsStrWeakFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsstrweak_free(ptr >>> 0, 1));

export class JsStrWeak {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsStrWeakFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsstrweak_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsstrweak_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        JsStrWeakFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} default_value
     * @returns {string}
     */
    getOrDefault(default_value) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(default_value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.jsstrweak_getOrDefault(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    drop() {
        wasm.jsstrweak_drop(this.__wbg_ptr);
    }
}

const JsWatcherFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jswatcher_free(ptr >>> 0, 1));

export class JsWatcher {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JsWatcherFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jswatcher_free(ptr, 0);
    }
    /**
     * @param {Function} watch_fn
     * @param {Function} callback_fn
     */
    constructor(watch_fn, callback_fn) {
        const ret = wasm.jswatcher_new(watch_fn, callback_fn);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        JsWatcherFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    check() {
        const ret = wasm.jswatcher_check(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.jswatcher_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const LoadingStatesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_loadingstates_free(ptr >>> 0, 1));

export class LoadingStates {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LoadingStatesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_loadingstates_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.loadingstates_new();
        this.__wbg_ptr = ret >>> 0;
        LoadingStatesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Str}
     */
    get idle() {
        const ret = wasm.loadingstates_IDLE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get IDLE() {
        const ret = wasm.loadingstates_IDLE(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get loading() {
        const ret = wasm.loadingstates_LOADING(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get LOADING() {
        const ret = wasm.loadingstates_LOADING(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get succeeded() {
        const ret = wasm.loadingstates_SUCCEEDED(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get SUCCEEDED() {
        const ret = wasm.loadingstates_SUCCEEDED(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get failed() {
        const ret = wasm.loadingstates_FAILED(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    get FAILED() {
        const ret = wasm.loadingstates_FAILED(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
}

const ManagedResourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_managedresource_free(ptr >>> 0, 1));

export class ManagedResource {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ManagedResource.prototype);
        obj.__wbg_ptr = ptr;
        ManagedResourceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ManagedResourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_managedresource_free(ptr, 0);
    }
    /**
     * @param {any} value
     * @param {Function} dispose_fn
     */
    constructor(value, dispose_fn) {
        const ret = wasm.managedresource_new(value, dispose_fn);
        this.__wbg_ptr = ret >>> 0;
        ManagedResourceFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Function} fn_callback
     * @returns {any}
     */
    use(fn_callback) {
        const ret = wasm.managedresource_use(this.__wbg_ptr, fn_callback);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Promise<any>}
     */
    dispose() {
        const ret = wasm.managedresource_dispose(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get isDisposed() {
        const ret = wasm.managedresource_isDisposed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {any}
     */
    get valueOrNone() {
        const ret = wasm.managedresource_valueOrNone(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.managedresource_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const MatchBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_matchbuilder_free(ptr >>> 0, 1));

export class MatchBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MatchBuilder.prototype);
        obj.__wbg_ptr = ptr;
        MatchBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MatchBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_matchbuilder_free(ptr, 0);
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.matchbuilder_new(value);
        this.__wbg_ptr = ret >>> 0;
        MatchBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} pattern
     * @param {Function} handler
     * @returns {MatchBuilder}
     */
    with(pattern, handler) {
        const ret = wasm.matchbuilder_with(this.__wbg_ptr, pattern, handler);
        return MatchBuilder.__wrap(ret);
    }
    /**
     * @param {Function} default_handler
     * @returns {any}
     */
    otherwise(default_handler) {
        const ret = wasm.matchbuilder_otherwise(this.__wbg_ptr, default_handler);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const MathLibFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mathlib_free(ptr >>> 0, 1));

export class MathLib {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MathLibFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mathlib_free(ptr, 0);
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static isPrime(n) {
        const ret = wasm.mathlib_isPrime(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static nextPrime(n) {
        const ret = wasm.mathlib_nextPrime(n);
        return ret >>> 0;
    }
    /**
     * @param {number} limit
     * @returns {Uint32Array}
     */
    static sieveOfEratosthenes(limit) {
        const ret = wasm.mathlib_sieveOfEratosthenes(limit);
        return ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static gcd(a, b) {
        const ret = wasm.mathlib_gcd(a, b);
        return ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static lcm(a, b) {
        const ret = wasm.mathlib_lcm(a, b);
        return ret;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static factorial(n) {
        const ret = wasm.mathlib_factorial(n);
        return ret;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static fibonacci(n) {
        const ret = wasm.mathlib_fibonacci(n);
        return ret;
    }
    /**
     * @param {number} n
     * @param {number} k
     * @returns {number}
     */
    static binomialCoefficient(n, k) {
        const ret = wasm.mathlib_binomialCoefficient(n, k);
        return ret;
    }
    /**
     * @param {Float64Array} a
     * @param {Float64Array} b
     * @param {number} n
     * @returns {Float64Array}
     */
    static linearSolve(a, b, n) {
        const ret = wasm.mathlib_linearSolve(a, b, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Float64Array} a
     * @param {Float64Array} b
     * @param {number} rows_a
     * @param {number} cols_a
     * @param {number} cols_b
     * @returns {Float64Array}
     */
    static matrixMultiply(a, b, rows_a, cols_a, cols_b) {
        const ret = wasm.mathlib_matrixMultiply(a, b, rows_a, cols_a, cols_b);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Float64Array} a
     * @param {number} n
     * @returns {Float64Array}
     */
    static matrixInverse(a, n) {
        const ret = wasm.mathlib_matrixInverse(a, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Float64Array} matrix
     * @param {number} n
     * @param {number | null} [max_iterations]
     * @returns {Float64Array}
     */
    static eigenvalues(matrix, n, max_iterations) {
        const ret = wasm.mathlib_eigenvalues(matrix, n, isLikeNone(max_iterations) ? 0x100000001 : (max_iterations) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Float64Array} real
     * @param {Float64Array} imag
     * @returns {object}
     */
    static fft(real, imag) {
        const ret = wasm.mathlib_fft(real, imag);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Float64Array} real
     * @param {Float64Array} imag
     * @returns {object}
     */
    static ifft(real, imag) {
        const ret = wasm.mathlib_ifft(real, imag);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} f
     * @param {number} a
     * @param {number} b
     * @param {number} n
     * @returns {number}
     */
    static integrateSimpson(f, a, b, n) {
        const ret = wasm.mathlib_integrateSimpson(f, a, b, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {Function} f
     * @param {number} s
     * @param {number} t_max
     * @param {number} n
     * @returns {number}
     */
    static laplaceTransform(f, s, t_max, n) {
        const ret = wasm.mathlib_laplaceTransform(f, s, t_max, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {Function} f
     * @param {Function} df
     * @param {number} x0
     * @param {number | null} [epsilon]
     * @param {number | null} [max_iterations]
     * @returns {number}
     */
    static newtonRaphson(f, df, x0, epsilon, max_iterations) {
        const ret = wasm.mathlib_newtonRaphson(f, df, x0, !isLikeNone(epsilon), isLikeNone(epsilon) ? 0 : epsilon, isLikeNone(max_iterations) ? 0x100000001 : (max_iterations) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {number} n
     * @param {number} x
     * @returns {number}
     */
    static besselJ(n, x) {
        const ret = wasm.mathlib_besselJ(n, x);
        return ret;
    }
    /**
     * @param {number} n
     * @param {number} x
     * @returns {number}
     */
    static legendrePolynomial(n, x) {
        const ret = wasm.mathlib_legendrePolynomial(n, x);
        return ret;
    }
    /**
     * @param {number} x
     * @returns {object}
     */
    static hyperbolicFunctions(x) {
        const ret = wasm.mathlib_hyperbolicFunctions(x);
        return ret;
    }
    /**
     * @param {number} re1
     * @param {number} im1
     * @param {number} re2
     * @param {number} im2
     * @param {string} operation
     * @returns {object}
     */
    static complexOperations(re1, im1, re2, im2, operation) {
        const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mathlib_complexOperations(re1, im1, re2, im2, ptr0, len0);
        return ret;
    }
    /**
     * @param {Float64Array} data
     * @returns {object}
     */
    static statisticalFunctions(data) {
        const ret = wasm.mathlib_statisticalFunctions(data);
        return ret;
    }
}

const OptionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_option_free(ptr >>> 0, 1));

export class Option {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Option.prototype);
        obj.__wbg_ptr = ptr;
        OptionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OptionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_option_free(ptr, 0);
    }
    /**
     * @param {boolean} some
     * @param {any} value
     */
    constructor(some, value) {
        const ret = wasm.option_new(some, value);
        this.__wbg_ptr = ret >>> 0;
        OptionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean}
     */
    isSome() {
        const ret = wasm.option_isSome(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isNone() {
        const ret = wasm.option_isNone(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {any}
     */
    unwrap() {
        const ret = wasm.option_unwrap(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} default_value
     * @returns {any}
     */
    unwrapOr(default_value) {
        const ret = wasm.option_unwrapOr(this.__wbg_ptr, default_value);
        return ret;
    }
    /**
     * @param {Function} default_fn
     * @returns {any}
     */
    unwrapOrElse(default_fn) {
        const ret = wasm.option_unwrapOrElse(this.__wbg_ptr, default_fn);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} mapper
     * @returns {Option}
     */
    map(mapper) {
        const ret = wasm.option_map(this.__wbg_ptr, mapper);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Option.__wrap(ret[0]);
    }
    /**
     * @param {Function} fn_val
     * @returns {Option}
     */
    andThen(fn_val) {
        const ret = wasm.option_andThen(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Option.__wrap(ret[0]);
    }
    /**
     * @param {Option} optb
     * @returns {Option}
     */
    or(optb) {
        _assertClass(optb, Option);
        const ret = wasm.option_or(this.__wbg_ptr, optb.__wbg_ptr);
        return Option.__wrap(ret);
    }
    /**
     * @param {Function} on_some
     * @param {Function} on_none
     * @returns {any}
     */
    match(on_some, on_none) {
        const ret = wasm.option_match(this.__wbg_ptr, on_some, on_none);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} predicate
     * @returns {Option}
     */
    filter(predicate) {
        const ret = wasm.option_filter(this.__wbg_ptr, predicate);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Option.__wrap(ret[0]);
    }
    /**
     * @param {Function} predicate
     * @returns {boolean}
     */
    exists(predicate) {
        const ret = wasm.option_exists(this.__wbg_ptr, predicate);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.option_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Option}
     */
    clone() {
        const ret = wasm.option_clone(this.__wbg_ptr);
        return Option.__wrap(ret);
    }
}

const OwnedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_owned_free(ptr >>> 0, 1));

export class Owned {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Owned.prototype);
        obj.__wbg_ptr = ptr;
        OwnedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OwnedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_owned_free(ptr, 0);
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.owned_new(value);
        this.__wbg_ptr = ret >>> 0;
        OwnedFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    consume() {
        const ret = wasm.owned_consume(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} fn_callback
     * @returns {any}
     */
    borrow(fn_callback) {
        const ret = wasm.owned_borrow(this.__wbg_ptr, fn_callback);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} fn_callback
     * @returns {any}
     */
    borrowMut(fn_callback) {
        const ret = wasm.owned_borrowMut(this.__wbg_ptr, fn_callback);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {boolean}
     */
    isConsumed() {
        const ret = wasm.owned_isConsumed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isAlive() {
        const ret = wasm.owned_isAlive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.owned_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const PrimitivesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_primitives_free(ptr >>> 0, 1));

export class Primitives {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrimitivesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_primitives_free(ptr, 0);
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateU8(n) {
        const ret = wasm.primitives_validateU8(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateU16(n) {
        const ret = wasm.primitives_validateU16(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateU32(n) {
        const ret = wasm.primitives_validateU32(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateU64(n) {
        const ret = wasm.primitives_validateU64(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateUsize(n) {
        const ret = wasm.primitives_validateU64(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateI8(n) {
        const ret = wasm.primitives_validateI8(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateI16(n) {
        const ret = wasm.primitives_validateI16(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateI32(n) {
        const ret = wasm.primitives_validateI32(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateI64(n) {
        const ret = wasm.primitives_validateI64(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateIsize(n) {
        const ret = wasm.primitives_validateI64(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateF32(n) {
        const ret = wasm.primitives_validateF32(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static validateF64(n) {
        const ret = wasm.primitives_validateF64(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {boolean}
     */
    static isPowerOfTwo(n) {
        const ret = wasm.primitives_isPowerOfTwo(n);
        return ret !== 0;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static nextPowerOfTwo(n) {
        const ret = wasm.primitives_nextPowerOfTwo(n);
        return ret >>> 0;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static leadingZeros(n) {
        const ret = wasm.primitives_leadingZeros(n);
        return ret >>> 0;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static trailingZeros(n) {
        const ret = wasm.primitives_trailingZeros(n);
        return ret >>> 0;
    }
    /**
     * @param {number} n
     * @returns {number}
     */
    static countOnes(n) {
        const ret = wasm.primitives_countOnes(n);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_u8(a, b) {
        const ret = wasm.primitives_add_u8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_u16(a, b) {
        const ret = wasm.primitives_add_u16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_u32(a, b) {
        const ret = wasm.primitives_add_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static add_u64(a, b) {
        const ret = wasm.primitives_add_u64(a, b);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_usize(a, b) {
        const ret = wasm.primitives_add_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_i8(a, b) {
        const ret = wasm.primitives_add_i8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_i16(a, b) {
        const ret = wasm.primitives_add_i16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_i32(a, b) {
        const ret = wasm.primitives_add_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static add_i64(a, b) {
        const ret = wasm.primitives_add_i64(a, b);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static add_isize(a, b) {
        const ret = wasm.primitives_add_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_u8(a, b) {
        const ret = wasm.primitives_sub_u8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_u16(a, b) {
        const ret = wasm.primitives_sub_u16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_u32(a, b) {
        const ret = wasm.primitives_sub_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static sub_u64(a, b) {
        const ret = wasm.primitives_sub_u64(a, b);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_usize(a, b) {
        const ret = wasm.primitives_sub_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_i8(a, b) {
        const ret = wasm.primitives_sub_i8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_i16(a, b) {
        const ret = wasm.primitives_sub_i16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_i32(a, b) {
        const ret = wasm.primitives_sub_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static sub_i64(a, b) {
        const ret = wasm.primitives_sub_i64(a, b);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static sub_isize(a, b) {
        const ret = wasm.primitives_sub_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_u8(a, b) {
        const ret = wasm.primitives_mul_u8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_u16(a, b) {
        const ret = wasm.primitives_mul_u16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_u32(a, b) {
        const ret = wasm.primitives_mul_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static mul_u64(a, b) {
        const ret = wasm.primitives_mul_u64(a, b);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_usize(a, b) {
        const ret = wasm.primitives_mul_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_i8(a, b) {
        const ret = wasm.primitives_mul_i8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_i16(a, b) {
        const ret = wasm.primitives_mul_i16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_i32(a, b) {
        const ret = wasm.primitives_mul_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static mul_i64(a, b) {
        const ret = wasm.primitives_mul_i64(a, b);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static mul_isize(a, b) {
        const ret = wasm.primitives_mul_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_u8(a, b) {
        const ret = wasm.primitives_div_u8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_u16(a, b) {
        const ret = wasm.primitives_div_u16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_u32(a, b) {
        const ret = wasm.primitives_div_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static div_u64(a, b) {
        const ret = wasm.primitives_div_u64(a, b);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_usize(a, b) {
        const ret = wasm.primitives_div_u32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_i8(a, b) {
        const ret = wasm.primitives_div_i8(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_i16(a, b) {
        const ret = wasm.primitives_div_i16(a, b);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_i32(a, b) {
        const ret = wasm.primitives_div_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} a
     * @param {bigint} b
     * @returns {bigint | undefined}
     */
    static div_i64(a, b) {
        const ret = wasm.primitives_div_i64(a, b);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number | undefined}
     */
    static div_isize(a, b) {
        const ret = wasm.primitives_div_i32(a, b);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    static format_bin(n) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_format_bin(n);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    static format_hex(n) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_format_hex(n);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    static format_oct(n) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_format_oct(n);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @param {number} radix
     * @param {number} pad
     * @returns {string}
     */
    static format_int(n, radix, pad) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_format_int(n, radix, pad);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @param {number} digits
     * @returns {string}
     */
    static format_float(n, digits) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_format_float(n, digits);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static u8_to_u16(value) {
        const ret = wasm.primitives_u8_to_u16(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static u8_to_u32(value) {
        const ret = wasm.primitives_u8_to_u16(value);
        return ret >>> 0;
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static u8_to_u64(value) {
        const ret = wasm.primitives_u8_to_u64(value);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static u16_to_u32(value) {
        const ret = wasm.primitives_u16_to_u32(value);
        return ret >>> 0;
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static u16_to_u64(value) {
        const ret = wasm.primitives_u16_to_u64(value);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static u32_to_u64(value) {
        const ret = wasm.primitives_u32_to_u64(value);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static i8_to_i16(value) {
        const ret = wasm.primitives_i8_to_i16(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static i8_to_i32(value) {
        const ret = wasm.primitives_i8_to_i16(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static i8_to_i64(value) {
        const ret = wasm.primitives_i8_to_i64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static i16_to_i32(value) {
        const ret = wasm.primitives_i16_to_i32(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static i16_to_i64(value) {
        const ret = wasm.primitives_i16_to_i64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {bigint}
     */
    static i32_to_i64(value) {
        const ret = wasm.primitives_i32_to_i64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static f32_to_f64(value) {
        const ret = wasm.primitives_f32_to_f64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static u8_to_i8(value) {
        const ret = wasm.primitives_i8_to_u8(value);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static u16_to_i16(value) {
        const ret = wasm.primitives_i16_to_u16(value);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static u32_to_i32(value) {
        const ret = wasm.primitives_i32_to_u32(value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} value
     * @returns {bigint | undefined}
     */
    static u64_to_i64(value) {
        const ret = wasm.primitives_u64_to_i64(value);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static i8_to_u8(value) {
        const ret = wasm.primitives_i8_to_u8(value);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static i16_to_u16(value) {
        const ret = wasm.primitives_i16_to_u16(value);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static i32_to_u32(value) {
        const ret = wasm.primitives_i32_to_u32(value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {bigint} value
     * @returns {bigint | undefined}
     */
    static i64_to_u64(value) {
        const ret = wasm.primitives_i64_to_u64(value);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static f32_to_i32(value) {
        const ret = wasm.primitives_f32_to_i32(value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {bigint | undefined}
     */
    static f64_to_i64(value) {
        const ret = wasm.primitives_f64_to_i64(value);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    static f32_to_u32(value) {
        const ret = wasm.primitives_f32_to_u32(value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {bigint | undefined}
     */
    static f64_to_u64(value) {
        const ret = wasm.primitives_f64_to_u64(value);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static i32_to_f32(value) {
        const ret = wasm.primitives_i32_to_f32(value);
        return ret;
    }
    /**
     * @param {bigint} value
     * @returns {number}
     */
    static i64_to_f64(value) {
        const ret = wasm.primitives_i64_to_f64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {number}
     */
    static u32_to_f32(value) {
        const ret = wasm.primitives_u32_to_f32(value);
        return ret;
    }
    /**
     * @param {bigint} value
     * @returns {number}
     */
    static u64_to_f64(value) {
        const ret = wasm.primitives_u64_to_f64(value);
        return ret;
    }
    /**
     * @param {number} value
     * @returns {string}
     */
    static to_binary(value) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_to_binary(value);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} value
     * @returns {string}
     */
    static to_hex(value) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_to_hex(value);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} value
     * @returns {string}
     */
    static to_octal(value) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.primitives_to_octal(value);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static bitwise_and(a, b) {
        const ret = wasm.primitives_bitwise_and(a, b);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static bitwise_or(a, b) {
        const ret = wasm.primitives_bitwise_or(a, b);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static bitwise_xor(a, b) {
        const ret = wasm.primitives_bitwise_xor(a, b);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @returns {number}
     */
    static bitwise_not(a) {
        const ret = wasm.primitives_bitwise_not(a);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} bits
     * @returns {number}
     */
    static shift_left(a, bits) {
        const ret = wasm.primitives_shift_left(a, bits);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} bits
     * @returns {number}
     */
    static shift_right(a, bits) {
        const ret = wasm.primitives_shift_right(a, bits);
        return ret >>> 0;
    }
    /**
     * @param {number} a
     * @param {number} bits
     * @returns {number}
     */
    static unsigned_shift_right(a, bits) {
        const ret = wasm.primitives_shift_right(a, bits);
        return ret >>> 0;
    }
}

const ReceiverFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_receiver_free(ptr >>> 0, 1));

export class Receiver {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Receiver.prototype);
        obj.__wbg_ptr = ptr;
        ReceiverFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReceiverFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_receiver_free(ptr, 0);
    }
    /**
     * @param {Channel} channel
     */
    constructor(channel) {
        _assertClass(channel, Channel);
        var ptr0 = channel.__destroy_into_raw();
        const ret = wasm.receiver_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        ReceiverFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Promise<any>}
     */
    receive() {
        const ret = wasm.receiver_receive(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    tryReceive() {
        const ret = wasm.receiver_tryReceive(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get closed() {
        const ret = wasm.receiver_closed(this.__wbg_ptr);
        return ret !== 0;
    }
}

const RefFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ref_free(ptr >>> 0, 1));

export class Ref {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ref.prototype);
        obj.__wbg_ptr = ptr;
        RefFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RefFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ref_free(ptr, 0);
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.ref_new(value);
        this.__wbg_ptr = ret >>> 0;
        RefFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get() {
        const ret = wasm.ref_get(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    drop() {
        wasm.ref_drop(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    isActive() {
        const ret = wasm.ref_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ref_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const RefMutFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_refmut_free(ptr >>> 0, 1));

export class RefMut {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RefMut.prototype);
        obj.__wbg_ptr = ptr;
        RefMutFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RefMutFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_refmut_free(ptr, 0);
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.refmut_new(value);
        this.__wbg_ptr = ret >>> 0;
        RefMutFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get() {
        const ret = wasm.refmut_get(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Function} updater
     */
    set(updater) {
        const ret = wasm.refmut_set(this.__wbg_ptr, updater);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    drop() {
        wasm.refmut_drop(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    isActive() {
        const ret = wasm.refmut_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.refmut_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const RegexBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regexbuilder_free(ptr >>> 0, 1));

export class RegexBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegexBuilder.prototype);
        obj.__wbg_ptr = ptr;
        RegexBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RegexBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regexbuilder_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.regexbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        RegexBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {RegexBuilder}
     */
    find_ip_address() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_ip_address(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    find_phone_number() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_phone_number(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    find_date() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_date(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    find_time() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_time(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    and() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_and(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    or() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_or(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} text
     * @returns {RegexBuilder}
     */
    find(text) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_find(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    anything() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_anything(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    something() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_something(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} text
     * @returns {RegexBuilder}
     */
    maybe(text) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_maybe(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    digits() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_digits(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    letters() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_letters(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    whitespace() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_whitespace(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    optional_whitespace() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_optional_whitespace(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    find_email() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_email(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    find_url() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_find_url(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} key
     * @returns {RegexBuilder}
     */
    find_object_with_email(key) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_find_object_with_email(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} key
     * @returns {RegexBuilder}
     */
    find_object_with_id(key) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_find_object_with_id(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} key
     * @returns {RegexBuilder}
     */
    find_objects_that_contains_key(key) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_find_objects_that_contains_key(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {string} prefix
     * @returns {RegexBuilder}
     */
    find_word_that_starts_with(prefix) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_find_word_that_starts_with(ptr, ptr0, len0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    start_capture() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_start_capture(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    end_capture() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_end_capture(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    start_group() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_start_group(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    end_group() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_end_group(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @param {number} min
     * @param {number | null} [max_opt]
     * @returns {RegexBuilder}
     */
    repeat_previous(min, max_opt) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_repeat_previous(ptr, min, isLikeNone(max_opt) ? 0x100000001 : (max_opt) >>> 0);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    repeatZeroOrMore() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_repeatZeroOrMore(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    repeatOneOrMore() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_repeatOneOrMore(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    repeatZeroOrOne() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_repeatZeroOrOne(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    findJsonObject() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_findJsonObject(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    findJsonArray() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_findJsonArray(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    findJsonString() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_findJsonString(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {RegexBuilder}
     */
    findJsonNumber() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexbuilder_findJsonNumber(ptr);
        return RegexBuilder.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    done() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.regexbuilder_done(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    createRegex() {
        const ret = wasm.regexbuilder_createRegex(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    test(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_test(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @param {string} text
     * @returns {any}
     */
    extractMatches(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexbuilder_extractMatches(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const RegexLanguageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regexlanguage_free(ptr >>> 0, 1));

export class RegexLanguage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegexLanguage.prototype);
        obj.__wbg_ptr = ptr;
        RegexLanguageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RegexLanguageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regexlanguage_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.regexbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        RegexLanguageFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {RegexLanguage}
     */
    i_want_to_find() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_i_want_to_find(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {string} text
     * @returns {RegexLanguage}
     */
    find_me(text) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_find_me(ptr, ptr0, len0);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    anything() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_anything(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    something() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_something(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    digits() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_digits(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    an_email() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_an_email(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    a_url() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_a_url(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {string} field
     * @returns {RegexLanguage}
     */
    with_email_in(field) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(field, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_with_email_in(ptr, ptr0, len0);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {string} key
     * @returns {RegexLanguage}
     */
    that_contains_key(key) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_that_contains_key(ptr, ptr0, len0);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    followed_by() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_followed_by(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    or_maybe() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_or_maybe(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {number} count
     * @returns {RegexLanguage}
     */
    that_repeats_at_least(count) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_that_repeats_at_least(ptr, count);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {number} count
     * @returns {RegexLanguage}
     */
    that_repeats_exactly(count) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_that_repeats_exactly(ptr, count);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @param {string} prefix
     * @returns {RegexLanguage}
     */
    words_starting_with(prefix) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_words_starting_with(ptr, ptr0, len0);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    start_capturing() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_start_capturing(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    end_capturing() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_end_capturing(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    json_object() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_json_object(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    json_array() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_json_array(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    json_string() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_json_string(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    json_number() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_json_number(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    that_repeats_zero_or_more() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_that_repeats_zero_or_more(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    that_repeats_one_or_more() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_that_repeats_one_or_more(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    that_is_optional() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_that_is_optional(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    done() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.regexlanguage_done(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    createRegex() {
        const ret = wasm.regexlanguage_createRegex(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    test(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_test(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @param {string} text
     * @returns {any}
     */
    extractMatches(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.regexlanguage_extractMatches(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {RegexLanguage}
     */
    an_ip_address() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_an_ip_address(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    a_phone_number() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_a_phone_number(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    a_date() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_a_date(ptr);
        return RegexLanguage.__wrap(ret);
    }
    /**
     * @returns {RegexLanguage}
     */
    a_time() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.regexlanguage_a_time(ptr);
        return RegexLanguage.__wrap(ret);
    }
}

const ResultWrapperFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_resultwrapper_free(ptr >>> 0, 1));

export class ResultWrapper {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ResultWrapper.prototype);
        obj.__wbg_ptr = ptr;
        ResultWrapperFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ResultWrapperFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resultwrapper_free(ptr, 0);
    }
    /**
     * @param {boolean} is_ok
     * @param {any} value
     * @param {any} error
     */
    constructor(is_ok, value, error) {
        const ret = wasm.resultwrapper_new(is_ok, value, error);
        this.__wbg_ptr = ret >>> 0;
        ResultWrapperFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} value
     * @returns {ResultWrapper}
     */
    static ok(value) {
        const ret = wasm.resultwrapper_ok(value);
        return ResultWrapper.__wrap(ret);
    }
    /**
     * @param {any} error
     * @returns {ResultWrapper}
     */
    static err(error) {
        const ret = wasm.resultwrapper_err(error);
        return ResultWrapper.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    isOk() {
        const ret = wasm.resultwrapper_isOk(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    isErr() {
        const ret = wasm.resultwrapper_isErr(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {any}
     */
    unwrap() {
        const ret = wasm.resultwrapper_unwrap(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    unwrapErr() {
        const ret = wasm.resultwrapper_unwrapErr(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} default_value
     * @returns {any}
     */
    unwrapOr(default_value) {
        const ret = wasm.resultwrapper_unwrapOr(this.__wbg_ptr, default_value);
        return ret;
    }
    /**
     * @param {Function} on_ok
     * @param {Function} on_err
     * @returns {any}
     */
    match(on_ok, on_err) {
        const ret = wasm.resultwrapper_match(this.__wbg_ptr, on_ok, on_err);
        return ret;
    }
    /**
     * @returns {any}
     */
    getError() {
        const ret = wasm.resultwrapper_getError(this.__wbg_ptr);
        return ret;
    }
}

const SearchFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_search_free(ptr >>> 0, 1));

export class Search {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SearchFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_search_free(ptr, 0);
    }
    /**
     * @param {Array<any>} arr
     * @param {any} target
     * @param {Function | null} [comparator]
     * @returns {number}
     */
    static binarySearch(arr, target, comparator) {
        const ret = wasm.search_binarySearch(arr, target, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {any} target
     * @param {Function | null} [comparator]
     * @returns {number}
     */
    static linearSearch(arr, target, comparator) {
        const ret = wasm.search_linearSearch(arr, target, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {Function} predicate
     * @returns {number}
     */
    static findIndex(arr, predicate) {
        const ret = wasm.search_findIndex(arr, predicate);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {Function} predicate
     * @returns {Array<any>}
     */
    static findAll(arr, predicate) {
        const ret = wasm.search_findAll(arr, predicate);
        return ret;
    }
    /**
     * @param {string} haystack
     * @param {string} needle
     * @returns {number}
     */
    static kmpSearch(haystack, needle) {
        const ptr0 = passStringToWasm0(haystack, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(needle, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.search_kmpSearch(ptr0, len0, ptr1, len1);
        return ret;
    }
}

const SenderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sender_free(ptr >>> 0, 1));

export class Sender {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Sender.prototype);
        obj.__wbg_ptr = ptr;
        SenderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SenderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sender_free(ptr, 0);
    }
    /**
     * @param {Channel} channel
     */
    constructor(channel) {
        _assertClass(channel, Channel);
        var ptr0 = channel.__destroy_into_raw();
        const ret = wasm.receiver_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        SenderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} value
     * @returns {Promise<any>}
     */
    send(value) {
        const ret = wasm.sender_send(this.__wbg_ptr, value);
        return ret;
    }
    /**
     * @param {any} value
     * @returns {boolean}
     */
    trySend(value) {
        const ret = wasm.sender_trySend(this.__wbg_ptr, value);
        return ret !== 0;
    }
    close() {
        wasm.channel_close(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    get closed() {
        const ret = wasm.receiver_closed(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SortingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sorting_free(ptr >>> 0, 1));

export class Sorting {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SortingFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sorting_free(ptr, 0);
    }
    /**
     * @param {Array<any>} arr
     * @param {Function | null} [comparator]
     * @returns {Array<any>}
     */
    static quickSort(arr, comparator) {
        const ret = wasm.sorting_quickSort(arr, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {Function | null} [comparator]
     * @returns {Array<any>}
     */
    static mergeSort(arr, comparator) {
        const ret = wasm.sorting_mergeSort(arr, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {Function | null} [comparator]
     * @returns {Array<any>}
     */
    static heapSort(arr, comparator) {
        const ret = wasm.sorting_heapSort(arr, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {Function | null} [comparator]
     * @returns {boolean}
     */
    static isSorted(arr, comparator) {
        const ret = wasm.sorting_isSorted(arr, isLikeNone(comparator) ? 0 : addToExternrefTable0(comparator));
        return ret !== 0;
    }
}

const StrFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_str_free(ptr >>> 0, 1));

export class Str {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Str.prototype);
        obj.__wbg_ptr = ptr;
        StrFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StrFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_str_free(ptr, 0);
    }
    /**
     * @param {string} s
     */
    constructor(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        StrFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} s
     * @returns {Str}
     */
    static fromRaw(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_fromRaw(ptr0, len0);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    static empty() {
        const ret = wasm.str_empty();
        return Str.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    unwrap() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.str_unwrap(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    to_string() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.str_to_string(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    static getToStringTag() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.str_getToStringTag();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.str_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.str_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Str}
     */
    toUpperCase() {
        const ret = wasm.str_toUpperCase(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {Str}
     */
    toLowerCase() {
        const ret = wasm.str_toLowerCase(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @param {string} other
     * @returns {boolean}
     */
    contains(other) {
        const ptr0 = passStringToWasm0(other, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_contains(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @returns {Str}
     */
    trim() {
        const ret = wasm.str_trim(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @param {number} index
     * @returns {string}
     */
    charAt(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.str_charAt(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} start
     * @param {number} end
     * @returns {Str}
     */
    substring(start, end) {
        const ret = wasm.str_substring(this.__wbg_ptr, start, end);
        return Str.__wrap(ret);
    }
    /**
     * @param {Str} other
     * @returns {Str}
     */
    concat(other) {
        _assertClass(other, Str);
        const ret = wasm.str_concat(this.__wbg_ptr, other.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @param {string} prefix
     * @returns {boolean}
     */
    startsWith(prefix) {
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_startsWith(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} suffix
     * @returns {boolean}
     */
    endsWith(suffix) {
        const ptr0 = passStringToWasm0(suffix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_endsWith(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} search_str
     * @param {number | null} [position]
     * @returns {number}
     */
    indexOf(search_str, position) {
        const ptr0 = passStringToWasm0(search_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_indexOf(this.__wbg_ptr, ptr0, len0, isLikeNone(position) ? 0x100000001 : (position) >>> 0);
        return ret;
    }
    /**
     * @param {string} search_str
     * @returns {number}
     */
    lastIndexOf(search_str) {
        const ptr0 = passStringToWasm0(search_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_lastIndexOf(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} separator
     * @returns {Array<any>}
     */
    split(separator) {
        const ptr0 = passStringToWasm0(separator, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.str_split(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} search_value
     * @param {string} replace_value
     * @returns {Str}
     */
    replace(search_value, replace_value) {
        const ptr0 = passStringToWasm0(search_value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(replace_value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.str_replace(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return Str.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    valueOf() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.str_valueOf(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Str} other
     * @returns {boolean}
     */
    equals(other) {
        _assertClass(other, Str);
        const ret = wasm.str_equals(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
}

const StructFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_struct_free(ptr >>> 0, 1));

export class Struct {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Struct.prototype);
        obj.__wbg_ptr = ptr;
        StructFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StructFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_struct_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.struct_empty();
        this.__wbg_ptr = ret >>> 0;
        StructFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {object} obj
     * @returns {Struct}
     */
    static from(obj) {
        const ret = wasm.struct_from(obj);
        return Struct.__wrap(ret);
    }
    /**
     * @returns {Struct}
     */
    static empty() {
        const ret = wasm.struct_empty();
        return Struct.__wrap(ret);
    }
    /**
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.struct_get(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @param {string} key
     * @param {any} value
     * @returns {Struct}
     */
    set(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.struct_set(this.__wbg_ptr, ptr0, len0, value);
        return Struct.__wrap(ret);
    }
    /**
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.struct_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    entries() {
        const ret = wasm.struct_entries(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {object}
     */
    toObject() {
        const ret = wasm.struct_toObject(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} fn_val
     * @returns {Struct}
     */
    map(fn_val) {
        const ret = wasm.struct_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Struct.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {Struct}
     */
    filter(fn_val) {
        const ret = wasm.struct_filter(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Struct.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.struct_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.struct_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const TaskFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_task_free(ptr >>> 0, 1));

export class Task {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Task.prototype);
        obj.__wbg_ptr = ptr;
        TaskFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TaskFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_task_free(ptr, 0);
    }
    /**
     * @param {Promise<any>} promise
     */
    constructor(promise) {
        const ret = wasm.task_new(promise);
        this.__wbg_ptr = ret >>> 0;
        TaskFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} controller
     */
    setController(controller) {
        wasm.task_setController(this.__wbg_ptr, controller);
    }
    /**
     * @returns {Promise<any>}
     */
    run() {
        const ret = wasm.task_run(this.__wbg_ptr);
        return ret;
    }
    cancel() {
        const ret = wasm.task_cancel(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    isCancelled() {
        const ret = wasm.task_isCancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.task_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const TextProcessingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_textprocessing_free(ptr >>> 0, 1));

export class TextProcessing {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TextProcessingFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_textprocessing_free(ptr, 0);
    }
    /**
     * @param {string} text
     * @returns {number}
     */
    static wordCount(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_wordCount(ptr0, len0);
        return ret >>> 0;
    }
    /**
     * @param {string} text
     * @returns {number}
     */
    static sentenceCount(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_sentenceCount(ptr0, len0);
        return ret >>> 0;
    }
    /**
     * @param {string} a
     * @param {string} b
     * @returns {number}
     */
    static levenshteinDistance(a, b) {
        const ptr0 = passStringToWasm0(a, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_levenshteinDistance(ptr0, len0, ptr1, len1);
        return ret >>> 0;
    }
    /**
     * @param {string} text
     * @returns {object}
     */
    static frequencyAnalysis(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_frequencyAnalysis(ptr0, len0);
        return ret;
    }
    /**
     * @param {string} text
     * @returns {string}
     */
    static slugify(text) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.textprocessing_slugify(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} text
     * @returns {Array<any>}
     */
    static extractDates(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_extractDates(ptr0, len0);
        return ret;
    }
    /**
     * @param {string} text
     * @returns {Array<any>}
     */
    static tokenize(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_tokenize(ptr0, len0);
        return ret;
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    static isEmail(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_isEmail(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    static isUrl(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_isUrl(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    static isIPv4(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_isIPv4(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} text
     * @returns {boolean}
     */
    static isIPv6(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_isIPv6(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} word
     * @returns {string}
     */
    static pluralize(word) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(word, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.textprocessing_pluralize(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} text
     * @returns {object}
     */
    static extractEntities(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_extractEntities(ptr0, len0);
        return ret;
    }
    /**
     * @param {string} text
     * @param {string[] | null} [stop_words]
     * @returns {Array<any>}
     */
    static extractKeywords(text, stop_words) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(stop_words) ? 0 : passArrayJsValueToWasm0(stop_words, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.textprocessing_extractKeywords(ptr0, len0, ptr1, len1);
        return ret;
    }
}

const TupleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tuple_free(ptr >>> 0, 1));

export class Tuple {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Tuple.prototype);
        obj.__wbg_ptr = ptr;
        TupleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TupleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tuple_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.tuple_new();
        this.__wbg_ptr = ret >>> 0;
        TupleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Array<any>} array
     * @returns {Tuple}
     */
    static from(array) {
        const ret = wasm.tuple_from(array);
        return Tuple.__wrap(ret);
    }
    /**
     * @param {any} a
     * @param {any} b
     * @returns {Tuple}
     */
    static pair(a, b) {
        const ret = wasm.tuple_pair(a, b);
        return Tuple.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.tuple_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.tuple_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @returns {any}
     */
    get(index) {
        const ret = wasm.tuple_get(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} index
     * @param {any} value
     * @returns {Tuple}
     */
    replace(index, value) {
        const ret = wasm.tuple_replace(this.__wbg_ptr, index, value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Tuple.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    first() {
        const ret = wasm.tuple_first(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    second() {
        const ret = wasm.tuple_second(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {Tuple}
     */
    map(fn_val) {
        const ret = wasm.tuple_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Tuple.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.tuple_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {Array<any>}
     */
    toArray() {
        const ret = wasm.tuple_toArray(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tuple_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ValidationErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_validationerror_free(ptr >>> 0, 1));

export class ValidationError {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ValidationErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_validationerror_free(ptr, 0);
    }
    /**
     * @param {Str} message
     */
    constructor(message) {
        _assertClass(message, Str);
        const ret = wasm.validationerror_new(message.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        ValidationErrorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Str}
     */
    message() {
        const ret = wasm.validationerror_message(this.__wbg_ptr);
        return Str.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    toJS() {
        const ret = wasm.validationerror_toJS(this.__wbg_ptr);
        return ret;
    }
}

const VecFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vec_free(ptr >>> 0, 1));

export class Vec {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vec.prototype);
        obj.__wbg_ptr = ptr;
        VecFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VecFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vec_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.vec_empty();
        this.__wbg_ptr = ret >>> 0;
        VecFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} capacity
     * @returns {Vec}
     */
    static withCapacity(capacity) {
        const ret = wasm.vec_withCapacity(capacity);
        return Vec.__wrap(ret);
    }
    /**
     * @param {Array<any>} array
     * @returns {Vec}
     */
    static from(array) {
        const ret = wasm.vec_from(array);
        return Vec.__wrap(ret);
    }
    /**
     * @returns {Vec}
     */
    static empty() {
        const ret = wasm.vec_empty();
        return Vec.__wrap(ret);
    }
    /**
     * @param {any} fn_val
     * @returns {any}
     */
    find(fn_val) {
        const ret = wasm.vec_find(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} initial
     * @param {any} fn_val
     * @returns {any}
     */
    fold(initial, fn_val) {
        const ret = wasm.vec_fold(this.__wbg_ptr, initial, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {Vec}
     */
    map(fn_val) {
        const ret = wasm.vec_map(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Vec.__wrap(ret[0]);
    }
    /**
     * @param {any} fn_val
     * @returns {Vec}
     */
    filter(fn_val) {
        const ret = wasm.vec_filter(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Vec.__wrap(ret[0]);
    }
    /**
     * @returns {Vec}
     */
    reverse() {
        const ret = wasm.vec_reverse(this.__wbg_ptr);
        return Vec.__wrap(ret);
    }
    /**
     * @param {any} fn_val
     * @returns {boolean}
     */
    all(fn_val) {
        const ret = wasm.vec_all(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @param {any} fn_val
     * @returns {boolean}
     */
    any(fn_val) {
        const ret = wasm.vec_any(this.__wbg_ptr, fn_val);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @param {number} n
     * @returns {Vec}
     */
    take(n) {
        const ret = wasm.vec_take(this.__wbg_ptr, n);
        return Vec.__wrap(ret);
    }
    /**
     * @param {number} n
     * @returns {Vec}
     */
    drop(n) {
        const ret = wasm.vec_drop(this.__wbg_ptr, n);
        return Vec.__wrap(ret);
    }
    /**
     * @param {Vec} other
     * @returns {Vec}
     */
    concat(other) {
        _assertClass(other, Vec);
        const ret = wasm.vec_concat(this.__wbg_ptr, other.__wbg_ptr);
        return Vec.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.vec_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.vec_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} value
     */
    push(value) {
        wasm.vec_push(this.__wbg_ptr, value);
    }
    /**
     * @returns {number | undefined}
     */
    pop() {
        const ret = wasm.vec_pop(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get(index) {
        const ret = wasm.vec_get(this.__wbg_ptr, index);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number} index
     * @param {number} value
     */
    set(index, value) {
        const ret = wasm.vec_set(this.__wbg_ptr, index, value);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {Array<any>}
     */
    toArray() {
        const ret = wasm.vec_toArray(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} fn_val
     */
    forEach(fn_val) {
        const ret = wasm.vec_forEach(this.__wbg_ptr, fn_val);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vec_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_add_883d9432f9188ef2 = function(arg0, arg1) {
        const ret = arg0.add(arg1);
        return ret;
    };
    imports.wbg.__wbg_apply_36be6a55257c99bf = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.apply(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_apply_eb9e9b97497f91e4 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.apply(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_833bed5770ea2041 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.call(arg1, arg2, arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_b8adc8b1d0a0d8eb = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.call(arg1, arg2, arg3, arg4);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_catch_a6e601879b2610e9 = function(arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_entries_c8a90a7ed73e84ce = function(arg0) {
        const ret = arg0.entries();
        return ret;
    };
    imports.wbg.__wbg_error_1004b8c64097413f = function(arg0, arg1) {
        console.error(arg0, arg1);
    };
    imports.wbg.__wbg_eval_e10dc02e9547f640 = function() { return handleError(function (arg0, arg1) {
        const ret = eval(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_finally_b0e84f80db073b6f = function(arg0, arg1) {
        const ret = arg0.finally(arg1);
        return ret;
    };
    imports.wbg.__wbg_for_4ff07bddd743c5e7 = function(arg0, arg1) {
        const ret = Symbol.for(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_from_2a5d3e218e67aa85 = function(arg0) {
        const ret = Array.from(arg0);
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_get_13495dac72693ecc = function(arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
    };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_getindex_2b2e46a17f14612d = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_getindex_b3df41665d83d8f3 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_has_76ca66e2f25d1c49 = function(arg0, arg1) {
        const ret = arg0.has(arg1);
        return ret;
    };
    imports.wbg.__wbg_has_7984823c9e23a04a = function(arg0, arg1) {
        const ret = arg0.has(arg1);
        return ret;
    };
    imports.wbg.__wbg_has_a5ea9117f258a0ec = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Function_07c665125a9d8cfc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Function;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_7f2dcef8f78644a4 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Promise_935168b8f4b49db3 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Promise;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_is_c7481c65e7e5df9e = function(arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_keys_4e7df9a04572b339 = function(arg0) {
        const ret = arg0.keys();
        return ret;
    };
    imports.wbg.__wbg_keys_5c77a08ddc2fb8a6 = function(arg0) {
        const ret = Object.keys(arg0);
        return ret;
    };
    imports.wbg.__wbg_length_238152a0aedbb6e7 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_c67d5e5c3b83737f = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_815(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_5e0be73521bc8c17 = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_a239edaa1dc2968f = function(arg0) {
        const ret = new Set(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_c68d7209be747379 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithargs_ab6ffe8cd6c19c04 = function(arg0, arg1, arg2, arg3) {
        const ret = new Function(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_5ebc38e611488614 = function(arg0) {
        const ret = new Float64Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_bd3de93688d68fbc = function(arg0) {
        const ret = new Uint32Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_c4c419ef0bc8a1f8 = function(arg0) {
        const ret = new Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_ee8e1b95dea9d37c = function(arg0) {
        const ret = new Uint8ClampedArray(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_now_807e54c39636c349 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_receiver_new = function(arg0) {
        const ret = Receiver.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_reject_b3fcf99063186ff7 = function(arg0) {
        const ret = Promise.reject(arg0);
        return ret;
    };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_sender_new = function(arg0) {
        const ret = Sender.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setindex_1ee8d4cff9651c00 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_setindex_293cc136ea1e25f9 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_setindex_c430b78b97744fcc = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2 >>> 0;
    };
    imports.wbg.__wbg_setindex_dcd71eabf405bde1 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_size_531ef01d6a4916c2 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_size_f9d54556ad844dc3 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_str_new = function(arg0) {
        const ret = Str.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_toStringTag_8ca81c3aaed93093 = function() {
        const ret = Symbol.toStringTag;
        return ret;
    };
    imports.wbg.__wbg_toString_66ab719c2a98bdf1 = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_values_53465c57fc8cd691 = function(arg0) {
        const ret = arg0.values();
        return ret;
    };
    imports.wbg.__wbg_values_623d00ad3703dfaa = function(arg0) {
        const ret = arg0.values();
        return ret;
    };
    imports.wbg.__wbg_vec_new = function(arg0) {
        const ret = Vec.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1537 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 60, __wbg_adapter_42);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1539 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 60, __wbg_adapter_45);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        const ret = !arg0;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_symbol = function(arg0) {
        const ret = typeof(arg0) === 'symbol';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('milost_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
