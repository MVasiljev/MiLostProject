import { Str } from "./string";

export class Tuple<T extends unknown[]> {
  private readonly items: T;

  static readonly _type = "Tuple";

  private constructor(items: T) {
    this.items = items;
  }

  static from<T extends unknown[]>(...items: T): Tuple<T> {
    return new Tuple<T>(items);
  }

  static pair<A, B>(a: A, b: B): Tuple<[A, B]> {
    return Tuple.from(a, b);
  }

  get<I extends keyof T>(index: I): T[I] {
    return this.items[index];
  }

  replace<I extends keyof T>(index: I, value: T[I]): Tuple<T> {
    const copy = this.items.slice() as T;
    copy[Number(index) as keyof T] = value;
    return new Tuple(copy);
  }

  first(): T[0] {
    return this.get("0" as keyof T);
  }

  second(): T[1] {
    return this.get("1" as keyof T);
  }

  toString(): Str {
    return Str.fromRaw(`[Tuple ${JSON.stringify(this.items)}]`);
  }

  toJSON(): T {
    return this.items;
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Tuple._type);
  }
}
