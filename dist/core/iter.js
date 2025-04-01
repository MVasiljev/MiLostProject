import { Vec, i32, Str, u32 } from "../types";
import { ValidationError } from "./error";
import { Option } from "../core/option";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Iter {
    constructor(iterable) {
        this.iterable = iterable;
        this._useWasm = isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.Iter(iterable);
            }
            catch (err) {
                console.warn(`WASM Iter creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static from(iterable) {
        return new Iter(iterable);
    }
    static fromVec(vec) {
        return new Iter(vec);
    }
    static empty() {
        return new Iter(Vec.empty());
    }
    static range(start, end, step = i32(1)) {
        const startNum = start;
        const endNum = end;
        const stepNum = step;
        if (isWasmInitialized()) {
            try {
                const wasmModule = getWasmModule();
                wasmModule.checkIterableRange(startNum, endNum, stepNum);
            }
            catch (err) {
                throw new ValidationError(Str.fromRaw("Step cannot be zero"));
            }
        }
        else if (stepNum === 0) {
            throw new ValidationError(Str.fromRaw("Step cannot be zero"));
        }
        return new Iter({
            *[Symbol.iterator]() {
                for (let i = startNum; stepNum > 0 ? i < endNum : i > endNum; i += stepNum) {
                    yield i32(i);
                }
            },
        });
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
    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]();
    }
    next() {
        if (this._useWasm) {
            try {
                const result = this._inner.next();
                if (result.isSome()) {
                    return Option.Some(result.unwrap());
                }
                else {
                    return Option.None();
                }
            }
            catch (err) {
                console.warn(`WASM next failed, using JS fallback: ${err}`);
            }
        }
        const iter = this[Symbol.iterator]();
        const { done, value } = iter.next();
        return done ? Option.None() : Option.Some(value);
    }
    map(f) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let index = 0;
                for (const item of self) {
                    yield f(item, u32(index++));
                }
            },
        });
    }
    filter(predicate) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let index = 0;
                for (const item of self) {
                    if (predicate(item, u32(index++)))
                        yield item;
                }
            },
        });
    }
    take(n) {
        const self = this;
        const nValue = n;
        return new Iter({
            *[Symbol.iterator]() {
                let count = 0;
                for (const item of self) {
                    if (count++ >= nValue)
                        break;
                    yield item;
                }
            },
        });
    }
    skip(n) {
        const self = this;
        const nValue = n;
        return new Iter({
            *[Symbol.iterator]() {
                let count = 0;
                for (const item of self) {
                    if (count++ < nValue)
                        continue;
                    yield item;
                }
            },
        });
    }
    enumerate() {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let index = 0;
                for (const item of self) {
                    yield [u32(index++), item];
                }
            },
        });
    }
    zip(other) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                const it1 = self[Symbol.iterator]();
                const it2 = other[Symbol.iterator]();
                while (true) {
                    const a = it1.next();
                    const b = it2.next();
                    if (a.done || b.done)
                        break;
                    yield [a.value, b.value];
                }
            },
        });
    }
    chain(other) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                yield* self;
                yield* other;
            },
        });
    }
    flatMap(f) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                for (const item of self) {
                    yield* f(item);
                }
            },
        });
    }
    chunks(size) {
        const self = this;
        const sizeValue = size;
        return new Iter({
            *[Symbol.iterator]() {
                let chunk = [];
                for (const item of self) {
                    chunk.push(item);
                    if (chunk.length === sizeValue) {
                        yield Vec.from(chunk);
                        chunk = [];
                    }
                }
                if (chunk.length > 0)
                    yield Vec.from(chunk);
            },
        });
    }
    collect() {
        return Vec.from(this.iterable);
    }
    find(predicate) {
        for (const item of this) {
            if (predicate(item))
                return Option.Some(item);
        }
        return Option.None();
    }
    first() {
        return this.next();
    }
    last() {
        let last;
        let hasValue = false;
        for (const item of this) {
            last = item;
            hasValue = true;
        }
        return hasValue ? Option.Some(last) : Option.None();
    }
    nth(n) {
        let i = 0;
        const nValue = n;
        for (const item of this) {
            if (i++ === nValue)
                return Option.Some(item);
        }
        return Option.None();
    }
    forEach(fn) {
        let index = 0;
        for (const item of this) {
            fn(item, u32(index++));
        }
    }
    all(predicate) {
        for (const item of this) {
            if (!predicate(item))
                return false;
        }
        return true;
    }
    any(predicate) {
        for (const item of this) {
            if (predicate(item))
                return true;
        }
        return false;
    }
    count() {
        if (this._useWasm) {
            try {
                return u32(this._inner.count());
            }
            catch (err) {
                console.warn(`WASM count failed, using JS fallback: ${err}`);
            }
        }
        let count = 0;
        for (const _ of this) {
            count++;
        }
        return u32(count);
    }
    fold(initial, f) {
        let acc = initial;
        let index = 0;
        for (const item of this) {
            acc = f(acc, item, u32(index++));
        }
        return acc;
    }
    dedup() {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let prev;
                let first = true;
                for (const item of self) {
                    if (first || item !== prev) {
                        yield item;
                        prev = item;
                        first = false;
                    }
                }
            },
        });
    }
    dedupBy(keyFn) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let prevKey;
                let first = true;
                for (const item of self) {
                    const key = keyFn(item);
                    if (first || key !== prevKey) {
                        yield item;
                        prevKey = key;
                        first = false;
                    }
                }
            },
        });
    }
    intersperse(separator) {
        const self = this;
        return new Iter({
            *[Symbol.iterator]() {
                let first = true;
                for (const item of self) {
                    if (!first)
                        yield separator;
                    yield item;
                    first = false;
                }
            },
        });
    }
    toString() {
        return Str.fromRaw(`[Iter]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Iter._type);
    }
}
Iter._type = "Iter";
//# sourceMappingURL=iter.js.map