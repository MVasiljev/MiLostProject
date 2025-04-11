/**
 * Reference type implementation for MiLost
 *
 * Provides a type-safe immutable reference management system with WebAssembly
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
 * Module definition for Ref WASM implementation
 */
const refModule: WasmModule = {
  name: "Ref",

  initialize(wasmModule: any) {
    console.log("Initializing Ref module with WASM...");

    if (typeof wasmModule.Ref === "object") {
      console.log("Found Ref module in WASM");

      const methods = ["createRef", "get", "drop", "isActive", "toString"];

      methods.forEach((method) => {
        if (typeof wasmModule.Ref[method] === "function") {
          console.log(`Found method: Ref.${method}`);
        } else {
          console.warn(`Missing method: Ref.${method}`);
        }
      });
    } else {
      console.warn("Ref module not found in WASM module");
      throw new Error("Required WASM functions not found for Ref module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Ref module");
  },
};

registerModule(refModule);

/**
 * Immutable reference type
 */
export class Ref<T> {
  private _value: T;
  private _active: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "Ref";

  /**
   * Create a new Ref instance
   * @param value The value to reference
   */
  constructor(value: T) {
    this._value = value;
    this._active = true;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Ref) {
      try {
        this._inner = createWasmInstance("Ref.createRef", [value], () => {
          this._useWasm = false;
          return null;
        });
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Ref creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Factory method to create a Ref instance
   * @param value The value to reference
   * @returns A new Ref instance
   */
  static create<T>(value: T): Ref<T> {
    return new Ref(value);
  }

  /**
   * Get the referenced value
   * @returns The referenced value
   */
  get(): T {
    if (this._useWasm && this._inner) {
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
   * @returns A Str representation of the Ref
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`)
      );
    }
    return Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): string {
    return Ref.TYPE;
  }
}
