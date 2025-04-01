import { Str, i32, u32, f64, Vec } from "../types/index.js";
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
    private static _isObj;
    private static _useWasm;
    static init(): Promise<void>;
    static get useWasm(): boolean;
    static get is(): any;
    static matchesPattern<T>(value: T, pattern: MatchPattern<T>): boolean;
    static extractValue<T>(value: T, pattern: MatchPattern<T>): any;
}
export declare function matchValue<T, R>(value: T, patterns: {
    [key: string]: (value: any) => R;
} | Array<[MatchPattern<T>, (value: any) => R]>): Promise<R>;
export declare function matchPattern<T, R>(value: T, patterns: Array<[(val: T) => boolean, (val: T) => R]>, defaultFn?: (val: T) => R): Promise<R>;
export declare function matchType<_T, R>(value: unknown, patterns: {
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
}): Promise<R>;
export declare function matchTag<T extends {
    type: Str;
} | {
    kind: Str;
} | {
    tag: Str;
}, R>(value: T, patterns: Record<string, (val: any) => R>, defaultFn?: (val: T) => R): Promise<R>;
export declare function matchCases<T, R>(value: T, cases: Array<[MatchPattern<T>, (value: any) => R]>, defaultCase?: () => R): Promise<R>;
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
    const is: any;
}
export { matchValue as match };
