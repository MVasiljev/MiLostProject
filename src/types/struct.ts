import { Str } from "./string";
import { Vec } from "./vec";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class Struct<T extends Record<string, unknown>> {
  private readonly _fields: Readonly<T>;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Struct";

  private constructor(
    fields: T,
    useWasm: boolean = true,
    existingWasmStruct?: any
  ) {
    this._fields = Object.freeze({ ...fields });
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmStruct) {
      this._inner = existingWasmStruct;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const jsObject = Object.create(null);

        for (const key in fields) {
          if (Object.prototype.hasOwnProperty.call(fields, key)) {
            jsObject[key] = fields[key];
          }
        }

        this._inner = wasmModule.Struct.fromObject(jsObject);
      } catch (error) {
        console.warn(
          `WASM Struct creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T extends Record<string, unknown>>(
    fields: Partial<T>,
    fallback: () => T
  ): Struct<T> {
    const full = { ...fallback(), ...fields } as T;
    return new Struct(full);
  }

  static empty<T extends Record<string, unknown>>(): Struct<T> {
    return new Struct({} as T);
  }

  static async create<T extends Record<string, unknown>>(
    fields: T
  ): Promise<Struct<T>> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new Struct<T>(fields);
  }

  get<K extends keyof T>(key: K): T[K] {
    if (this._useWasm) {
      try {
        return this._inner.get(String(key)) as T[K];
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }

    return this._fields[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): Struct<T> {
    if (this._useWasm) {
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

  keys(): Vec<keyof T> {
    if (this._useWasm) {
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

  entries(): Vec<[keyof T, T[keyof T]]> {
    if (this._useWasm) {
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

  toObject(): T {
    if (this._useWasm) {
      try {
        const wasmObject = this._inner.toObject();
        return Object.fromEntries(Object.entries(wasmObject)) as T;
      } catch (error) {
        console.warn(`WASM toObject failed, using JS fallback: ${error}`);
      }
    }

    return { ...this._fields };
  }

  toJSON(): T {
    return this.toObject();
  }

  toString(): Str {
    return Str.fromRaw(`[Struct ${JSON.stringify(this._fields)}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Struct._type);
  }
}
