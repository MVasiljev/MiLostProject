import { Str } from "../types/string.js";
import { Resource } from "./resource.js";
import { AppError } from "../core/error.js";
export interface IDisposable {
    dispose(): Promise<void> | void;
}
export declare function asResource<T extends IDisposable, E extends AppError = AppError>(disposable: T): Promise<Resource<T, E>>;
export declare class DisposableGroup implements IDisposable {
    private _disposables;
    private _disposed;
    private _inner;
    private _useWasm;
    static readonly _type = "DisposableGroup";
    constructor();
    static init(): Promise<void>;
    add(disposable: IDisposable): this;
    dispose(): Promise<void>;
    get isDisposed(): boolean;
    get size(): number;
    toString(): Str;
    get [Symbol.toStringTag](): string;
}
