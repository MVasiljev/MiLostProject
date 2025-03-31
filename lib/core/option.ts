import { Str, Vec } from "lib/types";
import { ValidationError } from "./error";

export class Option<T> {
  private readonly _value?: T;
  private readonly _some: boolean;

  static readonly _type = "Option";

  private constructor(some: boolean, value?: T) {
    this._some = some;
    this._value = value;
  }

  static Some<T>(value: T): Option<T> {
    if (value === null || value === undefined) {
      throw new ValidationError(
        Str.fromRaw("Cannot create Some with null or undefined value")
      );
    }
    return new Option<T>(true, value);
  }

  static None<T>(): Option<T> {
    return new Option<T>(false);
  }

  static from<T>(value: T | null | undefined): Option<T> {
    return value !== null && value !== undefined
      ? Option.Some(value)
      : Option.None<T>();
  }

  isSome(): boolean {
    return this._some;
  }

  isNone(): boolean {
    return !this._some;
  }

  expect(message: Str): T {
    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(message);
  }

  unwrap(): T {
    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
  }

  unwrapOr(defaultValue: T): T {
    return this._some && this._value !== undefined ? this._value : defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return this._some && this._value !== undefined ? this._value : fn();
  }

  map<U>(fn: (value: T) => U): Option<U> {
    if (this._some && this._value !== undefined) {
      return Option.Some(fn(this._value));
    }
    return Option.None<U>();
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this._some && this._value !== undefined) {
      return fn(this._value);
    }
    return Option.None<U>();
  }

  or<U extends T>(optb: Option<U>): Option<T | U> {
    return this._some ? this : optb;
  }

  match<U>(onSome: (value: T) => U, onNone: () => U): U {
    return this._some && this._value !== undefined
      ? onSome(this._value)
      : onNone();
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (this._some && this._value !== undefined && predicate(this._value)) {
      return this;
    }
    return Option.None<T>();
  }

  exists(predicate: (value: T) => boolean): boolean {
    return this._some && this._value !== undefined && predicate(this._value);
  }

  static firstSome<T>(...options: Option<T>[]): Option<T> {
    return Vec.from(options)
      .find((option) => option.isSome())
      .unwrapOr(Option.None<T>());
  }

  static all<T>(options: Vec<Option<T>>): Option<Vec<T>> {
    const values: T[] = [];

    for (const option of options) {
      if (option.isNone()) {
        return Option.None<Vec<T>>();
      }
      values.push(option.unwrap());
    }

    return Option.Some(Vec.from(values));
  }

  toString(): Str {
    return this._some
      ? Str.fromRaw(`[Some ${this._value}]`)
      : Str.fromRaw("[None]");
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Option._type);
  }
}
