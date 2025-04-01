import { Str } from "../types/string.js";
import { ContractError } from "./contract.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class Invariant<T> {
  private readonly _value: T;
  private readonly _invariantFn: (value: T) => boolean;
  private readonly _errorMsg: Str;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Invariant";

  private constructor(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage: Str = Str.fromRaw("Invariant violated")
  ) {
    this._value = value;
    this._invariantFn = invariant;
    this._errorMsg = errorMessage;
    this._useWasm = isWasmInitialized();

    // First check with JS implementation to catch errors early
    if (!invariant(value)) {
      throw new ContractError(errorMessage);
    }

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.createInvariant(
          value as any,
          this._invariantFn as any,
          this._errorMsg.toString()
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
        console.warn(
          `WASM Invariant creation failed, using JS implementation: ${err}`
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

  static new<T>(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage?: Str
  ): Invariant<T> {
    return new Invariant(value, invariant, errorMessage);
  }

  get(): T {
    if (this._useWasm) {
      try {
        return this._inner.get() as T;
      } catch (err) {
        console.warn(`WASM get failed, using JS fallback: ${err}`);
      }
    }
    return this._value;
  }

  map<U>(
    fn: (value: T) => U,
    newInvariant: (value: U) => boolean,
    errorMessage?: Str
  ): Invariant<U> {
    if (this._useWasm) {
      try {
        const mappedInvariant = this._inner.map(
          fn as any,
          newInvariant as any,
          errorMessage?.toString()
        );

        // We need to wrap the WASM invariant in our TypeScript class
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

    // JS fallback
    const newValue = fn(this._value);
    return Invariant.new(newValue, newInvariant, errorMessage);
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[Invariant]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Invariant._type);
  }
}
