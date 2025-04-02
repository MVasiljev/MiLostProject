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
    private readonly _inner;
    private readonly _useWasm;
    static readonly _type = "DisposableGroup";
    private constructor();
    static new(): DisposableGroup;
    static empty(): DisposableGroup;
    static create(): Promise<DisposableGroup>;
    static fromWasmGroup(wasmGroup: any): DisposableGroup;
    add(disposable: IDisposable): DisposableGroup;
    dispose(): Promise<void>;
    get isDisposed(): boolean;
    get size(): number;
    toString(): Str;
    get [Symbol.toStringTag](): string;
}
