import { ValidationError } from "../core";
import { WasmStr, ensureWasmInitialized, initWasm } from "../wasm/init";
export class Str {
    constructor(inner) {
        this._inner = inner;
    }
    static fromRaw(value) {
        ensureWasmInitialized();
        try {
            return new Str(WasmStr.fromRaw(value));
        }
        catch (error) {
            throw new ValidationError(this.fromRaw(`Failed to create Str: ${error}`));
        }
    }
    static async create(value) {
        await initWasm();
        try {
            const wasmStr = WasmStr.create(value);
            return new Str(wasmStr);
        }
        catch (error) {
            throw new Error(`Failed to create Str: ${error}`);
        }
    }
    unwrap() {
        return this._inner.unwrap();
    }
    toUpperCase() {
        return new Str(this._inner.toUpperCase());
    }
    toLowerCase() {
        return new Str(this._inner.toLowerCase());
    }
    len() {
        return this._inner.len();
    }
    isEmpty() {
        return this._inner.isEmpty();
    }
    trim() {
        return new Str(this._inner.trim());
    }
    equals(other) {
        return this._inner.equals(other._inner);
    }
    compare(other) {
        return this._inner.compare(other._inner);
    }
    toString() {
        return this._inner.unwrap();
    }
    toJSON() {
        return this._inner.toJSON();
    }
}
