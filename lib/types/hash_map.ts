import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";

export class HashMap<K, V> implements Iterable<[K, V]> {
  private readonly _map: Map<K, V>;

  static readonly _type = "HashMap";

  private constructor(entries?: Iterable<[K, V]>) {
    this._map = new Map(entries);
  }

  static from<K, V>(entries?: Iterable<[K, V]>): HashMap<K, V> {
    return new HashMap(entries);
  }

  static empty<K = never, V = never>(): HashMap<K, V> {
    return new HashMap();
  }

  get [Symbol.toStringTag]() {
    return HashMap._type;
  }

  size(): u32 {
    return u32(this._map.size);
  }

  isEmpty(): boolean {
    return this._map.size === 0;
  }

  get(key: K): V | undefined {
    return this._map.get(key);
  }

  contains(key: K): boolean {
    return this._map.has(key);
  }

  insert(key: K, value: V): HashMap<K, V> {
    const copy = new Map(this._map);
    copy.set(key, value);
    return new HashMap(copy);
  }

  remove(key: K): HashMap<K, V> {
    const copy = new Map(this._map);
    copy.delete(key);
    return new HashMap(copy);
  }

  keys(): Vec<K> {
    return Vec.from(this._map.keys());
  }

  values(): Vec<V> {
    return Vec.from(this._map.values());
  }

  entries(): Vec<[K, V]> {
    return Vec.from(this._map.entries());
  }

  forEach(callback: (value: V, key: K) => void): void {
    this._map.forEach(callback);
  }

  map<R>(fn: (value: V, key: K) => R): HashMap<K, R> {
    const mapped = new Map<K, R>();
    this._map.forEach((v, k) => mapped.set(k, fn(v, k)));
    return new HashMap(mapped);
  }

  filter(predicate: (value: V, key: K) => boolean): HashMap<K, V> {
    const filtered = new Map<K, V>();
    this._map.forEach((v, k) => {
      if (predicate(v, k)) filtered.set(k, v);
    });
    return new HashMap(filtered);
  }

  extend(other: HashMap<K, V>): HashMap<K, V> {
    const merged = new Map(this._map);
    for (const [k, v] of other) {
      merged.set(k, v);
    }
    return new HashMap(merged);
  }

  clear(): HashMap<K, V> {
    return HashMap.empty();
  }

  find(fn: (value: V, key: K) => boolean): [K, V] | undefined {
    for (const [k, v] of this._map) {
      if (fn(v, k)) return [k, v];
    }
    return undefined;
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this._map[Symbol.iterator]();
  }

  toJSON(): [K, V][] {
    return [...this._map.entries()];
  }

  toString(): Str {
    return Str.fromRaw(`[HashMap size=${this._map.size}]`);
  }
}
