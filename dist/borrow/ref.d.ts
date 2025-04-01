import { Str } from "../types/string.js";
export declare class Ref<T> {
    private _value;
    private _active;
    private _inner;
    private _useWasm;
    static readonly _type = "Ref";
    private constructor();
    static new<T>(value: T): Ref<T>;
    static init(): Promise<void>;
    get(): T;
    drop(): void;
    isActive(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
