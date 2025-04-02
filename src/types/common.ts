import { Vec } from ".";
import { Result, AppError, identity } from "../core";
import { Brand } from "./branding";
import { u32, i32, f64, limits } from "./primitives";
import { Str } from "./string";
import { Option } from "../core/option";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export type Fallible<T> = Result<T, AppError>;
export type AsyncFallible<T> = Promise<Result<T, AppError>>;
export type Optional<T> = Option<T>;
export type Nullable<T> = T | null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type DeepReadonly<T> = T extends Vec<infer R>
  ? Vec<DeepReadonly<R>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type Thunk<T> = () => T;

export type LoadingState = Str | Str | Str | Str;

export const LoadingStates = (() => {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const loadingStates = new wasmModule.LoadingStates();

      return {
        IDLE: loadingStates.idle,
        LOADING: loadingStates.loading,
        SUCCEEDED: loadingStates.succeeded,
        FAILED: loadingStates.failed,
      };
    } catch (error) {
      console.warn(
        `WASM LoadingStates initialization failed, using JS implementation: ${error}`
      );
    }
  }

  return {
    IDLE: Str.fromRaw("idle"),
    LOADING: Str.fromRaw("loading"),
    SUCCEEDED: Str.fromRaw("succeeded"),
    FAILED: Str.fromRaw("failed"),
  };
})();

export type ExtractOption<T> = T extends Option<infer U> ? U : never;
export type ExtractResult<T> = T extends Result<infer U, any> ? U : never;
export type ExtractError<T> = T extends Result<any, infer E> ? E : never;

export function isDefined<T>(value: T | null | undefined): value is T {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isDefined(value);
    } catch (error) {
      console.warn(`WASM isDefined failed, using JS fallback: ${error}`);
    }
  }

  return value !== null && value !== undefined;
}

export type StrRecord<T> = { [key: string]: T };

export function isObject(value: unknown): value is StrRecord<unknown> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isObject(value);
    } catch (error) {
      console.warn(`WASM isObject failed, using JS fallback: ${error}`);
    }
  }

  return typeof value === "object" && value !== null && !isVec(value);
}

export function isVec<T>(value: unknown): value is Vec<T> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isVec(value);
    } catch (error) {
      console.warn(`WASM isVec failed, using JS fallback: ${error}`);
    }
  }

  return value instanceof Vec;
}

export function isStr(value: unknown): value is Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isStr(value);
    } catch (error) {
      console.warn(`WASM isStr failed, using JS fallback: ${error}`);
    }
  }

  return value instanceof Str;
}

export function isNumeric(value: unknown): value is u32 | i32 | f64 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isNumeric(value);
    } catch (error) {
      console.warn(`WASM isNumeric failed, using JS fallback: ${error}`);
    }
  }

  if (typeof value !== "number" || Number.isNaN(value)) return false;

  const numValue = value as number;

  if (Number.isInteger(numValue)) {
    if (numValue >= limits.u32[0] && numValue <= limits.u32[1]) return true;
    if (numValue >= limits.i32[0] && numValue <= limits.i32[1]) return true;
  }

  if (Number.isFinite(numValue)) {
    if (numValue >= limits.f64[0] && numValue <= limits.f64[1]) return true;
  }

  return false;
}

export function isBoolean(value: unknown): value is boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isBoolean(value);
    } catch (error) {
      console.warn(`WASM isBoolean failed, using JS fallback: ${error}`);
    }
  }

  return typeof value === "boolean";
}

export function isFunction(value: unknown): value is Function {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.isFunction(value);
    } catch (error) {
      console.warn(`WASM isFunction failed, using JS fallback: ${error}`);
    }
  }

  return typeof value === "function";
}

export interface AsyncDisposable {
  dispose(): Promise<void>;
}

export interface Disposable {
  dispose(): void;
}

export type Json = Brand<string, Str>;
export type Positive = Brand<number, Str>;
export type Negative = Brand<number, Str>;
export type NonNegative = Brand<number, Str>;
export type Percentage = Brand<number, Str>;

export const BrandTypes = (() => {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const brandTypes = new wasmModule.BrandTypes();

      return {
        JSON: brandTypes.JSON,
        POSITIVE: brandTypes.POSITIVE,
        NEGATIVE: brandTypes.NEGATIVE,
        NON_NEGATIVE: brandTypes.NON_NEGATIVE,
        PERCENTAGE: brandTypes.PERCENTAGE,
      };
    } catch (error) {
      console.warn(
        `WASM BrandTypes initialization failed, using JS implementation: ${error}`
      );
    }
  }

  return {
    JSON: Str.fromRaw("Json"),
    POSITIVE: Str.fromRaw("Positive"),
    NEGATIVE: Str.fromRaw("Negative"),
    NON_NEGATIVE: Str.fromRaw("NonNegative"),
    PERCENTAGE: Str.fromRaw("Percentage"),
  };
})();

export function iterableToVec<T>(iterable: Iterable<T>): Vec<T> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.iterableToVec(iterable);
    } catch (error) {
      console.warn(`WASM iterableToVec failed, using JS fallback: ${error}`);
    }
  }

  return Vec.from(iterable);
}

let typesInstance: Record<string, any> | null = null;

export const Types = (() => {
  const jsFallback = {
    isDefined,
    isObject,
    isVec,
    isStr,
    isNumeric,
    isBoolean,
    isFunction,
    identity,
    iterableToVec,
  };

  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const wasmTypes = wasmModule.createTypes();

      wasmTypes.wasmInstance = wasmModule;

      typesInstance = wasmTypes;

      return wasmTypes;
    } catch (error) {
      console.warn(
        `WASM Types initialization failed, using JS implementation: ${error}`
      );
      return jsFallback;
    }
  }

  return jsFallback;
})();

export async function initCommon(): Promise<void> {
  if (!isWasmInitialized()) {
    try {
      await initWasm();
    } catch (error) {
      console.warn(`WASM module initialization failed: ${error}`);
    }
  }
}
