/**
 * Invariant type implementation for MiLost
 *
 * Provides a type-safe, immutable Invariant type with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";
import { ContractError } from "./contract.js";

/**
 * Module definition for Invariant WASM implementation
 */
const invariantModule: WasmModule = {
  name: "Invariant",

  initialize(wasmModule: any) {
    console.log("Initializing Invariant module with WASM...");

    if (typeof wasmModule.Invariant === "object") {
      console.log("Found Invariant module in WASM");

      const methods = ["createInvariant", "get", "map", "toString"];

      methods.forEach((method) => {
        if (typeof wasmModule.Invariant[method] === "function") {
          console.log(`Found method: Invariant.${method}`);
        } else {
          console.warn(`Missing method: Invariant.${method}`);
        }
      });
    } else {
      console.warn("Invariant module not found in WASM module");
      throw new Error("Required WASM functions not found for Invariant module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Invariant module");
  },
};

registerModule(invariantModule);

export class Invariant<T> {
  private readonly _value: T;
  private readonly _invariantFn: (value: T) => boolean;
  private readonly _errorMsg: Str;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Invariant";

  private constructor(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage: Str = Str.fromRaw("Invariant violated")
  ) {
    if (!invariant(value)) {
      throw new ContractError(errorMessage);
    }

    this._value = value;
    this._invariantFn = invariant;
    this._errorMsg = errorMessage;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Invariant) {
      try {
        this._inner = wasmModule.Invariant.createInvariant(
          value as any,
          this._invariantFn as any,
          this._errorMsg.toString()
        );
        this._useWasm = true;
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name === "ContractError" &&
          "message" in err
        ) {
          throw new ContractError(Str.fromRaw(String(err.message)));
        }
        console.warn(
          `WASM Invariant creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a new Invariant
   * @param value The value to create an Invariant for
   * @param invariant The invariant condition function
   * @param errorMessage Optional custom error message
   * @returns A new Invariant instance
   */
  static new<T>(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage?: Str
  ): Invariant<T> {
    return new Invariant(value, invariant, errorMessage);
  }

  /**
   * Get the underlying value
   * @returns The value of the Invariant
   */
  get(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get() as T;
      } catch (err) {
        console.warn(`WASM get failed, using JS fallback: ${err}`);
      }
    }
    return this._value;
  }

  /**
   * Transform the Invariant's value
   * @param fn Transformation function
   * @param newInvariant New invariant condition
   * @param errorMessage Optional error message
   * @returns A new Invariant with transformed value
   */
  map<U>(
    fn: (value: T) => U,
    newInvariant: (value: U) => boolean,
    errorMessage?: Str
  ): Invariant<U> {
    if (this._useWasm && this._inner) {
      try {
        const mappedInvariant = this._inner.map(
          fn as any,
          newInvariant as any,
          errorMessage?.toString()
        );

        return new Invariant<U>(
          mappedInvariant.get() as U,
          newInvariant,
          errorMessage
        );
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name === "ContractError" &&
          "message" in err
        ) {
          throw new ContractError(Str.fromRaw(String(err.message)));
        }
        console.warn(`WASM map failed, using JS fallback: ${err}`);
      }
    }

    const newValue = fn(this._value);
    return Invariant.new(newValue, newInvariant, errorMessage);
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Invariant
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[Invariant]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Invariant._type);
  }
}
