import { Option } from "../core/option";
import { u32 } from "./primitives";
import { Str } from "./string";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../initWasm/lib";

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
          `WASM Vec creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    } else {
      this._useWasm = false;
    }
  }

  static from<T>(iterable: Iterable<T>): Vec<T> {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const items = [...iterable];

        if (items.every((item) => typeof item === "number")) {
          const array = new Array(items.length);
          for (let i = 0; i < items.length; i++) {
            array[i] = items[i];
          }

          const wasmVec = wasmModule.Vec.from(array);
          return new Vec<T>(items, true, wasmVec);
        }
      } catch (error) {
        console.warn(`WASM Vec.from failed, using JS implementation: ${error}`);
      }
    }

    return new Vec<T>([...iterable], false);
  }

  static empty<T>(): Vec<T> {
    return callWasmStaticMethod(
      "Vec",
      "empty",
      [],
      () => new Vec<T>([], false)
    );
  }

  static withCapacity<T>(capacity: number): Vec<T> {
    return callWasmStaticMethod(
      "Vec",
      "withCapacity",
      [capacity],
      () => new Vec<T>([], false)
    );
  }

  len(): u32 {
    if (this._useWasm && this._isNumeric) {
      return callWasmInstanceMethod(this._inner, "len", [], () =>
        u32(this._items.length)
      );
    }
    return u32(this._items.length);
  }

  isEmpty(): boolean {
    if (this._useWasm && this._isNumeric) {
      return callWasmInstanceMethod(
        this._inner,
        "isEmpty",
        [],
        () => this._items.length === 0
      );
    }
    return this._items.length === 0;
  }

  get(index: u32): Option<T> {
    const i = Number(index);

    if (this._useWasm && this._isNumeric) {
      try {
        const result = this._inner.get(i);
        return result !== undefined && result !== null
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

  find(predicate: (item: T) => boolean): Option<T> {
    if (this._useWasm && this._isNumeric) {
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

  fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R {
    if (this._useWasm && this._isNumeric) {
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

  map<U>(fn: (item: T, index: u32) => U): Vec<U> {
    if (this._useWasm && this._isNumeric) {
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

  filter(predicate: (item: T, index: u32) => boolean): Vec<T> {
    if (this._useWasm && this._isNumeric) {
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

  reverse(): Vec<T> {
    if (this._useWasm && this._isNumeric) {
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

  all(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._isNumeric) {
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

  any(predicate: (item: T) => boolean): boolean {
    if (this._useWasm && this._isNumeric) {
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

  take(n: u32): Vec<T> {
    if (this._useWasm && this._isNumeric) {
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

  drop(n: u32): Vec<T> {
    if (this._useWasm && this._isNumeric) {
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

  concat(other: Vec<T>): Vec<T> {
    if (
      this._useWasm &&
      this._isNumeric &&
      other._useWasm &&
      other._isNumeric
    ) {
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

  forEach(callback: (item: T, index: u32) => void): void {
    if (this._useWasm && this._isNumeric) {
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

  toString(): Str {
    if (this._useWasm && this._isNumeric) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Vec len=${this._items.length}]`);
  }

  [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  toJSON(): T[] {
    return this.toArray();
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Vec");
  }
}
