import { Option } from "../core/option";
import { u32 } from "../types/primitives";
import { Str } from "../types/string";

export class Vec<T> implements Iterable<T> {
  private readonly _items: T[];

  private constructor(...items: T[]) {
    this._items = items;
  }

  static new<T>(): Vec<T> {
    return new Vec<T>();
  }

  static from<T>(iterable: Iterable<T>): Vec<T> {
    return new Vec<T>(...iterable);
  }

  static empty<T>(): Vec<T> {
    return Vec.new<T>();
  }

  len(): u32 {
    return u32(this._items.length);
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  get(index: u32): Option<T> {
    const i = index as unknown as u32;
    return i >= 0 && i < this._items.length
      ? Option.Some(this._items[i])
      : Option.None();
  }

  find</* U extends T */ _U = T>(predicate: (item: T) => boolean): Option<T> {
    for (const item of this._items) {
      if (predicate(item)) {
        return Option.Some(item);
      }
    }
    return Option.None<T>();
  }

  push(item: T): Vec<T> {
    return new Vec(...this._items, item);
  }

  pop(): [Vec<T>, Option<T>] {
    if (this.isEmpty()) return [this, Option.None()];
    return [
      new Vec(...this._items.slice(0, -1)),
      Option.Some(this._items[this._items.length - 1]),
    ];
  }

  fold<R>(initial: R, fn: (acc: R, item: T, index: u32) => R): R {
    let acc = initial;
    let index = 0;
    for (const item of this._items) {
      acc = fn(acc, item, u32(index++));
    }
    return acc;
  }
  map<U>(fn: (item: T, index: u32) => U): Vec<U> {
    const result: U[] = [];
    let index = 0;
    for (const item of this._items) {
      result.push(fn(item, u32(index++)));
    }
    return new Vec(...result);
  }

  filter(predicate: (item: T, index: u32) => boolean): Vec<T> {
    const result: T[] = [];
    let index = 0;
    for (const item of this._items) {
      if (predicate(item, u32(index++))) {
        result.push(item);
      }
    }
    return new Vec(...result);
  }

  reverse(): Vec<T> {
    const result: T[] = [];
    for (let i = this._items.length - 1; i >= 0; i--) {
      result.push(this._items[i]);
    }
    return new Vec(...result);
  }

  all(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  any(predicate: (item: T) => boolean): boolean {
    for (const item of this._items) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  take(n: u32): Vec<T> {
    const count = Math.min(n as unknown as u32, this._items.length);
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this._items[i]);
    }
    return new Vec(...result);
  }

  drop(n: u32): Vec<T> {
    const count = Math.min(n as unknown as u32, this._items.length);
    const result: T[] = [];
    for (let i = count; i < this._items.length; i++) {
      result.push(this._items[i]);
    }
    return new Vec(...result);
  }

  concat(other: Vec<T>): Vec<T> {
    const result: T[] = [];

    for (const item of this._items) {
      result.push(item);
    }

    for (const item of other) {
      result.push(item);
    }

    return new Vec(...result);
  }

  toArray(): T[] {
    return [...this._items];
  }

  [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  toString(): Str {
    return Str.fromRaw(`[Vec len=${this._items.length}]`);
  }

  toJSON(): T[] {
    return this._items;
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Vec");
  }
}
