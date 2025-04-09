import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";
import {
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
} from "../initWasm/lib.js";

export class OwnershipError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Owned<T> {
  private _value: T | null;
  private _consumed: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "Owned";

  constructor(value: T) {
    this._value = value;
    this._consumed = false;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      this._inner = createWasmInstance("createOwned", [value], () => {
        this._useWasm = false;
        return null;
      });
    }
  }

  static create<T>(value: T): Owned<T> {
    return new Owned(value);
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM module initialization failed: ${error}`);
      }
    }
  }

  consume(): T {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "consume", [], () => {
        if (this._consumed || this._value === null) {
          throw new OwnershipError(
            Str.fromRaw("Value has already been consumed")
          );
        }
        this._consumed = true;
        const value = this._value;
        this._value = null;
        return value!;
      });
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
    }

    this._consumed = true;
    const value = this._value;
    this._value = null;
    return value!;
  }

  borrow<R>(fn: (value: T) => R): R {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "borrow", [fn], () => {
        if (this._consumed || this._value === null) {
          throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
      });
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  borrowMut<R>(fn: (value: T) => R): R {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "borrowMut", [fn], () => {
        if (this._consumed || this._value === null) {
          throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
      });
    }

    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  isConsumed(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isConsumed",
        [],
        () => this._consumed
      );
    }
    return this._consumed;
  }

  isAlive(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isAlive",
        [],
        () => this._value !== null
      );
    }
    return this._value !== null;
  }

  toString(): Str {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`)
      );
    }
    return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
  }

  get [Symbol.toStringTag](): string {
    return Owned.TYPE;
  }
}
1;
