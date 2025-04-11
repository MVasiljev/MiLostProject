/**
 * Tuple type implementation for MiLost
 *
 * Provides a type-safe, immutable tuple implementation with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "./string.js";

/**
 * Module definition for Tuple WASM implementation
 */
const tupleModule: WasmModule = {
  name: "Tuple",

  initialize(wasmModule: any) {
    console.log("Initializing Tuple module with WASM...");

    if (typeof wasmModule.Tuple === "function") {
      console.log("Found Tuple constructor in WASM module");
      Tuple._useWasm = true;

      const staticMethods = ["from", "pair"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Tuple[method] === "function") {
          console.log(`Found static method: Tuple.${method}`);
        } else {
          console.warn(`Missing static method: Tuple.${method}`);
        }
      });

      const instanceMethods = [
        "len",
        "isEmpty",
        "get",
        "replace",
        "first",
        "second",
        "map",
        "forEach",
        "toArray",
        "toString",
      ];

      try {
        const sampleTuple = new wasmModule.Tuple.from([1, 2]);
        instanceMethods.forEach((method) => {
          if (typeof sampleTuple[method] === "function") {
            console.log(`Found instance method: Tuple.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Tuple.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Tuple instance:", error);
      }
    } else {
      console.warn("Tuple constructor not found in WASM module");

      if (
        typeof wasmModule.TupleModule === "object" &&
        wasmModule.TupleModule !== null
      ) {
        console.log("Found TupleModule object, checking methods...");
        Object.keys(wasmModule.TupleModule).forEach((key) => {
          console.log(`Found TupleModule.${key}`);
        });

        if (typeof wasmModule.TupleModule.createTuple === "function") {
          console.log("Found alternative constructor: TupleModule.createTuple");
          Tuple._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for Tuple module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Tuple module");
    Tuple._useWasm = false;
  },
};

registerModule(tupleModule);

/**
 * An immutable tuple type with WASM acceleration
 */
export class Tuple<T extends unknown[]> implements Iterable<unknown> {
  private readonly _items: T;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;
  static readonly _type = "Tuple";

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    items: T,
    useWasm: boolean = Tuple._useWasm,
    existingWasmTuple?: any
  ) {
    this._items = [...items] as T;
    this._useWasm = useWasm && Tuple._useWasm;

    if (existingWasmTuple) {
      this._inner = existingWasmTuple;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Tuple === "function") {
          const jsArray = new Array(items.length);
          for (let i = 0; i < items.length; i++) {
            jsArray[i] = items[i];
          }
          this._inner = wasmModule.Tuple.from(jsArray);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Tuple creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a Tuple from items
   * @param items The items to create the tuple from
   * @returns A new Tuple instance
   */
  static from<T extends unknown[]>(...items: T): Tuple<T> {
    if (Tuple._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Tuple &&
        typeof wasmModule.Tuple.from === "function"
      ) {
        try {
          return wasmModule.Tuple.from(items);
        } catch (error) {
          console.warn(`WASM Tuple.from failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Tuple<T>(items, false);
  }

  /**
   * Create a pair tuple
   * @param a First item
   * @param b Second item
   * @returns A new Tuple instance with two items
   */
  static pair<A, B>(a: A, b: B): Tuple<[A, B]> {
    if (Tuple._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Tuple &&
        typeof wasmModule.Tuple.pair === "function"
      ) {
        try {
          return wasmModule.Tuple.pair(a, b);
        } catch (error) {
          console.warn(`WASM Tuple.pair failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Tuple<[A, B]>([a, b] as [A, B], false);
  }

  /**
   * Get the length of the tuple
   * @returns The tuple length
   */
  len(): number {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.len();
      } catch (error) {
        console.warn(`WASM len failed, using JS fallback: ${error}`);
      }
    }
    return this._items.length;
  }

  /**
   * Check if the tuple is empty
   * @returns True if the tuple is empty
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
   * @returns The item at the specified index
   */
  get<I extends keyof T>(index: I): T[I] {
    const i = Number(index);
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get(i) as T[I];
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._items[index];
  }

  /**
   * Replace an item at a specific index
   * @param index The index to replace
   * @param value The new value
   * @returns A new Tuple with the replaced item
   */
  replace<I extends keyof T>(index: I, value: T[I]): Tuple<T> {
    const i = Number(index);
    if (this._useWasm && this._inner) {
      try {
        const newWasmTuple = this._inner.replace(i, value);
        const copy = this._items.slice() as T;
        copy[i] = value;
        return new Tuple<T>(copy, true, newWasmTuple);
      } catch (error) {
        console.warn(`WASM replace failed, using JS fallback: ${error}`);
      }
    }
    const copy = this._items.slice() as T;
    copy[i] = value;
    return new Tuple<T>(copy, this._useWasm);
  }

  /**
   * Get the first item of the tuple
   * @returns The first item
   */
  first(): T[0] {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.first() as T[0];
      } catch (error) {
        console.warn(`WASM first failed, using JS fallback: ${error}`);
      }
    }
    return this._items[0];
  }

  /**
   * Get the second item of the tuple
   * @returns The second item
   */
  second(): T[1] {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.second() as T[1];
      } catch (error) {
        console.warn(`WASM second failed, using JS fallback: ${error}`);
      }
    }
    return this._items[1];
  }

  /**
   * Map the tuple's items
   * @param fn Mapping function
   * @returns A new Tuple with mapped items
   */
  map<R>(fn: (value: unknown, index: number) => R): Tuple<R[]> {
    if (this._useWasm && this._inner) {
      try {
        const mappedWasm = this._inner.map(fn);
        const mappedItems = this._items.map(fn) as R[];
        return new Tuple<R[]>(mappedItems, true, mappedWasm);
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }
    return new Tuple<R[]>(this._items.map(fn) as R[], false);
  }

  /**
   * Iterate over the tuple
   * @param callback Function to call for each item
   */
  forEach(callback: (value: unknown, index: number) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach(callback);
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
    this._items.forEach(callback);
  }

  /**
   * Convert tuple to array
   * @returns An array representation of the tuple
   */
  toArray(): T {
    if (this._useWasm && this._inner) {
      try {
        const wasmArray = this._inner.toArray();
        return Array.from(wasmArray) as T;
      } catch (error) {
        console.warn(`WASM toArray failed, using JS fallback: ${error}`);
      }
    }
    return [...this._items] as T;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the tuple
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Tuple ${JSON.stringify(this._items)}]`);
  }

  /**
   * Convert to JSON
   * @returns An array representation
   */
  toJSON(): T {
    return this.toArray();
  }

  /**
   * Implement iterator protocol
   * @returns An iterator for the tuple
   */
  [Symbol.iterator](): Iterator<unknown> {
    return this._items[Symbol.iterator]();
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Tuple._type);
  }
}
