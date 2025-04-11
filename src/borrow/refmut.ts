/**
 * Mutable Reference type implementation for MiLost
 *
 * Provides a type-safe mutable reference management system with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { callWasmInstanceMethod, createWasmInstance } from "../initWasm/lib.js";
import { OwnershipError } from "./ownership.js";
import { Str } from "../types/string.js";

/**
 * Module definition for RefMut WASM implementation
 */
const refMutModule: WasmModule = {
  name: "RefMut",

  initialize(wasmModule: any) {
    console.log("Initializing RefMut module with WASM...");

    if (typeof wasmModule.RefMut === "object") {
      console.log("Found RefMut module in WASM");

      const methods = [
        "createRefMut",
        "get",
        "set",
        "drop",
        "isActive",
        "toString",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.RefMut[method] === "function") {
          console.log(`Found method: RefMut.${method}`);
        } else {
          console.warn(`Missing method: RefMut.${method}`);
        }
      });
    } else {
      console.warn("RefMut module not found in WASM module");
      throw new Error("Required WASM functions not found for RefMut module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for RefMut module");
  },
};

// Register the module
registerModule(refMutModule);

/**
 * Mutable reference type
 */
export class RefMut<T> {
  private _value: T;
  private _active: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "RefMut";

  /**
   * Create a new RefMut instance
   * @param value The value to reference mutably
   */
  constructor(value: T) {
    this._value = value;
    this._active = true;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.RefMut) {
      try {
        this._inner = createWasmInstance("RefMut.createRefMut", [value], () => {
          this._useWasm = false;
          return null;
        });
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM RefMut creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Factory method to create a RefMut instance
   * @param value The value to reference mutably
   * @returns A new RefMut instance
   */
  static create<T>(value: T): RefMut<T> {
    return new RefMut(value);
  }

  /**
   * Get the referenced value
   * @returns The referenced value
   */
  get(): T {
    if (this._useWasm && this._inner) {
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

  /**
   * Update the referenced value
   * @param updater Function to update the value
   */
  set(updater: (value: T) => T): void {
    if (this._useWasm && this._inner) {
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

  /**
   * Drop the reference, making it invalid
   */
  drop(): void {
    if (this._useWasm && this._inner) {
      callWasmInstanceMethod(this._inner, "drop", [], () => {
        this._active = false;
      });
      return;
    }

    this._active = false;
  }

  /**
   * Check if the reference is still active
   * @returns True if the reference is active
   */
  isActive(): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "isActive",
        [],
        () => this._active
      );
    }
    return this._active;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the RefMut
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`)
      );
    }
    return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): string {
    return RefMut.TYPE;
  }
}
