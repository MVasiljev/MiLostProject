import { Str } from "./string";
import { Vec } from "./vec";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Struct {
    constructor(fields, useWasm = true, existingWasmStruct) {
        this._fields = Object.freeze({ ...fields });
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmStruct) {
            this._inner = existingWasmStruct;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                const jsObject = Object.create(null);
                for (const key in fields) {
                    if (Object.prototype.hasOwnProperty.call(fields, key)) {
                        jsObject[key] = fields[key];
                    }
                }
                this._inner = wasmModule.Struct.fromObject(jsObject);
            }
            catch (error) {
                console.warn(`WASM Struct creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static from(fields, fallback) {
        const full = { ...fallback(), ...fields };
        return new Struct(full);
    }
    static empty() {
        return new Struct({});
    }
    static async create(fields) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new Struct(fields);
    }
    get(key) {
        if (this._useWasm) {
            try {
                return this._inner.get(String(key));
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return this._fields[key];
    }
    set(key, value) {
        if (this._useWasm) {
            try {
                const newWasmStruct = this._inner.set(String(key), value);
                const newFields = { ...this._fields, [key]: value };
                return new Struct(newFields, true, newWasmStruct);
            }
            catch (error) {
                console.warn(`WASM set failed, using JS fallback: ${error}`);
            }
        }
        return new Struct({ ...this._fields, [key]: value }, this._useWasm);
    }
    keys() {
        if (this._useWasm) {
            try {
                const wasmKeys = this._inner.keys();
                const keys = Array.from(wasmKeys);
                return Vec.from(keys);
            }
            catch (error) {
                console.warn(`WASM keys failed, using JS fallback: ${error}`);
            }
        }
        return Vec.from(Object.keys(this._fields));
    }
    entries() {
        if (this._useWasm) {
            try {
                const wasmEntries = this._inner.entries();
                const entries = Array.from(wasmEntries).map((entry) => [entry[0], entry[1]]);
                return Vec.from(entries);
            }
            catch (error) {
                console.warn(`WASM entries failed, using JS fallback: ${error}`);
            }
        }
        return Vec.from(Object.entries(this._fields));
    }
    toObject() {
        if (this._useWasm) {
            try {
                const wasmObject = this._inner.toObject();
                return Object.fromEntries(Object.entries(wasmObject));
            }
            catch (error) {
                console.warn(`WASM toObject failed, using JS fallback: ${error}`);
            }
        }
        return { ...this._fields };
    }
    toJSON() {
        return this.toObject();
    }
    toString() {
        return Str.fromRaw(`[Struct ${JSON.stringify(this._fields)}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Struct._type);
    }
}
Struct._type = "Struct";
//# sourceMappingURL=struct.js.map