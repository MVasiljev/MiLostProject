import { HashMap, HashSet, Vec, Str, u32 } from "../types";
import { Iter } from "./iter";
import { ValidationError } from "./error";
import { isWasmInitialized, getWasmModule, initWasm } from "../initWasm/init";

export async function initFunctional(): Promise<void> {
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

export function toHashMap<T, K, V>(
  iterator: Iter<T>,
  keyValueFn: (item: T) => [K, V]
): HashMap<K, V> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.toHashMapRust === "function") {
        return wasmModule.toHashMapRust(iterator, keyValueFn);
      }
    } catch (err) {
      console.warn(`WASM toHashMap failed, using JS fallback: ${err}`);
    }
  }

  const pairs = iterator.map(keyValueFn).collect();
  return HashMap.from(pairs);
}

export function toHashSet<T>(iterator: Iter<T>): HashSet<T> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.toHashSetRust === "function") {
        return wasmModule.toHashSetRust(iterator);
      }
    } catch (err) {
      console.warn(`WASM toHashSet failed, using JS fallback: ${err}`);
    }
  }

  return HashSet.from(iterator.collect());
}

export function toVec<T>(iterator: Iter<T>): Vec<T> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.toVecRust === "function") {
        return wasmModule.toVecRust(iterator);
      }
    } catch (err) {
      console.warn(`WASM toVec failed, using JS fallback: ${err}`);
    }
  }

  return iterator.collect();
}

export type StrKeyedRecord<V> = { [key: string]: V };

export function mapObject<T, U, K extends Str>(
  obj: StrKeyedRecord<T>,
  fn: (value: T, key: K) => U
): StrKeyedRecord<U> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.mapObjectRust === "function") {
        return wasmModule.mapObjectRust(obj, fn);
      }
    } catch (err) {
      console.warn(`WASM mapObject failed, using JS fallback: ${err}`);
    }
  }

  const result = {} as StrKeyedRecord<U>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key] as T, key as unknown as K);
    }
  }
  return result;
}

export function filterObject<T, K extends Str>(
  obj: StrKeyedRecord<T>,
  predicate: (value: T, key: K) => boolean
): StrKeyedRecord<T> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.filterObjectRust === "function") {
        return wasmModule.filterObjectRust(obj, predicate);
      }
    } catch (err) {
      console.warn(`WASM filterObject failed, using JS fallback: ${err}`);
    }
  }

  const result = {} as StrKeyedRecord<T>;
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      predicate(obj[key] as T, key as unknown as K)
    ) {
      result[key] = obj[key] as T;
    }
  }
  return result;
}

function isMergeableObject(item: any): item is StrKeyedRecord<any> {
  return (
    item &&
    typeof item === "object" &&
    !(item instanceof Vec) &&
    !(item instanceof HashMap) &&
    !(item instanceof HashSet)
  );
}

export function mergeDeep<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) return target;

  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (
        wasmModule.isMergeableObjectRust(target) &&
        wasmModule.isMergeableObjectRust(source)
      ) {
        Object.keys(source).forEach((key) => {
          if (
            wasmModule.isMergeableObjectRust(source[key as keyof typeof source])
          ) {
            if (!target[key as keyof typeof target]) {
              Object.assign(target, { [key]: {} });
            }
            if (source[key as keyof typeof source] !== undefined) {
              mergeDeep(
                target[key as keyof typeof target] as object,
                source[key as keyof typeof source]!
              );
            }
          } else {
            Object.assign(target, {
              [key]: source[key as keyof typeof source],
            });
          }
        });
      }
      return mergeDeep(target, ...sources);
    } catch (err) {
      console.warn(`WASM mergeDeep failed, using JS fallback: ${err}`);
    }
  }

  if (isMergeableObject(target) && isMergeableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isMergeableObject(source[key as keyof typeof source])) {
        if (!target[key as keyof typeof target]) {
          Object.assign(target, { [key]: {} });
        }
        if (source[key as keyof typeof source] !== undefined) {
          mergeDeep(
            target[key as keyof typeof target] as object,
            source[key as keyof typeof source]!
          );
        }
      } else {
        Object.assign(target, { [key]: source[key as keyof typeof source] });
      }
    });
  }

  return mergeDeep(target, ...sources);
}

export function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.pipeRust === "function") {
        return (arg: T) => wasmModule.pipeRust(fns, arg);
      }
    } catch (err) {
      console.warn(`WASM pipe failed, using JS fallback: ${err}`);
    }
  }

  return (arg) => Vec.from(fns).fold(arg, (result, fn) => fn(result));
}

export function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.composeRust === "function") {
        return (arg: T) => wasmModule.composeRust(fns, arg);
      }
    } catch (err) {
      console.warn(`WASM compose failed, using JS fallback: ${err}`);
    }
  }

  return (arg) =>
    Vec.from(fns)
      .reverse()
      .fold(arg, (result, fn) => fn(result));
}

export function curry<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): CurriedFunction<Args, Return> {
  return function curried(...args: unknown[]): any {
    if (args.length >= fn.length) {
      return fn(...(args as Args));
    }

    return function (...moreArgs: unknown[]) {
      return curried(...args, ...moreArgs);
    };
  } as CurriedFunction<Args, Return>;
}

type CurriedFunction<Args extends unknown[], Return> = Args extends [
  infer First,
  ...infer Rest
]
  ? (arg: First) => CurriedFunction<Rest, Return>
  : Return;

export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  keyFn?: (...args: Args) => Str
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    let cacheKey: string;

    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (keyFn) {
          cacheKey = keyFn(...args).unwrap();
        } else {
          cacheKey = wasmModule.createCacheKeyRust(args);
        }

        if (wasmModule.mapHasRust(cache, cacheKey)) {
          return wasmModule.mapGetRust(cache, cacheKey) as Return;
        }

        const result = fn(...args);
        wasmModule.mapSetRust(cache, cacheKey, result as any);
        return result;
      } catch (err) {
        console.warn(`WASM memoize helpers failed, using JS fallback: ${err}`);
      }
    }

    cacheKey = keyFn ? keyFn(...args).unwrap() : JSON.stringify(args);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const result = fn(...args);
    cache.set(cacheKey, result);
    return result;
  };
}

export function once<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  let called = false;
  let result: Return;

  return (...args: Args): Return => {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  };
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: u32
): (...args: Args) => void {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;
  const waitMs = wait as unknown as number;

  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();

      return (...args: Args): void => {
        const now = Date.now();

        if (wasmModule.shouldThrottleExecuteRust(lastCall, waitMs)) {
          if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
          }

          lastCall = now;
          fn(...args);
        } else {
          lastArgs = args;

          if (timeout === null) {
            timeout = setTimeout(() => {
              if (lastArgs !== null) {
                lastCall = Date.now();
                fn(...lastArgs);
              }
              timeout = null;
            }, waitMs - (now - lastCall));
          }
        }
      };
    } catch (err) {
      console.warn(`WASM throttle helpers failed, using JS fallback: ${err}`);
    }
  }

  return (...args: Args): void => {
    const now = Date.now();

    if (now - lastCall >= waitMs) {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }

      lastCall = now;
      fn(...args);
    } else {
      lastArgs = args;

      if (timeout === null) {
        timeout = setTimeout(() => {
          if (lastArgs !== null) {
            lastCall = Date.now();
            fn(...lastArgs);
          }
          timeout = null;
        }, waitMs - (now - lastCall));
      }
    }
  };
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: u32
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Args): void => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, wait as unknown as number);
  };
}

export function noop(): void {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      wasmModule.noopRust();
      return;
    } catch (err) {
      console.warn(`WASM noop failed, using JS fallback: ${err}`);
    }
  }
}

export function identity<T>(value: T): T {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      return wasmModule.identityRust(value as any) as T;
    } catch (err) {
      console.warn(`WASM identity failed, using JS fallback: ${err}`);
    }
  }
  return value;
}

export function not<T>(
  predicate: (value: T) => boolean
): (value: T) => boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();

      return (value: T): boolean => {
        const result = predicate(value);
        return wasmModule.notRust(result);
      };
    } catch (err) {
      console.warn(`WASM not helpers failed, using JS fallback: ${err}`);
    }
  }

  return (value: T) => !predicate(value);
}

export function allOf<T>(
  ...predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.allOfRust === "function") {
        return (value: T) => wasmModule.allOfRust(predicates, value);
      }
    } catch (err) {
      console.warn(`WASM allOf failed, using JS fallback: ${err}`);
    }
  }

  return (value: T) =>
    Vec.from(predicates).all((predicate) => predicate(value));
}

export function anyOf<T>(
  ...predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.anyOfRust === "function") {
        return (value: T) => wasmModule.anyOfRust(predicates, value);
      }
    } catch (err) {
      console.warn(`WASM anyOf failed, using JS fallback: ${err}`);
    }
  }

  return (value: T) =>
    Vec.from(predicates).any((predicate) => predicate(value));
}

export function prop<T, K extends keyof T>(key: K): (obj: T) => T[K] {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();

      return (obj: T): T[K] => {
        try {
          const result = wasmModule.propAccessRust(obj, key);
          return result as T[K];
        } catch (err) {
          throw new ValidationError(
            Str.fromRaw(`Property access failed for key: ${String(key)}`)
          );
        }
      };
    } catch (err) {
      console.warn(`WASM prop helpers failed, using JS fallback: ${err}`);
    }
  }

  return (obj: T) => obj[key];
}

export function hasProp<K extends Str>(
  key: K
): (obj: unknown) => obj is { [P in string]: unknown } {
  return (obj: unknown): obj is { [P in string]: unknown } => {
    return typeof obj === "object" && obj !== null && key.unwrap() in obj;
  };
}

export function propEq<T, K extends keyof T, V extends T[K]>(
  key: K,
  value: V
): (obj: T) => boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();

      return (obj: T): boolean => {
        try {
          return wasmModule.propEqRust(obj, key, value as any);
        } catch (err) {
          throw new ValidationError(
            Str.fromRaw(
              `Property equality check failed for key: ${String(key)}`
            )
          );
        }
      };
    } catch (err) {
      console.warn(`WASM propEq helpers failed, using JS fallback: ${err}`);
    }
  }

  return (obj: T) => obj[key] === value;
}

export function partial<
  Args extends unknown[],
  PartialArgs extends Partial<Args>,
  Return
>(
  fn: (...args: Args) => Return,
  ...partialArgs: PartialArgs
): (...args: RemovePartialArgs<Args, PartialArgs>) => Return {
  return (...args: any) => fn(...([...partialArgs, ...args] as Args));
}

type RemovePartialArgs<
  Args extends unknown[],
  PartialArgs extends Partial<Args>
> = Args extends [...PartialArgs, ...infer Rest] ? Rest : never;

export function flip<A, B, C>(fn: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => fn(a, b);
}

export function juxt<T, R extends unknown[]>(
  ...fns: { [K in keyof R]: (arg: T) => R[K] }
): (arg: T) => Vec<unknown> {
  return (arg: T) => Vec.from(fns.map((fn) => fn(arg)));
}

export function zipWith<T, U, R>(
  fn: (a: T, b: U) => R,
  as: Vec<T>,
  bs: Vec<U>
): Vec<R> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.zipWithRust === "function") {
        return wasmModule.zipWithRust(fn, as, bs);
      }
    } catch (err) {
      console.warn(`WASM zipWith failed, using JS fallback: ${err}`);
    }
  }

  const result: R[] = [];
  const minLen = Math.min(
    as.len() as unknown as number,
    bs.len() as unknown as number
  );

  for (let i = 0; i < minLen; i++) {
    const a = as.get(u32(i)).unwrap();
    const b = bs.get(u32(i)).unwrap();
    result.push(fn(a, b));
  }

  return Vec.from(result);
}

export function converge<
  Args extends unknown[],
  Results extends unknown[],
  Return
>(
  after: (results: Vec<unknown>) => Return,
  fns: { [K in keyof Results]: (...args: Args) => Results[K] }
): (...args: Args) => Return {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      if (typeof wasmModule.convergeRust === "function") {
        return (...args: Args) => wasmModule.convergeRust(after, fns, args);
      }
    } catch (err) {
      console.warn(`WASM converge failed, using JS fallback: ${err}`);
    }
  }

  return (...args: Args) => {
    const results = Vec.from(fns.map((fn) => fn(...args)));
    return after(results);
  };
}
