import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
export declare class HashSet<T> implements Iterable<T> {
    private readonly _set;
    static readonly _type = "HashSet";
    private constructor();
    static from<T>(values?: Iterable<T>): HashSet<T>;
    static empty<T = never>(): HashSet<T>;
    get [Symbol.toStringTag](): string;
    size(): u32;
    isEmpty(): boolean;
    contains(value: T): boolean;
    insert(value: T): HashSet<T>;
    remove(value: T): HashSet<T>;
    values(): Vec<T>;
    forEach(callback: (value: T) => void): void;
    union(other: HashSet<T>): HashSet<T>;
    intersection(other: HashSet<T>): HashSet<T>;
    difference(other: HashSet<T>): HashSet<T>;
    symmetricDifference(other: HashSet<T>): HashSet<T>;
    isSubset(other: HashSet<T>): boolean;
    isSuperset(other: HashSet<T>): boolean;
    clear(): HashSet<T>;
    map<R>(fn: (value: T) => R): HashSet<R>;
    filter(fn: (value: T) => boolean): HashSet<T>;
    find(fn: (value: T) => boolean): T | undefined;
    [Symbol.iterator](): Iterator<T>;
    toJSON(): T[];
    toString(): Str;
}
