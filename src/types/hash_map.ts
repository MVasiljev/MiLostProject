import { Vec } from "./vec";
import { u32 } from "./primitives";
import { Str } from "./string";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../initWasm/lib";

export class HashMap<K, V> implements Iterable<[K, V]> {
  private readonly _map: Map<K, V>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "HashMap";

  private constructor(
    entries?: Iterable<[K, V]>,
    useWasm: boolean = true,
    existingWasmMap?: any
  ) {
    this._map = new Map(entries);
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmMap) {
      this._inner = existingWasmMap;
    } else if (this._useWasm) {
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

          this._inner = wasmModule.HashMap.from(jsArray);
        } else {
          this._inner = new wasmModule.HashMap();
        }
      } catch (error) {
        console.warn(
          `WASM HashMap creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<K, V>(entries?: Iterable<[K, V]>): HashMap<K, V> {
    return callWasmStaticMethod(
      "HashMap",
      "from",
      entries ? [Array.from(entries).map(([k, v]) => [k, v])] : [],
      () => new HashMap<K, V>(entries, false)
    );
  }

  static empty<K = never, V = never>(): HashMap<K, V> {
    return callWasmStaticMethod(
      "HashMap",
      "empty",
      [],
      () => new HashMap<K, V>(undefined, false)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(HashMap._type);
  }

  size(): u32 {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "size", [], () =>
        u32(this._map.size)
      );
    }
    return u32(this._map.size);
  }

  isEmpty(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isEmpty",
        [],
        () => this._map.size === 0
      );
    }
    return this._map.size === 0;
  }

  get(key: K): V | undefined {
    if (this._useWasm) {
      try {
        const value = this._inner.get(key);
        return value === undefined ? undefined : (value as V);
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._map.get(key);
  }

  contains(key: K): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "contains", [key], () =>
        this._map.has(key)
      );
    }
    return this._map.has(key);
  }

  insert(key: K, value: V): HashMap<K, V> {
    if (this._useWasm) {
      try {
        const newWasmMap = this._inner.insert(key, value);
        const newMap = new Map(this._map);
        newMap.set(key, value);
        return new HashMap<K, V>(newMap, true, newWasmMap);
      } catch (error) {
        console.warn(`WASM insert failed, using JS fallback: ${error}`);
      }
    }
    const copy = new Map(this._map);
    copy.set(key, value);
    return new HashMap(copy, this._useWasm);
  }

  remove(key: K): HashMap<K, V> {
    if (this._useWasm) {
      try {
        const newWasmMap = this._inner.remove(key);
        const newMap = new Map(this._map);
        newMap.delete(key);
        return new HashMap<K, V>(newMap, true, newWasmMap);
      } catch (error) {
        console.warn(`WASM remove failed, using JS fallback: ${error}`);
      }
    }
    const copy = new Map(this._map);
    copy.delete(key);
    return new HashMap(copy, this._useWasm);
  }

  keys(): Vec<K> {
    if (this._useWasm) {
      try {
        const wasmKeys = this._inner.keys();
        const keys = Array.from(wasmKeys) as K[];
        return Vec.from(keys);
      } catch (error) {
        console.warn(`WASM keys failed, using JS fallback: ${error}`);
      }
    }
    return Vec.from(this._map.keys());
  }

  values(): Vec<V> {
    if (this._useWasm) {
      try {
        const wasmValues = this._inner.values();
        const values = Array.from(wasmValues) as V[];
        return Vec.from(values);
      } catch (error) {
        console.warn(`WASM values failed, using JS fallback: ${error}`);
      }
    }
    return Vec.from(this._map.values());
  }

  entries(): Vec<[K, V]> {
    if (this._useWasm) {
      try {
        const wasmEntries = this._inner.entries();
        const entries = Array.from(wasmEntries).map(
          (entry: any) => [entry[0], entry[1]] as [K, V]
        );
        return Vec.from(entries);
      } catch (error) {
        console.warn(`WASM entries failed, using JS fallback: ${error}`);
      }
    }
    return Vec.from(this._map.entries());
  }

  map<R>(fn: (value: V, key: K) => R): HashMap<K, R> {
    if (this._useWasm) {
      try {
        const mappedWasm = this._inner.map((value: V, key: K) =>
          fn(value, key)
        );
        const mapped = new Map<K, R>();
        this._map.forEach((v, k) => mapped.set(k, fn(v, k)));
        return new HashMap<K, R>(mapped, true, mappedWasm);
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }
    const mapped = new Map<K, R>();
    this._map.forEach((v, k) => mapped.set(k, fn(v, k)));
    return new HashMap<K, R>(mapped, false);
  }

  filter(predicate: (value: V, key: K) => boolean): HashMap<K, V> {
    if (this._useWasm) {
      try {
        const filteredWasm = this._inner.filter((value: V, key: K) =>
          predicate(value, key)
        );
        const filtered = new Map<K, V>();
        this._map.forEach((v, k) => {
          if (predicate(v, k)) filtered.set(k, v);
        });
        return new HashMap<K, V>(filtered, true, filteredWasm);
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }
    const filtered = new Map<K, V>();
    this._map.forEach((v, k) => {
      if (predicate(v, k)) filtered.set(k, v);
    });
    return new HashMap<K, V>(filtered, false);
  }

  find(fn: (value: V, key: K) => boolean): [K, V] | undefined {
    if (this._useWasm) {
      try {
        const result = this._inner.find((value: V, key: K) => fn(value, key));
        if (result !== undefined && result.length === 2) {
          return [result[0], result[1]] as [K, V];
        }
      } catch (error) {
        console.warn(`WASM find failed, using JS fallback: ${error}`);
      }
    }
    for (const [k, v] of this._map) {
      if (fn(v, k)) return [k, v];
    }
    return undefined;
  }

  forEach(callback: (value: V, key: K) => void): void {
    if (this._useWasm) {
      try {
        this._inner.forEach((value: V, key: K) => callback(value, key));
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
    this._map.forEach(callback);
  }

  extend(other: HashMap<K, V>): HashMap<K, V> {
    if (this._useWasm && other._useWasm) {
      try {
        const extendedWasm = this._inner.extend(other._inner);
        const merged = new Map(this._map);
        for (const [k, v] of other) {
          merged.set(k, v);
        }
        return new HashMap<K, V>(merged, true, extendedWasm);
      } catch (error) {
        console.warn(`WASM extend failed, using JS fallback: ${error}`);
      }
    }
    const merged = new Map(this._map);
    for (const [k, v] of other) {
      merged.set(k, v);
    }
    return new HashMap(merged, this._useWasm);
  }

  clear(): HashMap<K, V> {
    if (this._useWasm) {
      try {
        const clearedWasm = this._inner.clear();
        return new HashMap<K, V>(new Map(), true, clearedWasm);
      } catch (error) {
        console.warn(`WASM clear failed, using JS fallback: ${error}`);
      }
    }
    return HashMap.empty();
  }

  toArray(): [K, V][] {
    if (this._useWasm) {
      try {
        const wasmArray = this._inner.toArray();
        return Array.from(wasmArray).map(
          (entry: any) => [entry[0], entry[1]] as [K, V]
        );
      } catch (error) {
        console.warn(`WASM toArray failed, using JS fallback: ${error}`);
      }
    }
    return [...this._map.entries()];
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[HashMap size=${this._map.size}]`);
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this._map[Symbol.iterator]();
  }

  toJSON(): [K, V][] {
    return [...this._map.entries()];
  }
}
