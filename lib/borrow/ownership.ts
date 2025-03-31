import { Str } from "../types/string";
import { AppError } from "../core/error";

export class OwnershipError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Owned<T> {
  private _value: T | null;
  private _consumed: boolean = false;

  static readonly _type = "Owned";

  private constructor(value: T) {
    this._value = value;
  }

  static new<T>(value: T): Owned<T> {
    return new Owned(value);
  }

  consume(): T {
    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
    }

    this._consumed = true;
    const value = this._value;
    this._value = null;
    return value;
  }

  borrow<R>(fn: (value: T) => R): R {
    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  borrowMut<R>(fn: (value: T) => R): R {
    if (this._consumed || this._value === null) {
      throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
    }

    return fn(this._value);
  }

  isConsumed(): boolean {
    return this._consumed;
  }

  toString(): Str {
    return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Owned._type);
  }
}
