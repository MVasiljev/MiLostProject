import { Str } from "./string";
import { Vec } from "./vec";
export declare class Struct<T extends Record<string, unknown>> {
    private readonly _fields;
    private readonly _inner;
    private readonly _useWasm;
    static readonly _type = "Struct";
    private constructor();
    static from<T extends Record<string, unknown>>(fields: Partial<T>, fallback: () => T): Struct<T>;
    static empty<T extends Record<string, unknown>>(): Struct<T>;
    static create<T extends Record<string, unknown>>(fields: T): Promise<Struct<T>>;
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): Struct<T>;
    keys(): Vec<keyof T>;
    entries(): Vec<[keyof T, T[keyof T]]>;
    toObject(): T;
    toJSON(): T;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
