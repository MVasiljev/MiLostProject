import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class Tuple<T extends unknown[]> {
  private readonly items: T;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Tuple";

  private constructor(
    items: T,
    useWasm: boolean = true,
    existingWasmTuple?: any
  ) {
    this.items = items;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmTuple) {
      this._inner = existingWasmTuple;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const jsArray = new Array(items.length);

        for (let i = 0; i < items.length; i++) {
          jsArray[i] = items[i];
        }

        this._inner = wasmModule.Tuple.fromArray(jsArray);
      } catch (error) {
        console.warn(
          `WASM Tuple creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T extends unknown[]>(...items: T): Tuple<T> {
    return new Tuple<T>(items);
  }

  static pair<A, B>(a: A, b: B): Tuple<[A, B]> {
    return Tuple.from(a, b);
  }

  static async create<T extends unknown[]>(...items: T): Promise<Tuple<T>> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new Tuple<T>(items);
  }

  get<I extends keyof T>(index: I): T[I] {
    const i = Number(index);

    if (this._useWasm) {
      try {
        const result = this._inner.get(i);
        return result as T[I];
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }

    return this.items[index];
  }

  replace<I extends keyof T>(index: I, value: T[I]): Tuple<T> {
    const i = Number(index);

    if (this._useWasm) {
      try {
        const newWasmTuple = this._inner.replace(i, value);
        const copy = this.items.slice() as T;
        copy[i] = value;
        return new Tuple<T>(copy, true, newWasmTuple);
      } catch (error) {
        console.warn(`WASM replace failed, using JS fallback: ${error}`);
      }
    }

    const copy = this.items.slice() as T;
    copy[Number(index) as keyof T] = value;
    return new Tuple<T>(copy, this._useWasm);
  }

  first(): T[0] {
    if (this._useWasm) {
      try {
        return this._inner.first() as T[0];
      } catch (error) {
        console.warn(`WASM first failed, using JS fallback: ${error}`);
      }
    }

    return this.get("0" as keyof T);
  }

  second(): T[1] {
    if (this._useWasm) {
      try {
        return this._inner.second() as T[1];
      } catch (error) {
        console.warn(`WASM second failed, using JS fallback: ${error}`);
      }
    }

    return this.get("1" as keyof T);
  }

  toArray(): T {
    if (this._useWasm) {
      try {
        const wasmArray = this._inner.toArray();
        return Array.from(wasmArray) as T;
      } catch (error) {
        console.warn(`WASM toArray failed, using JS fallback: ${error}`);
      }
    }

    return [...this.items] as T;
  }

  toString(): Str {
    return Str.fromRaw(`[Tuple ${JSON.stringify(this.items)}]`);
  }

  toJSON(): T {
    return this.items;
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Tuple._type);
  }
}
