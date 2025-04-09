import { Str, Vec } from "../types";
import { ValidationError } from "./error";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class Option<T> {
  private readonly _value?: T;
  private readonly _some: boolean;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Option";

  private constructor(some: boolean, value?: T) {
    this._some = some;
    this._value = value;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();

        if (some) {
          if (typeof wasmModule.createSome === "function") {
            this._inner = wasmModule.createSome(value as any);
          } else if (typeof wasmModule.create_some === "function") {
            this._inner = wasmModule.create_some(value as any);
          } else if (typeof wasmModule.Some === "function") {
            this._inner = wasmModule.Some(value as any);
          } else {
            this._useWasm = false;
          }
        } else {
          if (typeof wasmModule.createNone === "function") {
            this._inner = wasmModule.createNone();
          } else if (typeof wasmModule.create_none === "function") {
            this._inner = wasmModule.create_none();
          } else if (typeof wasmModule.None === "function") {
            this._inner = wasmModule.None();
          } else {
            this._useWasm = false;
          }
        }
      } catch (err) {
        this._useWasm = false;
      }
    }
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

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        return;
      }
    }
  }

  isSome(): boolean {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.isSome === "function") {
          return this._inner.isSome();
        } else if (typeof this._inner.is_some === "function") {
          return this._inner.is_some();
        }
      } catch (err) {
        return this._some;
      }
    }
    return this._some;
  }

  isNone(): boolean {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.isNone === "function") {
          return this._inner.isNone();
        } else if (typeof this._inner.is_none === "function") {
          return this._inner.is_none();
        }
      } catch (err) {
        return !this._some;
      }
    }
    return !this._some;
  }

  expect(message: Str): T {
    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(message);
  }

  unwrap(): T {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.unwrap === "function") {
          return this._inner.unwrap() as T;
        } else if (typeof this._inner.get === "function") {
          return this._inner.get() as T;
        }
      } catch (err) {
        throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
      }
    }

    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
  }

  unwrapOr(defaultValue: T): T {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.unwrapOr === "function") {
          return this._inner.unwrapOr(defaultValue) as T;
        } else if (typeof this._inner.unwrap_or === "function") {
          return this._inner.unwrap_or(defaultValue) as T;
        } else if (typeof this._inner.getOr === "function") {
          return this._inner.getOr(defaultValue) as T;
        }
      } catch (err) {
        return this._some && this._value !== undefined
          ? this._value
          : defaultValue;
      }
    }
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
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.match === "function") {
          return this._inner.match(
            (val: T) => onSome(val),
            () => onNone()
          ) as U;
        } else if (typeof this._inner.fold === "function") {
          return this._inner.fold(
            (val: T) => onSome(val),
            () => onNone()
          ) as U;
        }
      } catch (err) {
        return this._some && this._value !== undefined
          ? onSome(this._value)
          : onNone();
      }
    }
    return this._some && this._value !== undefined
      ? onSome(this._value)
      : onNone();
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.filter === "function") {
          const result = this._inner.filter((val: T) => predicate(val));
          return result.isSome?.() ? this : Option.None<T>();
        }
      } catch (err) {
        return this._some && this._value !== undefined && predicate(this._value)
          ? this
          : Option.None<T>();
      }
    }

    if (this._some && this._value !== undefined && predicate(this._value)) {
      return this;
    }
    return Option.None<T>();
  }

  exists(predicate: (value: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.exists === "function") {
          return this._inner.exists((val: T) => predicate(val));
        }
      } catch (err) {
        return (
          this._some && this._value !== undefined && predicate(this._value)
        );
      }
    }
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
    if (this._useWasm && this._inner) {
      try {
        if (typeof this._inner.toString === "function") {
          return Str.fromRaw(this._inner.toString());
        }
      } catch (err) {
        return this._some
          ? Str.fromRaw(`[Some ${this._value}]`)
          : Str.fromRaw("[None]");
      }
    }
    return this._some
      ? Str.fromRaw(`[Some ${this._value}]`)
      : Str.fromRaw("[None]");
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Option._type);
  }
}
