/**
 * Common Utilities for MiLost
 *
 * Provides a collection of utility types, type guards, and helper functions
 * with WebAssembly acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Vec } from "./vec.js";
import { Str } from "./string.js";
import { u32, i32, f64, limits } from "./primitives.js";
import { Result, AppError, identity } from "../core/index.js";
import { Option } from "../core/option.js";
import { Brand } from "./branding.js";

/**
 * Module definition for Common WASM implementation
 */
const commonModule: WasmModule = {
  name: "Common",

  initialize(wasmModule: any) {
    console.log("Initializing Common module with WASM...");

    if (typeof wasmModule.Common === "object") {
      console.log("Found Common module in WASM");

      const methods = [
        "isDefined",
        "isObject",
        "isVec",
        "isStr",
        "isNumeric",
        "isBoolean",
        "isFunction",
        "iterableToVec",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Common[method] === "function") {
          console.log(`Found method: Common.${method}`);
        } else {
          console.warn(`Missing method: Common.${method}`);
        }
      });
    } else {
      console.warn("Common module not found in WASM module");
      throw new Error("Required WASM functions not found for Common module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Common module");
  },
};

registerModule(commonModule);

/**
 * Check if a value is defined (not null or undefined)
 * @param value The value to check
 * @returns True if the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isDefined) {
    try {
      return wasmModule.Common.isDefined(value);
    } catch (error) {
      console.warn(`WASM isDefined failed, using JS fallback: ${error}`);
    }
  }
  return value !== null && value !== undefined;
}

/**
 * Check if a value is a plain object
 * @param value The value to check
 * @returns True if the value is an object
 */
export function isObject(value: unknown): value is StrRecord<unknown> {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isObject) {
    try {
      return wasmModule.Common.isObject(value);
    } catch (error) {
      console.warn(`WASM isObject failed, using JS fallback: ${error}`);
    }
  }
  return typeof value === "object" && value !== null && !isVec(value);
}

/**
 * Check if a value is a Vec
 * @param value The value to check
 * @returns True if the value is a Vec
 */
export function isVec<T>(value: unknown): value is Vec<T> {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isVec) {
    try {
      return wasmModule.Common.isVec(value);
    } catch (error) {
      console.warn(`WASM isVec failed, using JS fallback: ${error}`);
    }
  }
  return value instanceof Vec;
}

/**
 * Check if a value is a Str
 * @param value The value to check
 * @returns True if the value is a Str
 */
export function isStr(value: unknown): value is Str {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isStr) {
    try {
      return wasmModule.Common.isStr(value);
    } catch (error) {
      console.warn(`WASM isStr failed, using JS fallback: ${error}`);
    }
  }
  return value instanceof Str;
}

/**
 * Check if a value is a numeric type
 * @param value The value to check
 * @returns True if the value is a numeric type
 */
export function isNumeric(value: unknown): value is u32 | i32 | f64 {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isNumeric) {
    try {
      return wasmModule.Common.isNumeric(value);
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

/**
 * Check if a value is a boolean
 * @param value The value to check
 * @returns True if the value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isBoolean) {
    try {
      return wasmModule.Common.isBoolean(value);
    } catch (error) {
      console.warn(`WASM isBoolean failed, using JS fallback: ${error}`);
    }
  }
  return typeof value === "boolean";
}

/**
 * Check if a value is a function
 * @param value The value to check
 * @returns True if the value is a function
 */
export function isFunction(value: unknown): value is Function {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.isFunction) {
    try {
      return wasmModule.Common.isFunction(value);
    } catch (error) {
      console.warn(`WASM isFunction failed, using JS fallback: ${error}`);
    }
  }
  return typeof value === "function";
}

/**
 * Convert an iterable to a Vec
 * @param iterable The iterable to convert
 * @returns A Vec containing the iterable's elements
 */
export function iterableToVec<T>(iterable: Iterable<T>): Vec<T> {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.iterableToVec) {
    try {
      return wasmModule.Common.iterableToVec(iterable);
    } catch (error) {
      console.warn(`WASM iterableToVec failed, using JS fallback: ${error}`);
    }
  }
  return Vec.from(iterable);
}

export type Fallible<T> = Result<T, AppError>;
export type AsyncFallible<T> = Promise<Result<T, AppError>>;
export type Optional<T> = Option<T>;
export type Nullable<T> = T | null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Readonly<T> = { readonly [P in keyof T]: T[P] };

export type DeepReadonly<T> = T extends Vec<infer R>
  ? Vec<DeepReadonly<R>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type Thunk<T> = () => T;
export type StrRecord<T> = { [key: string]: T };

export type ExtractOption<T> = T extends Option<infer U> ? U : never;
export type ExtractResult<T> = T extends Result<infer U, any> ? U : never;
export type ExtractError<T> = T extends Result<any, infer E> ? E : never;

export type Json = Brand<string, Str>;
export type Positive = Brand<number, Str>;
export type Negative = Brand<number, Str>;
export type NonNegative = Brand<number, Str>;
export type Percentage = Brand<number, Str>;

/**
 * Loading state definitions
 */
export type LoadingState = {
  IDLE: Str;
  LOADING: Str;
  SUCCEEDED: Str;
  FAILED: Str;
};

/**
 * Create loading states with WASM support
 */
export const LoadingStates: LoadingState = (() => {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.getLoadingStates) {
    try {
      return wasmModule.Common.getLoadingStates();
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

/**
 * Brand type definitions
 */
export const BrandTypes = (() => {
  const wasmModule = getWasmModule();
  if (wasmModule?.Common?.getBrandTypes) {
    try {
      return wasmModule.Common.getBrandTypes();
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

export const Types = {
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

export interface AsyncDisposable {
  dispose(): Promise<void>;
}

export interface Disposable {
  dispose(): void;
}
