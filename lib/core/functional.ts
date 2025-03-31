import { Vec } from "../types/vec";
import { HashMap } from "../types/hash_map";
import { HashSet } from "../types/hash_set";
import { Iter } from "./iter";
import { Str } from "../types/string";
import { u32 } from "../types/primitives";

export function toHashMap<T, K, V>(
  iterator: Iter<T>,
  keyValueFn: (item: T) => [K, V]
): HashMap<K, V> {
  const pairs = iterator.map(keyValueFn).collect();
  return HashMap.from(pairs);
}

export function toHashSet<T>(iterator: Iter<T>): HashSet<T> {
  return HashSet.from(iterator.collect());
}

export function toVec<T>(iterator: Iter<T>): Vec<T> {
  return Vec.from(iterator.collect());
}

export type StrKeyedRecord<K extends Str, V> = { [key: string]: V };

export function mapObject<T, U, K extends Str>(
  obj: StrKeyedRecord<K, T>,
  fn: (value: T, key: K) => U
): StrKeyedRecord<K, U> {
  const result = {} as StrKeyedRecord<K, U>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key] as T, key as unknown as K);
    }
  }

  return result;
}

export function filterObject<T, K extends Str>(
  obj: StrKeyedRecord<K, T>,
  predicate: (value: T, key: K) => boolean
): StrKeyedRecord<K, T> {
  const result = {} as StrKeyedRecord<K, T>;

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

export function mergeDeep<T>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) return target;

  if (isMergeableObject(target) && isMergeableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isMergeableObject(source[key as keyof typeof source])) {
        if (!target[key as keyof typeof target]) {
          Object.assign(target, { [key]: {} });
        }
        if (source[key as keyof typeof source] !== undefined) {
          mergeDeep(
            target[key as keyof typeof target],
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

function isMergeableObject(item: any): item is StrKeyedRecord<Str, any> {
  return (
    item &&
    typeof item === "object" &&
    !(item instanceof Vec) &&
    !(item instanceof HashMap) &&
    !(item instanceof HashSet)
  );
}

export function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg) => Vec.from(fns).fold(arg, (result, fn) => fn(result));
}

export function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
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
  const cache = HashMap.empty<Str, Return>();

  return (...args: Args): Return => {
    const key = keyFn ? keyFn(...args) : Str.fromRaw(JSON.stringify(args));

    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    cache.insert(key, result);
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

  return (...args: Args): void => {
    const now = Date.now();
    const waitMs = wait as unknown as u32;

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
    }, wait as unknown as u32);
  };
}

export function noop(): void {}

export function identity<T>(value: T): T {
  return value;
}

export function not<T>(
  predicate: (value: T) => boolean
): (value: T) => boolean {
  return (value: T) => !predicate(value);
}

export function allOf<T>(
  ...predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  return (value: T) =>
    Vec.from(predicates).all((predicate) => predicate(value));
}

export function anyOf<T>(
  ...predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  return (value: T) =>
    Vec.from(predicates).any((predicate) => predicate(value));
}

export function prop<T, K extends keyof T>(key: K): (obj: T) => T[K] {
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
  const result: R[] = [];
  const minLen = Math.min(
    as.len() as unknown as u32,
    bs.len() as unknown as u32
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
  return (...args: Args) => {
    const results = Vec.from(fns.map((fn) => fn(...args)));
    return after(results);
  };
}
