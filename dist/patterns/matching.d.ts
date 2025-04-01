import { AppError, Result } from "../core";
import { Str, i32, u32, f64, Vec } from "../types";
import { Option } from "../core/option";
export type MatchArm<T, R> = {
    pattern: MatchPattern<T>;
    handler: (value: any) => R;
};
export type MatchPattern<T> = T | ((value: T) => boolean) | {
    [K in keyof T]?: MatchPattern<T[K]>;
} | typeof SomePattern | typeof NonePattern | typeof OkPattern | typeof ErrPattern | typeof _;
export declare const SomePattern: unique symbol;
export declare const NonePattern: unique symbol;
export declare const OkPattern: unique symbol;
export declare const ErrPattern: unique symbol;
export declare const _: unique symbol;
export declare class PatternMatcher {
    static readonly _type = "PatternMatcher";
    static is: {
        nullish: <T>(val: T | null | undefined) => val is null | undefined;
        str: (val: unknown) => val is Str;
        rawString: (val: unknown) => val is string;
        numeric: (val: unknown) => val is i32 | u32 | f64;
        rawNumber: (val: unknown) => val is number;
        boolean: (val: unknown) => val is boolean;
        vec: <T>(val: unknown) => val is Vec<T>;
        object: <T extends object>(val: unknown) => val is T;
        function: <T extends Function>(val: unknown) => val is T;
        some: <T>(val: Option<T>) => boolean;
        none: <T>(val: Option<T>) => boolean;
        ok: <T, E extends AppError>(val: Result<T, E>) => boolean;
        err: <T, E extends AppError>(val: Result<T, E>) => boolean;
        empty: (val: any) => boolean;
        equalTo: <T>(target: T) => (val: unknown) => boolean;
        inRange: (min: i32, max: i32) => (val: i32) => boolean;
        predicate: <T>(fn: (val: T) => boolean) => (val: T) => boolean;
    };
    static matchesPattern<T>(value: T, pattern: MatchPattern<T>): boolean;
    static extractValue<T>(value: T, pattern: MatchPattern<T>): any;
}
export declare function matchValue<T, R>(value: T, patterns: {
    [key: string]: (value: any) => R;
} | Array<[MatchPattern<T>, (value: any) => R]>): R;
export declare function matchPattern<T, R>(value: T, patterns: Array<[(val: T) => boolean, (val: T) => R]>, defaultFn?: (val: T) => R): R;
export declare function matchType</* T */ _T, R>(value: unknown, patterns: {
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
}): R;
export declare function matchTag<T extends {
    type: Str;
} | {
    kind: Str;
} | {
    tag: Str;
}, R>(value: T, patterns: Record<string, (val: any) => R>, defaultFn?: (val: T) => R): R;
export declare function matchCases<T, R>(value: T, cases: Array<[MatchPattern<T>, (value: any) => R]>, defaultCase?: () => R): R;
export declare namespace Patterns {
    const Some: symbol;
    const None: symbol;
    const Ok: symbol;
    const Err: symbol;
    const Wildcard: symbol;
    const match: typeof matchValue;
    const pattern: typeof matchPattern;
    const type: typeof matchType;
    const tag: typeof matchTag;
    const cases: typeof matchCases;
    const is: {
        nullish: <T>(val: T | null | undefined) => val is null | undefined;
        str: (val: unknown) => val is Str;
        rawString: (val: unknown) => val is string;
        numeric: (val: unknown) => val is i32 | u32 | f64;
        rawNumber: (val: unknown) => val is number;
        boolean: (val: unknown) => val is boolean;
        vec: <T>(val: unknown) => val is Vec<T>;
        object: <T extends object>(val: unknown) => val is T;
        function: <T extends Function>(val: unknown) => val is T;
        some: <T>(val: Option<T>) => boolean;
        none: <T>(val: Option<T>) => boolean;
        ok: <T, E extends AppError>(val: Result<T, E>) => boolean;
        err: <T, E extends AppError>(val: Result<T, E>) => boolean;
        empty: (val: any) => boolean;
        equalTo: <T>(target: T) => (val: unknown) => boolean;
        inRange: (min: i32, max: i32) => (val: i32) => boolean;
        predicate: <T>(fn: (val: T) => boolean) => (val: T) => boolean;
    };
}
export { matchValue as match };
