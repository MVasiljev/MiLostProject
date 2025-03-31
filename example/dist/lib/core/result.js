import { Str } from "../types";
import { AppError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError, ServerError, NetworkError, } from "./error";
import { Option } from "../core/option";
export class Result {
    static Result(error) {
        throw new Error("Method not implemented.");
    }
    constructor(ok, value, error) {
        this._ok = ok;
        this._value = value;
        this._error = error;
    }
    static Ok(value) {
        return new Result(true, value, undefined);
    }
    static Err(error) {
        if (!error) {
            throw new Error("Error must be provided when creating an Err result");
        }
        return new Result(false, undefined, error);
    }
    isOk() {
        return this._ok;
    }
    isErr() {
        return !this._ok;
    }
    isError(errorType) {
        return this.isErr() && this._error instanceof errorType;
    }
    expect(message) {
        if (this._ok && this._value !== undefined) {
            return this._value;
        }
        throw new Error(message);
    }
    unwrap() {
        if (this._ok && this._value !== undefined) {
            return this._value;
        }
        throw this._error || new Error("Called unwrap on an Err result");
    }
    unwrapOr(defaultValue) {
        return this._ok && this._value !== undefined ? this._value : defaultValue;
    }
    unwrapOrElse(fn) {
        return this._ok && this._value !== undefined ? this._value : fn();
    }
    map(fn) {
        if (this._ok && this._value !== undefined) {
            return Result.Ok(fn(this._value));
        }
        return Result.Err(this._error);
    }
    mapErr(fn) {
        if (this.isErr()) {
            const mappedError = fn(this._error);
            return Result.Err(mappedError);
        }
        return this;
    }
    andThen(fn) {
        if (this.isOk() && this._value !== undefined) {
            return fn(this._value);
        }
        return Result.Err(this._error);
    }
    and(res) {
        return this._ok ? res : Result.Err(this._error);
    }
    or(res) {
        return this._ok ? this : res;
    }
    match(onOk, onErr) {
        return this._ok && this._value !== undefined
            ? onOk(this._value)
            : onErr(this._error);
    }
    getError() {
        return this._error;
    }
    ok() {
        return this.isOk() && this._value !== undefined
            ? Option.Some(this._value)
            : Option.None();
    }
    err() {
        return this.isErr() && this._error !== undefined
            ? Option.Some(this._error)
            : Option.None();
    }
    isSuccess() {
        return this._ok;
    }
    isFailure() {
        return !this._ok;
    }
    static tryCatch(fn, errorHandler) {
        try {
            return Result.Ok(fn());
        }
        catch (error) {
            const appError = errorHandler
                ? errorHandler(error)
                : new AppError(Str.fromRaw(error instanceof Error ? error.message : String(error)));
            return Result.Err(appError);
        }
    }
    static async tryCatchAsync(fn, errorHandler) {
        try {
            const value = await fn();
            return Result.Ok(value);
        }
        catch (error) {
            const appError = errorHandler
                ? errorHandler(error)
                : new AppError(Str.fromRaw(error instanceof Error ? error.message : String(error)));
            return Result.Err(appError);
        }
    }
    static fromValidation(value, validator, errorMsg) {
        if (validator(value)) {
            return Result.Ok(value);
        }
        return Result.Err(new AppError(Str.fromRaw(errorMsg)));
    }
    static async apiRequest(requestFn, defaultErrorMsg = "API request failed") {
        try {
            const response = await requestFn();
            const data = await response.json();
            if (!response.ok) {
                const status = response.status;
                if (status === 401)
                    return Result.Err(new UnauthorizedError(Str.fromRaw("Authentication required")));
                if (status === 403)
                    return Result.Err(new ForbiddenError(Str.fromRaw("Access forbidden")));
                if (status === 404)
                    return Result.Err(new NotFoundError(Str.fromRaw("Resource not found")));
                if (status === 400)
                    return Result.Err(new ValidationError(data?.error || "Invalid request"));
                if (status >= 500)
                    return Result.Err(new ServerError(data?.error || "Server error"));
                return Result.Err(new AppError(data?.error || defaultErrorMsg));
            }
            return Result.Ok(data);
        }
        catch (error) {
            return Result.Err(new NetworkError(Str.fromRaw(error instanceof Error ? error.message : "Network request failed")));
        }
    }
    static all(results) {
        const values = [];
        for (const result of results) {
            if (result.isErr()) {
                return Result.Err(result.getError());
            }
            values.push(result.unwrap());
        }
        return Result.Ok(values);
    }
}
export function Ok(value) {
    return Result.Ok(value);
}
export function Err(error) {
    return Result.Err(error);
}
export function tryFn(fn, errorMapper = generalErrorMapper) {
    try {
        return Ok(fn());
    }
    catch (error) {
        return Err(errorMapper(error));
    }
}
export async function tryAsync(fn, errorMapper = generalErrorMapper) {
    try {
        const result = await fn();
        return Ok(result);
    }
    catch (error) {
        return Err(errorMapper(error));
    }
}
export async function apiRequest(url, options = {}, errorMapper = apiErrorMapper) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            return Result.Err(errorMapper({ response, data }));
        }
        return Result.Ok(data);
    }
    catch (error) {
        return Result.Err(errorMapper(error));
    }
}
function generalErrorMapper(error) {
    return new AppError(Str.fromRaw(error instanceof Error ? error.message : String(error)));
}
function apiErrorMapper(error) {
    if (typeof error === "object" && error !== null && "response" in error) {
        const { response, data } = error;
        const status = response.status;
        if (status === 401)
            return new UnauthorizedError(data?.error || "Unauthorized");
        if (status === 403)
            return new ForbiddenError(data?.error || "Forbidden");
        if (status === 404)
            return new NotFoundError(data?.error || "Not found");
        if (status === 400)
            return new ValidationError(data?.error || "Invalid request");
        if (status >= 500)
            return new ServerError(data?.error || "Server error");
        return new AppError(data?.error || `Request failed with status ${status}`);
    }
    return new NetworkError(Str.fromRaw(error instanceof Error ? error.message : "Network error"));
}
