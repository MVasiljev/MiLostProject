import { Str } from "../types/string.js";
import { Resource } from "./resource.js";
import { AppError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export interface IDisposable {
  dispose(): Promise<void> | void;
}

export async function asResource<
  T extends IDisposable,
  E extends AppError = AppError
>(disposable: T): Promise<Resource<T, E>> {
  // Ensure WASM is initialized if possible
  await Resource.init();

  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const wasmResource = wasmModule.asResource(disposable);

      // We need to wrap the WASM resource in our TypeScript Resource class
      return Resource.new<T, E>(disposable, (d) => d.dispose());
    } catch (err) {
      console.warn(`WASM asResource failed, using JS fallback: ${err}`);
    }
  }

  // JS fallback
  return Resource.new(disposable, (d) => d.dispose());
}

export class DisposableGroup implements IDisposable {
  private _disposables: IDisposable[] = [];
  private _disposed: boolean = false;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "DisposableGroup";

  constructor() {
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.createDisposableGroup();
      } catch (err) {
        console.warn(
          `WASM DisposableGroup creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }

  add(disposable: IDisposable): this {
    if (this._useWasm) {
      try {
        this._inner.add(disposable);
        this._disposables.push(disposable); // Keep JS state in sync
        return this;
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          String(err.message).includes("Cannot add to disposed group")
        ) {
          throw new Error("Cannot add to disposed group");
        }
        console.warn(`WASM add failed, using JS fallback: ${err}`);
        this._useWasm = false;
      }
    }

    if (this._disposed) {
      throw new Error("Cannot add to disposed group");
    }

    this._disposables.push(disposable);
    return this;
  }

  async dispose(): Promise<void> {
    if (this._useWasm) {
      try {
        await this._inner.dispose();
        this._disposed = true;
        this._disposables = [];
        return;
      } catch (err) {
        console.warn(`WASM dispose failed, using JS fallback: ${err}`);
        this._useWasm = false;
      }
    }

    if (!this._disposed) {
      this._disposed = true;

      for (let i = this._disposables.length - 1; i >= 0; i--) {
        const result = this._disposables[i].dispose();
        if (result instanceof Promise) {
          await result;
        }
      }

      this._disposables = [];
    }
  }

  get isDisposed(): boolean {
    if (this._useWasm) {
      try {
        const disposed = this._inner.isDisposed;
        this._disposed = disposed; // Keep JS state in sync
        return disposed;
      } catch (err) {
        console.warn(`WASM isDisposed failed, using JS fallback: ${err}`);
        this._useWasm = false;
      }
    }
    return this._disposed;
  }

  get size(): number {
    if (this._useWasm) {
      try {
        return this._inner.size;
      } catch (err) {
        console.warn(`WASM size failed, using JS fallback: ${err}`);
        this._useWasm = false;
      }
    }
    return this._disposables.length;
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
        this._useWasm = false;
      }
    }
    return Str.fromRaw(
      `[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`
    );
  }

  get [Symbol.toStringTag](): string {
    return DisposableGroup._type;
  }
}
