import { Vec } from "./vec";
import { u32 } from "./primitives";
import { Str } from "./string";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../initWasm/lib";

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
          this._inner = wasmModule.HashSet.from(jsArray);
        } else {
          this._inner = new wasmModule.HashSet();
        }
      } catch (error) {
        console.warn(
          `WASM HashSet creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T>(values?: Iterable<T>): HashSet<T> {
    return callWasmStaticMethod(
      "HashSet",
      "from",
      values ? [Array.from(values)] : [],
      () => new HashSet<T>(values, false)
    );
  }

  static empty<T = never>(): HashSet<T> {
    return callWasmStaticMethod(
      "HashSet",
      "empty",
      [],
      () => new HashSet<T>(undefined, false)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(HashSet._type);
  }

  size(): u32 {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "size", [], () =>
        u32(this._set.size)
      );
    }
    return u32(this._set.size);
  }

  isEmpty(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isEmpty",
        [],
        () => this._set.size === 0
      );
    }
    return this._set.size === 0;
  }

  contains(value: T): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "contains", [value], () =>
        this._set.has(value)
      );
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

  map<R>(fn: (value: T) => R): HashSet<R> {
    if (this._useWasm) {
      try {
        const mappedWasm = this._inner.map(fn);
        return new HashSet<R>([...this._set].map(fn), true, mappedWasm);
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }
    return HashSet.from([...this._set].map(fn));
  }

  filter(fn: (value: T) => boolean): HashSet<T> {
    if (this._useWasm) {
      try {
        const filteredWasm = this._inner.filter(fn);
        return new HashSet<T>([...this._set].filter(fn), true, filteredWasm);
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }
    return HashSet.from([...this._set].filter(fn));
  }

  find(fn: (value: T) => boolean): T | undefined {
    if (this._useWasm) {
      try {
        const result = this._inner.find(fn);
        if (result !== undefined) {
          return result as T;
        }
      } catch (error) {
        console.warn(`WASM find failed, using JS fallback: ${error}`);
      }
    }
    for (const val of this._set) {
      if (fn(val)) return val;
    }
    return undefined;
  }

  forEach(callback: (value: T) => void): void {
    if (this._useWasm) {
      try {
        this._inner.forEach(callback);
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
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
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[HashSet size=${this._set.size}]`);
  }

  [Symbol.iterator](): Iterator<T> {
    return this._set[Symbol.iterator]();
  }

  toJSON(): T[] {
    return this.toArray();
  }
}
