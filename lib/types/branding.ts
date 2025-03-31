import { Result, Ok, Err } from "../core/result";
import { ValidationError } from "../core/error";
import { Str } from "./string";

export type Brand<T, B extends Str> = T & { readonly __brand: B };

export class Branded<T, B extends Str> {
  private readonly _value: T;
  private readonly _brand: B;

  static readonly _type = Str.fromRaw("Branded");

  private constructor(value: T, brand: B) {
    this._value = value;
    this._brand = brand;
  }

  get [Symbol.toStringTag](): Str {
    return Branded._type;
  }

  static create<T, B extends Str>(value: T, brand: B): Branded<T, B> {
    return new Branded(value, brand);
  }

  static createConstructor<T, B extends Str>(
    brand: B,
    validator?: (value: T) => boolean,
    errorMsg?: Str
  ): (value: T) => Branded<T, B> {
    return (value: T): Branded<T, B> => {
      if (validator && !validator(value)) {
        throw new ValidationError(
          Str.fromRaw(
            errorMsg?.unwrap() ??
              Str.fromRaw(
                "Invalid " + brand.unwrap() + " value: " + value
              ).unwrap()
          )
        );
      }
      return Branded.create(value, brand);
    };
  }

  static createSafeConstructor<T, B extends Str>(
    brand: B,
    validator: (value: T) => boolean,
    errorMsg?: Str
  ): (value: T) => Result<Branded<T, B>, ValidationError> {
    return (value: T): Result<Branded<T, B>, ValidationError> => {
      if (!validator(value)) {
        return Err(
          new ValidationError(
            Str.fromRaw(
              errorMsg?.unwrap() ??
                Str.fromRaw(
                  "Invalid " + brand.unwrap() + " value: " + value
                ).unwrap()
            )
          )
        );
      }
      return Ok(Branded.create(value, brand));
    };
  }

  static isBranded<T, B extends Str>(
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
    return Str.fromRaw("[Branded " + this._brand.unwrap() + "]");
  }

  static unsafeBrand<B extends Str>(brand: B): B {
    return brand;
  }
}
