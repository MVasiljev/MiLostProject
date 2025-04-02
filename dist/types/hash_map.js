import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class HashMap {
    constructor(entries, useWasm = true, existingWasmMap) {
        this._map = new Map(entries);
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmMap) {
            this._inner = existingWasmMap;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                if (entries) {
                    const entriesArray = Array.from(entries).map(([k, v]) => [k, v]);
                    const jsArray = new Array(entriesArray.length);
                    for (let i = 0; i < entriesArray.length; i++) {
                        const entryArray = new Array(2);
                        entryArray[0] = entriesArray[i][0];
                        entryArray[1] = entriesArray[i][1];
                        jsArray[i] = entryArray;
                    }
                    this._inner = wasmModule.HashMap.fromEntries(jsArray);
                }
                else {
                    this._inner = new wasmModule.HashMap();
                }
            }
            catch (error) {
                console.warn(`WASM HashMap creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static from(entries) {
        return new HashMap(entries);
    }
    static empty() {
        return new HashMap();
    }
    static async create(entries) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new HashMap(entries);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(HashMap._type);
    }
    size() {
        if (this._useWasm) {
            try {
                return u32(this._inner.size());
            }
            catch (error) {
                console.warn(`WASM size failed, using JS fallback: ${error}`);
            }
        }
        return u32(this._map.size);
    }
    isEmpty() {
        if (this._useWasm) {
            try {
                return this._inner.isEmpty();
            }
            catch (error) {
                console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
            }
        }
        return this._map.size === 0;
    }
    get(key) {
        if (this._useWasm) {
            try {
                const value = this._inner.get(key);
                return value === undefined ? undefined : value;
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return this._map.get(key);
    }
    contains(key) {
        if (this._useWasm) {
            try {
                return this._inner.contains(key);
            }
            catch (error) {
                console.warn(`WASM contains failed, using JS fallback: ${error}`);
            }
        }
        return this._map.has(key);
    }
    insert(key, value) {
        if (this._useWasm) {
            try {
                const newWasmMap = this._inner.insert(key, value);
                const newMap = new Map(this._map);
                newMap.set(key, value);
                return new HashMap(newMap, true, newWasmMap);
            }
            catch (error) {
                console.warn(`WASM insert failed, using JS fallback: ${error}`);
            }
        }
        const copy = new Map(this._map);
        copy.set(key, value);
        return new HashMap(copy, this._useWasm);
    }
    remove(key) {
        if (this._useWasm) {
            try {
                const newWasmMap = this._inner.remove(key);
                const newMap = new Map(this._map);
                newMap.delete(key);
                return new HashMap(newMap, true, newWasmMap);
            }
            catch (error) {
                console.warn(`WASM remove failed, using JS fallback: ${error}`);
            }
        }
        const copy = new Map(this._map);
        copy.delete(key);
        return new HashMap(copy, this._useWasm);
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
        return Vec.from(this._map.keys());
    }
    values() {
        if (this._useWasm) {
            try {
                const wasmValues = this._inner.values();
                const values = Array.from(wasmValues);
                return Vec.from(values);
            }
            catch (error) {
                console.warn(`WASM values failed, using JS fallback: ${error}`);
            }
        }
        return Vec.from(this._map.values());
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
        return Vec.from(this._map.entries());
    }
    forEach(callback) {
        this._map.forEach(callback);
    }
    map(fn) {
        const mapped = new Map();
        this._map.forEach((v, k) => mapped.set(k, fn(v, k)));
        return new HashMap(mapped, this._useWasm);
    }
    filter(predicate) {
        const filtered = new Map();
        this._map.forEach((v, k) => {
            if (predicate(v, k))
                filtered.set(k, v);
        });
        return new HashMap(filtered, this._useWasm);
    }
    extend(other) {
        if (this._useWasm && other._useWasm) {
            try {
                const newWasmMap = this._inner.extend(other._inner);
                const merged = new Map(this._map);
                for (const [k, v] of other) {
                    merged.set(k, v);
                }
                return new HashMap(merged, true, newWasmMap);
            }
            catch (error) {
                console.warn(`WASM extend failed, using JS fallback: ${error}`);
            }
        }
        const merged = new Map(this._map);
        for (const [k, v] of other) {
            merged.set(k, v);
        }
        return new HashMap(merged, this._useWasm);
    }
    clear() {
        if (this._useWasm) {
            try {
                const newWasmMap = this._inner.clear();
                return new HashMap(new Map(), true, newWasmMap);
            }
            catch (error) {
                console.warn(`WASM clear failed, using JS fallback: ${error}`);
            }
        }
        return HashMap.empty();
    }
    find(fn) {
        for (const [k, v] of this._map) {
            if (fn(v, k))
                return [k, v];
        }
        return undefined;
    }
    [Symbol.iterator]() {
        return this._map[Symbol.iterator]();
    }
    toJSON() {
        return [...this._map.entries()];
    }
    toArray() {
        if (this._useWasm) {
            try {
                const wasmArray = this._inner.toArray();
                return Array.from(wasmArray).map((entry) => [entry[0], entry[1]]);
            }
            catch (error) {
                console.warn(`WASM toArray failed, using JS fallback: ${error}`);
            }
        }
        return [...this._map.entries()];
    }
    toString() {
        return Str.fromRaw(`[HashMap size=${this._map.size}]`);
    }
}
HashMap._type = "HashMap";
//# sourceMappingURL=hash_map.js.map