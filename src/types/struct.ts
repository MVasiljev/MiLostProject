import { Vec } from "./vec";

export class Struct<T extends Record<string, unknown>> {
  private readonly _fields: Readonly<T>;

  static readonly _type = "Struct";

  private constructor(fields: T) {
    this._fields = Object.freeze({ ...fields });
  }

  static from<T extends Record<string, unknown>>(
    fields: Partial<T>,
    fallback: () => T
  ): Struct<T> {
    const full = { ...fallback(), ...fields } as T;
    return new Struct(full);
  }

  static empty<T extends Record<string, unknown>>(): Struct<T> {
    return new Struct({} as T);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this._fields[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): Struct<T> {
    return new Struct({ ...this._fields, [key]: value } as T);
  }

  keys(): Vec<keyof T> {
    return Vec.from(Object.keys(this._fields) as (keyof T)[]);
  }

  entries(): Vec<[keyof T, T[keyof T]]> {
    return Vec.from(Object.entries(this._fields) as [keyof T, T[keyof T]][]);
  }

  toJSON(): T {
    return { ...this._fields };
  }

  toString(): string {
    return `[Struct ${JSON.stringify(this._fields)}]`;
  }

  get [Symbol.toStringTag]() {
    return Struct._type;
  }
}
