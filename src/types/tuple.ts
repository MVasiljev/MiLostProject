import { Str } from "./string";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../initWasm/lib";

export class Tuple<T extends unknown[]> implements Iterable<unknown> {
  private readonly _items: T;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Tuple";

  private constructor(
    items: T,
    useWasm: boolean = true,
    existingWasmTuple?: any
  ) {
    this._items = [...items] as T;
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
        this._inner = wasmModule.Tuple.from(jsArray);
      } catch (error) {
        console.warn(
          `WASM Tuple creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static from<T extends unknown[]>(...items: T): Tuple<T> {
    return callWasmStaticMethod(
      "Tuple",
      "from",
      [items],
      () => new Tuple<T>(items, false)
    );
  }

  static pair<A, B>(a: A, b: B): Tuple<[A, B]> {
    return callWasmStaticMethod(
      "Tuple",
      "pair",
      [a, b],
      () => new Tuple<[A, B]>([a, b] as [A, B], false)
    );
  }

  len(): number {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "len",
        [],
        () => this._items.length
      );
    }
    return this._items.length;
  }

  isEmpty(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isEmpty",
        [],
        () => this._items.length === 0
      );
    }
    return this._items.length === 0;
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
    return this._items[index];
  }

  replace<I extends keyof T>(index: I, value: T[I]): Tuple<T> {
    const i = Number(index);
    if (this._useWasm) {
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

  first(): T[0] {
    if (this._useWasm) {
      try {
        return this._inner.first() as T[0];
      } catch (error) {
        console.warn(`WASM first failed, using JS fallback: ${error}`);
      }
    }
    return this._items[0];
  }

  second(): T[1] {
    if (this._useWasm) {
      try {
        return this._inner.second() as T[1];
      } catch (error) {
        console.warn(`WASM second failed, using JS fallback: ${error}`);
      }
    }
    return this._items[1];
  }

  map<R>(fn: (value: unknown, index: number) => R): Tuple<R[]> {
    if (this._useWasm) {
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

  forEach(callback: (value: unknown, index: number) => void): void {
    if (this._useWasm) {
      try {
        this._inner.forEach(callback);
        return;
      } catch (error) {
        console.warn(`WASM forEach failed, using JS fallback: ${error}`);
      }
    }
    this._items.forEach(callback);
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
    return [...this._items] as T;
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Tuple ${JSON.stringify(this._items)}]`);
  }

  toJSON(): T {
    return this.toArray();
  }

  [Symbol.iterator](): Iterator<unknown> {
    return this._items[Symbol.iterator]();
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Tuple._type);
  }
}
