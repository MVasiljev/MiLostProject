import { Str } from "../types/string";
import { Resource } from "./resource";
export function asResource(disposable) {
    return Resource.new(disposable, (d) => d.dispose());
}
export class DisposableGroup {
    _disposables = [];
    _disposed = false;
    static _type = "DisposableGroup";
    add(disposable) {
        if (this._disposed) {
            throw new Error("Cannot add to disposed group");
        }
        this._disposables.push(disposable);
        return this;
    }
    async dispose() {
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
    get isDisposed() {
        return this._disposed;
    }
    get size() {
        return this._disposables.length;
    }
    toString() {
        return Str.fromRaw(`[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`);
    }
    get [Symbol.toStringTag]() {
        return DisposableGroup._type;
    }
}
