/**
 * Struct type implementation for MiLost
 *
 * Provides a type-safe, immutable struct implementation with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "./string.js";
import { Vec } from "./vec.js";

/**
 * Module definition for Struct WASM implementation
 */
const structModule: WasmModule = {
  name: "Struct",

  initialize(wasmModule: any) {
    console.log("Initializing Struct module with WASM...");

    if (typeof wasmModule.Struct === "function") {
      console.log("Found Struct constructor in WASM module");
      Struct._useWasm = true;

      const staticMethods = ["from", "empty"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Struct[method] === "function") {
          console.log(`Found static method: Struct.${method}`);
        } else {
          console.warn(`Missing static method: Struct.${method}`);
        }
      });

      const instanceMethods = [
        "get",
        "set",
        "keys",
        "entries",
        "toObject",
        "map",
        "filter",
        "forEach",
        "toString",
      ];

      try {
        const sampleStruct = new wasmModule.Struct.from({});
        instanceMethods.forEach((method) => {
          if (typeof sampleStruct[method] === "function") {
            console.log(`Found instance method: Struct.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Struct.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Struct instance:", error);
      }
    } else {
      console.warn("Struct constructor not found in WASM module");

      if (
        typeof wasmModule.StructModule === "object" &&
        wasmModule.StructModule !== null
      ) {
        console.log("Found StructModule object, checking methods...");
        Object.keys(wasmModule.StructModule).forEach((key) => {
          console.log(`Found StructModule.${key}`);
        });

        if (typeof wasmModule.StructModule.createStruct === "function") {
          console.log(
            "Found alternative constructor: StructModule.createStruct"
          );
          Struct._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for Struct module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Struct module");
    Struct._useWasm = false;
  },
};

registerModule(structModule);

/**
 * An immutable struct type with WASM acceleration
 */
export class Struct<T extends Record<string, unknown>> {
  private readonly _fields: Readonly<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;
  static readonly _type = "Struct";

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    fields: T,
    useWasm: boolean = Struct._useWasm,
    existingWasmStruct?: any
  ) {
    this._fields = Object.freeze({ ...fields });
    this._useWasm = useWasm && Struct._useWasm;

    if (existingWasmStruct) {
      this._inner = existingWasmStruct;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Struct === "function") {
          const jsObject = Object.create(null);

          for (const key in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, key)) {
              jsObject[key] = fields[key];
            }
          }

          this._inner = wasmModule.Struct.from(jsObject);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Struct creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a Struct from fields
   * @param fields The fields to create the struct from
   * @returns A new Struct instance
   */
  static from<T extends Record<string, unknown>>(fields: T): Struct<T> {
    if (Struct._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Struct &&
        typeof wasmModule.Struct.from === "function"
      ) {
        try {
          return wasmModule.Struct.from(fields);
        } catch (error) {
          console.warn(`WASM Struct.from failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Struct<T>(fields, false);
  }

  /**
   * Create an empty Struct
   * @returns A new empty Struct instance
   */
  static empty<
    T extends Record<string, unknown> = Record<string, never>
  >(): Struct<T> {
    if (Struct._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Struct &&
        typeof wasmModule.Struct.empty === "function"
      ) {
        try {
          return wasmModule.Struct.empty();
        } catch (error) {
          console.warn(`WASM Struct.empty failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Struct<T>({} as T, false);
  }

  /**
   * Get a value by key
   * @param key The key to retrieve
   * @returns The value associated with the key
   */
  get<K extends keyof T>(key: K): T[K] {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get(String(key)) as T[K];
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._fields[key];
  }

  /**
   * Set a value for a key
   * @param key The key to set
   * @param value The value to set
   * @returns A new Struct with the updated value
   */
  set<K extends keyof T>(key: K, value: T[K]): Struct<T> {
    if (this._useWasm && this._inner) {
      try {
        const newWasmStruct = this._inner.set(String(key), value);
        const newFields = { ...this._fields, [key]: value } as T;
        return new Struct<T>(newFields, true, newWasmStruct);
      } catch (error) {
        console.warn(`WASM set failed, using JS fallback: ${error}`);
      }
    }
    return new Struct({ ...this._fields, [key]: value } as T, this._useWasm);
  }

  /**
   * Get the keys of the struct
   * @returns A Vec of keys
   */
  keys(): Vec<keyof T> {
    if (this._useWasm && this._inner) {
      try {
        const wasmKeys = this._inner.keys();
        const keys = Array.from(wasmKeys) as (keyof T)[];
        return Vec.from(keys);
      } catch (error) {
        console.warn(`WASM keys failed, using JS fallback: ${error}`);
      }
    }
    return Vec.from(Object.keys(this._fields) as (keyof T)[]);
  }

  /**
   * Get the entries of the struct
   * @returns A Vec of key-value pairs
   */
  entries(): Vec<[keyof T, T[keyof T]]> {
    if (this._useWasm && this._inner) {
      try {
        const wasmEntries = this._inner.entries();
        const entries = Array.from(wasmEntries).map(
          (entry: any) => [entry[0], entry[1]] as [keyof T, T[keyof T]]
        );
        return Vec.from(entries);
      } catch (error) {
        console.warn(`WASM entries failed, using JS fallback: ${error}`);
      }
    }
    return Vec.from(Object.entries(this._fields) as [keyof T, T[keyof T]][]);
  }

  /**
   * Convert to a plain object
   * @returns A plain object representation
   */
  toObject(): T {
    if (this._useWasm && this._inner) {
      try {
        const wasmObject = this._inner.toObject();
        return Object.fromEntries(Object.entries(wasmObject)) as T;
      } catch (error) {
        console.warn(`WASM toObject failed, using JS fallback: ${error}`);
      }
    }
    return { ...this._fields };
  }

  /**
   * Map the struct's values
   * @param fn Mapping function
   * @returns A new Struct with mapped values
   */
  map<R>(
    fn: (value: T[keyof T], key: keyof T) => R
  ): Struct<Record<keyof T, R>> {
    if (this._useWasm && this._inner) {
      try {
        const mappedWasm = this._inner.map(fn);
        const result: Record<string, R> = {};
        for (const key in this._fields) {
          if (Object.prototype.hasOwnProperty.call(this._fields, key)) {
            result[key] = fn(this._fields[key], key as keyof T);
          }
        }
        return new Struct<Record<keyof T, R>>(
          result as Record<keyof T, R>,
          true,
          mappedWasm
        );
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }

    const result: Record<string, R> = {};
    for (const key in this._fields) {
      if (Object.prototype.hasOwnProperty.call(this._fields, key)) {
        result[key] = fn(this._fields[key], key as keyof T);
      }
    }
    return new Struct<Record<keyof T, R>>(result as Record<keyof T, R>, false);
  }

  /**
   * Filter the struct's values
   * @param fn Filtering predicate
   * @returns A new Struct with filtered values
   */
  filter(fn: (value: T[keyof T], key: keyof T) => boolean): Struct<Partial<T>> {
    if (this._useWasm && this._inner) {
      try {
        const filteredWasm = this._inner.filter(fn);
        const result: Partial<T> = {};
        for (const key in this._fields) {
          if (
            Object.prototype.hasOwnProperty.call(this._fields, key) &&
            fn(this._fields[key], key as keyof T)
          ) {
            result[key as keyof T] = this._fields[key];
          }
        }
        return new Struct<Partial<T>>(result, true, filteredWasm);
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }

    const result: Partial<T> = {};
    for (const key in this._fields) {
      if (
        Object.prototype.hasOwnProperty.call(this._fields, key) &&
        fn(this._fields[key], key as keyof T)
      ) {
        result[key as keyof T] = this._fields[key];
      }
    }
    return new Struct<Partial<T>>(result, false);
  }

  /**
   * Iterate over the struct's entries
   * @param callback Function to call for each entry
   */
  forEach(callback: (value: T[keyof T], key: keyof T) => void): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.forEach(callback);
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }

    for (const key in this._fields) {
      if (Object.prototype.hasOwnProperty.call(this._fields, key)) {
        callback(this._fields[key], key as keyof T);
      }
    }
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the struct
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Struct ${JSON.stringify(this._fields)}]`);
  }

  /**
   * Convert to JSON
   * @returns A plain object representation
   */
  toJSON(): T {
    return this.toObject();
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Struct._type);
  }
}
