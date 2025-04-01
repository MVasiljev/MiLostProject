import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Result } from "../core/result.js";
export declare class TaskError extends AppError {
    constructor(message: Str);
}
export declare class Task<T, E extends AppError = AppError> {
    private readonly _promise;
    private _isCancelled;
    private _controller;
    private _inner;
    private _useWasm;
    static readonly _type = "Task";
    private constructor();
    static init(): Promise<void>;
    static new<T, E extends AppError = AppError>(executor: (signal: AbortSignal) => Promise<Result<T, E>>): Task<T, E>;
    static resolve<T, E extends AppError = AppError>(value: T): Task<T, E>;
    static reject<T, E extends AppError = AppError>(error: E): Task<T, E>;
    static all<T, E extends AppError = AppError>(tasks: Task<T, E>[]): Task<T[], E>;
    map<U>(fn: (value: T) => U): Task<U, E>;
    flatMap<U>(fn: (value: T) => Task<U, E>): Task<U, E>;
    catch<F extends AppError>(fn: (error: E) => Result<T, F>): Task<T, F>;
    run(): Promise<Result<T, E>>;
    cancel(): void;
    get isCancelled(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
