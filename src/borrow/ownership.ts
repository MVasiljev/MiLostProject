import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class OwnershipError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Owned<T> {
  private _value: T | null;
  private _consumed: boolean = false;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Owned";

  private constructor(value: T) {
    this._value = value;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.createOwned(value as any);
      } catch (err) {
        console.warn(
          `WASM Owned creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(value: T): Owned<T> {
    return new Owned(value);
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

  consume(): T {
    if (this._useWasm) {
      try {
        const result = this._inner.consume();
        this._consumed = true;
        this._value = null;
        return result as T;
      } catch (err) {
        throw new OwnershipError(
          Str.fromRaw("Value has already been consumed")
        );
      }
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
    }

    this._consumed = true;
    const value = this._value;
    this._value = null;
    return value;
  }

  borrow<R>(fn: (value: T) => R): R {
    if (this._useWasm) {
      try {
        return this._inner.borrow((val: T) => fn(val)) as R;
      } catch (err) {
        throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
      }
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  borrowMut<R>(fn: (value: T) => R): R {
    if (this._useWasm) {
      try {
        return this._inner.borrowMut((val: T) => fn(val)) as R;
      } catch (err) {
        throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
      }
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  isConsumed(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isConsumed();
      } catch (err) {
        console.warn(`WASM isConsumed failed, using JS fallback: ${err}`);
      }
    }
    return this._consumed;
  }

  isAlive(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isAlive();
      } catch (err) {
        console.warn(`WASM isAlive failed, using JS fallback: ${err}`);
      }
    }
    return this._value !== null;
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Owned._type);
  }
}
