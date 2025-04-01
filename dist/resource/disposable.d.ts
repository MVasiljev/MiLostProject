import { Str } from "../types/string";
import { Resource } from "./resource";
import { AppError } from "../core/error";
export interface IDisposable {
    dispose(): Promise<void> | void;
}
export declare function asResource<T extends IDisposable, E extends AppError = AppError>(disposable: T): Resource<T, E>;
export declare class DisposableGroup implements IDisposable {
    private _disposables;
    private _disposed;
    static readonly _type = "DisposableGroup";
    add(disposable: IDisposable): this;
    dispose(): Promise<void>;
    get isDisposed(): boolean;
    get size(): number;
    toString(): Str;
    get [Symbol.toStringTag](): string;
}
