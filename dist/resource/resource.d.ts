import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
export declare class ResourceError extends AppError {
    constructor(message: Str);
}
export declare class Resource<T, E extends AppError = AppError> {
    private _value;
    private _disposed;
    private readonly _dispose;
    private _inner;
    private _useWasm;
    static readonly _type = "Resource";
    private constructor();
    static init(): Promise<void>;
    static new<T, E extends AppError = AppError>(value: T, dispose: (value: T) => Promise<void> | void): Resource<T, E>;
    use<R>(fn: (value: T) => R): R;
    useAsync<R>(fn: (value: T) => Promise<R>): Promise<R>;
    dispose(): Promise<void>;
    get isDisposed(): boolean;
    get valueOrNone(): Option<T>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare function withResource<T, R, E extends AppError = AppError>(resource: Resource<T, E>, fn: (value: T) => Promise<R> | R): Promise<R>;
