import { Str } from "../types/string";
import { AppError } from "../core/error";
import { Option } from "../core/option";

export class ResourceError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Resource<T, E extends AppError = AppError> {
  private _value: T | null;
  private _disposed: boolean = false;
  private readonly _dispose: (value: T) => Promise<void> | void;

  static readonly _type = "Resource";

  private constructor(value: T, dispose: (value: T) => Promise<void> | void) {
    this._value = value;
    this._dispose = dispose;
  }

  static new<T, E extends AppError = AppError>(
    value: T,
    dispose: (value: T) => Promise<void> | void
  ): Resource<T, E> {
    return new Resource(value, dispose);
  }

  use<R>(fn: (value: T) => R): R {
    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async useAsync<R>(fn: (value: T) => Promise<R>): Promise<R> {
    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async dispose(): Promise<void> {
    if (!this._disposed && this._value !== null) {
      const disposeResult = this._dispose(this._value);
      if (disposeResult instanceof Promise) {
        await disposeResult;
      }
      this._disposed = true;
      this._value = null;
    }
  }

  get isDisposed(): boolean {
    return this._disposed;
  }

  get valueOrNone(): Option<T> {
    return this._disposed || this._value === null
      ? Option.None()
      : Option.Some(this._value);
  }

  toString(): Str {
    return Str.fromRaw(`[Resource ${this._disposed ? "disposed" : "active"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Resource._type);
  }
}

export async function withResource<T, R, E extends AppError = AppError>(
  resource: Resource<T, E>,
  fn: (value: T) => Promise<R> | R
): Promise<R> {
  try {
    const result = await Promise.resolve(resource.use(fn));
    return result;
  } finally {
    await resource.dispose();
  }
}
