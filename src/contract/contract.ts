import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class ContractError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export async function initContracts(): Promise<void> {
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

export function requires<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Precondition failed")
): void {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      wasmModule.requires(condition, errorMessage.toString());
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

  // JS fallback
  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

export function ensures<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Postcondition failed")
): void {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      wasmModule.ensures(condition, errorMessage.toString());
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

  // JS fallback
  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

export function contract<T, R>(
  fn: (arg: T) => R,
  precondition?: (arg: T) => boolean,
  postcondition?: (arg: T, result: R) => boolean,
  preErrorMsg?: Str,
  postErrorMsg?: Str
): (arg: T) => R {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();

      const contractFn = wasmModule.contract(
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

  // JS fallback
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
