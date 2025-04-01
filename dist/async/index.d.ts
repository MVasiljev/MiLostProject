import { Vec } from '../types/vec.js';
import { Str } from '../types/string.js';
import { u32 } from '../types/primitives.js';
import { AppError } from '../core/error.js';
import { Result } from '../core/result.js';
export declare class AsyncUtils {
    static readonly _type = "AsyncUtils";
    private constructor();
    static all<T, E extends AppError = AppError>(promises: Vec<Promise<Result<T, E>>>): Promise<Result<Vec<T>, E>>;
    static allSettled<T, E extends AppError = AppError>(promises: Vec<Promise<Result<T, E>>>): Promise<Result<Vec<T>, E>>;
    static mapSeries<T, U, E extends AppError = AppError>(items: Vec<T>, fn: (item: T, index: u32) => Promise<Result<U, E>>): Promise<Result<Vec<U>, E>>;
    static retry<T, E extends AppError = AppError>(operation: () => Promise<Result<T, E>>, options?: {
        maxRetries?: u32;
        baseDelay?: u32;
        maxDelay?: u32;
        shouldRetry?: (error: E, attempt: u32) => boolean;
    }): Promise<Result<T, E>>;
    static debounce<T, E extends AppError = AppError, Args extends unknown[] = unknown[]>(fn: (...args: Args) => Promise<Result<T, E>>, wait: u32): (...args: Args) => Promise<Result<T, E>>;
    static withTimeout<T, E extends AppError = AppError>(promise: Promise<Result<T, E>>, timeoutMs: u32, timeoutError: E): Promise<Result<T, E>>;
    static cancellable<T, E extends AppError = AppError>(fn: (signal: AbortSignal) => Promise<Result<T, E>>): {
        promise: Promise<Result<T, E>>;
        cancel: () => void;
    };
    static toString(): Str;
    static get [Symbol.toStringTag](): Str;
}
export declare namespace async {
    const all: typeof AsyncUtils.all;
    const allSettled: typeof AsyncUtils.allSettled;
    const mapSeries: typeof AsyncUtils.mapSeries;
    const retry: typeof AsyncUtils.retry;
    const debounce: typeof AsyncUtils.debounce;
    const withTimeout: typeof AsyncUtils.withTimeout;
    const cancellable: typeof AsyncUtils.cancellable;
}
