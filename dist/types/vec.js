import { Option } from "../core/option";
import { u32 } from "../types/primitives";
import { Str } from "../types/string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Vec {
    constructor(items = [], useWasm = true, existingWasmVec) {
        this._items = [...items];
        this._useWasm = useWasm && isWasmInitialized();
        this._isNumeric = items.every((item) => typeof item === "number");
        if (existingWasmVec) {
            this._inner = existingWasmVec;
        }
        else if (this._useWasm && this._isNumeric) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.Vec();
                for (const item of items) {
                    this._inner.push(item);
                }
            }
            catch (error) {
                console.warn(`WASM Vec creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
        else if (this._useWasm && !this._isNumeric) {
            this._useWasm = false;
        }
    }
    static new() {
        return new Vec();
    }
    static empty() {
        return Vec.new();
    }
    static from(iterable) {
        return new Vec([...iterable]);
    }
    static async withCapacity(capacity) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        const wasmInitialized = isWasmInitialized();
        if (wasmInitialized) {
            try {
                const wasmModule = getWasmModule();
                const wasmVec = wasmModule.Vec.withCapacity(capacity);
                return new Vec([], true, wasmVec);
            }
            catch (error) {
                console.warn(`WASM withCapacity failed, using JS fallback: ${error}`);
            }
        }
        return new Vec();
    }
    static async create(items = []) {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new Vec(items);
    }
    len() {
        if (this._useWasm && this._isNumeric) {
            try {
                return u32(this._inner.len());
            }
            catch (error) {
                console.warn(`WASM len failed, using JS fallback: ${error}`);
            }
        }
        return u32(this._items.length);
    }
    isEmpty() {
        if (this._useWasm && this._isNumeric) {
            try {
                return this._inner.isEmpty();
            }
            catch (error) {
                console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
            }
        }
        return this._items.length === 0;
    }
    get(index) {
        const i = Number(index);
        if (this._useWasm && this._isNumeric) {
            try {
                const result = this._inner.get(i);
                return result !== undefined
                    ? Option.Some(result)
                    : Option.None();
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return i >= 0 && i < this._items.length
            ? Option.Some(this._items[i])
            : Option.None();
    }
    set(index, value) {
        const i = Number(index);
        if (i < 0 || i >= this._items.length) {
            return this;
        }
        const newItems = [...this._items];
        newItems[i] = value;
        if (this._useWasm && this._isNumeric && typeof value === "number") {
            try {
                const wasmModule = getWasmModule();
                const newWasmVec = new wasmModule.Vec();
                for (let j = 0; j < newItems.length; j++) {
                    newWasmVec.push(newItems[j]);
                }
                return new Vec(newItems, this._useWasm, newWasmVec);
            }
            catch (error) {
                console.warn(`WASM set operation failed, using JS fallback: ${error}`);
            }
        }
        return new Vec(newItems, this._useWasm && this._isNumeric);
    }
    push(item) {
        const newItems = [...this._items, item];
        const isNumeric = this._isNumeric && typeof item === "number";
        if (this._useWasm && isNumeric) {
            try {
                const wasmModule = getWasmModule();
                const newWasmVec = new wasmModule.Vec();
                for (const value of this._items) {
                    newWasmVec.push(value);
                }
                newWasmVec.push(item);
                return new Vec(newItems, this._useWasm, newWasmVec);
            }
            catch (error) {
                console.warn(`WASM push failed, using JS fallback: ${error}`);
            }
        }
        return new Vec(newItems, this._useWasm && isNumeric);
    }
    pop() {
        if (this.isEmpty())
            return [this, Option.None()];
        const lastItem = this._items[this._items.length - 1];
        const newItems = this._items.slice(0, -1);
        if (this._useWasm && this._isNumeric) {
            try {
                const wasmModule = getWasmModule();
                const newWasmVec = new wasmModule.Vec();
                for (let i = 0; i < newItems.length; i++) {
                    newWasmVec.push(newItems[i]);
                }
                return [
                    new Vec(newItems, this._useWasm, newWasmVec),
                    Option.Some(lastItem),
                ];
            }
            catch (error) {
                console.warn(`WASM pop failed, using JS fallback: ${error}`);
            }
        }
        return [
            new Vec(newItems, this._useWasm && this._isNumeric),
            Option.Some(lastItem),
        ];
    }
    toArray() {
        if (this._useWasm && this._isNumeric) {
            try {
                const wasmArray = this._inner.toArray();
                return Array.from(wasmArray);
            }
            catch (error) {
                console.warn(`WASM toArray failed, using JS fallback: ${error}`);
            }
        }
        return [...this._items];
    }
    find(predicate) {
        for (const item of this._items) {
            if (predicate(item)) {
                return Option.Some(item);
            }
        }
        return Option.None();
    }
    fold(initial, fn) {
        let acc = initial;
        let index = 0;
        for (const item of this._items) {
            acc = fn(acc, item, u32(index++));
        }
        return acc;
    }
    map(fn) {
        const result = [];
        let index = 0;
        for (const item of this._items) {
            result.push(fn(item, u32(index++)));
        }
        return new Vec(result, this._useWasm && result.every((item) => typeof item === "number"));
    }
    filter(predicate) {
        const result = [];
        let index = 0;
        for (const item of this._items) {
            if (predicate(item, u32(index++))) {
                result.push(item);
            }
        }
        return new Vec(result, this._useWasm && this._isNumeric);
    }
    reverse() {
        const result = [...this._items].reverse();
        return new Vec(result, this._useWasm && this._isNumeric);
    }
    all(predicate) {
        for (const item of this._items) {
            if (!predicate(item)) {
                return false;
            }
        }
        return true;
    }
    any(predicate) {
        for (const item of this._items) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }
    take(n) {
        const count = Math.min(Number(n), this._items.length);
        const result = this._items.slice(0, count);
        return new Vec(result, this._useWasm && this._isNumeric);
    }
    drop(n) {
        const count = Math.min(Number(n), this._items.length);
        const result = this._items.slice(count);
        return new Vec(result, this._useWasm && this._isNumeric);
    }
    concat(other) {
        const result = [...this._items, ...other.toArray()];
        const isNumeric = this._isNumeric && other.all((item) => typeof item === "number");
        return new Vec(result, this._useWasm && isNumeric);
    }
    [Symbol.iterator]() {
        return this._items[Symbol.iterator]();
    }
    toString() {
        return Str.fromRaw(`[Vec len=${this._items.length}]`);
    }
    toJSON() {
        return this.toArray();
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Vec");
    }
}
//# sourceMappingURL=vec.js.map