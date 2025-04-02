import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Tuple {
    constructor(items, useWasm = true, existingWasmTuple) {
        this.items = items;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmTuple) {
            this._inner = existingWasmTuple;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                const jsArray = new Array(items.length);
                for (let i = 0; i < items.length; i++) {
                    jsArray[i] = items[i];
                }
                this._inner = wasmModule.Tuple.fromArray(jsArray);
            }
            catch (error) {
                console.warn(`WASM Tuple creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static from(...items) {
        return new Tuple(items);
    }
    static pair(a, b) {
        return Tuple.from(a, b);
    }
    static async create(...items) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new Tuple(items);
    }
    get(index) {
        const i = Number(index);
        if (this._useWasm) {
            try {
                const result = this._inner.get(i);
                return result;
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return this.items[index];
    }
    replace(index, value) {
        const i = Number(index);
        if (this._useWasm) {
            try {
                const newWasmTuple = this._inner.replace(i, value);
                const copy = this.items.slice();
                copy[i] = value;
                return new Tuple(copy, true, newWasmTuple);
            }
            catch (error) {
                console.warn(`WASM replace failed, using JS fallback: ${error}`);
            }
        }
        const copy = this.items.slice();
        copy[Number(index)] = value;
        return new Tuple(copy, this._useWasm);
    }
    first() {
        if (this._useWasm) {
            try {
                return this._inner.first();
            }
            catch (error) {
                console.warn(`WASM first failed, using JS fallback: ${error}`);
            }
        }
        return this.get("0");
    }
    second() {
        if (this._useWasm) {
            try {
                return this._inner.second();
            }
            catch (error) {
                console.warn(`WASM second failed, using JS fallback: ${error}`);
            }
        }
        return this.get("1");
    }
    toArray() {
        if (this._useWasm) {
            try {
                const wasmArray = this._inner.toArray();
                return Array.from(wasmArray);
            }
            catch (error) {
                console.warn(`WASM toArray failed, using JS fallback: ${error}`);
            }
        }
        return [...this.items];
    }
    toString() {
        return Str.fromRaw(`[Tuple ${JSON.stringify(this.items)}]`);
    }
    toJSON() {
        return this.items;
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Tuple._type);
    }
}
Tuple._type = "Tuple";
//# sourceMappingURL=tuple.js.map