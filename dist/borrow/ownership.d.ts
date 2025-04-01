import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
export declare class OwnershipError extends AppError {
    constructor(message: Str);
}
export declare class Owned<T> {
    private _value;
    private _consumed;
    static readonly _type = "Owned";
    private constructor();
    static new<T>(value: T): Owned<T>;
    consume(): T;
    borrow<R>(fn: (value: T) => R): R;
    borrowMut<R>(fn: (value: T) => R): R;
    isConsumed(): boolean;
    toString(): Str;
    isAlive(): boolean;
    get [Symbol.toStringTag](): Str;
}
