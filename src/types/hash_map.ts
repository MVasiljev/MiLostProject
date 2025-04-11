/**
 * HashMap type implementation for MiLost
 *
 * Provides a type-safe, immutable hash map implementation with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Vec } from "./vec.js";
import { u32 } from "./primitives.js";
import { Str } from "./string.js";

/**
 * Module definition for HashMap WASM implementation
 */
const hashMapModule: WasmModule = {
  name: "HashMap",

  initialize(wasmModule: any) {
    console.log("Initializing HashMap module with WASM...");

    if (typeof wasmModule.HashMap === "function") {
      console.log("Found HashMap constructor in WASM module");
      HashMap._useWasm = true;

      const staticMethods = ["from", "empty"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.HashMap[method] === "function") {
          console.log(`Found static method: HashMap.${method}`);
        } else {
          console.warn(`Missing static method: HashMap.${method}`);
        }
      });

      const instanceMethods = [
        "size",
        "isEmpty",
        "get",
        "contains",
        "insert",
        "remove",
        "keys",
        "values",
        "entries",
        "map",
        "filter",
        "find",
        "forEach",
        "extend",
        "clear",
        "toArray",
        "toString",
      ];

      try {
        const sampleMap = new wasmModule.HashMap();
        instanceMethods.forEach((method) => {
          if (typeof sampleMap[method] === "function") {
            console.log(`Found instance method: HashMap.prototype.${method}`);
          } else {
            console.warn(
              `Missing instance method: HashMap.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample HashMap instance:", error);
      }
    } else {
      console.warn("HashMap constructor not found in WASM module");

      if (
        typeof wasmModule.HashMapModule === "object" &&
        wasmModule.HashMapModule !== null
      ) {
        console.log("Found HashMapModule object, checking methods...");
        Object.keys(wasmModule.HashMapModule).forEach((key) => {
          console.log(`Found HashMapModule.${key}`);
        });

        if (typeof wasmModule.HashMapModule.createHashMap === "function") {
          console.log(
            "Found alternative constructor: HashMapModule.createHashMap"
          );
          HashMap._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for HashMap module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for HashMap module");
    HashMap._useWasm = false;
  },
};

registerModule(hashMapModule);

/**
 * An immutable hash map type with WASM acceleration
 */
export class HashMap<K, V> implements Iterable<[K, V]> {
  private readonly _map: Map<K, V>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;
  static readonly _type = "HashMap";

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    entries?: Iterable<[K, V]>,
    useWasm: boolean = HashMap._useWasm,
    existingWasmMap?: any
  ) {
    this._map = new Map(entries);
    this._useWasm = useWasm && HashMap._useWasm;

    if (existingWasmMap) {
      this._inner = existingWasmMap;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.HashMap === "function") {
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
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM HashMap creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a HashMap from entries
   * @param entries Optional iterable of key-value pairs
   * @returns A new HashMap instance
   */
  static from<K, V>(entries?: Iterable<[K, V]>): HashMap<K, V> {
    if (HashMap._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.HashMap &&
        typeof wasmModule.HashMap.from === "function"
      ) {
        try {
          return entries
            ? wasmModule.HashMap.from(
                Array.from(entries).map(([k, v]) => [k, v])
              )
            : wasmModule.HashMap.empty();
        } catch (error) {
          console.warn(`WASM HashMap.from failed, using JS fallback: ${error}`);
        }
      }
    }
    return new HashMap<K, V>(entries, false);
  }

  /**
   * Create an empty HashMap
   * @returns A new empty HashMap instance
   */
  static empty<K = never, V = never>(): HashMap<K, V> {
    if (HashMap._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.HashMap &&
        typeof wasmModule.HashMap.empty === "function"
      ) {
        try {
          return wasmModule.HashMap.empty();
        } catch (error) {
          console.warn(
            `WASM HashMap.empty failed, using JS fallback: ${error}`
          );
        }
      }
    }
    return new HashMap<K, V>(undefined, false);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(HashMap._type);
  }

  /**
   * Get the size of the map
   * @returns The number of entries in the map
   */
  size(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.size();
      } catch (error) {
        console.warn(`WASM size failed, using JS fallback: ${error}`);
      }
    }
    return u32(this._map.size);
  }

  /**
   * Check if the map is empty
   * @returns True if the map has no entries
   */
  isEmpty(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isEmpty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
      }
    }
    return this._map.size === 0;
  }

  /**
   * Get a value by its key
   * @param key The key to look up
   * @returns The value associated with the key, or undefined
   */
  get(key: K): V | undefined {
    if (this._useWasm && this._inner) {
      try {
        const value = this._inner.get(key);
        return value === undefined ? undefined : (value as V);
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._map.get(key);
  }

  /**
   * Check if the map contains a specific key
   * @param key The key to check
   * @returns True if the key exists in the map
   */
  contains(key: K): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.contains(key);
      } catch (error) {
        console.warn(`WASM contains failed, using JS fallback: ${error}`);
      }
    }
    return this._map.has(key);
  }

  /**
   * Insert a new key-value pair
   * @param key The key to insert
   * @param value The value to associate with the key
   * @returns A new HashMap with the added entry
   */
  insert(key: K, value: V): HashMap<K, V> {
    if (this._useWasm && this._inner) {
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

  /**
   * Remove an entry by its key
   * @param key The key to remove
   * @returns A new HashMap without the specified key
   */
  remove(key: K): HashMap<K, V> {
    if (this._useWasm && this._inner) {
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

  /**
   * Get all keys in the map
   * @returns A Vec of all keys
   */
  keys(): Vec<K> {
    if (this._useWasm && this._inner) {
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

  /**
   * Get all values in the map
   * @returns A Vec of all values
   */
  values(): Vec<V> {
    if (this._useWasm && this._inner) {
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

  /**
   * Get all entries in the map
   * @returns A Vec of all key-value pairs
   */
  entries(): Vec<[K, V]> {
    if (this._useWasm && this._inner) {
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

  /**
   * Transform values while preserving keys
   * @param fn Mapping function
   * @returns A new HashMap with transformed values
   */
  map<R>(fn: (value: V, key: K) => R): HashMap<K, R> {
    if (this._useWasm && this._inner) {
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

  /**
   * Filter entries based on a predicate
   * @param predicate Filtering function
   * @returns A new HashMap with filtered entries
   */
  filter(predicate: (value: V, key: K) => boolean): HashMap<K, V> {
    if (this._useWasm && this._inner) {
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

  /**
   * Find the first entry matching a predicate
   * @param fn Predicate function
   * @returns The first matching key-value pair or undefined
   */
  find(fn: (value: V, key: K) => boolean): [K, V] | undefined {
    if (this._useWasm && this._inner) {
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

  /**
   * Iterate over the map's entries
   * @param callback Function to call for each entry*/
  forEach(callback: (value: V, key: K) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach((value: V, key: K) => callback(value, key));
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
    this._map.forEach(callback);
  }

  /**
   * Extend the map with entries from another HashMap
   * @param other The HashMap to merge with
   * @returns A new HashMap with combined entries
   */
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

  /**
   * Clear all entries from the map
   * @returns An empty HashMap
   */
  clear(): HashMap<K, V> {
    if (this._useWasm && this._inner) {
      try {
        const clearedWasm = this._inner.clear();
        return new HashMap<K, V>(new Map(), true, clearedWasm);
      } catch (error) {
        console.warn(`WASM clear failed, using JS fallback: ${error}`);
      }
    }
    return HashMap.empty();
  }

  /**
   * Convert the map to an array of entries
   * @returns An array of key-value pairs
   */
  toArray(): [K, V][] {
    if (this._useWasm && this._inner) {
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

  /**
   * Convert to string representation
   * @returns A Str representation of the map
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[HashMap size=${this._map.size}]`);
  }

  /**
   * Implement iterator protocol
   * @returns An iterator for the map entries
   */
  [Symbol.iterator](): Iterator<[K, V]> {
    return this._map[Symbol.iterator]();
  }

  /**
   * Convert to JSON
   * @returns An array of entries
   */
  toJSON(): [K, V][] {
    return [...this._map.entries()];
  }
}
