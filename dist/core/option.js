import { Str, Vec } from "../types";
import { ValidationError } from "./error";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Option {
    constructor(some, value) {
        this._some = some;
        this._value = value;
        this._useWasm = isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                if (some) {
                    this._inner = wasmModule.createSome(value);
                }
                else {
                    this._inner = wasmModule.createNone();
                }
            }
            catch (err) {
                console.warn(`WASM Option creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static Some(value) {
        if (value === null || value === undefined) {
            throw new ValidationError(Str.fromRaw("Cannot create Some with null or undefined value"));
        }
        return new Option(true, value);
    }
    static None() {
        return new Option(false);
    }
    static from(value) {
        return value !== null && value !== undefined
            ? Option.Some(value)
            : Option.None();
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
    isSome() {
        if (this._useWasm) {
            try {
                return this._inner.isSome();
            }
            catch (err) {
                console.warn(`WASM isSome failed, using JS fallback: ${err}`);
            }
        }
        return this._some;
    }
    isNone() {
        if (this._useWasm) {
            try {
                return this._inner.isNone();
            }
            catch (err) {
                console.warn(`WASM isNone failed, using JS fallback: ${err}`);
            }
        }
        return !this._some;
    }
    expect(message) {
        if (this._some && this._value !== undefined) {
            return this._value;
        }
        throw new ValidationError(message);
    }
    unwrap() {
        if (this._useWasm) {
            try {
                return this._inner.unwrap();
            }
            catch (err) {
                throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
            }
        }
        if (this._some && this._value !== undefined) {
            return this._value;
        }
        throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
    }
    unwrapOr(defaultValue) {
        if (this._useWasm) {
            try {
                return this._inner.unwrapOr(defaultValue);
            }
            catch (err) {
                console.warn(`WASM unwrapOr failed, using JS fallback: ${err}`);
            }
        }
        return this._some && this._value !== undefined ? this._value : defaultValue;
    }
    unwrapOrElse(fn) {
        return this._some && this._value !== undefined ? this._value : fn();
    }
    map(fn) {
        if (this._some && this._value !== undefined) {
            return Option.Some(fn(this._value));
        }
        return Option.None();
    }
    andThen(fn) {
        if (this._some && this._value !== undefined) {
            return fn(this._value);
        }
        return Option.None();
    }
    or(optb) {
        return this._some ? this : optb;
    }
    match(onSome, onNone) {
        if (this._useWasm) {
            try {
                return this._inner.match((val) => onSome(val), () => onNone());
            }
            catch (err) {
                console.warn(`WASM match failed, using JS fallback: ${err}`);
            }
        }
        return this._some && this._value !== undefined
            ? onSome(this._value)
            : onNone();
    }
    filter(predicate) {
        if (this._useWasm) {
            try {
                const result = this._inner.filter((val) => predicate(val));
                return result.isSome() ? this : Option.None();
            }
            catch (err) {
                console.warn(`WASM filter failed, using JS fallback: ${err}`);
            }
        }
        if (this._some && this._value !== undefined && predicate(this._value)) {
            return this;
        }
        return Option.None();
    }
    exists(predicate) {
        if (this._useWasm) {
            try {
                return this._inner.exists((val) => predicate(val));
            }
            catch (err) {
                console.warn(`WASM exists failed, using JS fallback: ${err}`);
            }
        }
        return this._some && this._value !== undefined && predicate(this._value);
    }
    static firstSome(...options) {
        return Vec.from(options)
            .find((option) => option.isSome())
            .unwrapOr(Option.None());
    }
    static all(options) {
        const values = [];
        for (const option of options) {
            if (option.isNone()) {
                return Option.None();
            }
            values.push(option.unwrap());
        }
        return Option.Some(Vec.from(values));
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
        return this._some
            ? Str.fromRaw(`[Some ${this._value}]`)
            : Str.fromRaw("[None]");
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Option._type);
    }
}
Option._type = "Option";
//# sourceMappingURL=option.js.map