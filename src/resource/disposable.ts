import { Str } from "../types/string";
import { Resource } from "./resource";
import { AppError } from "../core/error";

export interface IDisposable {
  dispose(): Promise<void> | void;
}

export function asResource<
  T extends IDisposable,
  E extends AppError = AppError
>(disposable: T): Resource<T, E> {
  return Resource.new(disposable, (d) => d.dispose());
}

export class DisposableGroup implements IDisposable {
  private _disposables: IDisposable[] = [];
  private _disposed: boolean = false;

  static readonly _type = "DisposableGroup";

  add(disposable: IDisposable): this {
    if (this._disposed) {
      throw new Error("Cannot add to disposed group");
    }
    this._disposables.push(disposable);
    return this;
  }

  async dispose(): Promise<void> {
    if (!this._disposed) {
      this._disposed = true;

      for (let i = this._disposables.length - 1; i >= 0; i--) {
        const result = this._disposables[i].dispose();
        if (result instanceof Promise) {
          await result;
        }
      }

      this._disposables = [];
    }
  }

  get isDisposed(): boolean {
    return this._disposed;
  }

  get size(): number {
    return this._disposables.length;
  }

  toString(): Str {
    return Str.fromRaw(
      `[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`
    );
  }

  get [Symbol.toStringTag](): string {
    return DisposableGroup._type;
  }
}
