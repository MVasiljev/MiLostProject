import { Vec } from ".";
import { Result, AppError, identity } from "../core";
import { Brand } from "./branding";
import { u32, i32, f64 } from "./primitives";
import { Str } from "./string";
import { Option } from "../core/option";
export type Fallible<T> = Result<T, AppError>;
export type AsyncFallible<T> = Promise<Result<T, AppError>>;
export type Optional<T> = Option<T>;
export type Nullable<T> = T | null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
export type DeepReadonly<T> = T extends Vec<infer R> ? Vec<DeepReadonly<R>> : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
export type Thunk<T> = () => T;
export type LoadingState = Str | Str | Str | Str;
export declare const LoadingStates: {
    IDLE: Str;
    LOADING: Str;
    SUCCEEDED: Str;
    FAILED: Str;
};
export type ExtractOption<T> = T extends Option<infer U> ? U : never;
export type ExtractResult<T> = T extends Result<infer U, any> ? U : never;
export type ExtractError<T> = T extends Result<any, infer E> ? E : never;
export declare function isDefined<T>(value: T | null | undefined): value is T;
export type StrRecord<T> = {
    [key: string]: T;
};
export declare function isObject(value: unknown): value is StrRecord<unknown>;
export declare function isVec<T>(value: unknown): value is Vec<T>;
export declare function isStr(value: unknown): value is Str;
export declare function isNumeric(value: unknown): value is u32 | i32 | f64;
export declare function isBoolean(value: unknown): value is boolean;
export declare function isFunction(value: unknown): value is Function;
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
export declare const BrandTypes: {
    JSON: Str;
    POSITIVE: Str;
    NEGATIVE: Str;
    NON_NEGATIVE: Str;
    PERCENTAGE: Str;
};
export declare function iterableToVec<T>(iterable: Iterable<T>): Vec<T>;
export declare const Types: {
    isDefined: typeof isDefined;
    isObject: typeof isObject;
    isVec: typeof isVec;
    isStr: typeof isStr;
    isNumeric: typeof isNumeric;
    isBoolean: typeof isBoolean;
    isFunction: typeof isFunction;
    identity: typeof identity;
    iterableToVec: typeof iterableToVec;
};
