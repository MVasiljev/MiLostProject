/**
 * Disposable resource management for MiLost
 *
 * Provides interfaces and classes for managing disposable resources with
 * optional WebAssembly acceleration.
 */
import { Str } from "../types/string.js";
import { Resource } from "./resource.js";
import { AppError } from "../core/error.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

export interface IDisposable {
  dispose(): Promise<void> | void;
}

/**
 * Module definition for DisposableGroup WASM implementation
 */
const disposableGroupModule: WasmModule = {
  name: "DisposableGroup",

  initialize(wasmModule: any) {
    console.log("Initializing DisposableGroup module with WASM...");

    if (typeof wasmModule.DisposableGroup === "function") {
      console.log("Found DisposableGroup constructor in WASM module");
      DisposableGroup._useWasm = true;

      const staticMethods = ["new", "empty", "fromWasmGroup"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.DisposableGroup[method] === "function") {
          console.log(`Found static method: DisposableGroup.${method}`);
        } else {
          console.warn(`Missing static method: DisposableGroup.${method}`);
        }
      });

      const instanceMethods = [
        "add",
        "dispose",
        "isDisposed",
        "size",
        "toString",
      ];
      try {
        const sampleGroup = wasmModule.DisposableGroup.new();
        instanceMethods.forEach((method) => {
          if (typeof sampleGroup[method] === "function") {
            console.log(
              `Found instance method: DisposableGroup.prototype.${method}`
            );
          } else {
            console.warn(
              `Missing instance method: DisposableGroup.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample DisposableGroup instance:", error);
      }
    } else {
      throw new Error(
        "Required WASM functions not found for DisposableGroup module"
      );
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for DisposableGroup module");
    DisposableGroup._useWasm = false;
  },
};

registerModule(disposableGroupModule);

export function useDisposableResource<
  T extends IDisposable,
  E extends AppError = AppError
>(): (disposable: T) => Promise<Resource<T, E>> {
  return async (disposable: T): Promise<Resource<T, E>> => {
    if (Resource._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (
          wasmModule &&
          typeof wasmModule.Resource.fromWasmResource === "function"
        ) {
          const wasmResource = wasmModule.Resource.fromWasmResource(
            disposable,
            (d: T) => d.dispose()
          );
          return Resource.fromWasmResource<T, E>(
            disposable,
            (d) => d.dispose(),
            wasmResource
          );
        }
      } catch (error) {
        console.warn(`WASM asResource failed, using JS fallback: ${error}`);
      }
    }

    return Resource.new<T, E>(disposable, (d) => d.dispose());
  };
}

export class DisposableGroup implements IDisposable {
  private _disposables: IDisposable[] = [];
  private _disposed: boolean = false;
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;

  static readonly _type = "DisposableGroup";

  private constructor(
    useWasm: boolean = DisposableGroup._useWasm,
    existingWasmGroup?: any
  ) {
    this._useWasm = useWasm;

    if (existingWasmGroup) {
      this._inner = existingWasmGroup;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (
          wasmModule &&
          typeof wasmModule.DisposableGroup.new === "function"
        ) {
          this._inner = wasmModule.DisposableGroup.new();
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM DisposableGroup creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new(): DisposableGroup {
    return new DisposableGroup();
  }

  static empty(): DisposableGroup {
    return DisposableGroup.new();
  }

  static fromWasmGroup(wasmGroup: any): DisposableGroup {
    return new DisposableGroup(true, wasmGroup);
  }

  add(disposable: IDisposable): DisposableGroup {
    if (this._useWasm && this._inner) {
      try {
        const newWasmGroup = this._inner.add(disposable);
        const newGroup = DisposableGroup.fromWasmGroup(newWasmGroup);
        newGroup._disposables = [...this._disposables, disposable];
        newGroup._disposed = this._disposed;
        return newGroup;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Cannot add to disposed group"
        ) {
          throw new Error("Cannot add to disposed group");
        }
        console.warn(`WASM add failed, using JS fallback: ${error}`);
      }
    }

    if (this._disposed) {
      throw new Error("Cannot add to disposed group");
    }

    const newGroup = new DisposableGroup(false);
    newGroup._disposables = [...this._disposables, disposable];
    newGroup._disposed = this._disposed;

    return newGroup;
  }

  async dispose(): Promise<void> {
    if (this._useWasm && this._inner) {
      try {
        await this._inner.dispose();
        this._disposed = true;
        this._disposables = [];
        return;
      } catch (error) {
        console.warn(`WASM dispose failed, using JS fallback: ${error}`);
      }
    }

    if (!this._disposed) {
      this._disposed = true;

      for (let i = this._disposables.length - 1; i >= 0; i--) {
        try {
          const result = this._disposables[i].dispose();
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          console.error("Error disposing resource:", error);
        }
      }

      this._disposables = [];
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

  get size(): number {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.size();
      } catch (error) {
        console.warn(`WASM size failed, using JS fallback: ${error}`);
      }
    }
    return this._disposables.length;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(
      `[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`
    );
  }

  get [Symbol.toStringTag](): string {
    return DisposableGroup._type;
  }
}
