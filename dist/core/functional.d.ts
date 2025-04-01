import { HashMap, HashSet, Vec, Str, u32 } from "../types";
import { Iter } from "./iter";
export declare function initFunctional(): Promise<void>;
export declare function toHashMap<T, K, V>(iterator: Iter<T>, keyValueFn: (item: T) => [K, V]): HashMap<K, V>;
export declare function toHashSet<T>(iterator: Iter<T>): HashSet<T>;
export declare function toVec<T>(iterator: Iter<T>): Vec<T>;
export type StrKeyedRecord<V> = {
    [key: string]: V;
};
export declare function mapObject<T, U, K extends Str>(obj: StrKeyedRecord<T>, fn: (value: T, key: K) => U): StrKeyedRecord<U>;
export declare function filterObject<T, K extends Str>(obj: StrKeyedRecord<T>, predicate: (value: T, key: K) => boolean): StrKeyedRecord<T>;
export declare function mergeDeep<T extends object>(target: T, ...sources: Partial<T>[]): T;
export declare function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T;
export declare function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T;
export declare function curry<Args extends unknown[], Return>(fn: (...args: Args) => Return): CurriedFunction<Args, Return>;
type CurriedFunction<Args extends unknown[], Return> = Args extends [
    infer First,
    ...infer Rest
] ? (arg: First) => CurriedFunction<Rest, Return> : Return;
export declare function memoize<Args extends unknown[], Return>(fn: (...args: Args) => Return, keyFn?: (...args: Args) => Str): (...args: Args) => Return;
export declare function once<Args extends unknown[], Return>(fn: (...args: Args) => Return): (...args: Args) => Return;
export declare function throttle<Args extends unknown[]>(fn: (...args: Args) => void, wait: u32): (...args: Args) => void;
export declare function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: u32): (...args: Args) => void;
export declare function noop(): void;
export declare function identity<T>(value: T): T;
export declare function not<T>(predicate: (value: T) => boolean): (value: T) => boolean;
export declare function allOf<T>(...predicates: Array<(value: T) => boolean>): (value: T) => boolean;
export declare function anyOf<T>(...predicates: Array<(value: T) => boolean>): (value: T) => boolean;
export declare function prop<T, K extends keyof T>(key: K): (obj: T) => T[K];
export declare function hasProp<K extends Str>(key: K): (obj: unknown) => obj is {
    [P in string]: unknown;
};
export declare function propEq<T, K extends keyof T, V extends T[K]>(key: K, value: V): (obj: T) => boolean;
export declare function partial<Args extends unknown[], PartialArgs extends Partial<Args>, Return>(fn: (...args: Args) => Return, ...partialArgs: PartialArgs): (...args: RemovePartialArgs<Args, PartialArgs>) => Return;
type RemovePartialArgs<Args extends unknown[], PartialArgs extends Partial<Args>> = Args extends [...PartialArgs, ...infer Rest] ? Rest : never;
export declare function flip<A, B, C>(fn: (a: A, b: B) => C): (b: B, a: A) => C;
export declare function juxt<T, R extends unknown[]>(...fns: {
    [K in keyof R]: (arg: T) => R[K];
}): (arg: T) => Vec<unknown>;
export declare function zipWith<T, U, R>(fn: (a: T, b: U) => R, as: Vec<T>, bs: Vec<U>): Vec<R>;
export declare function converge<Args extends unknown[], Results extends unknown[], Return>(after: (results: Vec<unknown>) => Return, fns: {
    [K in keyof Results]: (...args: Args) => Results[K];
}): (...args: Args) => Return;
export {};
