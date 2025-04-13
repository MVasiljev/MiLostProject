/**
 * Vector type implementation for MiLost
 *
 * Provides a type-safe, immutable vector implementation with WebAssembly
 * acceleration when available.
 */

import { Option } from "../core/option.js";
import {
  WasmModule,
  registerModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { u32 } from "./primitives.js";
import { Str } from "./string.js";

/**
 * Module definition for Vec WASM implementation
 */
const vecModule: WasmModule = {
  name: "Vec",

  initialize(wasmModule: any) {
    console.log("Initializing Vec module with WASM...");

    if (typeof wasmModule.Vec === "function") {
      console.log("Found Vec constructor in WASM module");
      Vec._useWasm = true;

      const staticMethods = ["from", "empty", "withCapacity"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Vec[method] === "function") {
          console.log(`Found static method: Vec.${method}`);
        } else {
          console.warn(`Missing static method: Vec.${method}`);
        }
      });

      const instanceMethods = [
        "len",
        "isEmpty",
        "get",
        "find",
        "fold",
        "map",
        "filter",
        "reverse",
        "all",
        "any",
        "take",
        "drop",
        "concat",
        "push",
        "forEach",
        "toArray",
        "toString",
      ];

      try {
        const sampleVec = new wasmModule.Vec();
        instanceMethods.forEach((method) => {
          if (typeof sampleVec[method] === "function") {
            console.log(`Found instance method: Vec.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Vec.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Vec instance:", error);
      }
    } else {
      console.warn("Vec constructor not found in WASM module");

      if (
        typeof wasmModule.VecModule === "object" &&
        wasmModule.VecModule !== null
      ) {
        console.log("Found VecModule object, checking methods...");
        Object.keys(wasmModule.VecModule).forEach((key) => {
          console.log(`Found VecModule.${key}`);
        });

        if (typeof wasmModule.VecModule.createVec === "function") {
          console.log("Found alternative constructor: VecModule.createVec");
          Vec._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for Vec module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Vec module");
    Vec._useWasm = false;
  },
};

registerModule(vecModule);

/**
 * An immutable vector type with WASM acceleration
 */
export class Vec<T> implements Iterable<T> {
  private readonly _items: T[];
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _isNumeric: boolean;
  static _useWasm: boolean = false;

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    items: T[] = [],
    useWasm: boolean = Vec._useWasm,
    existingWasmVec?: any
  ) {
    this._items = [...items];
    this._useWasm = useWasm && Vec._useWasm;
    this._isNumeric = items.every((item) => typeof item === "number");

    if (existingWasmVec) {
      this._inner = existingWasmVec;
    } else if (this._useWasm && this._isNumeric) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Vec === "function") {
          this._inner = new wasmModule.Vec();

          for (const item of items) {
            this._inner.push(item as unknown as number);
          }
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Vec creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    } else {
      this._useWasm = false;
    }
  }

  /**
   * Create a Vec from an iterable
   * @param iterable The source iterable
   * @returns A new Vec instance
   */
  static from<T>(iterable: Iterable<T>): Vec<T> {
    if (Vec._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Vec &&
        typeof wasmModule.Vec.from === "function"
      ) {
        try {
          const items = [...iterable];

          if (items.every((item) => typeof item === "number")) {
            const wasmVec = wasmModule.Vec.from(items);
            return new Vec<T>(items, true, wasmVec);
          }
        } catch (error) {
          console.warn(`WASM Vec.from failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Vec<T>([...iterable], false);
  }

  /**
   * Create an empty Vec
   * @returns A new empty Vec instance
   */
  static empty<T>(): Vec<T> {
    if (Vec._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Vec &&
        typeof wasmModule.Vec.empty === "function"
      ) {
        try {
          return wasmModule.Vec.empty();
        } catch (error) {
          console.warn(`WASM Vec.empty failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Vec<T>([], false);
  }

  /**
   * Create a Vec with a specific capacity
   * @param capacity The initial capacity
   * @returns A new Vec instance
   */
  static withCapacity<T>(capacity: number): Vec<T> {
    if (Vec._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Vec &&
        typeof wasmModule.Vec.withCapacity === "function"
      ) {
        try {
          return wasmModule.Vec.withCapacity(capacity);
        } catch (error) {
          console.warn(
            `WASM Vec.withCapacity failed, using JS fallback: ${error}`
          );
        }
      }
    }
    return new Vec<T>([], false);
  }

  /**
   * Get the length of the vector
   * @returns The vector length
   */
  len(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.len();
      } catch (error) {
        console.warn(`WASM len failed, using JS fallback: ${error}`);
      }
    }
    return u32(this._items.length);
  }

  /**
   * Check if the vector is empty
   * @returns True if the vector is empty
   */
  isEmpty(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isEmpty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
      }
    }
    return this._items.length === 0;
  }

  /**
   * Get an item at a specific index
   * @param index The index to retrieve
   * @returns An Option containing the item or None
   */
  get(index: u32): Option<T> {
    const i = Number(index);

    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.get(i);
        return result !== undefined && result !== null
          ? Option.Some(result as T)
          : Option.None<T>();
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }

    return i >= 0 && i < this._items.length
      ? Option.Some(this._items[i])
      : Option.None<T>();
  }

  /**
   * Find the first item matching a predicate
   * @param predicate The predicate to match against
   * @returns An Option containing the first matching item or None
   */
  find(predicate: (item: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.find(predicate);
        if (result !== undefined && result !== null) {
          return Option.Some(result as T);
        }
        return Option.None<T>();
      } catch (error) {
        console.warn(`WASM find failed, using JS fallback: ${error}`);
      }
    }

    for (const item of this._items) {
      if (predicate(item)) {
        return Option.Some(item);
      }
    }
    return Option.None<T>();
  }

  /**
   * Fold the vector to a single value
   * @param initial Initial accumulator value
   * @param fn Folding function
   * @returns The final accumulated value
   */
  fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.fold(initial, fn);
        return result as R;
      } catch (error) {
        console.warn(`WASM fold failed, using JS fallback: ${error}`);
      }
    }

    let acc = initial;
    let index = 0;
    for (const item of this._items) {
      acc = fn(acc, item, u32(index++));
    }
    return acc;
  }

  /**
   * Map the vector's items
   * @param fn Mapping function
   * @returns A new Vec with mapped items
   */
  map<U>(fn: (item: T, index: u32) => U): Vec<U> {
    if (this._useWasm && this._inner) {
      try {
        const mappedWasm = this._inner.map(fn);
        const mappedItems = this._items.map((item, index) =>
          fn(item, u32(index))
        );
        const isNumeric = mappedItems.every((item) => typeof item === "number");
        return new Vec<U>(mappedItems, isNumeric, mappedWasm);
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }

    const result: U[] = [];
    let index = 0;
    for (const item of this._items) {
      result.push(fn(item, u32(index++)));
    }
    return new Vec<U>(
      result,
      result.every((item) => typeof item === "number")
    );
  }

  /**
   * Filter the vector's items
   * @param predicate Filtering predicate
   * @returns A new Vec with filtered items
   */
  filter(predicate: (item: T, index: u32) => boolean): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        const filteredWasm = this._inner.filter(predicate);
        const filteredItems = this._items.filter((item, index) =>
          predicate(item, u32(index))
        );
        return new Vec<T>(filteredItems, true, filteredWasm);
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }

    const result: T[] = [];
    let index = 0;
    for (const item of this._items) {
      if (predicate(item, u32(index++))) {
        result.push(item);
      }
    }
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Reverse the vector
   * @returns A new Vec with items in reverse order
   */
  reverse(): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        const reversedWasm = this._inner.reverse();
        const reversedItems = [...this._items].reverse();
        return new Vec<T>(reversedItems, true, reversedWasm);
      } catch (error) {
        console.warn(`WASM reverse failed, using JS fallback: ${error}`);
      }
    }

    const result = [...this._items].reverse();
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Check if all items match a predicate
   * @param predicate Predicate to check against
   * @returns True if all items match
   */
  all(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.all(predicate);
      } catch (error) {
        console.warn(`WASM all failed, using JS fallback: ${error}`);
      }
    }

    for (const item of this._items) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if any item matches a predicate
   * @param predicate Predicate to check against
   * @returns True if any item matches
   */
  any(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.any(predicate);
      } catch (error) {
        console.warn(`WASM any failed, using JS fallback: ${error}`);
      }
    }

    for (const item of this._items) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Take the first n items
   * @param n Number of items to take
   * @returns A new Vec with the first n items
   */
  take(n: u32): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        const takenWasm = this._inner.take(Number(n));
        const count = Math.min(Number(n), this._items.length);
        const result = this._items.slice(0, count);
        return new Vec<T>(result, true, takenWasm);
      } catch (error) {
        console.warn(`WASM take failed, using JS fallback: ${error}`);
      }
    }

    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(0, count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Drop the first n items
   * @param n Number of items to drop
   * @returns A new Vec without the first n items
   */
  drop(n: u32): Vec<T> {
    if (this._useWasm && this._inner) {
      try {
        const droppedWasm = this._inner.drop(Number(n));
        const count = Math.min(Number(n), this._items.length);
        const result = this._items.slice(count);
        return new Vec<T>(result, true, droppedWasm);
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }

    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Concatenate with another vector
   * @param other The vector to concatenate
   * @returns A new Vec with items from both vectors
   */
  concat(other: Vec<T>): Vec<T> {
    if (this._useWasm && this._inner && other._useWasm && other._inner) {
      try {
        const concatWasm = this._inner.concat(other._inner);
        const result = [...this._items, ...other._items];
        return new Vec<T>(result, true, concatWasm);
      } catch (error) {
        console.warn(`WASM concat failed, using JS fallback: ${error}`);
      }
    }

    const result = [...this._items, ...other._items];
    const isNumeric =
      this._isNumeric && other._items.every((item) => typeof item === "number");
    return new Vec<T>(result, isNumeric);
  }

  /**
   * Push an item to the vector
   * @param item The item to push
   * @returns A new Vec with the item added
   */
  push(item: T): Vec<T> {
    const newItems = [...this._items, item];
    const isNumeric = this._isNumeric && typeof item === "number";

    if (this._useWasm && isNumeric) {
      try {
        const wasmModule = getWasmModule();
        const newWasmVec = new wasmModule.Vec();

        for (const value of this._items) {
          newWasmVec.push(value as unknown as number);
        }
        newWasmVec.push(item as unknown as number);

        return new Vec<T>(newItems, true, newWasmVec);
      } catch (error) {
        console.warn(`WASM push failed, using JS fallback: ${error}`);
      }
    }

    return new Vec<T>(newItems, isNumeric);
  }

  /**
   * Iterate over the vector
   * @param callback Function to call for each item
   */
  forEach(callback: (item: T, index: u32) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach((item: T, index: number) => {
          callback(item, u32(index));
        });
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }

    let index = 0;
    for (const item of this._items) {
      callback(item, u32(index++));
    }
  }

  /**
   * Convert vector to array
   * @returns An array representation of the vector
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
    return [...this._items];
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the vector
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Vec len=${this._items.length}]`);
  }

  /**
   * Implement iterator protocol
   * @returns An iterator for the vector
   */
  [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  /**
   * Convert to JSON
   * @returns An array representation
   */
  toJSON(): T[] {
    return this.toArray();
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Vec");
  }
}
