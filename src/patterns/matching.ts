import { AppError, Result, ValidationError } from "../core/index.js";
import { Str, i32, u32, f64, Vec } from "../types/index.js";
import { Option } from "../core/option.js";
import {
  getWasmModule,
  initWasm,
  isWasmInitialized,
} from "../initWasm/init.js";
import {
  callWasmStaticMethod,
  callWasmInstanceMethod,
} from "../initWasm/lib.js";

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

export class PatternMatcher {
  static readonly _type = "PatternMatcher";
  private static _isObj: any = null;
  private static _useWasm: boolean = false;

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
        PatternMatcher._useWasm = false;
        return;
      }
    }

    try {
      PatternMatcher._useWasm = isWasmInitialized();
      if (PatternMatcher._useWasm) {
        const wasmModule = getWasmModule();
        PatternMatcher._isObj =
          wasmModule.PatternMatcher.createPatternMatcherIs();
      }
    } catch (error) {
      console.warn(`WASM pattern matcher initialization failed: ${error}`);
      PatternMatcher._useWasm = false;
    }
  }

  static get useWasm(): boolean {
    return PatternMatcher._useWasm;
  }

  static get is() {
    if (PatternMatcher._isObj) {
      return PatternMatcher._isObj;
    }

    return {
      nullish: <T>(val: T | null | undefined): val is null | undefined =>
        val === null || val === undefined,

      str: (val: unknown): val is Str => val instanceof Str,

      rawString: (val: unknown): val is string => typeof val === "string",

      numeric: (val: unknown): val is i32 | u32 | f64 =>
        (typeof val === "number" && !isNaN(val)) ||
        (val instanceof Number && !isNaN(val.valueOf())),

      rawNumber: (val: unknown): val is number =>
        typeof val === "number" && !isNaN(val),

      boolean: (val: unknown): val is boolean => typeof val === "boolean",

      vec: <T>(val: unknown): val is Vec<T> => val instanceof Vec,

      object: <T extends object>(val: unknown): val is T =>
        val !== null &&
        typeof val === "object" &&
        !(val instanceof Vec) &&
        !(val instanceof Str) &&
        !(val instanceof Array),

      function: <T extends Function>(val: unknown): val is T =>
        typeof val === "function",

      some: <T>(val: Option<T>): boolean => val.isSome(),

      none: <T>(val: Option<T>): boolean => val.isNone(),

      ok: <T, E extends AppError>(val: Result<T, E>): boolean => val.isOk(),

      err: <T, E extends AppError>(val: Result<T, E>): boolean => val.isErr(),

      empty: (val: any): boolean => {
        if (val === null || val === undefined) return true;
        if (val instanceof Str) return val.unwrap().length === 0;
        if (val instanceof Vec) return val.isEmpty();
        if (typeof val === "string") return val.length === 0;
        if (typeof val === "object") return Object.keys(val).length === 0;
        return false;
      },

      equalTo:
        <T>(target: T) =>
        (val: unknown): boolean =>
          val === target,

      inRange:
        (min: i32, max: i32) =>
        (val: i32): boolean =>
          (val as unknown as number) >= (min as unknown as number) &&
          (val as unknown as number) <= (max as unknown as number),

      predicate: <T>(fn: (val: T) => boolean) => fn,
    };
  }

  static matchesPattern<T>(value: T, pattern: MatchPattern<T>): boolean {
    return callWasmStaticMethod(
      "PatternMatcher",
      "matchesPattern",
      [value, pattern],
      () => {
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
    );
  }

  static extractValue<T>(value: T, pattern: MatchPattern<T>): any {
    return callWasmStaticMethod(
      "PatternMatcher",
      "extractValue",
      [value, pattern],
      () => {
        if (pattern === SomePattern && value instanceof Option) {
          return value.unwrap();
        }

        if (pattern === ErrPattern && value instanceof Result) {
          return value.getError();
        }

        return value;
      }
    );
  }
}

export async function matchValue<T, R>(
  value: T,
  patterns:
    | { [key: string]: (value: any) => R }
    | Array<[MatchPattern<T>, (value: any) => R]>
): Promise<R> {
  await PatternMatcher.init();

  return callWasmStaticMethod(
    "PatternMatcher",
    "matchValue",
    [value, patterns],
    async () => {
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
  );
}

export async function matchPattern<T, R>(
  value: T,
  patterns: Array<[(val: T) => boolean, (val: T) => R]>,
  defaultFn?: (val: T) => R
): Promise<R> {
  await PatternMatcher.init();

  for (const [predicate, handler] of patterns) {
    if (predicate(value)) {
      return handler(value);
    }
  }
  if (defaultFn) {
    return defaultFn(value);
  }
  throw new ValidationError(
    Str.fromRaw("No pattern matched and no default provided")
  );
}

export async function matchType<_T, R>(
  value: unknown,
  patterns: {
    str?: (val: Str) => R;
    rawString?: (val: string) => R;
    numeric?: (val: i32 | u32 | f64) => R;
    rawNumber?: (val: number) => R;
    boolean?: (val: boolean) => R;
    vec?: <T>(val: Vec<T>) => R;
    object?: (val: object) => R;
    null?: () => R;
    undefined?: () => R;
    default?: (val: unknown) => R;
  }
): Promise<R> {
  await PatternMatcher.init();

  const { is } = PatternMatcher;

  if (is.str(value as unknown) && patterns.str) {
    return patterns.str(value as Str);
  }
  if (is.rawString(value as unknown) && patterns.rawString) {
    return patterns.rawString(value as string);
  }
  if (is.numeric(value as unknown) && patterns.numeric) {
    return patterns.numeric(value as i32 | u32 | f64);
  }
  if (is.rawNumber(value as unknown) && patterns.rawNumber) {
    return patterns.rawNumber(value as number);
  }
  if (is.boolean(value as unknown) && patterns.boolean) {
    return patterns.boolean(value as boolean);
  }
  if (is.vec(value as unknown) && patterns.vec) {
    return patterns.vec(value as Vec<any>);
  }
  if (is.object(value as unknown) && patterns.object) {
    return patterns.object(value as object);
  }
  if (value === null && patterns.null) {
    return patterns.null();
  }
  if (value === undefined && patterns.undefined) {
    return patterns.undefined();
  }
  if (patterns.default) {
    return patterns.default(value);
  }
  throw new ValidationError(
    Str.fromRaw("No pattern matched and no default provided")
  );
}

export async function matchTag<
  T extends { type: Str } | { kind: Str } | { tag: Str },
  R
>(
  value: T,
  patterns: Record<string, (val: any) => R>,
  defaultFn?: (val: T) => R
): Promise<R> {
  await PatternMatcher.init();

  let tag: Str | undefined;

  if ("type" in value) {
    tag = value.type;
  } else if ("kind" in value) {
    tag = value.kind;
  } else if ("tag" in value) {
    tag = value.tag;
  }

  if (tag !== undefined) {
    const tagStr = tag.unwrap();
    if (tagStr in patterns && patterns[tagStr]) {
      return patterns[tagStr](value);
    }
  }

  if (defaultFn) {
    return defaultFn(value);
  }

  const tagDisplay = tag ? tag.unwrap() : "undefined";
  throw new ValidationError(
    Str.fromRaw(
      `No pattern matched for tag "${tagDisplay}" and no default provided`
    )
  );
}

export async function matchCases<T, R>(
  value: T,
  cases: Array<[MatchPattern<T>, (value: any) => R]>,
  defaultCase?: () => R
): Promise<R> {
  try {
    return await matchValue(value, cases);
  } catch (e) {
    if (defaultCase) {
      return defaultCase();
    }
    throw e;
  }
}

export namespace Patterns {
  export const Some = SomePattern;
  export const None = NonePattern;
  export const Ok = OkPattern;
  export const Err = ErrPattern;
  export const Wildcard = _;

  export const match = matchValue;
  export const pattern = matchPattern;
  export const type = matchType;
  export const tag = matchTag;
  export const cases = matchCases;

  export const is = PatternMatcher.is;
}

export { matchValue as match };
