/**
 * Resource management for MiLost
 *
 * Provides a Resource class for managing disposable resources with
 * optional WebAssembly acceleration.
 */
import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

export class ResourceError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Module definition for Resource WASM implementation
 */
const resourceModule: WasmModule = {
  name: "Resource",

  initialize(wasmModule: any) {
    console.log("Initializing Resource module with WASM...");

    if (typeof wasmModule.Resource === "function") {
      console.log("Found Resource constructor in WASM module");
      Resource._useWasm = true;

      const staticMethods = ["new", "fromWasmResource", "withManagedResource"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Resource[method] === "function") {
          console.log(`Found static method: Resource.${method}`);
        } else {
          console.warn(`Missing static method: Resource.${method}`);
        }
      });

      const instanceMethods = [
        "use",
        "useAsync",
        "dispose",
        "isDisposed",
        "valueOrNone",
        "toString",
      ];
      try {
        const sampleResource = wasmModule.Resource.new(null, () => {});
        instanceMethods.forEach((method) => {
          if (typeof sampleResource[method] === "function") {
            console.log(`Found instance method: Resource.prototype.${method}`);
          } else {
            console.warn(
              `Missing instance method: Resource.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Resource instance:", error);
      }
    } else {
      throw new Error("Required WASM functions not found for Resource module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Resource module");
    Resource._useWasm = false;
  },
};

registerModule(resourceModule);

export class Resource<T, E extends AppError = AppError> {
  private _value: T | null;
  private _disposed: boolean = false;
  private readonly _dispose: (value: T) => Promise<void> | void;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;

  static readonly _type = "Resource";

  private constructor(
    value: T,
    dispose: (value: T) => Promise<void> | void,
    useWasm: boolean = Resource._useWasm,
    existingWasmResource?: any
  ) {
    this._value = value;
    this._dispose = dispose;
    this._useWasm = useWasm;

    if (existingWasmResource) {
      this._inner = existingWasmResource;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Resource.new === "function") {
          this._inner = wasmModule.Resource.new(value, dispose);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Resource creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
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
    if (this._useWasm && this._inner) {
      try {
        return this._inner.use(fn);
      } catch (error) {
        if (error instanceof Error && error.name === "ResourceError") {
          throw new ResourceError(Str.fromRaw(error.message));
        }
        console.warn(`WASM use failed, using JS fallback: ${error}`);
      }
    }

    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async useAsync<R>(fn: (value: T) => Promise<R>): Promise<R> {
    if (this._useWasm && this._inner) {
      try {
        return await this._inner.useAsync(fn);
      } catch (error) {
        if (error instanceof Error && error.name === "ResourceError") {
          throw new ResourceError(Str.fromRaw(error.message));
        }
        console.warn(`WASM useAsync failed, using JS fallback: ${error}`);
      }
    }

    if (this._disposed || this._value === null) {
      throw new ResourceError(Str.fromRaw("Resource has been disposed"));
    }

    return fn(this._value);
  }

  async dispose(): Promise<void> {
    if (this._useWasm && this._inner) {
      try {
        await this._inner.dispose();
        this._disposed = true;
        this._value = null;
        return;
      } catch (error) {
        console.warn(`WASM dispose failed, using JS fallback: ${error}`);
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
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isDisposed();
      } catch (error) {
        console.warn(`WASM isDisposed failed, using JS fallback: ${error}`);
      }
    }
    return this._disposed;
  }

  get valueOrNone(): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const optionObj = this._inner.valueOrNone();
        return optionObj.isSome()
          ? Option.Some(optionObj.value())
          : Option.None<T>();
      } catch (error) {
        console.warn(`WASM valueOrNone failed, using JS fallback: ${error}`);
      }
    }

    return this._disposed || this._value === null
      ? Option.None<T>()
      : Option.Some(this._value);
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
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
  if (Resource._useWasm) {
    try {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        typeof wasmModule.Resource.withManagedResource === "function"
      ) {
        return await wasmModule.Resource.withManagedResource(resource, fn);
      }
    } catch (error) {
      console.warn(`WASM withResource failed, using JS fallback: ${error}`);
    }
  }

  try {
    const result = await Promise.resolve(resource.use(fn));
    return result;
  } finally {
    await resource.dispose();
  }
}
