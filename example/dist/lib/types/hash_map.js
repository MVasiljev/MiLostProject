import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
export class HashMap {
    constructor(entries) {
        this._map = new Map(entries);
    }
    static from(entries) {
        return new HashMap(entries);
    }
    static empty() {
        return new HashMap();
    }
    get [Symbol.toStringTag]() {
        return HashMap._type;
    }
    size() {
        return u32(this._map.size);
    }
    isEmpty() {
        return this._map.size === 0;
    }
    get(key) {
        return this._map.get(key);
    }
    contains(key) {
        return this._map.has(key);
    }
    insert(key, value) {
        const copy = new Map(this._map);
        copy.set(key, value);
        return new HashMap(copy);
    }
    remove(key) {
        const copy = new Map(this._map);
        copy.delete(key);
        return new HashMap(copy);
    }
    keys() {
        return Vec.from(this._map.keys());
    }
    values() {
        return Vec.from(this._map.values());
    }
    entries() {
        return Vec.from(this._map.entries());
    }
    forEach(callback) {
        this._map.forEach(callback);
    }
    map(fn) {
        const mapped = new Map();
        this._map.forEach((v, k) => mapped.set(k, fn(v, k)));
        return new HashMap(mapped);
    }
    filter(predicate) {
        const filtered = new Map();
        this._map.forEach((v, k) => {
            if (predicate(v, k))
                filtered.set(k, v);
        });
        return new HashMap(filtered);
    }
    extend(other) {
        const merged = new Map(this._map);
        for (const [k, v] of other) {
            merged.set(k, v);
        }
        return new HashMap(merged);
    }
    clear() {
        return HashMap.empty();
    }
    find(fn) {
        for (const [k, v] of this._map) {
            if (fn(v, k))
                return [k, v];
        }
        return undefined;
    }
    [Symbol.iterator]() {
        return this._map[Symbol.iterator]();
    }
    toJSON() {
        return [...this._map.entries()];
    }
    toString() {
        return Str.fromRaw(`[HashMap size=${this._map.size}]`);
    }
}
HashMap._type = "HashMap";
