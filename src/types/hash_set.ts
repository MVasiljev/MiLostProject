/**
 * HashSet type implementation for MiLost
 *
 * Provides a type-safe, immutable hash set implementation with WebAssembly
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
 * Module definition for HashSet WASM implementation
 */
const hashSetModule: WasmModule = {
  name: "HashSet",

  initialize(wasmModule: any) {
    console.log("Initializing HashSet module with WASM...");

    if (typeof wasmModule.HashSet === "function") {
      console.log("Found HashSet constructor in WASM module");
      HashSet._useWasm = true;

      const staticMethods = ["from", "empty"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.HashSet[method] === "function") {
          console.log(`Found static method: HashSet.${method}`);
        } else {
          console.warn(`Missing static method: HashSet.${method}`);
        }
      });

      const instanceMethods = [
        "size",
        "isEmpty",
        "contains",
        "insert",
        "remove",
        "values",
        "map",
        "filter",
        "find",
        "forEach",
        "union",
        "intersection",
        "difference",
        "symmetricDifference",
        "isSubset",
        "isSuperset",
        "clear",
        "toArray",
        "toString",
      ];

      try {
        const sampleSet = new wasmModule.HashSet();
        instanceMethods.forEach((method) => {
          if (typeof sampleSet[method] === "function") {
            console.log(`Found instance method: HashSet.prototype.${method}`);
          } else {
            console.warn(
              `Missing instance method: HashSet.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample HashSet instance:", error);
      }
    } else {
      console.warn("HashSet constructor not found in WASM module");

      if (
        typeof wasmModule.HashSetModule === "object" &&
        wasmModule.HashSetModule !== null
      ) {
        console.log("Found HashSetModule object, checking methods...");
        Object.keys(wasmModule.HashSetModule).forEach((key) => {
          console.log(`Found HashSetModule.${key}`);
        });

        if (typeof wasmModule.HashSetModule.createHashSet === "function") {
          console.log(
            "Found alternative constructor: HashSetModule.createHashSet"
          );
          HashSet._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for HashSet module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for HashSet module");
    HashSet._useWasm = false;
  },
};

registerModule(hashSetModule);

/**
 * An immutable hash set type with WASM acceleration
 */
export class HashSet<T> implements Iterable<T> {
  private readonly _set: Set<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;
  static readonly _type = "HashSet";

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    values?: Iterable<T>,
    useWasm: boolean = HashSet._useWasm,
    existingWasmSet?: any
  ) {
    this._set = new Set(values);
    this._useWasm = useWasm && HashSet._useWasm;

    if (existingWasmSet) {
      this._inner = existingWasmSet;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.HashSet === "function") {
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
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM HashSet creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a HashSet from values
   * @param values Optional iterable of values
   * @returns A new HashSet instance
   */
  static from<T>(values?: Iterable<T>): HashSet<T> {
    if (HashSet._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.HashSet &&
        typeof wasmModule.HashSet.from === "function"
      ) {
        try {
          return values
            ? wasmModule.HashSet.from(Array.from(values))
            : wasmModule.HashSet.empty();
        } catch (error) {
          console.warn(`WASM HashSet.from failed, using JS fallback: ${error}`);
        }
      }
    }
    return new HashSet<T>(values, false);
  }

  /**
   * Create an empty HashSet
   * @returns A new empty HashSet instance
   */
  static empty<T = never>(): HashSet<T> {
    if (HashSet._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.HashSet &&
        typeof wasmModule.HashSet.empty === "function"
      ) {
        try {
          return wasmModule.HashSet.empty();
        } catch (error) {
          console.warn(
            `WASM HashSet.empty failed, using JS fallback: ${error}`
          );
        }
      }
    }
    return new HashSet<T>(undefined, false);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(HashSet._type);
  }

  /**
   * Get the size of the set
   * @returns The number of elements in the set
   */
  size(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.size();
      } catch (error) {
        console.warn(`WASM size failed, using JS fallback: ${error}`);
      }
    }
    return u32(this._set.size);
  }

  /**
   * Check if the set is empty
   * @returns True if the set has no elements
   */
  isEmpty(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isEmpty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
      }
    }
    return this._set.size === 0;
  }

  /**
   * Check if the set contains a value
   * @param value The value to check
   * @returns True if the value is in the set
   */
  contains(value: T): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.contains(value);
      } catch (error) {
        console.warn(`WASM contains failed, using JS fallback: ${error}`);
      }
    }
    return this._set.has(value);
  }

  /**
   * Insert a value into the set
   * @param value The value to insert
   * @returns A new HashSet with the value added
   */
  insert(value: T): HashSet<T> {
    if (this._useWasm && this._inner) {
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

  /**
   * Remove a value from the set
   * @param value The value to remove
   * @returns A new HashSet with the value removed
   */
  remove(value: T): HashSet<T> {
    if (this._useWasm && this._inner) {
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

  /**
   * Get all values in the set
   * @returns A Vec of all values
   */
  values(): Vec<T> {
    if (this._useWasm && this._inner) {
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

  /**
   * Map the set's values
   * @param fn Mapping function
   * @returns A new HashSet with mapped values
   */
  map<R>(fn: (value: T) => R): HashSet<R> {
    if (this._useWasm && this._inner) {
      try {
        const mappedWasm = this._inner.map(fn);
        return new HashSet<R>([...this._set].map(fn), true, mappedWasm);
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }
    return HashSet.from([...this._set].map(fn));
  }

  /**
   * Filter the set's values
   * @param fn Filtering predicate
   * @returns A new HashSet with filtered values
   */
  filter(fn: (value: T) => boolean): HashSet<T> {
    if (this._useWasm && this._inner) {
      try {
        const filteredWasm = this._inner.filter(fn);
        return new HashSet<T>([...this._set].filter(fn), true, filteredWasm);
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }
    return HashSet.from([...this._set].filter(fn));
  }

  /**
   * Find the first value matching a predicate
   * @param fn Predicate function
   * @returns The first matching value or undefined
   */
  find(fn: (value: T) => boolean): T | undefined {
    if (this._useWasm && this._inner) {
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

  /**
   * Iterate over the set's values
   * @param callback Function to call for each value
   */
  forEach(callback: (value: T) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach(callback);
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
    this._set.forEach(callback);
  }

  /**
   * Create a union of two sets
   * @param other The other HashSet to union with
   * @returns A new HashSet with values from both sets
   */
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

  /**
   * Create an intersection of two sets
   * @param other The other HashSet to intersect with
   * @returns A new HashSet with common values
   */
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

  /**
   * Create a difference of two sets
   * @param other The HashSet to subtract
   * @returns A new HashSet with values not in the other set
   */
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

  /**
   * Create a symmetric difference of two sets
   * @param other The other HashSet
   * @returns A new HashSet with values in either set, but not both
   */
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

  /**
   * Check if this set is a subset of another set
   * @param other The other HashSet
   * @returns True if all elements in this set are in the other set
   */
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

  /**
   * Check if this set is a superset of another set
   * @param other The other HashSet
   * @returns True if all elements in the other set are in this set
   */
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

  /**
   * Clear all elements from the set
   * @returns An empty HashSet
   */
  clear(): HashSet<T> {
    if (this._useWasm && this._inner) {
      try {
        const newWasmSet = this._inner.clear();
        return new HashSet<T>(new Set(), true, newWasmSet);
      } catch (error) {
        console.warn(`WASM clear failed, using JS fallback: ${error}`);
      }
    }
    return HashSet.empty();
  }

  /**
   * Convert the set to an array
   * @returns An array of all values in the set
   */
  toArray(): T[] {
    if (this._useWasm && this._inner) {
      try {
        const wasmArray = this._inner.toArray();
        return Array.from(wasmArray) as T[];
      } catch (error) {
        console.warn(`WASM toArray failed, using JS fallback: ${error}`);
      }
    }
    return [...this._set];
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the set
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[HashSet size=${this._set.size}]`);
  }

  /**
   * Implement iterator protocol
   * @returns An iterator for the set
   */
  [Symbol.iterator](): Iterator<T> {
    return this._set[Symbol.iterator]();
  }

  /**
   * Convert to JSON
   * @returns An array representation
   */
  toJSON(): T[] {
    return this.toArray();
  }
}
