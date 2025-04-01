// src/types/vec.ts
import { Option } from "../core/option";
import { u32 } from "../types/primitives";
import { Str } from "../types/string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

/**
 * A Rust-like vector type
 * Currently supports numeric values (f64) for WASM implementation
 */
export class Vec<T> implements Iterable<T> {
  private readonly _items: T[];
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _isNumeric: boolean;

  private constructor(
    items: T[] = [],
    useWasm: boolean = true,
    existingWasmVec?: any
  ) {
    this._items = [...items];
    this._useWasm = useWasm && isWasmInitialized();

    // Check if this Vec contains only numbers for WASM compatibility
    this._isNumeric = items.every((item) => typeof item === "number");

    if (existingWasmVec) {
      // Use the existing WASM Vec provided
      this._inner = existingWasmVec;
    } else if (this._useWasm && this._isNumeric) {
      try {
        // Get the WASM module
        const wasmModule = getWasmModule();

        // Create a WASM Vec
        this._inner = new wasmModule.Vec();

        // Populate the WASM Vec with values
        for (const item of items) {
          this._inner.push(item as unknown as number);
        }
      } catch (error) {
        // Fall back to pure JS if WASM fails
        console.warn(
          `WASM Vec creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    } else if (this._useWasm && !this._isNumeric) {
      // Non-numeric Vecs can't use WASM implementation
      this._useWasm = false;
    }
  }

  /**
   * Create a new empty Vec
   */
  static new<T>(): Vec<T> {
    return new Vec<T>();
  }

  /**
   * Create an empty Vec (alias for new)
   */
  static empty<T>(): Vec<T> {
    return Vec.new<T>();
  }

  /**
   * Create a Vec from an iterable
   */
  static from<T>(iterable: Iterable<T>): Vec<T> {
    return new Vec<T>([...iterable]);
  }

  /**
   * Create a Vec with pre-allocated capacity (async to ensure WASM is initialized)
   */
  static async withCapacity<T>(capacity: number): Promise<Vec<T>> {
    // Ensure WASM is initialized if available
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    const wasmInitialized = isWasmInitialized();

    if (wasmInitialized) {
      try {
        // Use WASM's withCapacity method
        const wasmModule = getWasmModule();
        const wasmVec = wasmModule.Vec.withCapacity(capacity);

        // Create a new Vec with the WASM Vec as inner
        return new Vec<T>([], true, wasmVec);
      } catch (error) {
        console.warn(`WASM withCapacity failed, using JS fallback: ${error}`);
        // No real equivalent in JS, just create an empty array
      }
    }

    return new Vec<T>();
  }

  /**
   * Create a Vec (async to ensure WASM is initialized)
   */
  static async create<T>(items: T[] = []): Promise<Vec<T>> {
    // Ensure WASM is initialized if available
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new Vec<T>(items);
  }

  /**
   * Get the length of the Vec
   */
  len(): u32 {
    if (this._useWasm && this._isNumeric) {
      try {
        return u32(this._inner.len());
      } catch (error) {
        console.warn(`WASM len failed, using JS fallback: ${error}`);
      }
    }
    return u32(this._items.length);
  }

  /**
   * Check if the Vec is empty
   */
  isEmpty(): boolean {
    if (this._useWasm && this._isNumeric) {
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
   */
  get(index: u32): Option<T> {
    const i = Number(index);

    if (this._useWasm && this._isNumeric) {
      try {
        const result = this._inner.get(i);
        return result !== undefined
          ? Option.Some(result as unknown as T)
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
   * Set an item at a specific index and return a new Vec
   * Note: This preserves immutability like other methods
   */
  set(index: u32, value: T): Vec<T> {
    const i = Number(index);

    if (i < 0 || i >= this._items.length) {
      // Return the original Vec unchanged if index is out of bounds
      return this;
    }

    // Create a copy of the items array with the updated value
    const newItems = [...this._items];
    newItems[i] = value;

    if (this._useWasm && this._isNumeric && typeof value === "number") {
      try {
        // Get the WASM module
        const wasmModule = getWasmModule();

        // Create a new WASM Vec
        const newWasmVec = new wasmModule.Vec();

        // Copy all values with the new value at the specified index
        for (let j = 0; j < newItems.length; j++) {
          newWasmVec.push(newItems[j] as unknown as number);
        }

        return new Vec<T>(newItems, this._useWasm, newWasmVec);
      } catch (error) {
        console.warn(`WASM set operation failed, using JS fallback: ${error}`);
      }
    }

    return new Vec<T>(newItems, this._useWasm && this._isNumeric);
  }

  /**
   * Add an item to the end of the Vec
   */
  push(item: T): Vec<T> {
    const newItems = [...this._items, item];
    const isNumeric = this._isNumeric && typeof item === "number";

    if (this._useWasm && isNumeric) {
      try {
        // Get the WASM module
        const wasmModule = getWasmModule();

        // Create a new WASM Vec
        const newWasmVec = new wasmModule.Vec();

        // Copy existing values and add the new item
        for (const value of this._items) {
          newWasmVec.push(value as unknown as number);
        }
        newWasmVec.push(item as unknown as number);

        // Create a new Vec with the new WASM Vec
        return new Vec<T>(newItems, this._useWasm, newWasmVec);
      } catch (error) {
        console.warn(`WASM push failed, using JS fallback: ${error}`);
      }
    }

    return new Vec<T>(newItems, this._useWasm && isNumeric);
  }

  /**
   * Remove and return the last item
   */
  pop(): [Vec<T>, Option<T>] {
    if (this.isEmpty()) return [this, Option.None<T>()];

    const lastItem = this._items[this._items.length - 1];
    const newItems = this._items.slice(0, -1);

    if (this._useWasm && this._isNumeric) {
      try {
        // Get the WASM module
        const wasmModule = getWasmModule();

        // Create a new WASM Vec with all items except the last
        const newWasmVec = new wasmModule.Vec();

        // Copy all values except the last one
        for (let i = 0; i < newItems.length; i++) {
          newWasmVec.push(newItems[i] as unknown as number);
        }

        return [
          new Vec<T>(newItems, this._useWasm, newWasmVec),
          Option.Some(lastItem),
        ];
      } catch (error) {
        console.warn(`WASM pop failed, using JS fallback: ${error}`);
      }
    }

    return [
      new Vec<T>(newItems, this._useWasm && this._isNumeric),
      Option.Some(lastItem),
    ];
  }

  /**
   * Convert to a JavaScript array
   */
  toArray(): T[] {
    if (this._useWasm && this._isNumeric) {
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
   * Find an item that matches a predicate
   */
  find(predicate: (item: T) => boolean): Option<T> {
    for (const item of this._items) {
      if (predicate(item)) {
        return Option.Some(item);
      }
    }
    return Option.None<T>();
  }

  /**
   * Fold the Vec into a single value
   */
  fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R {
    let acc = initial;
    let index = 0;
    for (const item of this._items) {
      acc = fn(acc, item, u32(index++));
    }
    return acc;
  }

  /**
   * Map each item to a new value
   */
  map<U>(fn: (item: T, index: u32) => U): Vec<U> {
    const result: U[] = [];
    let index = 0;
    for (const item of this._items) {
      result.push(fn(item, u32(index++)));
    }
    return new Vec<U>(
      result,
      this._useWasm && result.every((item) => typeof item === "number")
    );
  }

  /**
   * Filter items based on a predicate
   */
  filter(predicate: (item: T, index: u32) => boolean): Vec<T> {
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
   * Reverse the Vec
   */
  reverse(): Vec<T> {
    const result = [...this._items].reverse();
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Check if all items match a predicate
   */
  all(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if any item matches a predicate
   */
  any(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Take n items from the beginning
   */
  take(n: u32): Vec<T> {
    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(0, count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Drop n items from the beginning
   */
  drop(n: u32): Vec<T> {
    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  /**
   * Concatenate with another Vec
   */
  concat(other: Vec<T>): Vec<T> {
    const result = [...this._items, ...other.toArray()];
    const isNumeric =
      this._isNumeric && other.all((item) => typeof item === "number");
    return new Vec<T>(result, this._useWasm && isNumeric);
  }

  /**
   * Iterator implementation
   */
  [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  /**
   * Convert to string
   */
  toString(): Str {
    return Str.fromRaw(`[Vec len=${this._items.length}]`);
  }

  /**
   * Convert to JSON
   */
  toJSON(): T[] {
    return this.toArray();
  }

  /**
   * Symbol.toStringTag implementation
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Vec");
  }
}
