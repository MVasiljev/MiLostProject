import { Option } from "../core/option";
import { u32 } from "../types/primitives";
import { Str } from "../types/string";
/**
 * A Rust-like vector type
 * Currently supports numeric values (f64) for WASM implementation
 */
export declare class Vec<T> implements Iterable<T> {
    private readonly _items;
    private readonly _inner;
    private readonly _useWasm;
    private readonly _isNumeric;
    private constructor();
    /**
     * Create a new empty Vec
     */
    static new<T>(): Vec<T>;
    /**
     * Create an empty Vec (alias for new)
     */
    static empty<T>(): Vec<T>;
    /**
     * Create a Vec from an iterable
     */
    static from<T>(iterable: Iterable<T>): Vec<T>;
    /**
     * Create a Vec with pre-allocated capacity (async to ensure WASM is initialized)
     */
    static withCapacity<T>(capacity: number): Promise<Vec<T>>;
    /**
     * Create a Vec (async to ensure WASM is initialized)
     */
    static create<T>(items?: T[]): Promise<Vec<T>>;
    /**
     * Get the length of the Vec
     */
    len(): u32;
    /**
     * Check if the Vec is empty
     */
    isEmpty(): boolean;
    /**
     * Get an item at a specific index
     */
    get(index: u32): Option<T>;
    /**
     * Set an item at a specific index and return a new Vec
     * Note: This preserves immutability like other methods
     */
    set(index: u32, value: T): Vec<T>;
    /**
     * Add an item to the end of the Vec
     */
    push(item: T): Vec<T>;
    /**
     * Remove and return the last item
     */
    pop(): [Vec<T>, Option<T>];
    /**
     * Convert to a JavaScript array
     */
    toArray(): T[];
    /**
     * Find an item that matches a predicate
     */
    find(predicate: (item: T) => boolean): Option<T>;
    /**
     * Fold the Vec into a single value
     */
    fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R;
    /**
     * Map each item to a new value
     */
    map<U>(fn: (item: T, index: u32) => U): Vec<U>;
    /**
     * Filter items based on a predicate
     */
    filter(predicate: (item: T, index: u32) => boolean): Vec<T>;
    /**
     * Reverse the Vec
     */
    reverse(): Vec<T>;
    /**
     * Check if all items match a predicate
     */
    all(predicate: (item: T) => boolean): boolean;
    /**
     * Check if any item matches a predicate
     */
    any(predicate: (item: T) => boolean): boolean;
    /**
     * Take n items from the beginning
     */
    take(n: u32): Vec<T>;
    /**
     * Drop n items from the beginning
     */
    drop(n: u32): Vec<T>;
    /**
     * Concatenate with another Vec
     */
    concat(other: Vec<T>): Vec<T>;
    /**
     * Iterator implementation
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Convert to string
     */
    toString(): Str;
    /**
     * Convert to JSON
     */
    toJSON(): T[];
    /**
     * Symbol.toStringTag implementation
     */
    get [Symbol.toStringTag](): Str;
}
