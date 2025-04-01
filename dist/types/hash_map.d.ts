import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
export declare class HashMap<K, V> implements Iterable<[K, V]> {
    private readonly _map;
    static readonly _type = "HashMap";
    private constructor();
    static from<K, V>(entries?: Iterable<[K, V]>): HashMap<K, V>;
    static empty<K = never, V = never>(): HashMap<K, V>;
    get [Symbol.toStringTag](): string;
    size(): u32;
    isEmpty(): boolean;
    get(key: K): V | undefined;
    contains(key: K): boolean;
    insert(key: K, value: V): HashMap<K, V>;
    remove(key: K): HashMap<K, V>;
    keys(): Vec<K>;
    values(): Vec<V>;
    entries(): Vec<[K, V]>;
    forEach(callback: (value: V, key: K) => void): void;
    map<R>(fn: (value: V, key: K) => R): HashMap<K, R>;
    filter(predicate: (value: V, key: K) => boolean): HashMap<K, V>;
    extend(other: HashMap<K, V>): HashMap<K, V>;
    clear(): HashMap<K, V>;
    find(fn: (value: V, key: K) => boolean): [K, V] | undefined;
    [Symbol.iterator](): Iterator<[K, V]>;
    toJSON(): [K, V][];
    toString(): Str;
}
