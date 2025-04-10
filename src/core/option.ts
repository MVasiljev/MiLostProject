import { isWasmInitialized, getWasmModule, initWasm } from "../initWasm/init";
import { callWasmInstanceMethod } from "../initWasm/lib";
import { Str } from "../types";
import { ValidationError } from "./error";

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
          } else if (typeof wasmModule.Some === "function") {
            this._inner = wasmModule.Some(value as any);
          } else {
            this._useWasm = false;
          }
        } else {
          if (typeof wasmModule.createNone === "function") {
            this._inner = wasmModule.createNone();
          } else if (typeof wasmModule.None === "function") {
            this._inner = wasmModule.None();
          } else {
            this._useWasm = false;
          }
        }
      } catch (err) {
        console.warn(
          `WASM Option creation failed, using JS implementation: ${err}`
        );
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
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
        return;
      }
    }
  }

  isSome(): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "isSome",
        [],
        () => this._some
      );
    }
    return this._some;
  }

  isNone(): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "isNone",
        [],
        () => !this._some
      );
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
        return callWasmInstanceMethod(this._inner, "unwrap", [], () => {
          throw new ValidationError(
            Str.fromRaw("Called unwrap on a None value")
          );
        });
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
      return callWasmInstanceMethod(
        this._inner,
        "unwrapOr",
        [defaultValue],
        () =>
          this._some && this._value !== undefined ? this._value : defaultValue
      );
    }
    return this._some && this._value !== undefined ? this._value : defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(this._inner, "unwrapOrElse", [fn], () =>
        this._some && this._value !== undefined ? this._value : fn()
      );
    }
    return this._some && this._value !== undefined ? this._value : fn();
  }

  map<U>(fn: (value: T) => U): Option<U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.map(fn);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<U>();
      } catch (err) {
        console.warn(`WASM map failed, using JS fallback: ${err}`);
      }
    }

    if (this._some && this._value !== undefined) {
      return Option.Some(fn(this._value));
    }
    return Option.None<U>();
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.andThen(fn);
        return result;
      } catch (err) {
        console.warn(`WASM andThen failed, using JS fallback: ${err}`);
      }
    }

    if (this._some && this._value !== undefined) {
      return fn(this._value);
    }
    return Option.None<U>();
  }

  or<U extends T>(optb: Option<U>): Option<T | U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.or(optb._inner);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T | U>();
      } catch (err) {
        console.warn(`WASM or failed, using JS fallback: ${err}`);
      }
    }
    return this._some ? this : optb;
  }

  match<U>(onSome: (value: T) => U, onNone: () => U): U {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "match",
        [onSome, onNone],
        () =>
          this._some && this._value !== undefined
            ? onSome(this._value)
            : onNone()
      );
    }
    return this._some && this._value !== undefined
      ? onSome(this._value)
      : onNone();
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.filter(predicate);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T>();
      } catch (err) {
        console.warn(`WASM filter failed, using JS fallback: ${err}`);
      }
    }

    if (this._some && this._value !== undefined && predicate(this._value)) {
      return this;
    }
    return Option.None<T>();
  }

  exists(predicate: (value: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(
        this._inner,
        "exists",
        [predicate],
        () => this._some && this._value !== undefined && predicate(this._value)
      );
    }
    return this._some && this._value !== undefined && predicate(this._value);
  }

  static firstSome<T>(...options: Option<T>[]): Option<T> {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.firstSome === "function") {
          const array = options.map((opt) => opt._inner);
          const result = wasmModule.firstSome(array);
          return result.isSome()
            ? Option.Some(result.unwrap())
            : Option.None<T>();
        }
      } catch (err) {
        console.warn(`WASM firstSome failed, using JS fallback: ${err}`);
      }
    }

    for (const option of options) {
      if (option.isSome()) {
        return option;
      }
    }
    return Option.None<T>();
  }

  static all<T>(options: Option<T>[]): Option<T[]> {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.all === "function") {
          const array = options.map((opt) => opt._inner);
          const result = wasmModule.all(array);
          return result.isSome()
            ? Option.Some(result.unwrap())
            : Option.None<T[]>();
        }
      } catch (err) {
        console.warn(`WASM all failed, using JS fallback: ${err}`);
      }
    }

    const values: T[] = [];

    for (const option of options) {
      if (option.isNone()) {
        return Option.None<T[]>();
      }
      values.push(option.unwrap());
    }

    return Option.Some(values);
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      return callWasmInstanceMethod(this._inner, "toString", [], () =>
        this._some
          ? Str.fromRaw(`[Some ${this._value}]`)
          : Str.fromRaw("[None]")
      );
    }
    return this._some
      ? Str.fromRaw(`[Some ${this._value}]`)
      : Str.fromRaw("[None]");
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Option._type);
  }
}
