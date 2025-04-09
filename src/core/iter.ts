import { isWasmInitialized, getWasmModule } from "../initWasm/init";
import { callWasmStaticMethod } from "../initWasm/lib";
import { Vec, i32, Str, u32 } from "../types";
import { initWasm } from "../ui";
import { ValidationError } from "./error";
import { Option } from "./option";

export class Iter<T> implements Iterable<T> {
  private readonly iterable: Iterable<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Iter";

  private constructor(iterable: Iterable<T>) {
    this.iterable = iterable;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.from(iterable);
      } catch (err) {
        console.warn(
          `WASM Iter creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T>(iterable: Iterable<T>): Iter<T> {
    return new Iter(iterable);
  }

  static fromVec<T>(vec: Vec<T>): Iter<T> {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.fromVec === "function") {
          return callWasmStaticMethod(
            "Iter",
            "fromVec",
            [vec],
            () => new Iter<T>(vec)
          );
        }
      } catch (err) {
        console.warn(`WASM fromVec failed, using JS fallback: ${err}`);
      }
    }
    return new Iter<T>(vec);
  }

  static empty<T>(): Iter<T> {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.empty === "function") {
          return callWasmStaticMethod(
            "Iter",
            "empty",
            [],
            () => new Iter<T>([])
          );
        }
      } catch (err) {
        console.warn(`WASM empty failed, using JS fallback: ${err}`);
      }
    }
    return new Iter<T>([]);
  }

  static range(start: i32, end: i32, step: i32 = i32(1)): Iter<i32> {
    const startNum = start as unknown as number;
    const endNum = end as unknown as number;
    const stepNum = step as unknown as number;

    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.checkIterableRange === "function") {
          wasmModule.checkIterableRange(startNum, endNum, stepNum);
        }

        if (typeof wasmModule.range === "function") {
          return callWasmStaticMethod(
            "Iter",
            "range",
            [start, end, step],
            () => {
              if (stepNum === 0) {
                throw new ValidationError(Str.fromRaw("Step cannot be zero"));
              }
              return new Iter<i32>(
                Iter.createRangeIterator(startNum, endNum, stepNum)
              );
            }
          );
        }
      } catch (err) {
        if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          String(err.message).includes("Step cannot be zero")
        ) {
          throw new ValidationError(Str.fromRaw("Step cannot be zero"));
        }
        console.warn(`WASM range failed, using JS fallback: ${err}`);
      }
    }

    if (stepNum === 0) {
      throw new ValidationError(Str.fromRaw("Step cannot be zero"));
    }

    return new Iter<i32>(Iter.createRangeIterator(startNum, endNum, stepNum));
  }

  private static createRangeIterator(
    start: number,
    end: number,
    step: number
  ): Iterable<i32> {
    return {
      *[Symbol.iterator]() {
        for (let i = start; step > 0 ? i < end : i > end; i += step) {
          yield i32(i);
        }
      },
    };
  }

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]();
  }

  next(): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.next();
        return result;
      } catch (err) {
        console.warn(`WASM next failed, using JS fallback: ${err}`);
      }
    }

    const iter = this[Symbol.iterator]();
    const { done, value } = iter.next();
    return done ? Option.None<T>() : Option.Some(value);
  }

  map<U>(f: (item: T, index: u32) => U): Iter<U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.map(f);
        return result;
      } catch (err) {
        console.warn(`WASM map failed, using JS fallback: ${err}`);
      }
    }

    const self = this;
    return new Iter<U>({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          yield f(item, u32(index++));
        }
      },
    });
  }

  filter(predicate: (item: T, index: u32) => boolean): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.filter(predicate);
        return result;
      } catch (err) {
        console.warn(`WASM filter failed, using JS fallback: ${err}`);
      }
    }

    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          if (predicate(item, u32(index++))) yield item;
        }
      },
    });
  }

  take(n: u32): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.take(n);
        return result;
      } catch (err) {
        console.warn(`WASM take failed, using JS fallback: ${err}`);
      }
    }

    const self = this;
    const nValue = n as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let count = 0;
        for (const item of self) {
          if (count++ >= nValue) break;
          yield item;
        }
      },
    });
  }

  skip(n: u32): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.skip(n);
        return result;
      } catch (err) {
        console.warn(`WASM skip failed, using JS fallback: ${err}`);
      }
    }

    const self = this;
    const nValue = n as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let count = 0;
        for (const item of self) {
          if (count++ < nValue) continue;
          yield item;
        }
      },
    });
  }

  enumerate(): Iter<[u32, T]> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          yield [u32(index++), item] as [u32, T];
        }
      },
    });
  }

  zip<U>(other: Iterable<U>): Iter<[T, U]> {
    const self = this;
    return new Iter<[T, U]>({
      *[Symbol.iterator]() {
        const it1 = self[Symbol.iterator]();
        const it2 = other[Symbol.iterator]();
        while (true) {
          const a = it1.next();
          const b = it2.next();
          if (a.done || b.done) break;
          yield [a.value, b.value];
        }
      },
    });
  }

  chain(other: Iterable<T>): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        yield* self;
        yield* other;
      },
    });
  }

  flatMap<U>(f: (item: T) => Iterable<U>): Iter<U> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        for (const item of self) {
          yield* f(item);
        }
      },
    });
  }

  chunks(size: u32): Iter<Vec<T>> {
    const self = this;
    const sizeValue = size as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let chunk: T[] = [];
        for (const item of self) {
          chunk.push(item);
          if (chunk.length === sizeValue) {
            yield Vec.from(chunk);
            chunk = [];
          }
        }
        if (chunk.length > 0) yield Vec.from(chunk);
      },
    });
  }

  collect(): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.collect();
        return result;
      } catch (err) {
        console.warn(`WASM collect failed, using JS fallback: ${err}`);
      }
    }

    return Vec.from(Array.from(this));
  }

  find(predicate: (item: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.find(predicate);
        return result;
      } catch (err) {
        console.warn(`WASM find failed, using JS fallback: ${err}`);
      }
    }

    for (const item of this) {
      if (predicate(item)) return Option.Some(item);
    }
    return Option.None();
  }

  first(): Option<T> {
    return this.next();
  }

  last(): Option<T> {
    let last: T | undefined;
    let hasValue = false;
    for (const item of this) {
      last = item;
      hasValue = true;
    }
    return hasValue ? Option.Some(last!) : Option.None();
  }

  nth(n: u32): Option<T> {
    let i = 0;
    const nValue = n as unknown as number;
    for (const item of this) {
      if (i++ === nValue) return Option.Some(item);
    }
    return Option.None();
  }

  forEach(fn: (item: T, index: u32) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach(fn);
        return;
      } catch (err) {
        console.warn(`WASM forEach failed, using JS fallback: ${err}`);
      }
    }

    let index = 0;
    for (const item of this) {
      fn(item, u32(index++));
    }
  }

  all(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.all(predicate);
      } catch (err) {
        console.warn(`WASM all failed, using JS fallback: ${err}`);
      }
    }

    for (const item of this) {
      if (!predicate(item)) return false;
    }
    return true;
  }

  any(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.any(predicate);
      } catch (err) {
        console.warn(`WASM any failed, using JS fallback: ${err}`);
      }
    }

    for (const item of this) {
      if (predicate(item)) return true;
    }
    return false;
  }

  count(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.count();
      } catch (err) {
        console.warn(`WASM count failed, using JS fallback: ${err}`);
      }
    }

    let count = 0;
    for (const _ of this) {
      count++;
    }
    return u32(count);
  }

  fold<R>(initial: R, f: (acc: R, item: T, index: u32) => R): R {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.fold(initial, f);
      } catch (err) {
        console.warn(`WASM fold failed, using JS fallback: ${err}`);
      }
    }

    let acc = initial;
    let index = 0;
    for (const item of this) {
      acc = f(acc, item, u32(index++));
    }
    return acc;
  }

  dedup(): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let prev: T | undefined;
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

  dedupBy<K>(keyFn: (item: T) => K): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let prevKey: K | undefined;
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

  intersperse(separator: T): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let first = true;
        for (const item of self) {
          if (!first) yield separator;
          yield item;
          first = false;
        }
      },
    });
  }

  toString(): Str {
    return Str.fromRaw(`[Iter]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Iter._type);
  }
}
