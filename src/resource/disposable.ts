import { Str } from "../types/string.js";
import { Resource } from "./resource.js";
import { AppError } from "../core/error.js";
import {
  getWasmModule,
  initWasm,
  isWasmInitialized,
} from "../initWasm/init.js";
import {
  callWasmInstanceMethod,
  callWasmStaticMethod,
} from "../initWasm/lib.js";

export interface IDisposable {
  dispose(): Promise<void> | void;
}

export function useDisposableResource<
  T extends IDisposable,
  E extends AppError = AppError
>() {
  return async (disposable: T): Promise<Resource<T, E>> => {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmResource = callWasmStaticMethod(
          "Resource",
          "asResource",
          [disposable],
          () => null
        );

        return Resource.fromWasmResource<T, E>(
          disposable,
          (d) => d.dispose(),
          wasmResource
        );
      } catch (err) {
        console.warn(`WASM asResource failed, using JS fallback: ${err}`);
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

  static readonly _type = "DisposableGroup";

  private constructor(useWasm: boolean = true, existingWasmGroup?: any) {
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmGroup) {
      this._inner = existingWasmGroup;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "DisposableGroup",
          "create",
          [],
          () => null
        );
      } catch (err) {
        console.warn(
          `WASM DisposableGroup creation failed, falling back to JS implementation: ${err}`
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

  static async create(): Promise<DisposableGroup> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new DisposableGroup();
  }

  static fromWasmGroup(wasmGroup: any): DisposableGroup {
    return new DisposableGroup(true, wasmGroup);
  }

  add(disposable: IDisposable): DisposableGroup {
    if (this._useWasm) {
      try {
        const newWasmGroup = callWasmInstanceMethod(
          this._inner,
          "add",
          [disposable],
          () => {
            if (this._disposed) {
              throw new Error("Cannot add to disposed group");
            }
            const newGroup = new DisposableGroup(false);
            newGroup._disposables = [...this._disposables, disposable];
            return newGroup;
          }
        );

        const newGroup = DisposableGroup.fromWasmGroup(newWasmGroup);
        newGroup._disposables = [...this._disposables, disposable];
        newGroup._disposed = this._disposed;
        return newGroup;
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          String(err.message).includes("Cannot add to disposed group")
        ) {
          throw new Error("Cannot add to disposed group");
        }
        console.warn(`WASM add failed, using JS fallback: ${err}`);
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
    if (this._useWasm) {
      try {
        await callWasmInstanceMethod(this._inner, "dispose", [], async () => {
          if (!this._disposed) {
            for (let i = this._disposables.length - 1; i >= 0; i--) {
              try {
                const result = this._disposables[i].dispose();
                if (result instanceof Promise) {
                  await result;
                }
              } catch (err) {
                console.error("Error disposing resource:", err);
              }
            }
            this._disposables = [];
          }
        });
        this._disposed = true;
        this._disposables = [];
        return;
      } catch (err) {
        console.warn(`WASM dispose failed, using JS fallback: ${err}`);
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
        } catch (err) {
          console.error("Error disposing resource:", err);
        }
      }

      this._disposables = [];
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

  get size(): number {
    return callWasmInstanceMethod(
      this._inner,
      "size",
      [],
      () => this._disposables.length
    );
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(
        `[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`
      )
    );
  }

  get [Symbol.toStringTag](): string {
    return DisposableGroup._type;
  }
}
