import { Vec } from "../types/vec.js";
import { Str } from "../types/string.js";
import { u32 } from "../types/primitives.js";
import { AppError } from "../core/error.js";
import { Result } from "../core/result.js";

export class AsyncUtils {
  static readonly _type = "AsyncUtils";

  private constructor() {}

  static async all<T, E extends AppError = AppError>(
    promises: Vec<Promise<Result<T, E>>>
  ): Promise<Result<Vec<T>, E>> {
    try {
      const results = await Promise.all(promises);
      const values: T[] = [];

      for (const result of results) {
        if (result.isErr()) {
          return Result.Err(result.getError()!);
        }
        values.push(result.unwrap());
      }

      return Result.Ok(Vec.from(values));
    } catch (error) {
      return Result.Err(
        new AppError(Str.fromRaw("Error in async operation")) as E
      );
    }
  }

  static async allSettled<T, E extends AppError = AppError>(
    promises: Vec<Promise<Result<T, E>>>
  ): Promise<Result<Vec<T>, E>> {
    try {
      const results = await Promise.all(promises);
      const values: T[] = [];
      const errors: E[] = [];

      for (const result of results) {
        result.match(
          (value) => values.push(value),
          (error) => errors.push(error)
        );
      }

      if (errors.length > 0) {
        return Result.Err(errors[0] as E);
      }

      return Result.Ok(Vec.from(values));
    } catch (error) {
      return Result.Err(
        new AppError(Str.fromRaw("Error in async operation")) as E
      );
    }
  }

  static async mapSeries<T, U, E extends AppError = AppError>(
    items: Vec<T>,
    fn: (item: T, index: u32) => Promise<Result<U, E>>
  ): Promise<Result<Vec<U>, E>> {
    const results: U[] = [];
    let index = 0;

    for (const item of items) {
      const result = await fn(item, u32(index++));

      if (result.isErr()) {
        return Result.Err(result.getError()!);
      }

      results.push(result.unwrap());
    }

    return Result.Ok(Vec.from(results));
  }

  static async retry<T, E extends AppError = AppError>(
    operation: () => Promise<Result<T, E>>,
    options: {
      maxRetries?: u32;
      baseDelay?: u32;
      maxDelay?: u32;
      shouldRetry?: (error: E, attempt: u32) => boolean;
    } = {}
  ): Promise<Result<T, E>> {
    const maxRetries = options.maxRetries
      ? (options.maxRetries as unknown as number)
      : 3;
    const baseDelay = options.baseDelay
      ? (options.baseDelay as unknown as number)
      : 100;
    const maxDelay = options.maxDelay
      ? (options.maxDelay as unknown as number)
      : 5000;
    const shouldRetry = options.shouldRetry || (() => true);

    let attempt = 0;

    while (true) {
      const result = await operation();

      if (result.isOk() || attempt >= maxRetries) {
        return result;
      }

      const error = result.getError()!;

      if (!shouldRetry(error, u32(attempt))) {
        return result;
      }

      const jitter = Math.random() * 0.3 + 0.85;
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) * jitter,
        maxDelay
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }

  static debounce<
    T,
    E extends AppError = AppError,
    Args extends unknown[] = unknown[]
  >(
    fn: (...args: Args) => Promise<Result<T, E>>,
    wait: u32
  ): (...args: Args) => Promise<Result<T, E>> {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let latestResolve: ((value: Result<T, E>) => void) | null = null;
    let latestReject: ((reason: unknown) => void) | null = null;
    let latestArgs: Args | null = null;
    const waitMs = wait as unknown as number;

    return (...args: Args): Promise<Result<T, E>> => {
      latestArgs = args;

      return new Promise<Result<T, E>>((resolve, reject) => {
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
          } catch (error) {
            if (latestReject) {
              latestReject(error);
            }
          }
        }, waitMs);
      });
    };
  }

  static async withTimeout<T, E extends AppError = AppError>(
    promise: Promise<Result<T, E>>,
    timeoutMs: u32,
    timeoutError: E
  ): Promise<Result<T, E>> {
    const timeoutMsValue = timeoutMs as unknown as number;
    const timeoutPromise = new Promise<Result<T, E>>((resolve) => {
      setTimeout(() => resolve(Result.Err(timeoutError)), timeoutMsValue);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  static cancellable<T, E extends AppError = AppError>(
    fn: (signal: AbortSignal) => Promise<Result<T, E>>
  ): {
    promise: Promise<Result<T, E>>;
    cancel: () => void;
  } {
    const controller = new AbortController();
    const { signal } = controller;

    const promise = fn(signal).catch((error): Result<T, E> => {
      if (signal.aborted) {
        return Result.Err(
          new AppError(Str.fromRaw("Operation cancelled")) as E
        );
      }
      return Result.Err(new AppError(Str.fromRaw(String(error))) as E);
    });

    return {
      promise,
      cancel: () => controller.abort(),
    };
  }

  static toString(): Str {
    return Str.fromRaw(`[AsyncUtils]`);
  }

  static get [Symbol.toStringTag](): Str {
    return Str.fromRaw(AsyncUtils._type);
  }
}

export namespace async {
  export const all = AsyncUtils.all;
  export const allSettled = AsyncUtils.allSettled;
  export const mapSeries = AsyncUtils.mapSeries;
  export const retry = AsyncUtils.retry;
  export const debounce = AsyncUtils.debounce;
  export const withTimeout = AsyncUtils.withTimeout;
  export const cancellable = AsyncUtils.cancellable;
}
