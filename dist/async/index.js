import { Vec } from '../types/vec.js';
import { Str } from '../types/string.js';
import { u32 } from '../types/primitives.js';
import { AppError } from '../core/error.js';
import { Result } from '../core/result.js';
export class AsyncUtils {
    constructor() { }
    static async all(promises) {
        try {
            const results = await Promise.all(promises);
            const values = [];
            for (const result of results) {
                if (result.isErr()) {
                    return Result.Err(result.getError());
                }
                values.push(result.unwrap());
            }
            return Result.Ok(Vec.from(values));
        }
        catch (error) {
            return Result.Err(new AppError(Str.fromRaw("Error in async operation")));
        }
    }
    static async allSettled(promises) {
        try {
            const results = await Promise.all(promises);
            const values = [];
            const errors = [];
            for (const result of results) {
                result.match((value) => values.push(value), (error) => errors.push(error));
            }
            if (errors.length > 0) {
                return Result.Err(errors[0]);
            }
            return Result.Ok(Vec.from(values));
        }
        catch (error) {
            return Result.Err(new AppError(Str.fromRaw("Error in async operation")));
        }
    }
    static async mapSeries(items, fn) {
        const results = [];
        let index = 0;
        for (const item of items) {
            const result = await fn(item, u32(index++));
            if (result.isErr()) {
                return Result.Err(result.getError());
            }
            results.push(result.unwrap());
        }
        return Result.Ok(Vec.from(results));
    }
    static async retry(operation, options = {}) {
        const maxRetries = options.maxRetries
            ? options.maxRetries
            : 3;
        const baseDelay = options.baseDelay
            ? options.baseDelay
            : 100;
        const maxDelay = options.maxDelay
            ? options.maxDelay
            : 5000;
        const shouldRetry = options.shouldRetry || (() => true);
        let attempt = 0;
        while (true) {
            const result = await operation();
            if (result.isOk() || attempt >= maxRetries) {
                return result;
            }
            const error = result.getError();
            if (!shouldRetry(error, u32(attempt))) {
                return result;
            }
            const jitter = Math.random() * 0.3 + 0.85;
            const delay = Math.min(baseDelay * Math.pow(2, attempt) * jitter, maxDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));
            attempt++;
        }
    }
    static debounce(fn, wait) {
        let timeout = null;
        let latestResolve = null;
        let latestReject = null;
        let latestArgs = null;
        const waitMs = wait;
        return (...args) => {
            latestArgs = args;
            return new Promise((resolve, reject) => {
                latestResolve = resolve;
                latestReject = reject;
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(async () => {
                    try {
                        if (latestArgs && latestResolve) {
                            const result = await fn(...latestArgs);
                            latestResolve(result);
                        }
                    }
                    catch (error) {
                        if (latestReject) {
                            latestReject(error);
                        }
                    }
                }, waitMs);
            });
        };
    }
    static async withTimeout(promise, timeoutMs, timeoutError) {
        const timeoutMsValue = timeoutMs;
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve(Result.Err(timeoutError)), timeoutMsValue);
        });
        return Promise.race([promise, timeoutPromise]);
    }
    static cancellable(fn) {
        const controller = new AbortController();
        const { signal } = controller;
        const promise = fn(signal).catch((error) => {
            if (signal.aborted) {
                return Result.Err(new AppError(Str.fromRaw("Operation cancelled")));
            }
            return Result.Err(new AppError(Str.fromRaw(String(error))));
        });
        return {
            promise,
            cancel: () => controller.abort(),
        };
    }
    static toString() {
        return Str.fromRaw(`[AsyncUtils]`);
    }
    static get [Symbol.toStringTag]() {
        return Str.fromRaw(AsyncUtils._type);
    }
}
AsyncUtils._type = "AsyncUtils";
export var async;
(function (async) {
    async.all = AsyncUtils.all;
    async.allSettled = AsyncUtils.allSettled;
    async.mapSeries = AsyncUtils.mapSeries;
    async.retry = AsyncUtils.retry;
    async.debounce = AsyncUtils.debounce;
    async.withTimeout = AsyncUtils.withTimeout;
    async.cancellable = AsyncUtils.cancellable;
})(async || (async = {}));
//# sourceMappingURL=index.js.map