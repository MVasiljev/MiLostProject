import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class HashSet<T> implements Iterable<T> {
  private readonly _set: Set<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "HashSet";

  private constructor(
    values?: Iterable<T>,
    useWasm: boolean = true,
    existingWasmSet?: any
  ) {
    this._set = new Set(values);
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmSet) {
      this._inner = existingWasmSet;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();

        if (values) {
          const valuesArray = Array.from(values);
          const jsArray = new Array(valuesArray.length);

          for (let i = 0; i < valuesArray.length; i++) {
            jsArray[i] = valuesArray[i];
          }

          this._inner = wasmModule.HashSet.fromArray(jsArray);
        } else {
          this._inner = new wasmModule.HashSet();
        }
      } catch (error) {
        console.warn(
          `WASM HashSet creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T>(values?: Iterable<T>): HashSet<T> {
    return new HashSet(values);
  }

  static empty<T = never>(): HashSet<T> {
    return new HashSet();
  }

  static async create<T>(values?: Iterable<T>): Promise<HashSet<T>> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new HashSet<T>(values);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(HashSet._type);
  }

  size(): u32 {
    if (this._useWasm) {
      try {
        return u32(this._inner.size());
      } catch (error) {
        console.warn(`WASM size failed, using JS fallback: ${error}`);
      }
    }

    return u32(this._set.size);
  }

  isEmpty(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isEmpty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
      }
    }

    return this._set.size === 0;
  }

  contains(value: T): boolean {
    if (this._useWasm) {
      try {
        return this._inner.contains(value);
      } catch (error) {
        console.warn(`WASM contains failed, using JS fallback: ${error}`);
      }
    }

    return this._set.has(value);
  }

  insert(value: T): HashSet<T> {
    if (this._useWasm) {
      try {
        const newWasmSet = this._inner.insert(value);

        const newSet = new Set(this._set);
        newSet.add(value);

        return new HashSet<T>(newSet, true, newWasmSet);
      } catch (error) {
        console.warn(`WASM insert failed, using JS fallback: ${error}`);
      }
    }

    const copy = new Set(this._set);
    copy.add(value);
    return new HashSet(copy, this._useWasm);
  }

  remove(value: T): HashSet<T> {
    if (this._useWasm) {
      try {
        const newWasmSet = this._inner.remove(value);

        const newSet = new Set(this._set);
        newSet.delete(value);

        return new HashSet<T>(newSet, true, newWasmSet);
      } catch (error) {
        console.warn(`WASM remove failed, using JS fallback: ${error}`);
      }
    }

    const copy = new Set(this._set);
    copy.delete(value);
    return new HashSet(copy, this._useWasm);
  }

  values(): Vec<T> {
    if (this._useWasm) {
      try {
        const wasmValues = this._inner.values();
        const values = Array.from(wasmValues) as T[];
        return Vec.from(values);
      } catch (error) {
        console.warn(`WASM values failed, using JS fallback: ${error}`);
      }
    }

    return Vec.from(this._set.values());
  }

  forEach(callback: (value: T) => void): void {
    this._set.forEach(callback);
  }

  union(other: HashSet<T>): HashSet<T> {
    if (this._useWasm && other._useWasm) {
      try {
        const newWasmSet = this._inner.union(other._inner);

        const merged = new Set([...this._set, ...other._set]);

        return new HashSet<T>(merged, true, newWasmSet);
      } catch (error) {
        console.warn(`WASM union failed, using JS fallback: ${error}`);
      }
    }

    return HashSet.from([...this._set, ...other._set]);
  }

  intersection(other: HashSet<T>): HashSet<T> {
    if (this._useWasm && other._useWasm) {
      try {
        const newWasmSet = this._inner.intersection(other._inner);

        const intersection = new Set(
          [...this._set].filter((v) => other.contains(v))
        );

        return new HashSet<T>(intersection, true, newWasmSet);
      } catch (error) {
        console.warn(`WASM intersection failed, using JS fallback: ${error}`);
      }
    }

    return HashSet.from([...this._set].filter((v) => other.contains(v)));
  }

  difference(other: HashSet<T>): HashSet<T> {
    if (this._useWasm && other._useWasm) {
      try {
        const newWasmSet = this._inner.difference(other._inner);

        const difference = new Set(
          [...this._set].filter((v) => !other.contains(v))
        );

        return new HashSet<T>(difference, true, newWasmSet);
      } catch (error) {
        console.warn(`WASM difference failed, using JS fallback: ${error}`);
      }
    }

    return HashSet.from([...this._set].filter((v) => !other.contains(v)));
  }

  symmetricDifference(other: HashSet<T>): HashSet<T> {
    if (this._useWasm && other._useWasm) {
      try {
        const newWasmSet = this._inner.symmetricDifference(other._inner);

        const union = new Set([...this._set, ...other._set]);
        const intersection = new Set(
          [...this._set].filter((v) => other.contains(v))
        );
        const symmetricDiff = new Set(
          [...union].filter((v) => !intersection.has(v))
        );

        return new HashSet<T>(symmetricDiff, true, newWasmSet);
      } catch (error) {
        console.warn(
          `WASM symmetricDifference failed, using JS fallback: ${error}`
        );
      }
    }

    return this.union(other).difference(this.intersection(other));
  }

  isSubset(other: HashSet<T>): boolean {
    if (this._useWasm && other._useWasm) {
      try {
        return this._inner.isSubset(other._inner);
      } catch (error) {
        console.warn(`WASM isSubset failed, using JS fallback: ${error}`);
      }
    }

    for (const v of this._set) {
      if (!other.contains(v)) return false;
    }
    return true;
  }

  isSuperset(other: HashSet<T>): boolean {
    if (this._useWasm && other._useWasm) {
      try {
        return this._inner.isSuperset(other._inner);
      } catch (error) {
        console.warn(`WASM isSuperset failed, using JS fallback: ${error}`);
      }
    }

    return other.isSubset(this);
  }

  clear(): HashSet<T> {
    if (this._useWasm) {
      try {
        const newWasmSet = this._inner.clear();
        return new HashSet<T>(new Set(), true, newWasmSet);
      } catch (error) {
        console.warn(`WASM clear failed, using JS fallback: ${error}`);
      }
    }

    return HashSet.empty();
  }

  map<R>(fn: (value: T) => R): HashSet<R> {
    return HashSet.from([...this._set].map(fn));
  }

  filter(fn: (value: T) => boolean): HashSet<T> {
    return HashSet.from([...this._set].filter(fn));
  }

  find(fn: (value: T) => boolean): T | undefined {
    for (const val of this._set) {
      if (fn(val)) return val;
    }
    return undefined;
  }

  [Symbol.iterator](): Iterator<T> {
    return this._set[Symbol.iterator]();
  }

  toJSON(): T[] {
    return [...this._set];
  }

  toArray(): T[] {
    if (this._useWasm) {
      try {
        const wasmArray = this._inner.toArray();
        return Array.from(wasmArray) as T[];
      } catch (error) {
        console.warn(`WASM toArray failed, using JS fallback: ${error}`);
      }
    }

    return [...this._set];
  }

  toString(): Str {
    return Str.fromRaw(`[HashSet size=${this._set.size}]`);
  }
}
