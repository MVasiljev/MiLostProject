import { Str } from "../types/string.js";
import { OwnershipError } from "./ownership.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class RefMut {
    constructor(value) {
        this._active = true;
        this._value = value;
        this._useWasm = isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createRefMut(value);
            }
            catch (err) {
                console.warn(`WASM RefMut creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static new(value) {
        return new RefMut(value);
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
    get() {
        if (this._useWasm) {
            try {
                return this._inner.get();
            }
            catch (err) {
                throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
            }
        }
        if (!this._active) {
            throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
        }
        return this._value;
    }
    set(updater) {
        if (this._useWasm) {
            try {
                this._inner.set((val) => updater(val));
                this._value = updater(this._value);
                return;
            }
            catch (err) {
                throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
            }
        }
        if (!this._active) {
            throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
        }
        this._value = updater(this._value);
    }
    drop() {
        if (this._useWasm) {
            try {
                this._inner.drop();
                this._active = false;
                return;
            }
            catch (err) {
                console.warn(`WASM drop failed, using JS fallback: ${err}`);
            }
        }
        this._active = false;
    }
    isActive() {
        if (this._useWasm) {
            try {
                return this._inner.isActive();
            }
            catch (err) {
                console.warn(`WASM isActive failed, using JS fallback: ${err}`);
            }
        }
        return this._active;
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
        return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(RefMut._type);
    }
}
RefMut._type = "RefMut";
//# sourceMappingURL=refmut.js.map