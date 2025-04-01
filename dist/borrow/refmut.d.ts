import { Str } from "../types/string.js";
export declare class RefMut<T> {
    private _value;
    private _active;
    private _inner;
    private _useWasm;
    static readonly _type = "RefMut";
    private constructor();
    static new<T>(value: T): RefMut<T>;
    static init(): Promise<void>;
    get(): T;
    set(updater: (value: T) => T): void;
    drop(): void;
    isActive(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
