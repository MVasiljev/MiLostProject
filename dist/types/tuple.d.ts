import { Str } from "./string";
export declare class Tuple<T extends unknown[]> {
    private readonly items;
    static readonly _type = "Tuple";
    private constructor();
    static from<T extends unknown[]>(...items: T): Tuple<T>;
    static pair<A, B>(a: A, b: B): Tuple<[A, B]>;
    get<I extends keyof T>(index: I): T[I];
    replace<I extends keyof T>(index: I, value: T[I]): Tuple<T>;
    first(): T[0];
    second(): T[1];
    toString(): Str;
    toJSON(): T;
    get [Symbol.toStringTag](): Str;
}
