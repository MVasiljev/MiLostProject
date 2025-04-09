import { Str } from "../types/string.js";
import { OwnershipError } from "./ownership.js";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

export class RefMut<T> {
  private _value: T;
  private _active: boolean = true;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "RefMut";

  private constructor(value: T) {
    this._value = value;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.createRefMut(value as any);
      } catch (err) {
        console.warn(
          `WASM RefMut creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(value: T): RefMut<T> {
    return new RefMut(value);
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

  get(): T {
    if (this._useWasm) {
      try {
        return this._inner.get() as T;
      } catch (err) {
        throw new OwnershipError(
          Str.fromRaw("Mutable reference is no longer valid")
        );
      }
    }

    if (!this._active) {
      throw new OwnershipError(
        Str.fromRaw("Mutable reference is no longer valid")
      );
    }
    return this._value;
  }

  set(updater: (value: T) => T): void {
    if (this._useWasm) {
      try {
        this._inner.set((val: T) => updater(val));
        this._value = updater(this._value);
        return;
      } catch (err) {
        throw new OwnershipError(
          Str.fromRaw("Mutable reference is no longer valid")
        );
      }
    }

    if (!this._active) {
      throw new OwnershipError(
        Str.fromRaw("Mutable reference is no longer valid")
      );
    }
    this._value = updater(this._value);
  }

  drop(): void {
    if (this._useWasm) {
      try {
        this._inner.drop();
        this._active = false;
        return;
      } catch (err) {
        console.warn(`WASM drop failed, using JS fallback: ${err}`);
      }
    }

    this._active = false;
  }

  isActive(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isActive();
      } catch (err) {
        console.warn(`WASM isActive failed, using JS fallback: ${err}`);
      }
    }
    return this._active;
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(RefMut._type);
  }
}
