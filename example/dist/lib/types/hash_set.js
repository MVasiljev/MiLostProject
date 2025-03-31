import { Vec } from ".";
import { u32 } from "./primitives";
import { Str } from "./string";
export class HashSet {
    constructor(values) {
        this._set = new Set(values);
    }
    static from(values) {
        return new HashSet(values);
    }
    static empty() {
        return new HashSet();
    }
    get [Symbol.toStringTag]() {
        return HashSet._type;
    }
    size() {
        return u32(this._set.size);
    }
    isEmpty() {
        return this._set.size === 0;
    }
    contains(value) {
        return this._set.has(value);
    }
    insert(value) {
        const copy = new Set(this._set);
        copy.add(value);
        return new HashSet(copy);
    }
    remove(value) {
        const copy = new Set(this._set);
        copy.delete(value);
        return new HashSet(copy);
    }
    values() {
        return Vec.from(this._set.values());
    }
    forEach(callback) {
        this._set.forEach(callback);
    }
    union(other) {
        return HashSet.from([...this._set, ...other._set]);
    }
    intersection(other) {
        return HashSet.from([...this._set].filter((v) => other.contains(v)));
    }
    difference(other) {
        return HashSet.from([...this._set].filter((v) => !other.contains(v)));
    }
    symmetricDifference(other) {
        return this.union(other).difference(this.intersection(other));
    }
    isSubset(other) {
        for (const v of this._set) {
            if (!other.contains(v))
                return false;
        }
        return true;
    }
    isSuperset(other) {
        return other.isSubset(this);
    }
    clear() {
        return HashSet.empty();
    }
    map(fn) {
        return HashSet.from([...this._set].map(fn));
    }
    filter(fn) {
        return HashSet.from([...this._set].filter(fn));
    }
    find(fn) {
        for (const val of this._set) {
            if (fn(val))
                return val;
        }
        return undefined;
    }
    [Symbol.iterator]() {
        return this._set[Symbol.iterator]();
    }
    toJSON() {
        return [...this._set];
    }
    toString() {
        return Str.fromRaw(`[HashSet size=${this._set.size}]`);
    }
}
HashSet._type = "HashSet";
