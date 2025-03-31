import { Vec, i32, Str, u32 } from "lib/types";
import { Option } from "../core/option";
import { ValidationError } from "./error";

export class Iter<T> implements Iterable<T> {
  private readonly iterable: Iterable<T>;

  static readonly _type = "Iter";

  private constructor(iterable: Iterable<T>) {
    this.iterable = iterable;
  }

  static from<T>(iterable: Iterable<T>): Iter<T> {
    return new Iter(iterable);
  }

  static fromVec<T>(vec: Vec<T>): Iter<T> {
    return new Iter(vec);
  }

  static empty<T>(): Iter<T> {
    return new Iter<T>(Vec.empty<T>());
  }

  static range(start: i32, end: i32, step: i32 = i32(1)): Iter<i32> {
    const startNum = start as unknown as number;
    const endNum = end as unknown as number;
    const stepNum = step as unknown as number;

    if (stepNum === 0) {
      throw new ValidationError(Str.fromRaw("Step cannot be zero"));
    }

    return new Iter({
      *[Symbol.iterator]() {
        for (
          let i = startNum;
          stepNum > 0 ? i < endNum : i > endNum;
          i += stepNum
        ) {
          yield i32(i);
        }
      },
    });
  }

  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]();
  }

  next(): Option<T> {
    const iter = this[Symbol.iterator]();
    const { done, value } = iter.next();
    return done ? Option.None() : Option.Some(value);
  }

  map<U>(f: (item: T, index: u32) => U): Iter<U> {
    const self = this;
    return new Iter<U>({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          yield f(item, u32(index++));
        }
      },
    });
  }

  filter(predicate: (item: T, index: u32) => boolean): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          if (predicate(item, u32(index++))) yield item;
        }
      },
    });
  }

  take(n: u32): Iter<T> {
    const self = this;
    const nValue = n as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let count = 0;
        for (const item of self) {
          if (count++ >= nValue) break;
          yield item;
        }
      },
    });
  }

  skip(n: u32): Iter<T> {
    const self = this;
    const nValue = n as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let count = 0;
        for (const item of self) {
          if (count++ < nValue) continue;
          yield item;
        }
      },
    });
  }

  enumerate(): Iter<[u32, T]> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let index = 0;
        for (const item of self) {
          yield [u32(index++), item] as [u32, T];
        }
      },
    });
  }

  zip<U>(other: Iterable<U>): Iter<[T, U]> {
    const self = this;
    return new Iter<[T, U]>({
      *[Symbol.iterator]() {
        const it1 = self[Symbol.iterator]();
        const it2 = other[Symbol.iterator]();
        while (true) {
          const a = it1.next();
          const b = it2.next();
          if (a.done || b.done) break;
          yield [a.value, b.value];
        }
      },
    });
  }

  chain(other: Iterable<T>): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        yield* self;
        yield* other;
      },
    });
  }

  flatMap<U>(f: (item: T) => Iterable<U>): Iter<U> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        for (const item of self) {
          yield* f(item);
        }
      },
    });
  }

  chunks(size: u32): Iter<Vec<T>> {
    const self = this;
    const sizeValue = size as unknown as number;
    return new Iter({
      *[Symbol.iterator]() {
        let chunk: T[] = [];
        for (const item of self) {
          chunk.push(item);
          if (chunk.length === sizeValue) {
            yield Vec.from(chunk);
            chunk = [];
          }
        }
        if (chunk.length > 0) yield Vec.from(chunk);
      },
    });
  }

  collect(): Vec<T> {
    return Vec.from(this.iterable);
  }

  find(predicate: (item: T) => boolean): Option<T> {
    for (const item of this) {
      if (predicate(item)) return Option.Some(item);
    }
    return Option.None();
  }

  first(): Option<T> {
    return this.next();
  }

  last(): Option<T> {
    let last: T | undefined;
    let hasValue = false;
    for (const item of this) {
      last = item;
      hasValue = true;
    }
    return hasValue ? Option.Some(last!) : Option.None();
  }

  nth(n: u32): Option<T> {
    let i = 0;
    const nValue = n as u32;
    for (const item of this) {
      if (i++ === nValue) return Option.Some(item);
    }
    return Option.None();
  }

  forEach(fn: (item: T, index: u32) => void): void {
    let index = 0;
    for (const item of this) {
      fn(item, u32(index++));
    }
  }

  all(predicate: (item: T) => boolean): boolean {
    for (const item of this) {
      if (!predicate(item)) return false;
    }
    return true;
  }

  any(predicate: (item: T) => boolean): boolean {
    for (const item of this) {
      if (predicate(item)) return true;
    }
    return false;
  }

  count(): u32 {
    let count = 0;
    for (const _ of this) {
      count++;
    }
    return u32(count);
  }

  fold<R>(initial: R, f: (acc: R, item: T, index: u32) => R): R {
    let acc = initial;
    let index = 0;
    for (const item of this) {
      acc = f(acc, item, u32(index++));
    }
    return acc;
  }

  dedup(): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let prev: T | undefined;
        let first = true;
        for (const item of self) {
          if (first || item !== prev) {
            yield item;
            prev = item;
            first = false;
          }
        }
      },
    });
  }

  dedupBy<K>(keyFn: (item: T) => K): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let prevKey: K | undefined;
        let first = true;
        for (const item of self) {
          const key = keyFn(item);
          if (first || key !== prevKey) {
            yield item;
            prevKey = key;
            first = false;
          }
        }
      },
    });
  }

  intersperse(separator: T): Iter<T> {
    const self = this;
    return new Iter({
      *[Symbol.iterator]() {
        let first = true;
        for (const item of self) {
          if (!first) yield separator;
          yield item;
          first = false;
        }
      },
    });
  }

  toString(): Str {
    return Str.fromRaw(`[Iter]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Iter._type);
  }
}
