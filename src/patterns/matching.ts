/**
 * Pattern Matching for MiLost
 *
 * Provides a powerful pattern matching system for working with complex data structures
 * and handling various types of patterns including Options, Results, and custom objects.
 */
import { AppError, Result, ValidationError } from "../core/index.js";
import { Str, i32, u32, f64, Vec } from "../types/index.js";
import { Option } from "../core/option.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

/**
 * Pattern types for matching
 */
export type MatchPattern<T> =
  | T
  | ((value: T) => boolean)
  | { [K in keyof T]?: MatchPattern<T[K]> }
  | typeof SomePattern
  | typeof NonePattern
  | typeof OkPattern
  | typeof ErrPattern
  | typeof _;

export const SomePattern = Symbol("Some");
export const NonePattern = Symbol("None");
export const OkPattern = Symbol("Ok");
export const ErrPattern = Symbol("Err");
export const _ = Symbol("_");

/**
 * Module definition for PatternMatcher WASM implementation
 */
const patternMatcherModule: WasmModule = {
  name: "PatternMatcher",

  initialize(wasmModule: any) {
    console.log("Initializing PatternMatcher module with WASM...");

    if (wasmModule.PatternMatcher) {
      console.log("Found PatternMatcher object in WASM module");
      const methods = Object.getOwnPropertyNames(wasmModule.PatternMatcher);
      console.log("Available PatternMatcher methods:", methods);

      if (
        typeof wasmModule.PatternMatcher.createPatternMatcherIs === "function"
      ) {
        console.log("Found createPatternMatcherIs method");
        PatternMatcher._isObj =
          wasmModule.PatternMatcher.createPatternMatcherIs();
        PatternMatcher._useWasm = true;
      } else {
        console.warn(
          "Missing required method: PatternMatcher.createPatternMatcherIs"
        );
      }
    } else {
      console.log(
        "No PatternMatcher object found, checking for top-level functions"
      );

      const topLevelFunctions = [
        "createPatternMatcherIs",
        "matchesPattern",
        "extractValue",
        "matchValue",
      ];

      topLevelFunctions.forEach((func) => {
        if (typeof wasmModule[func] === "function") {
          console.log(`Found top-level function: ${func}`);
        } else {
          console.warn(`Missing top-level function: ${func}`);
        }
      });

      if (typeof wasmModule.createPatternMatcherIs === "function") {
        PatternMatcher._isObj = wasmModule.createPatternMatcherIs();
        PatternMatcher._useWasm = true;
      } else {
        throw new Error("Required WASM functions not found for PatternMatcher");
      }
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for PatternMatcher");
    PatternMatcher._useWasm = false;
    PatternMatcher._isObj = null;
  },
};

registerModule(patternMatcherModule);

/**
 * Pattern matcher utility class
 */
export class PatternMatcher {
  static readonly _type = "PatternMatcher";
  static _isObj: any = null;
  static _useWasm: boolean = false;

  /**
   * Check if WASM is enabled for pattern matching
   */
  static get useWasm(): boolean {
    return PatternMatcher._useWasm;
  }

  /**
   * Get type checking utilities
   */
  static get is() {
    if (PatternMatcher._isObj) {
      return PatternMatcher._isObj;
    }

    return {
      /**
       * Check if a value is null or undefined
       */
      nullish: <T>(val: T | null | undefined): val is null | undefined =>
        val === null || val === undefined,

      /**
       * Check if a value is a Str
       */
      str: (val: unknown): val is Str => val instanceof Str,

      /**
       * Check if a value is a raw string
       */
      rawString: (val: unknown): val is string => typeof val === "string",

      /**
       * Check if a value is a numeric type
       */
      numeric: (val: unknown): val is i32 | u32 | f64 =>
        (typeof val === "number" && !isNaN(val)) ||
        (val instanceof Number && !isNaN(val.valueOf())),

      /**
       * Check if a value is a raw number
       */
      rawNumber: (val: unknown): val is number =>
        typeof val === "number" && !isNaN(val),

      /**
       * Check if a value is a boolean
       */
      boolean: (val: unknown): val is boolean => typeof val === "boolean",

      /**
       * Check if a value is a Vec
       */
      vec: <T>(val: unknown): val is Vec<T> => val instanceof Vec,

      /**
       * Check if a value is an object
       */
      object: <T extends object>(val: unknown): val is T =>
        val !== null &&
        typeof val === "object" &&
        !(val instanceof Vec) &&
        !(val instanceof Str) &&
        !(val instanceof Array),

      /**
       * Check if a value is a function
       */
      function: <T extends Function>(val: unknown): val is T =>
        typeof val === "function",

      /**
       * Check if a value is a Some option
       */
      some: <T>(val: Option<T>): boolean => val.isSome(),

      /**
       * Check if a value is a None option
       */
      none: <T>(val: Option<T>): boolean => val.isNone(),

      /**
       * Check if a value is an Ok result
       */
      ok: <T, E extends AppError>(val: Result<T, E>): boolean => val.isOk(),

      /**
       * Check if a value is an Err result
       */
      err: <T, E extends AppError>(val: Result<T, E>): boolean => val.isErr(),

      /**
       * Check if a value is empty
       */
      empty: (val: any): boolean => {
        if (val === null || val === undefined) return true;
        if (val instanceof Str) return val.unwrap().length === 0;
        if (val instanceof Vec) return val.isEmpty();
        if (typeof val === "string") return val.length === 0;
        if (typeof val === "object") return Object.keys(val).length === 0;
        return false;
      },

      /**
       * Create a predicate that checks for equality
       */
      equalTo:
        <T>(target: T) =>
        (val: unknown): boolean =>
          val === target,

      /**
       * Create a predicate that checks if a value is in a range
       */
      inRange:
        (min: i32, max: i32) =>
        (val: i32): boolean =>
          (val as unknown as number) >= (min as unknown as number) &&
          (val as unknown as number) <= (max as unknown as number),

      /**
       * Identity function for predicates
       */
      predicate: <T>(fn: (val: T) => boolean) => fn,
    };
  }

  /**
   * Check if a value matches a pattern
   * @param value The value to check
   * @param pattern The pattern to match against
   * @returns True if the value matches the pattern
   */
  static matchesPattern<T>(value: T, pattern: MatchPattern<T>): boolean {
    if (PatternMatcher._useWasm) {
      try {
        const wasmModule = getWasmModule();

        if (wasmModule && typeof wasmModule.matchesPattern === "function") {
          return wasmModule.matchesPattern(value, pattern);
        }
      } catch (error) {
        console.warn(`WASM matchesPattern failed, using JS fallback: ${error}`);
      }
    }

    if (pattern === _) {
      return true;
    }

    if (pattern === SomePattern) {
      return value instanceof Option && value.isSome();
    }

    if (pattern === NonePattern) {
      return value instanceof Option && value.isNone();
    }

    if (pattern === OkPattern) {
      return value instanceof Result && value.isOk();
    }

    if (pattern === ErrPattern) {
      return value instanceof Result && value.isErr();
    }

    if (typeof pattern === "function") {
      return (pattern as (value: T) => boolean)(value);
    }

    if (
      typeof pattern === "object" &&
      pattern !== null &&
      !(pattern instanceof Array) &&
      !(pattern instanceof Vec)
    ) {
      if (typeof value !== "object" || value === null) {
        return false;
      }

      for (const key in pattern) {
        if (Object.prototype.hasOwnProperty.call(pattern, key)) {
          if (!(key in (value as any))) {
            return false;
          }

          if (
            !PatternMatcher.matchesPattern(
              (value as any)[key],
              (pattern as any)[key]
            )
          ) {
            return false;
          }
        }
      }
      return true;
    }

    return value === pattern;
  }

  /**
   * Extract a value from a pattern match
   * @param value The value to extract from
   * @param pattern The pattern that matched
   * @returns The extracted value
   */
  static extractValue<T>(value: T, pattern: MatchPattern<T>): any {
    if (PatternMatcher._useWasm) {
      try {
        const wasmModule = getWasmModule();

        if (wasmModule && typeof wasmModule.extractValue === "function") {
          return wasmModule.extractValue(value, pattern);
        }
      } catch (error) {
        console.warn(`WASM extractValue failed, using JS fallback: ${error}`);
      }
    }

    if (pattern === SomePattern && value instanceof Option) {
      return value.unwrap();
    }

    if (pattern === ErrPattern && value instanceof Result) {
      return value.getError();
    }

    return value;
  }
}

/**
 * Match a value against patterns
 * @param value The value to match
 * @param patterns The patterns to match against
 * @returns The result of the first matching pattern handler
 */
export async function matchValue<T, R>(
  value: T,
  patterns:
    | { [key: string]: (value: any) => R }
    | Array<[MatchPattern<T>, (value: any) => R]>
): Promise<R> {
  if (PatternMatcher._useWasm) {
    try {
      const wasmModule = getWasmModule();

      if (wasmModule && typeof wasmModule.matchValue === "function") {
        return wasmModule.matchValue(value, patterns);
      }
    } catch (error) {
      console.warn(`WASM matchValue failed, using JS fallback: ${error}`);
    }
  }

  if (!Array.isArray(patterns)) {
    if (value instanceof Option) {
      if (value.isSome() && "Some" in patterns) {
        return patterns.Some(value.unwrap());
      } else if (value.isNone() && "None" in patterns) {
        return patterns.None(value);
      }

      if ("_" in patterns) {
        return patterns._(value);
      }

      throw new ValidationError(
        Str.fromRaw("No matching pattern found for Option value")
      );
    }

    if (value instanceof Result) {
      if (value.isOk() && "Ok" in patterns) {
        return patterns.Ok(value.unwrap());
      } else if (value.isErr() && "Err" in patterns) {
        return patterns.Err(value.getError());
      }

      if ("_" in patterns) {
        return patterns._(value);
      }

      throw new ValidationError(
        Str.fromRaw("No matching pattern found for Result value")
      );
    }

    const patternArray: Array<[MatchPattern<T>, (value: any) => R]> = [];

    for (const key in patterns) {
      if (key === "Some" && patterns[key] !== undefined)
        patternArray.push([SomePattern, patterns[key]]);
      else if (key === "None" && patterns[key] !== undefined)
        patternArray.push([NonePattern, patterns[key]]);
      else if (key === "Ok" && patterns[key] !== undefined)
        patternArray.push([OkPattern, patterns[key]]);
      else if (key === "Err" && patterns[key] !== undefined)
        patternArray.push([ErrPattern, patterns[key]]);
      else if (key === "_" && patterns[key] !== undefined)
        patternArray.push([_, patterns[key]]);
      else if (patterns[key] !== undefined)
        patternArray.push([key as any, patterns[key]]);
    }

    return matchValue(value, patternArray);
  }

  for (const [pattern, handler] of patterns) {
    if (PatternMatcher.matchesPattern(value, pattern)) {
      return handler(PatternMatcher.extractValue(value, pattern));
    }
  }

  throw new ValidationError(
    Str.fromRaw("No pattern matched and no default provided")
  );
}
