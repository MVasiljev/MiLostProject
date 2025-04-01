import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Str {
    constructor(value, useWasm = true) {
        this._jsValue = value;
        this._useWasm = useWasm && isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.Str(value);
            }
            catch (error) {
                console.warn(`WASM string creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static fromRaw(value) {
        return new Str(value);
    }
    static async create(value) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new Str(value);
    }
    unwrap() {
        if (this._useWasm) {
            try {
                return this._inner.unwrap();
            }
            catch (error) {
                console.warn(`WASM unwrap failed, using JS fallback: ${error}`);
                return this._jsValue;
            }
        }
        return this._jsValue;
    }
    toUpperCase() {
        if (this._useWasm) {
            try {
                const upper = this._inner.to_uppercase();
                return new Str(upper.unwrap(), true);
            }
            catch (error) {
                console.warn(`WASM toUpperCase failed, using JS fallback: ${error}`);
            }
        }
        return new Str(this._jsValue.toUpperCase(), false);
    }
    toLowerCase() {
        if (this._useWasm) {
            try {
                const lower = this._inner.to_lowercase();
                return new Str(lower.unwrap(), true);
            }
            catch (error) {
                console.warn(`WASM toLowerCase failed, using JS fallback: ${error}`);
            }
        }
        return new Str(this._jsValue.toLowerCase(), false);
    }
    len() {
        if (this._useWasm) {
            try {
                return this._inner.len();
            }
            catch (error) {
                console.warn(`WASM len failed, using JS fallback: ${error}`);
            }
        }
        return this._jsValue.length;
    }
    isEmpty() {
        if (this._useWasm) {
            try {
                return this._inner.is_empty();
            }
            catch (error) {
                console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
            }
        }
        return this._jsValue.length === 0;
    }
    trim() {
        if (this._useWasm) {
            try {
                const trimmed = this._inner.trim();
                return new Str(trimmed.unwrap(), true);
            }
            catch (error) {
                console.warn(`WASM trim failed, using JS fallback: ${error}`);
            }
        }
        return new Str(this._jsValue.trim(), false);
    }
    equals(other) {
        return this.unwrap() === other.unwrap();
    }
    compare(other) {
        const thisStr = this.unwrap();
        const otherStr = other.unwrap();
        if (thisStr < otherStr)
            return -1;
        if (thisStr > otherStr)
            return 1;
        return 0;
    }
    contains(substr) {
        if (this._useWasm) {
            try {
                return this._inner.contains(substr);
            }
            catch (error) {
                console.warn(`WASM contains failed, using JS fallback: ${error}`);
            }
        }
        return this._jsValue.includes(substr);
    }
    toString() {
        return this.unwrap();
    }
    toJSON() {
        return JSON.stringify(this.unwrap());
    }
}
//# sourceMappingURL=string.js.map