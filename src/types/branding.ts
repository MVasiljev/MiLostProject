import { Result, ValidationError, Err, Ok } from "../core";
import { Str } from "./string";

export type Brand<T, B extends Str> = T & { readonly __brand: B };

export class Branded<T, B extends Str> {
  private readonly _value: T;
  private readonly _brand: B;

  private constructor(value: T, brand: B) {
    this._value = value;
    this._brand = brand;
  }

  static create<T, B extends Str>(
    value: T,
    brand: B,
    validator: (value: T) => boolean,
    errorMessage?: Str
  ): Result<Branded<T, B>, ValidationError> {
    if (!validator(value)) {
      return Err(
        new ValidationError(
          errorMessage ||
            Str.fromRaw(`Invalid ${brand.unwrap()} value: ${value}`)
        )
      );
    }
    return Ok(new Branded(value, brand));
  }

  static is<T, B extends Str>(
    value: unknown,
    brand: B
  ): value is Branded<T, B> {
    return value instanceof Branded && value._brand.unwrap() === brand.unwrap();
  }

  unwrap(): T {
    return this._value;
  }

  brand(): B {
    return this._brand;
  }

  toJSON(): T {
    return this._value;
  }

  toString(): Str {
    return Str.fromRaw(`[Branded ${this._brand.unwrap()}]`);
  }
}
