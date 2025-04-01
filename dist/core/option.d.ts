import { Str, Vec } from "../types";
export declare class Option<T> {
    private readonly _value?;
    private readonly _some;
    static readonly _type = "Option";
    private constructor();
    static Some<T>(value: T): Option<T>;
    static None<T>(): Option<T>;
    static from<T>(value: T | null | undefined): Option<T>;
    isSome(): boolean;
    isNone(): boolean;
    expect(message: Str): T;
    unwrap(): T;
    unwrapOr(defaultValue: T): T;
    unwrapOrElse(fn: () => T): T;
    map<U>(fn: (value: T) => U): Option<U>;
    andThen<U>(fn: (value: T) => Option<U>): Option<U>;
    or<U extends T>(optb: Option<U>): Option<T | U>;
    match<U>(onSome: (value: T) => U, onNone: () => U): U;
    filter(predicate: (value: T) => boolean): Option<T>;
    exists(predicate: (value: T) => boolean): boolean;
    static firstSome<T>(...options: Option<T>[]): Option<T>;
    static all<T>(options: Vec<Option<T>>): Option<Vec<T>>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
