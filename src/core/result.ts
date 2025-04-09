import { Str } from "../types";
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ServerError,
  NetworkError,
} from "./error";
import { Option } from "../core/option";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

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
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (ok && typeof wasmModule.createOkResultWrapper === "function") {
          this._inner = wasmModule.createOkResultWrapper(value as any);
        } else if (
          !ok &&
          typeof wasmModule.createErrResultWrapper === "function"
        ) {
          this._inner = wasmModule.createErrResultWrapper(error as any);
        } else {
          this._useWasm = false;
        }
      } catch (err) {
        console.warn(
          `WASM Result creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static Ok<T, E extends AppError = AppError>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  static Err<T, E extends AppError>(error: E): Result<T, E> {
    if (!error) {
      throw new Error("Error must be provided when creating an Err result");
    }
    return new Result<T, E>(false, undefined, error);
  }

  static Result(err: AppError): Result<never, AppError> {
    throw new Error("Method not implemented.");
  }

  isOk(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isOk();
      } catch (err) {
        console.warn(`WASM isOk failed, using JS fallback: ${err}`);
      }
    }
    return this._ok;
  }

  isErr(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isErr();
      } catch (err) {
        console.warn(`WASM isErr failed, using JS fallback: ${err}`);
      }
    }
    return !this._ok;
  }

  isError<F extends AppError>(errorType: {
    new (...args: unknown[]): F;
  }): this is Result<never, F> {
    return this.isErr() && this._error instanceof errorType;
  }

  expect(message: Str): T {
    if (this._ok && this._value !== undefined) {
      return this._value;
    }
    throw new AppError(message);
  }

  unwrap(): T {
    if (this._useWasm) {
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

  unwrapOr(defaultValue: T): T {
    if (this._useWasm) {
      try {
        return this._inner.unwrapOr(defaultValue) as T;
      } catch (err) {
        console.warn(`WASM unwrapOr failed, using JS fallback: ${err}`);
      }
    }
    return this._ok && this._value !== undefined ? this._value : defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return this._ok && this._value !== undefined ? this._value : fn();
  }

  map<U, F extends AppError = E>(fn: (value: T) => U): Result<U, F> {
    if (this._ok && this._value !== undefined) {
      return Result.Ok(fn(this._value)) as Result<U, F>;
    }
    return Result.Err(this._error as unknown as F);
  }

  mapErr<F extends AppError>(fn: (error: E) => F): Result<T, F> {
    if (this.isErr()) {
      const mappedError = fn(this._error as E);
      return Result.Err(mappedError);
    }
    return this as unknown as Result<T, F>;
  }

  andThen<U, F extends AppError = E>(
    fn: (value: T) => Result<U, F>
  ): Result<U, E | F> {
    if (this.isOk() && this._value !== undefined) {
      return fn(this._value);
    }
    return Result.Err(this._error as unknown as F);
  }

  and<U, F extends AppError = E>(res: Result<U, F>): Result<U, F> {
    return this._ok ? res : Result.Err(this._error as unknown as F);
  }

  or<F extends AppError>(res: Result<T, F>): Result<T, F> {
    return this._ok ? (this as unknown as Result<T, F>) : res;
  }

  match<U>(onOk: (value: T) => U, onErr: (error: E) => U): U {
    if (this._useWasm) {
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

  getError(): E | undefined {
    if (this._useWasm) {
      try {
        const error = this._inner.getError();
        return error === undefined ? undefined : (error as E);
      } catch (err) {
        console.warn(`WASM getError failed, using JS fallback: ${err}`);
      }
    }
    return this._error;
  }

  ok(): Option<T> {
    return this.isOk() && this._value !== undefined
      ? Option.Some(this._value)
      : Option.None<T>();
  }

  err(): Option<E> {
    return this.isErr() && this._error !== undefined
      ? Option.Some(this._error)
      : Option.None<E>();
  }

  isSuccess(): this is { _ok: true; _value: T } {
    return this._ok;
  }

  isFailure(): this is { _ok: false; _error: E } {
    return !this._ok;
  }

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

  static async apiRequest<T>(
    requestFn: () => Promise<Response>,
    defaultErrorMsg: Str = Str.fromRaw("API request failed")
  ): Promise<Result<T, AppError>> {
    try {
      const response = await requestFn();
      const data = await response.json();

      if (!response.ok) {
        const status = response.status;

        if (status === 401)
          return Result.Err(
            new UnauthorizedError(Str.fromRaw("Authentication required"))
          );
        if (status === 403)
          return Result.Err(
            new ForbiddenError(Str.fromRaw("Access forbidden"))
          );
        if (status === 404)
          return Result.Err(
            new NotFoundError(Str.fromRaw("Resource not found"))
          );
        if (status === 400)
          return Result.Err(
            new ValidationError(Str.fromRaw(data?.error || "Invalid request"))
          );
        if (status >= 500)
          return Result.Err(
            new ServerError(Str.fromRaw(data?.error || "Server error"))
          );

        return Result.Err(
          new AppError(Str.fromRaw(data?.error || defaultErrorMsg))
        );
      }

      return Result.Ok(data);
    } catch (error) {
      return Result.Err(
        new NetworkError(
          Str.fromRaw(
            error instanceof Error ? error.message : "Network request failed"
          )
        )
      );
    }
  }

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

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }
}

export function Ok<T, E extends AppError = AppError>(value: T): Result<T, E> {
  return Result.Ok<T, E>(value);
}

export function Err<T, E extends AppError>(error: E): Result<T, E> {
  return Result.Err<T, E>(error);
}

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

function generalErrorMapper(error: unknown): AppError {
  return new AppError(
    Str.fromRaw(error instanceof Error ? error.message : String(error))
  );
}

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
