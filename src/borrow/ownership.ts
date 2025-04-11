/**
 * Ownership type implementation for MiLost
 *
 * Provides a type-safe ownership management system with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { callWasmInstanceMethod, createWasmInstance } from "../initWasm/lib.js";
import { AppError } from "../core/index.js";
import { Str } from "../types/string.js";

/**
 * Module definition for Ownership WASM implementation
 */
const ownershipModule: WasmModule = {
  name: "Ownership",

  initialize(wasmModule: any) {
    console.log("Initializing Ownership module with WASM...");

    if (typeof wasmModule.Ownership === "object") {
      console.log("Found Ownership module in WASM");

      const methods = [
        "createOwned",
        "consume",
        "borrow",
        "borrowMut",
        "isConsumed",
        "isAlive",
        "toString",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Ownership[method] === "function") {
          console.log(`Found method: Ownership.${method}`);
        } else {
          console.warn(`Missing method: Ownership.${method}`);
        }
      });
    } else {
      console.warn("Ownership module not found in WASM module");
      throw new Error("Required WASM functions not found for Ownership module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Ownership module");
  },
};

registerModule(ownershipModule);

/**
 * Custom error for ownership violations
 */
export class OwnershipError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Ownership-managed value type
 */
export class Owned<T> {
  private _value: T | null;
  private _consumed: boolean;
  private _inner: any;
  private _useWasm: boolean;

  static readonly TYPE = "Owned";

  /**
   * Create a new Owned instance
   * @param value The value to manage
   */
  constructor(value: T) {
    this._value = value;
    this._consumed = false;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Ownership) {
      try {
        this._inner = createWasmInstance(
          "Ownership.createOwned",
          [value],
          () => {
            this._useWasm = false;
            return null;
          }
        );
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Owned creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Factory method to create an Owned instance
   * @param value The value to manage
   * @returns A new Owned instance
   */
  static create<T>(value: T): Owned<T> {
    return new Owned(value);
  }

  /**
   * Consume the value, moving ownership
   * @returns The consumed value
   */
  consume(): T {
    if (this._useWasm && this._inner) {
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

  /**
   * Borrow the value without consuming it
   * @param fn Function to apply to the borrowed value
   * @returns Result of the function
   */
  borrow<R>(fn: (value: T) => R): R {
    if (this._useWasm && this._inner) {
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

  /**
   * Mutably borrow the value without consuming it
   * @param fn Function to apply to the borrowed value
   * @returns Result of the function
   */
  borrowMut<R>(fn: (value: T) => R): R {
    if (this._useWasm && this._inner) {
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

  /**
   * Check if the value has been consumed
   * @returns True if the value is consumed
   */
  isConsumed(): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "isConsumed",
        [],
        () => this._consumed
      );
    }
    return this._consumed;
  }

  /**
   * Check if the value is still alive (not consumed)
   * @returns True if the value is not consumed
   */
  isAlive(): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "isAlive",
        [],
        () => this._value !== null
      );
    }
    return this._value !== null;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Owned value
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`)
      );
    }
    return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): string {
    return Owned.TYPE;
  }
}
