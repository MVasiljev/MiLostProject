import { Option } from "../core/option";
import { u32 } from "../types/primitives";
import { Str } from "../types/string";
export class Vec {
    _items;
    constructor(...items) {
        this._items = items;
    }
    static new() {
        return new Vec();
    }
    static from(iterable) {
        return new Vec(...iterable);
    }
    static empty() {
        return Vec.new();
    }
    len() {
        return u32(this._items.length);
    }
    isEmpty() {
        return this._items.length === 0;
    }
    get(index) {
        const i = index;
        return i >= 0 && i < this._items.length
            ? Option.Some(this._items[i])
            : Option.None();
    }
    find(predicate) {
        for (const item of this._items) {
            if (predicate(item)) {
                return Option.Some(item);
            }
        }
        return Option.None();
    }
    push(item) {
        return new Vec(...this._items, item);
    }
    pop() {
        if (this.isEmpty())
            return [this, Option.None()];
        return [
            new Vec(...this._items.slice(0, -1)),
            Option.Some(this._items[this._items.length - 1]),
        ];
    }
    fold(initial, fn) {
        let acc = initial;
        let index = 0;
        for (const item of this._items) {
            acc = fn(acc, item, u32(index++));
        }
        return acc;
    }
    map(fn) {
        const result = [];
        let index = 0;
        for (const item of this._items) {
            result.push(fn(item, u32(index++)));
        }
        return new Vec(...result);
    }
    filter(predicate) {
        const result = [];
        let index = 0;
        for (const item of this._items) {
            if (predicate(item, u32(index++))) {
                result.push(item);
            }
        }
        return new Vec(...result);
    }
    reverse() {
        const result = [];
        for (let i = this._items.length - 1; i >= 0; i--) {
            result.push(this._items[i]);
        }
        return new Vec(...result);
    }
    all(predicate) {
        for (const item of this._items) {
            if (!predicate(item)) {
                return false;
            }
        }
        return true;
    }
    any(predicate) {
        for (const item of this._items) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }
    take(n) {
        const count = Math.min(n, this._items.length);
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(this._items[i]);
        }
        return new Vec(...result);
    }
    drop(n) {
        const count = Math.min(n, this._items.length);
        const result = [];
        for (let i = count; i < this._items.length; i++) {
            result.push(this._items[i]);
        }
        return new Vec(...result);
    }
    concat(other) {
        const result = [];
        for (const item of this._items) {
            result.push(item);
        }
        for (const item of other) {
            result.push(item);
        }
        return new Vec(...result);
    }
    toArray() {
        return [...this._items];
    }
    [Symbol.iterator]() {
        return this._items[Symbol.iterator]();
    }
    toString() {
        return Str.fromRaw(`[Vec len=${this._items.length}]`);
    }
    toJSON() {
        return this._items;
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Vec");
    }
}
