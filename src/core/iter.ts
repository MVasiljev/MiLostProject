/**
 * Iterator type implementation for MiLost
 *
 * Provides a type-safe, flexible iterator type with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Vec, i32, u32 } from "../types/index.js";
import { Str } from "../types/string.js";
import { ValidationError } from "./error.js";
import { Option } from "./option.js";

/**
 * Module definition for Iter WASM implementation
 */
const iterModule: WasmModule = {
  name: "Iter",

  initialize(wasmModule: any) {
    console.log("Initializing Iter module with WASM...");

    if (typeof wasmModule.Iter === "object") {
      console.log("Found Iter module in WASM");

      const staticMethods = [
        "from",
        "fromVec",
        "empty",
        "range",
        "checkIterableRange",
      ];

      const instanceMethods = [
        "next",
        "map",
        "filter",
        "take",
        "skip",
        "enumerate",
        "zip",
        "chain",
        "flatMap",
        "chunks",
        "collect",
        "find",
        "first",
        "last",
        "nth",
        "forEach",
        "all",
        "any",
        "count",
        "fold",
        "dedup",
        "dedupBy",
        "intersperse",
      ];

      staticMethods.forEach((method) => {
        if (typeof wasmModule.Iter[method] === "function") {
          console.log(`Found static method: Iter.${method}`);
        } else {
          console.warn(`Missing static method: Iter.${method}`);
        }
      });

      try {
        const sampleIter = wasmModule.Iter.empty();
        instanceMethods.forEach((method) => {
          if (typeof sampleIter[method] === "function") {
            console.log(`Found instance method: Iter.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Iter.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Iter instance:", error);
      }
    } else {
      console.warn("Iter module not found in WASM module");
      throw new Error("Required WASM functions not found for Iter module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Iter module");
  },
};

registerModule(iterModule);

export class Iter<T> implements Iterable<T> {
  private readonly iterable: Iterable<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Iter";

  private constructor(iterable: Iterable<T>) {
    this.iterable = iterable;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Iter) {
      try {
        this._inner = wasmModule.Iter.from(iterable);
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Iter creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create an Iter from an iterable
   * @param iterable The source iterable
   * @returns A new Iter instance
   */
  static from<T>(iterable: Iterable<T>): Iter<T> {
    return new Iter(iterable);
  }

  /**
   * Create an Iter from a Vec
   * @param vec The source Vec
   * @returns A new Iter instance
   */
  static fromVec<T>(vec: Vec<T>): Iter<T> {
    const wasmModule = getWasmModule();
    if (wasmModule?.Iter?.fromVec) {
      try {
        return wasmModule.Iter.fromVec(vec);
      } catch (err) {
        console.warn(`WASM fromVec failed, using JS fallback: ${err}`);
      }
    }
    return new Iter<T>(vec);
  }

  /**
   * Create an empty Iter
   * @returns An empty Iter
   */
  static empty<T>(): Iter<T> {
    const wasmModule = getWasmModule();
    if (wasmModule?.Iter?.empty) {
      try {
        return wasmModule.Iter.empty();
      } catch (err) {
        console.warn(`WASM empty failed, using JS fallback: ${err}`);
      }
    }
    return new Iter<T>([]);
  }

  /**
   * Create an Iter of integers in a range
   * @param start Starting value
   * @param end Ending value (exclusive)
   * @param step Step size, defaults to 1
   * @returns An Iter of integers
   */
  static range(start: i32, end: i32, step: i32 = i32(1)): Iter<i32> {
    const startNum = start as unknown as number;
    const endNum = end as unknown as number;
    const stepNum = step as unknown as number;

    const wasmModule = getWasmModule();
    if (wasmModule?.Iter?.range) {
      try {
        if (typeof wasmModule.Iter.checkIterableRange === "function") {
          wasmModule.Iter.checkIterableRange(startNum, endNum, stepNum);
        }

        return wasmModule.Iter.range(start, end, step);
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

  /**
   * Create a range iterator
   * @param start Starting value
   * @param end Ending value
   * @param step Step size
   * @returns An iterable of integers
   */
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

  /**
   * Implement iterator protocol
   * @returns An iterator for the Iter
   */
  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]();
  }

  /**
   * Get the next value in the iterator
   * @returns An Option containing the next value
   */
  next(): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.next();
      } catch (err) {
        console.warn(`WASM next failed, using JS fallback: ${err}`);
      }
    }

    const iter = this[Symbol.iterator]();
    const { done, value } = iter.next();
    return done ? Option.None<T>() : Option.Some(value);
  }

  /**
   * Transform each element of the iterator
   * @param f Transformation function
   * @returns A new Iter with transformed elements
   */
  map<U>(f: (item: T, index: u32) => U): Iter<U> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.map(f);
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

  /**
   * Filter elements of the iterator
   * @param predicate Filtering function
   * @returns A new Iter with filtered elements
   */
  filter(predicate: (item: T, index: u32) => boolean): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.filter(predicate);
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

  /**
   * Take the first n elements
   * @param n Number of elements to take
   * @returns A new Iter with the first n elements
   */
  take(n: u32): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.take(n);
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

  /**
   * Skip the first n elements
   * @param n Number of elements to skip
   * @returns A new Iter without the first n elements
   */
  skip(n: u32): Iter<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.skip(n);
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

  /**
   * Enumerate the iterator with indices
   * @returns A new Iter of tuples with index and value
   */
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

  /**
   * Zip this iterator with another
   * @param other Another iterable
   * @returns A new Iter of paired elements
   */
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

  /**
   * Chain another iterator to this one
   * @param other Another iterable
   * @returns A new Iter combining both iterators
   */
  chain(other: Iterable<T>): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        yield* self;
        yield* other;
      },
    });
  }

  /**
   * Flat map the iterator
   * @param f Mapping function returning an iterable
   * @returns A new Iter with flattened results
   */
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

  /**
   * Collect iterator into chunks
   * @param size Size of each chunk
   * @returns A new Iter of Vec chunks
   */
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

  /**
   * Collect iterator into a Vec
   * @returns A Vec containing all elements
   */
  collect(): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.collect();
      } catch (err) {
        console.warn(`WASM collect failed, using JS fallback: ${err}`);
      }
    }

    return Vec.from(Array.from(this));
  }

  /**
   * Find first element matching a predicate
   * @param predicate Matching function
   * @returns An Option with the first matching element
   */
  find(predicate: (item: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.find(predicate);
      } catch (err) {
        console.warn(`WASM find failed, using JS fallback: ${err}`);
      }
    }

    for (const item of this) {
      if (predicate(item)) return Option.Some(item);
    }
    return Option.None();
  }

  /**
   * Get the first element
   * @returns An Option with the first element
   */
  first(): Option<T> {
    return this.next();
  }

  /**
   * Get the last element
   * @returns An Option with the last element
   */
  last(): Option<T> {
    let last: T | undefined;
    let hasValue = false;
    for (const item of this) {
      last = item;
      hasValue = true;
    }
    return hasValue ? Option.Some(last!) : Option.None();
  }

  /**
   * Get the nth element
   * @param n Index of the element
   * @returns An Option with the nth element
   */
  nth(n: u32): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.nth(n);
      } catch (err) {
        console.warn(`WASM nth failed, using JS fallback: ${err}`);
      }
    }

    const nValue = n as unknown as number;
    let index = 0;
    for (const item of this) {
      if (index++ === nValue) {
        return Option.Some(item);
      }
    }
    return Option.None();
  }

  /**
   * Iterate over each element
   * @param fn Function to call for each element
   */
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

  /**
   * Check if all elements satisfy a predicate
   * @param predicate Condition to check
   * @returns True if all elements satisfy the predicate
   */
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

  /**
   * Check if any element satisfies a predicate
   * @param predicate Condition to check
   * @returns True if any element satisfies the predicate
   */
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

  /**
   * Count the number of elements
   * @returns The number of elements
   */
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

  /**
   * Reduce the iterator to a single value
   * @param initial Initial accumulator value
   * @param f Reduction function
   * @returns The final accumulated value
   */
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

  /**
   * Remove consecutive duplicate elements
   * @returns A new Iter without consecutive duplicates
   */
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

  /**
   * Remove consecutive elements with the same key
   * @param keyFn Function to extract comparison key
   * @returns A new Iter without consecutive elements with the same key
   */
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

  /**
   * Insert a separator between elements
   * @param separator Element to insert between other elements
   * @returns A new Iter with separator inserted
   */
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

  /**
   * Convert to string representation
   * @returns A Str representation of the Iter
   */
  toString(): Str {
    return Str.fromRaw(`[Iter]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Iter._type);
  }
}
