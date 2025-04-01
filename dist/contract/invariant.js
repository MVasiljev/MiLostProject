import { Str } from "../types/string.js";
import { ContractError } from "./contract.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Invariant {
    constructor(value, invariant, errorMessage = Str.fromRaw("Invariant violated")) {
        this._value = value;
        this._invariantFn = invariant;
        this._errorMsg = errorMessage;
        this._useWasm = isWasmInitialized();
        // First check with JS implementation to catch errors early
        if (!invariant(value)) {
            throw new ContractError(errorMessage);
        }
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createInvariant(value, this._invariantFn, this._errorMsg.toString());
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "name" in err &&
                    err.name === "ContractError" &&
                    "message" in err) {
                    throw new ContractError(Str.fromRaw(String(err.message)));
                }
                console.warn(`WASM Invariant creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
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
    static new(value, invariant, errorMessage) {
        return new Invariant(value, invariant, errorMessage);
    }
    get() {
        if (this._useWasm) {
            try {
                return this._inner.get();
            }
            catch (err) {
                console.warn(`WASM get failed, using JS fallback: ${err}`);
            }
        }
        return this._value;
    }
    map(fn, newInvariant, errorMessage) {
        if (this._useWasm) {
            try {
                const mappedInvariant = this._inner.map(fn, newInvariant, errorMessage?.toString());
                // We need to wrap the WASM invariant in our TypeScript class
                return new Invariant(mappedInvariant.get(), newInvariant, errorMessage);
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "name" in err &&
                    err.name === "ContractError" &&
                    "message" in err) {
                    throw new ContractError(Str.fromRaw(String(err.message)));
                }
                console.warn(`WASM map failed, using JS fallback: ${err}`);
            }
        }
        // JS fallback
        const newValue = fn(this._value);
        return Invariant.new(newValue, newInvariant, errorMessage);
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
        return Str.fromRaw(`[Invariant]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Invariant._type);
    }
}
Invariant._type = "Invariant";
//# sourceMappingURL=invariant.js.map