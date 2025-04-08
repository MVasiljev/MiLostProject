import { Option } from "../core/option";
import { u32 } from "./primitives";
import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

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

    this._isNumeric = items.every((item) => typeof item === "number");

    if (existingWasmVec) {
      this._inner = existingWasmVec;
    } else if (this._useWasm && this._isNumeric) {
      try {
        const wasmModule = getWasmModule();

        this._inner = new wasmModule.Vec();

        for (const item of items) {
          this._inner.push(item as unknown as number);
        }
      } catch (error) {
        console.warn(
          `WASM Vec creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    } else if (this._useWasm && !this._isNumeric) {
      this._useWasm = false;
    }
  }

  static new<T>(): Vec<T> {
    return new Vec<T>();
  }

  static empty<T>(): Vec<T> {
    return Vec.new<T>();
  }

  static from<T>(iterable: Iterable<T>): Vec<T> {
    return new Vec<T>([...iterable]);
  }

  static async withCapacity<T>(capacity: number): Promise<Vec<T>> {
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
        const wasmModule = getWasmModule();
        const wasmVec = wasmModule.Vec.withCapacity(capacity);

        return new Vec<T>([], true, wasmVec);
      } catch (error) {
        console.warn(`WASM withCapacity failed, using JS fallback: ${error}`);
      }
    }

    return new Vec<T>();
  }

  static async create<T>(items: T[] = []): Promise<Vec<T>> {
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

  set(index: u32, value: T): Vec<T> {
    const i = Number(index);

    if (i < 0 || i >= this._items.length) {
      return this;
    }

    const newItems = [...this._items];
    newItems[i] = value;

    if (this._useWasm && this._isNumeric && typeof value === "number") {
      try {
        const wasmModule = getWasmModule();

        const newWasmVec = new wasmModule.Vec();

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

        return new Vec<T>(newItems, this._useWasm, newWasmVec);
      } catch (error) {
        console.warn(`WASM push failed, using JS fallback: ${error}`);
      }
    }

    return new Vec<T>(newItems, this._useWasm && isNumeric);
  }

  pop(): [Vec<T>, Option<T>] {
    if (this.isEmpty()) return [this, Option.None<T>()];

    const lastItem = this._items[this._items.length - 1];
    const newItems = this._items.slice(0, -1);

    if (this._useWasm && this._isNumeric) {
      try {
        const wasmModule = getWasmModule();

        const newWasmVec = new wasmModule.Vec();

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

  find(predicate: (item: T) => boolean): Option<T> {
    for (const item of this._items) {
      if (predicate(item)) {
        return Option.Some(item);
      }
    }
    return Option.None<T>();
  }

  fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R {
    let acc = initial;
    let index = 0;
    for (const item of this._items) {
      acc = fn(acc, item, u32(index++));
    }
    return acc;
  }

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

  reverse(): Vec<T> {
    const result = [...this._items].reverse();
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  all(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  any(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  take(n: u32): Vec<T> {
    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(0, count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  drop(n: u32): Vec<T> {
    const count = Math.min(Number(n), this._items.length);
    const result = this._items.slice(count);
    return new Vec<T>(result, this._useWasm && this._isNumeric);
  }

  concat(other: Vec<T>): Vec<T> {
    const result = [...this._items, ...other.toArray()];
    const isNumeric =
      this._isNumeric && other.all((item) => typeof item === "number");
    return new Vec<T>(result, this._useWasm && isNumeric);
  }

  [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  toString(): Str {
    return Str.fromRaw(`[Vec len=${this._items.length}]`);
  }

  toJSON(): T[] {
    return this.toArray();
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Vec");
  }
}
