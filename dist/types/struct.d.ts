import { Vec } from "./vec";
export declare class Struct<T extends Record<string, unknown>> {
    private readonly _fields;
    static readonly _type = "Struct";
    private constructor();
    static from<T extends Record<string, unknown>>(fields: Partial<T>, fallback: () => T): Struct<T>;
    static empty<T extends Record<string, unknown>>(): Struct<T>;
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): Struct<T>;
    keys(): Vec<keyof T>;
    entries(): Vec<[keyof T, T[keyof T]]>;
    toJSON(): T;
    toString(): string;
    get [Symbol.toStringTag](): string;
}
