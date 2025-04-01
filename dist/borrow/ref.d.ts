import { Str } from '../types/string.js';
export declare class Ref<T> {
    private _value;
    private _active;
    static readonly _type = "Ref";
    private constructor();
    static new<T>(value: T): Ref<T>;
    get(): T;
    drop(): void;
    isActive(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
