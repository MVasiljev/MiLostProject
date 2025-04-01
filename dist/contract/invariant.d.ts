import { Str } from '../types/string.js';
export declare class Invariant<T> {
    private readonly _value;
    private readonly _invariantFn;
    private readonly _errorMsg;
    static readonly _type = "Invariant";
    private constructor();
    static new<T>(value: T, invariant: (value: T) => boolean, errorMessage?: Str): Invariant<T>;
    get(): T;
    map<U>(fn: (value: T) => U, newInvariant: (value: U) => boolean, errorMessage?: Str): Invariant<U>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
