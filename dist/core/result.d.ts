import { AppError } from "./error";
import { Option } from "../core/option";
export declare class Result<T, E extends AppError = AppError> {
    static Result(/* error */ err: AppError): Result<never, AppError>;
    private readonly _value?;
    private readonly _error?;
    private readonly _ok;
    private constructor();
    static Ok<T, E extends AppError = AppError>(value: T): Result<T, E>;
    static Err<T, E extends AppError>(error: E): Result<T, E>;
    isOk(): boolean;
    isErr(): boolean;
    isError<F extends AppError>(errorType: {
        new (...args: unknown[]): F;
    }): this is Result<never, F>;
    expect(message: string): T;
    unwrap(): T;
    unwrapOr(defaultValue: T): T;
    unwrapOrElse(fn: () => T): T;
    map<U, F extends AppError = E>(fn: (value: T) => U): Result<U, F>;
    mapErr<F extends AppError>(fn: (error: E) => F): Result<T, F>;
    andThen<U, F extends AppError = E>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    and<U, F extends AppError = E>(res: Result<U, F>): Result<U, F>;
    or<F extends AppError>(res: Result<T, F>): Result<T, F>;
    match<U>(onOk: (value: T) => U, onErr: (error: E) => U): U;
    getError(): E | undefined;
    ok(): Option<T>;
    err(): Option<E>;
    isSuccess(): this is {
        _ok: true;
        _value: T;
    };
    isFailure(): this is {
        _ok: false;
        _error: E;
    };
    static tryCatch<T, E extends AppError = AppError>(fn: () => T, errorHandler?: (error: unknown) => E): Result<T, E>;
    static tryCatchAsync<T, E extends AppError = AppError>(fn: () => Promise<T>, errorHandler?: (error: unknown) => E): Promise<Result<T, E>>;
    static fromValidation<T>(value: T, validator: (val: T) => boolean, errorMsg: string): Result<T, AppError>;
    static apiRequest<T>(requestFn: () => Promise<Response>, defaultErrorMsg?: string): Promise<Result<T, AppError>>;
    static all<T, E extends AppError>(results: Result<T, E>[]): Result<T[], E>;
}
export declare function Ok<T, E extends AppError = AppError>(value: T): Result<T, E>;
export declare function Err<T, E extends AppError>(error: E): Result<T, E>;
export declare function tryFn<T, E extends AppError = AppError>(fn: () => T, errorMapper?: (error: unknown) => E): Result<T, E>;
export declare function tryAsync<T, E extends AppError = AppError>(fn: () => Promise<T>, errorMapper?: (error: unknown) => E): Promise<Result<T, E>>;
export declare function apiRequest<T>(url: string, options?: RequestInit, errorMapper?: (error: unknown) => AppError): Promise<Result<T, AppError>>;
