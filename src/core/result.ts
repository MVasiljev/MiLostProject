/**
 * Result type implementation for MiLost
 *
 * Provides a type-safe, immutable Result type with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Option } from "./option.js";
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ServerError,
  NetworkError,
} from "./error.js";
import { Str } from "../types/string.js";

/**
 * Module definition for Result WASM implementation
 */
const resultModule: WasmModule = {
  name: "Result",

  initialize(wasmModule: any) {
    console.log("Initializing Result module with WASM...");

    if (typeof wasmModule.Result === "object") {
      console.log("Found Result module in WASM");

      const methods = [
        "createOkResultWrapper",
        "createErrResultWrapper",
        "isOk",
        "isErr",
        "unwrap",
        "unwrapOr",
        "match",
        "getError",
        "tryCatch",
        "tryCatchAsync",
        "fromValidation",
        "apiRequest",
        "all",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Result[method] === "function") {
          console.log(`Found method: Result.${method}`);
        } else {
          console.warn(`Missing method: Result.${method}`);
        }
      });
    } else {
      console.warn("Result module not found in WASM module");
      throw new Error("Required WASM functions not found for Result module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Result module");
  },
};

registerModule(resultModule);

export class Result<T, E extends AppError = AppError> {
  private readonly _value?: T;
  private readonly _error?: E;
  private readonly _ok: boolean;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  private constructor(ok: boolean, value?: T, error?: E) {
    this._ok = ok;
    this._value = value;
    this._error = error;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Result) {
      try {
        if (
          ok &&
          typeof wasmModule.Result.createOkResultWrapper === "function"
        ) {
          this._inner = wasmModule.Result.createOkResultWrapper(value as any);
        } else if (
          !ok &&
          typeof wasmModule.Result.createErrResultWrapper === "function"
        ) {
          this._inner = wasmModule.Result.createErrResultWrapper(error as any);
        } else {
          this._useWasm = false;
          return;
        }
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Result creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a successful Result
   * @param value The value to wrap
   * @returns A successful Result
   */
  static Ok<T, E extends AppError = AppError>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  /**
   * Create a failed Result
   * @param error The error to wrap
   * @returns A failed Result
   */
  static Err<T, E extends AppError>(error: E): Result<T, E> {
    if (!error) {
      throw new Error("Error must be provided when creating an Err result");
    }
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * Check if the Result is successful
   * @returns True if the Result is Ok
   */
  isOk(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isOk();
      } catch (err) {
        console.warn(`WASM isOk failed, using JS fallback: ${err}`);
      }
    }
    return this._ok;
  }

  /**
   * Check if the Result is a failure
   * @returns True if the Result is an Err
   */
  isErr(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isErr();
      } catch (err) {
        console.warn(`WASM isErr failed, using JS fallback: ${err}`);
      }
    }
    return !this._ok;
  }

  /**
   * Check if the Result is an error of a specific type
   * @param errorType The error type to check
   * @returns True if the Result is an error of the specified type
   */
  isError<F extends AppError>(errorType: {
    new (...args: unknown[]): F;
  }): this is Result<never, F> {
    return this.isErr() && this._error instanceof errorType;
  }

  /**
   * Expect a value, throwing an error with a custom message if Err
   * @param message Error message to use if Result is Err
   * @returns The contained value
   */
  expect(message: Str): T {
    if (this._ok && this._value !== undefined) {
      return this._value;
    }
    throw new AppError(message);
  }

  /**
   * Unwrap the Result, throwing an error if Err
   * @returns The contained value
   */
  unwrap(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.unwrap() as T;
      } catch (err) {
        throw (
          this._error ||
          new AppError(Str.fromRaw("Called unwrap on an Err result"))
        );
      }
    }

    if (this._ok && this._value !== undefined) {
      return this._value;
    }
    throw this._error || new Error("Called unwrap on an Err result");
  }

  /**
   * Unwrap the Result or return a default value
   * @param defaultValue Value to return if Result is Err
   * @returns The contained value or the default
   */
  unwrapOr(defaultValue: T): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.unwrapOr(defaultValue) as T;
      } catch (err) {
        console.warn(`WASM unwrapOr failed, using JS fallback: ${err}`);
      }
    }
    return this._ok && this._value !== undefined ? this._value : defaultValue;
  }

  /**
   * Unwrap the Result or compute a default value
   * @param fn Function to compute default value
   * @returns The contained value or computed default
   */
  unwrapOrElse(fn: () => T): T {
    return this._ok && this._value !== undefined ? this._value : fn();
  }

  /**
   * Transform the Result's value
   * @param fn Transformation function
   * @returns A new Result with the transformed value
   */
  map<U, F extends AppError = E>(fn: (value: T) => U): Result<U, F> {
    if (this._ok && this._value !== undefined) {
      return Result.Ok(fn(this._value)) as Result<U, F>;
    }
    return Result.Err(this._error as unknown as F);
  }

  /**
   * Transform the Result's error
   * @param fn Error transformation function
   * @returns A new Result with the transformed error
   */
  mapErr<F extends AppError>(fn: (error: E) => F): Result<T, F> {
    if (this.isErr()) {
      const mappedError = fn(this._error as E);
      return Result.Err(mappedError);
    }
    return this as unknown as Result<T, F>;
  }

  /**
   * Flat map the Result's value
   * @param fn Transformation function returning another Result
   * @returns A new Result
   */
  andThen<U, F extends AppError = E>(
    fn: (value: T) => Result<U, F>
  ): Result<U, E | F> {
    if (this.isOk() && this._value !== undefined) {
      return fn(this._value);
    }
    return Result.Err(this._error as unknown as F);
  }

  /**
   * Return another Result if this Result is Ok
   * @param res Another Result
   * @returns The other Result or this Result's error
   */
  and<U, F extends AppError = E>(res: Result<U, F>): Result<U, F> {
    return this._ok ? res : Result.Err(this._error as unknown as F);
  }

  /**
   * Return this Result if Ok, otherwise return another Result
   * @param res Another Result
   * @returns This Result or the other Result
   */
  or<F extends AppError>(res: Result<T, F>): Result<T, F> {
    return this._ok ? (this as unknown as Result<T, F>) : res;
  }

  /**
   * Pattern match on the Result
   * @param onOk Function to call if Ok
   * @param onErr Function to call if Err
   * @returns Result of the matched function
   */
  match<U>(onOk: (value: T) => U, onErr: (error: E) => U): U {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.match(
          (val: T) => onOk(val),
          (err: E) => onErr(err)
        ) as U;
      } catch (err) {
        console.warn(`WASM match failed, using JS fallback: ${err}`);
      }
    }
    return this._ok && this._value !== undefined
      ? onOk(this._value)
      : onErr(this._error as E);
  }

  /**
   * Get the error if the Result is Err
   * @returns The error or undefined
   */
  getError(): E | undefined {
    if (this._useWasm && this._inner) {
      try {
        const error = this._inner.getError();
        return error === undefined ? undefined : (error as E);
      } catch (err) {
        console.warn(`WASM getError failed, using JS fallback: ${err}`);
      }
    }
    return this._error;
  }

  /**
   * Convert the Result's value to an Option
   * @returns Some with the value if Ok, None otherwise
   */
  ok(): Option<T> {
    return this.isOk() && this._value !== undefined
      ? Option.Some(this._value)
      : Option.None<T>();
  }

  /**
   * Convert the Result's error to an Option
   * @returns Some with the error if Err, None otherwise
   */
  err(): Option<E> {
    return this.isErr() && this._error !== undefined
      ? Option.Some(this._error)
      : Option.None<E>();
  }

  /**
   * Check if the Result is a success type
   * @returns True if the Result is Ok
   */
  isSuccess(): this is { _ok: true; _value: T } {
    return this._ok;
  }

  /**
   * Check if the Result is a failure type
   * @returns True if the Result is Err
   */
  isFailure(): this is { _ok: false; _error: E } {
    return !this._ok;
  }

  /**
   * Try to execute a function and wrap the result
   * @param fn Function to execute
   * @param errorHandler Optional error handler
   * @returns A Result wrapping the function's result or error
   */
  static tryCatch<T, E extends AppError = AppError>(
    fn: () => T,
    errorHandler?: (error: unknown) => E
  ): Result<T, E> {
    try {
      return Result.Ok(fn());
    } catch (error) {
      const appError = errorHandler
        ? errorHandler(error)
        : (new AppError(
            Str.fromRaw(error instanceof Error ? error.message : String(error))
          ) as E);
      return Result.Err(appError);
    }
  }

  /**
   * Try to execute an async function and wrap the result
   * @param fn Async function to execute
   * @param errorHandler Optional error handler
   * @returns A Promise resolving to a Result
   */
  static async tryCatchAsync<T, E extends AppError = AppError>(
    fn: () => Promise<T>,
    errorHandler?: (error: unknown) => E
  ): Promise<Result<T, E>> {
    try {
      const value = await fn();
      return Result.Ok(value);
    } catch (error) {
      const appError = errorHandler
        ? errorHandler(error)
        : (new AppError(
            Str.fromRaw(error instanceof Error ? error.message : String(error))
          ) as E);
      return Result.Err(appError);
    }
  }

  /**
   * Create a Result from a validation
   * @param value Value to validate
   * @param validator Validation function
   * @param errorMsg Error message if validation fails
   * @returns A Result based on validation
   */
  static fromValidation<T>(
    value: T,
    validator: (val: T) => boolean,
    errorMsg: Str
  ): Result<T, AppError> {
    if (validator(value)) {
      return Result.Ok(value);
    }
    return Result.Err(new AppError(errorMsg));
  }

  /**
   * Collect results from multiple Results
   * @param results Array of Results
   * @returns A Result containing an array of values or the first error
   */
  static all<T, E extends AppError>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];

    for (const result of results) {
      if (result.isErr()) {
        return Result.Err(result.getError()!);
      }
      values.push(result.unwrap());
    }

    return Result.Ok(values);
  }
}

/**
 * Shorthand for Result.Ok
 * @param value The value to wrap
 * @returns A successful Result
 */
export function Ok<T, E extends AppError = AppError>(value: T): Result<T, E> {
  return Result.Ok<T, E>(value);
}

/**
 * Shorthand for Result.Err
 * @param error The error to wrap
 * @returns A failed Result
 */
export function Err<T, E extends AppError>(error: E): Result<T, E> {
  return Result.Err<T, E>(error);
}

/**
 * Try to execute a function and wrap the result
 * @param fn Function to execute
 * @param errorMapper Optional error mapper
 * @returns A Result wrapping the function's result
 */
export function tryFn<T, E extends AppError = AppError>(
  fn: () => T,
  errorMapper: (error: unknown) => E = generalErrorMapper as (
    error: unknown
  ) => E
): Result<T, E> {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(errorMapper(error));
  }
}

/**
 * Try to execute an async function*
 * @param fn Async function to execute
 * @param errorMapper Optional error mapper
 * @returns A Promise resolving to a Result
 */
export async function tryAsync<T, E extends AppError = AppError>(
  fn: () => Promise<T>,
  errorMapper: (error: unknown) => E = generalErrorMapper as (
    error: unknown
  ) => E
): Promise<Result<T, E>> {
  try {
    const result = await fn();
    return Ok(result);
  } catch (error) {
    return Err(errorMapper(error));
  }
}

/**
 * Perform an API request and wrap the result
 * @param url The URL to request
 * @param options Optional fetch options
 * @param errorMapper Optional error mapper
 * @returns A Promise resolving to a Result of the API response
 */
export async function apiRequest<T>(
  url: Str,
  options: RequestInit = {},
  errorMapper: (error: unknown) => AppError = apiErrorMapper
): Promise<Result<T, AppError>> {
  try {
    const response = await fetch(url.unwrap(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      } as HeadersInit,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Result.Err(errorMapper({ response, data }));
    }

    return Result.Ok(data);
  } catch (error) {
    return Result.Err(errorMapper(error));
  }
}

/**
 * General error mapper for converting unknown errors to AppError
 * @param error The error to map
 * @returns An AppError
 */
function generalErrorMapper(error: unknown): AppError {
  return new AppError(
    Str.fromRaw(error instanceof Error ? error.message : String(error))
  );
}

/**
 * API-specific error mapper for converting HTTP errors to specific AppErrors
 * @param error The error to map
 * @returns An AppError specific to the HTTP error
 */
function apiErrorMapper(error: unknown): AppError {
  if (typeof error === "object" && error !== null && "response" in error) {
    const { response, data } = error as { response: Response; data: any };
    const status = response.status;

    if (status === 401)
      return new UnauthorizedError(Str.fromRaw(data?.error || "Unauthorized"));
    if (status === 403)
      return new ForbiddenError(Str.fromRaw(data?.error || "Forbidden"));
    if (status === 404)
      return new NotFoundError(Str.fromRaw(data?.error || "Not found"));
    if (status === 400)
      return new ValidationError(Str.fromRaw(data?.error || "Invalid request"));
    if (status >= 500)
      return new ServerError(Str.fromRaw(data?.error || "Server error"));

    return new AppError(
      Str.fromRaw(data?.error || `Request failed with status ${status}`)
    );
  }

  return new NetworkError(
    Str.fromRaw(error instanceof Error ? error.message : "Network error")
  );
}
