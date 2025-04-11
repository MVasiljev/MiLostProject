/**
 * Contract Programming Utilities for MiLost
 *
 * Provides design by contract programming utilities with WebAssembly
 * acceleration when available.
 */
import { AppError } from "../core/index.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";

/**
 * Module definition for Contract WASM implementation
 */
const contractModule: WasmModule = {
  name: "Contract",

  initialize(wasmModule: any) {
    console.log("Initializing Contract module with WASM...");

    if (typeof wasmModule.Contract === "object") {
      console.log("Found Contract module in WASM");

      const methods = ["requires", "ensures", "contract"];

      methods.forEach((method) => {
        if (typeof wasmModule.Contract[method] === "function") {
          console.log(`Found method: Contract.${method}`);
        } else {
          console.warn(`Missing method: Contract.${method}`);
        }
      });
    } else {
      console.warn("Contract module not found in WASM module");
      throw new Error("Required WASM functions not found for Contract module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Contract module");
  },
};

registerModule(contractModule);

/**
 * Custom error class for contract violations
 */
export class ContractError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Enforce a precondition
 * @param condition The condition to check
 * @param errorMessage Optional error message
 */
export function requires<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Precondition failed")
): void {
  const wasmModule = getWasmModule();
  if (wasmModule?.Contract?.requires) {
    try {
      wasmModule.Contract.requires(condition, errorMessage.toString());
      return;
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
      console.warn(`WASM requires failed, using JS fallback: ${err}`);
    }
  }

  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

/**
 * Enforce a postcondition
 * @param condition The condition to check
 * @param errorMessage Optional error message
 */
export function ensures<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Postcondition failed")
): void {
  const wasmModule = getWasmModule();
  if (wasmModule?.Contract?.ensures) {
    try {
      wasmModule.Contract.ensures(condition, errorMessage.toString());
      return;
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
      console.warn(`WASM ensures failed, using JS fallback: ${err}`);
    }
  }

  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

/**
 * Create a contracted function with pre and post conditions
 * @param fn The original function
 * @param precondition Optional precondition checker
 * @param postcondition Optional postcondition checker
 * @param preErrorMsg Optional precondition error message
 * @param postErrorMsg Optional postcondition error message
 * @returns A contracted function
 */
export function contract<T, R>(
  fn: (arg: T) => R,
  precondition?: (arg: T) => boolean,
  postcondition?: (arg: T, result: R) => boolean,
  preErrorMsg?: Str,
  postErrorMsg?: Str
): (arg: T) => R {
  const wasmModule = getWasmModule();
  if (wasmModule?.Contract?.contract) {
    try {
      const contractFn = wasmModule.Contract.contract(
        fn as any,
        precondition as any,
        postcondition as any,
        preErrorMsg?.toString(),
        postErrorMsg?.toString()
      );

      return contractFn as (arg: T) => R;
    } catch (err) {
      console.warn(`WASM contract failed, using JS fallback: ${err}`);
    }
  }

  return (arg: T): R => {
    if (precondition && !precondition(arg)) {
      throw new ContractError(
        preErrorMsg || Str.fromRaw("Precondition failed")
      );
    }

    const result = fn(arg);

    if (postcondition && !postcondition(arg, result)) {
      throw new ContractError(
        postErrorMsg || Str.fromRaw("Postcondition failed")
      );
    }

    return result;
  };
}
