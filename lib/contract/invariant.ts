import { Str } from "../types/string";
import { ContractError } from "./contract";

export class Invariant<T> {
  private readonly _value: T;
  private readonly _invariant: (value: T) => boolean;
  private readonly _errorMessage: Str;

  static readonly _type = "Invariant";

  private constructor(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage: Str = Str.fromRaw("Invariant violated")
  ) {
    this._value = value;
    this._invariant = invariant;
    this._errorMessage = errorMessage;

    if (!invariant(value)) {
      throw new ContractError(errorMessage);
    }
  }

  static new<T>(
    value: T,
    invariant: (value: T) => boolean,
    errorMessage?: Str
  ): Invariant<T> {
    return new Invariant(value, invariant, errorMessage);
  }

  get(): T {
    return this._value;
  }

  map<U>(
    fn: (value: T) => U,
    newInvariant: (value: U) => boolean,
    errorMessage?: Str
  ): Invariant<U> {
    const newValue = fn(this._value);
    return Invariant.new(newValue, newInvariant, errorMessage);
  }

  toString(): Str {
    return Str.fromRaw(`[Invariant]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Invariant._type);
  }
}
