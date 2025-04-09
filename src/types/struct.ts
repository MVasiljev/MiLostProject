import { Str } from "./string";
import { Vec } from "./vec";
import { getWasmModule, isWasmInitialized } from "../wasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../wasm/lib";

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

        this._inner = wasmModule.Struct.from(jsObject);
      } catch (error) {
        console.warn(
          `WASM Struct creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T extends Record<string, unknown>>(fields: T): Struct<T> {
    return callWasmStaticMethod(
      "Struct",
      "from",
      [fields],
      () => new Struct<T>(fields, false)
    );
  }

  static empty<
    T extends Record<string, unknown> = Record<string, never>
  >(): Struct<T> {
    return callWasmStaticMethod(
      "Struct",
      "empty",
      [],
      () => new Struct<T>({} as T, false)
    );
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

  map<R>(
    fn: (value: T[keyof T], key: keyof T) => R
  ): Struct<Record<keyof T, R>> {
    if (this._useWasm) {
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

  filter(fn: (value: T[keyof T], key: keyof T) => boolean): Struct<Partial<T>> {
    if (this._useWasm) {
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

  forEach(callback: (value: T[keyof T], key: keyof T) => void): void {
    if (this._useWasm) {
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

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Struct ${JSON.stringify(this._fields)}]`);
  }

  toJSON(): T {
    return this.toObject();
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Struct._type);
  }
}
