import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class OwnershipError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Owned {
    constructor(value) {
        this._consumed = false;
        this._value = value;
        this._useWasm = isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createOwned(value);
            }
            catch (err) {
                console.warn(`WASM Owned creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static new(value) {
        return new Owned(value);
    }
    static async init() {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
    }
    consume() {
        if (this._useWasm) {
            try {
                const result = this._inner.consume();
                this._consumed = true;
                this._value = null;
                return result;
            }
            catch (err) {
                throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
            }
        }
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
        }
        this._consumed = true;
        const value = this._value;
        this._value = null;
        return value;
    }
    borrow(fn) {
        if (this._useWasm) {
            try {
                return this._inner.borrow((val) => fn(val));
            }
            catch (err) {
                throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
            }
        }
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
    }
    borrowMut(fn) {
        if (this._useWasm) {
            try {
                return this._inner.borrowMut((val) => fn(val));
            }
            catch (err) {
                throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
            }
        }
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
    }
    isConsumed() {
        if (this._useWasm) {
            try {
                return this._inner.isConsumed();
            }
            catch (err) {
                console.warn(`WASM isConsumed failed, using JS fallback: ${err}`);
            }
        }
        return this._consumed;
    }
    isAlive() {
        if (this._useWasm) {
            try {
                return this._inner.isAlive();
            }
            catch (err) {
                console.warn(`WASM isAlive failed, using JS fallback: ${err}`);
            }
        }
        return this._value !== null;
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (err) {
                console.warn(`WASM toString failed, using JS fallback: ${err}`);
            }
        }
        return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Owned._type);
    }
}
Owned._type = "Owned";
//# sourceMappingURL=ownership.js.map