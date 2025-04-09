import { Str } from "../types/string.js";
import { OwnershipError } from "./ownership.js";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";
import { callWasmInstanceMethod, createWasmInstance } from "../initWasm/lib.js";

export class RefMut<T> {
  private _value: T;
  private _active: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "RefMut";

  constructor(value: T) {
    this._value = value;
    this._active = true;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      this._inner = createWasmInstance("createRefMut", [value], () => {
        this._useWasm = false;
        return null;
      });
    }
  }

  static create<T>(value: T): RefMut<T> {
    return new RefMut(value);
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

  get(): T {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "get", [], () => {
        if (!this._active) {
          throw new OwnershipError(
            Str.fromRaw("Mutable reference is no longer valid")
          );
        }
        return this._value;
      });
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
      callWasmInstanceMethod(this._inner, "set", [updater], () => {
        if (!this._active) {
          throw new OwnershipError(
            Str.fromRaw("Mutable reference is no longer valid")
          );
        }
        this._value = updater(this._value);
      });
      return;
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
      callWasmInstanceMethod(this._inner, "drop", [], () => {
        this._active = false;
      });
      return;
    }

    this._active = false;
  }

  isActive(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isActive",
        [],
        () => this._active
      );
    }
    return this._active;
  }

  toString(): Str {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`)
      );
    }
    return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
  }

  get [Symbol.toStringTag](): string {
    return RefMut.TYPE;
  }
}
