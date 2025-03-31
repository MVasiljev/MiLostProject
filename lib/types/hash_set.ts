import { u32 } from "../types/primitives";
import { Vec } from "./vec";
import { Str } from "./string";

export class HashSet<T> implements Iterable<T> {
  private readonly _set: Set<T>;

  static readonly _type = "HashSet";

  private constructor(values?: Iterable<T>) {
    this._set = new Set(values);
  }

  static from<T>(values?: Iterable<T>): HashSet<T> {
    return new HashSet(values);
  }

  static empty<T = never>(): HashSet<T> {
    return new HashSet();
  }

  get [Symbol.toStringTag]() {
    return HashSet._type;
  }

  size(): u32 {
    return u32(this._set.size);
  }

  isEmpty(): boolean {
    return this._set.size === 0;
  }

  contains(value: T): boolean {
    return this._set.has(value);
  }

  insert(value: T): HashSet<T> {
    const copy = new Set(this._set);
    copy.add(value);
    return new HashSet(copy);
  }

  remove(value: T): HashSet<T> {
    const copy = new Set(this._set);
    copy.delete(value);
    return new HashSet(copy);
  }

  values(): Vec<T> {
    return Vec.from(this._set.values());
  }

  forEach(callback: (value: T) => void): void {
    this._set.forEach(callback);
  }

  union(other: HashSet<T>): HashSet<T> {
    return HashSet.from([...this._set, ...other._set]);
  }

  intersection(other: HashSet<T>): HashSet<T> {
    return HashSet.from([...this._set].filter((v) => other.contains(v)));
  }

  difference(other: HashSet<T>): HashSet<T> {
    return HashSet.from([...this._set].filter((v) => !other.contains(v)));
  }

  symmetricDifference(other: HashSet<T>): HashSet<T> {
    return this.union(other).difference(this.intersection(other));
  }

  isSubset(other: HashSet<T>): boolean {
    for (const v of this._set) {
      if (!other.contains(v)) return false;
    }
    return true;
  }

  isSuperset(other: HashSet<T>): boolean {
    return other.isSubset(this);
  }

  clear(): HashSet<T> {
    return HashSet.empty();
  }

  map<R>(fn: (value: T) => R): HashSet<R> {
    return HashSet.from([...this._set].map(fn));
  }

  filter(fn: (value: T) => boolean): HashSet<T> {
    return HashSet.from([...this._set].filter(fn));
  }

  find(fn: (value: T) => boolean): T | undefined {
    for (const val of this._set) {
      if (fn(val)) return val;
    }
    return undefined;
  }

  [Symbol.iterator](): Iterator<T> {
    return this._set[Symbol.iterator]();
  }

  toJSON(): T[] {
    return [...this._set];
  }

  toString(): Str {
    return Str.fromRaw(`[HashSet size=${this._set.size}]`);
  }
}
