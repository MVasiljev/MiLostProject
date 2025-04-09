import { Str } from "../types/string.js";
import { OwnershipError } from "./ownership.js";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";
import { callWasmInstanceMethod, createWasmInstance } from "../initWasm/lib.js";

export class Ref<T> {
  private _value: T;
  private _active: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "Ref";

  constructor(value: T) {
    this._value = value;
    this._active = true;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      this._inner = createWasmInstance("createRef", [value], () => {
        this._useWasm = false;
        return null;
      });
    }
  }

  static create<T>(value: T): Ref<T> {
    return new Ref(value);
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
          throw new OwnershipError(Str.fromRaw("Reference is no longer valid"));
        }
        return this._value;
      });
    }

    if (!this._active) {
      throw new OwnershipError(Str.fromRaw("Reference is no longer valid"));
    }
    return this._value;
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
        Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`)
      );
    }
    return Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`);
  }

  get [Symbol.toStringTag](): string {
    return Ref.TYPE;
  }
}
