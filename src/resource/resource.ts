import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
import { getWasmModule, isWasmInitialized } from "../initWasm/init.js";
import {
  callWasmInstanceMethod,
  callWasmStaticMethod,
} from "../initWasm/lib.js";

export class ResourceError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Resource<T, E extends AppError = AppError> {
  private _value: T | null;
  private _disposed: boolean = false;
  private readonly _dispose: (value: T) => Promise<void> | void;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Resource";

  private constructor(
    value: T,
    dispose: (value: T) => Promise<void> | void,
    useWasm: boolean = true,
    existingWasmResource?: any
  ) {
    this._value = value;
    this._dispose = dispose;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmResource) {
      this._inner = existingWasmResource;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = callWasmStaticMethod(
          "Resource",
          "createManagedResource",
          [value, this._createDisposeFn(dispose)],
          () => null
        );
      } catch (err) {
        console.warn(
          `WASM Resource creation failed, falling back to JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  private _createDisposeFn(
    disposeFn: (value: T) => Promise<void> | void
  ): Function {
    return function (value: T) {
      const result = disposeFn(value);
      return result instanceof Promise ? result : Promise.resolve();
    };
  }

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await import("../initWasm/init.js").then((mod) => mod.initWasm());
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }

  static new<T, E extends AppError = AppError>(
    value: T,
    dispose: (value: T) => Promise<void> | void
  ): Resource<T, E> {
    return new Resource<T, E>(value, dispose);
  }

  static fromWasmResource<T, E extends AppError = AppError>(
    value: T,
    dispose: (value: T) => Promise<void> | void,
    wasmResource: any
  ): Resource<T, E> {
    return new Resource<T, E>(value, dispose, true, wasmResource);
  }

  use<R>(fn: (value: T) => R): R {
    if (this._useWasm) {
      try {
        return callWasmInstanceMethod(this._inner, "use", [fn], () => {
          if (this._disposed || this._value === null) {
            throw new ResourceError(Str.fromRaw("Resource has been disposed"));
          }
          return fn(this._value);
        });
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name === "ResourceError" &&
          "message" in err
        ) {
          throw new ResourceError(Str.fromRaw(String(err.message)));
        }
        console.warn(`WASM use failed, using JS fallback: ${err}`);
      }
    }

    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async useAsync<R>(fn: (value: T) => Promise<R>): Promise<R> {
    if (this._useWasm) {
      try {
        return await callWasmInstanceMethod(
          this._inner,
          "use",
          [fn],
          async () => {
            if (this._disposed || this._value === null) {
              throw new ResourceError(
                Str.fromRaw("Resource has been disposed")
              );
            }
            return fn(this._value);
          }
        );
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name === "ResourceError" &&
          "message" in err
        ) {
          throw new ResourceError(Str.fromRaw(String(err.message)));
        }
        console.warn(`WASM useAsync failed, using JS fallback: ${err}`);
      }
    }

    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async dispose(): Promise<void> {
    if (this._useWasm) {
      try {
        await callWasmInstanceMethod(this._inner, "dispose", [], async () => {
          if (!this._disposed && this._value !== null) {
            const disposeResult = this._dispose(this._value);
            if (disposeResult instanceof Promise) {
              await disposeResult;
            }
            this._disposed = true;
            this._value = null;
          }
        });
        this._disposed = true;
        this._value = null;
        return;
      } catch (err) {
        console.warn(`WASM dispose failed, using JS fallback: ${err}`);
      }
    }

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
    return callWasmInstanceMethod(
      this._inner,
      "isDisposed",
      [],
      () => this._disposed
    );
  }

  get valueOrNone(): Option<T> {
    if (this._useWasm) {
      try {
        const optionObj = callWasmInstanceMethod(
          this._inner,
          "valueOrNone",
          [],
          () => ({
            isSome: !this._disposed && this._value !== null,
            value: this._value,
          })
        );

        return optionObj.isSome
          ? Option.Some(optionObj.value as T)
          : Option.None<T>();
      } catch (err) {
        console.warn(`WASM valueOrNone failed, using JS fallback: ${err}`);
      }
    }

    return this._disposed || this._value === null
      ? Option.None<T>()
      : Option.Some(this._value);
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[Resource ${this._disposed ? "disposed" : "active"}]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Resource._type);
  }
}

export async function withResource<T, R, E extends AppError = AppError>(
  resource: Resource<T, E>,
  fn: (value: T) => Promise<R> | R
): Promise<R> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const innerResource = (resource as any)._inner;

      if (innerResource) {
        return await callWasmStaticMethod(
          "Resource",
          "withManagedResource",
          [innerResource, fn],
          async () => {
            try {
              const result = await Promise.resolve(resource.use(fn));
              return result;
            } finally {
              await resource.dispose();
            }
          }
        );
      }
    } catch (err) {
      console.warn(`WASM withResource failed, using JS fallback: ${err}`);
    }
  }

  try {
    const result = await Promise.resolve(resource.use(fn));
    return result;
  } finally {
    await resource.dispose();
  }
}
