/**
 * Option type implementation for MiLost
 *
 * Provides a type-safe, immutable Option type with WebAssembly
 * acceleration when available.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";
import { ValidationError } from "./error.js";

/**
 * Module definition for Option WASM implementation
 */
const optionModule: WasmModule = {
  name: "Option",

  initialize(wasmModule: any) {
    console.log("Initializing Option module with WASM...");

    if (typeof wasmModule.Option === "object") {
      console.log("Found Option module in WASM");

      const methods = [
        "createSome",
        "createNone",
        "Some",
        "None",
        "from",
        "firstSome",
        "all",
      ];

      const instanceMethods = [
        "isSome",
        "isNone",
        "expect",
        "unwrap",
        "unwrapOr",
        "unwrapOrElse",
        "map",
        "andThen",
        "or",
        "match",
        "filter",
        "exists",
        "toString",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Option[method] === "function") {
          console.log(`Found static method: Option.${method}`);
        } else {
          console.warn(`Missing static method: Option.${method}`);
        }
      });

      try {
        const sampleSome = wasmModule.Option.Some(42);
        instanceMethods.forEach((method) => {
          if (typeof sampleSome[method] === "function") {
            console.log(`Found instance method: Option.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Option.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Option instance:", error);
      }
    } else {
      console.warn("Option module not found in WASM module");
      throw new Error("Required WASM functions not found for Option module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Option module");
  },
};

registerModule(optionModule);

export class Option<T> {
  private readonly _value?: T;
  private readonly _some: boolean;
  private readonly _inner: any;
  private readonly _useWasm: boolean;

  static readonly _type = "Option";

  private constructor(some: boolean, value?: T) {
    this._some = some;
    this._value = value;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Option) {
      try {
        if (some) {
          if (typeof wasmModule.Option.createSome === "function") {
            this._inner = wasmModule.Option.createSome(value as any);
          } else if (typeof wasmModule.Option.Some === "function") {
            this._inner = wasmModule.Option.Some(value as any);
          } else {
            this._useWasm = false;
            return;
          }
        } else {
          if (typeof wasmModule.Option.createNone === "function") {
            this._inner = wasmModule.Option.createNone();
          } else if (typeof wasmModule.Option.None === "function") {
            this._inner = wasmModule.Option.None();
          } else {
            this._useWasm = false;
            return;
          }
        }
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Option creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create an Option with a non-null value
   * @param value The value to wrap
   * @returns An Option containing the value
   */
  static Some<T>(value: T): Option<T> {
    if (value === null || value === undefined) {
      throw new ValidationError(
        Str.fromRaw("Cannot create Some with null or undefined value")
      );
    }
    return new Option<T>(true, value);
  }

  /**
   * Create an empty Option
   * @returns An empty Option
   */
  static None<T>(): Option<T> {
    return new Option<T>(false);
  }

  /**
   * Create an Option from a potentially null or undefined value
   * @param value The value to wrap
   * @returns An Option containing the value or None
   */
  static from<T>(value: T | null | undefined): Option<T> {
    const wasmModule = getWasmModule();
    if (wasmModule?.Option?.from) {
      try {
        return wasmModule.Option.from(value);
      } catch (err) {
        console.warn(`WASM Option.from failed, using JS fallback: ${err}`);
      }
    }
    return value !== null && value !== undefined
      ? Option.Some(value)
      : Option.None<T>();
  }

  /**
   * Check if the Option contains a value
   * @returns True if the Option is Some
   */
  isSome(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isSome();
      } catch (error) {
        console.warn(`WASM isSome failed, using JS fallback: ${error}`);
      }
    }
    return this._some;
  }

  /**
   * Check if the Option is empty
   * @returns True if the Option is None
   */
  isNone(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isNone();
      } catch (error) {
        console.warn(`WASM isNone failed, using JS fallback: ${error}`);
      }
    }
    return !this._some;
  }

  /**
   * Expect a value, throwing an error with a custom message if None
   * @param message Error message to use if Option is None
   * @returns The contained value
   */
  expect(message: Str): T {
    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(message);
  }

  /**
   * Unwrap the Option, throwing an error if None
   * @returns The contained value
   */
  unwrap(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.unwrap();
      } catch (error) {
        console.warn(`WASM unwrap failed, using JS fallback: ${error}`);
      }
    }

    if (this._some && this._value !== undefined) {
      return this._value;
    }
    throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
  }

  /**
   * Unwrap the Option or return a default value
   * @param defaultValue Value to return if Option is None
   * @returns The contained value or the default
   */
  unwrapOr(defaultValue: T): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.unwrapOr(defaultValue);
      } catch (error) {
        console.warn(`WASM unwrapOr failed, using JS fallback: ${error}`);
      }
    }
    return this._some && this._value !== undefined ? this._value : defaultValue;
  }

  /**
   * Unwrap the Option or compute a default value
   * @param fn Function to compute default value
   * @returns The contained value or computed default
   */
  unwrapOrElse(fn: () => T): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.unwrapOrElse(fn);
      } catch (error) {
        console.warn(`WASM unwrapOrElse failed, using JS fallback: ${error}`);
      }
    }
    return this._some && this._value !== undefined ? this._value : fn();
  }

  /**
   * Transform the Option's value
   * @param fn Transformation function
   * @returns A new Option with the transformed value
   */
  map<U>(fn: (value: T) => U): Option<U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.map(fn);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<U>();
      } catch (error) {
        console.warn(`WASM map failed, using JS fallback: ${error}`);
      }
    }

    if (this._some && this._value !== undefined) {
      return Option.Some(fn(this._value));
    }
    return Option.None<U>();
  }

  /**
   * Flat map the Option's value
   * @param fn Transformation function returning another Option
   * @returns A new Option
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.andThen(fn);
        return result;
      } catch (error) {
        console.warn(`WASM andThen failed, using JS fallback: ${error}`);
      }
    }

    if (this._some && this._value !== undefined) {
      return fn(this._value);
    }
    return Option.None<U>();
  }

  /**
   * Return this Option if Some, otherwise return the other Option
   * @param optb Alternative Option
   * @returns This Option or the alternative
   */
  or<U extends T>(optb: Option<U>): Option<T | U> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.or(optb._inner);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T | U>();
      } catch (error) {
        console.warn(`WASM or failed, using JS fallback: ${error}`);
      }
    }
    return this._some ? this : optb;
  }

  /**
   * Pattern match on the Option
   * @param onSome Function to call if Some
   * @param onNone Function to call if None
   * @returns Result of the matched function
   */
  match<U>(onSome: (value: T) => U, onNone: () => U): U {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.match(onSome, onNone);
      } catch (error) {
        console.warn(`WASM match failed, using JS fallback: ${error}`);
      }
    }
    return this._some && this._value !== undefined
      ? onSome(this._value)
      : onNone();
  }

  /**
   * Filter the Option based on a predicate
   * @param predicate Condition to apply
   * @returns Some if predicate is true, None otherwise
   */
  filter(predicate: (value: T) => boolean): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.filter(predicate);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T>();
      } catch (error) {
        console.warn(`WASM filter failed, using JS fallback: ${error}`);
      }
    }

    if (this._some && this._value !== undefined && predicate(this._value)) {
      return this;
    }
    return Option.None<T>();
  }

  /**
   * Check if the Option satisfies a predicate
   * @param predicate Condition to check
   * @returns True if Some and predicate is true
   */
  exists(predicate: (value: T) => boolean): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.exists(predicate);
      } catch (error) {
        console.warn(`WASM exists failed, using JS fallback: ${error}`);
      }
    }
    return this._some && this._value !== undefined && predicate(this._value);
  }

  /**
   * Find the first Some Option in a list of Options
   * @param options List of Options to search
   * @returns The first Some Option or None
   */
  static firstSome<T>(...options: Option<T>[]): Option<T> {
    const wasmModule = getWasmModule();
    if (wasmModule?.Option?.firstSome) {
      try {
        const array = options.map((opt) => opt._inner);
        const result = wasmModule.Option.firstSome(array);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T>();
      } catch (error) {
        console.warn(`WASM firstSome failed, using JS fallback: ${error}`);
      }
    }

    for (const option of options) {
      if (option.isSome()) {
        return option;
      }
    }
    return Option.None<T>();
  }

  /**
   * Collect all values from a list of Options
   * @param options List of Options
   * @returns Some of all values if all are Some, None otherwise
   */
  static all<T>(options: Option<T>[]): Option<T[]> {
    const wasmModule = getWasmModule();
    if (wasmModule?.Option?.all) {
      try {
        const array = options.map((opt) => opt._inner);
        const result = wasmModule.Option.all(array);
        return result.isSome()
          ? Option.Some(result.unwrap())
          : Option.None<T[]>();
      } catch (error) {
        console.warn(`WASM all failed, using JS fallback: ${error}`);
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

  /**
   * Convert the Option to a string representation
   * @returns A Str representation of the Option
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.toString();
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return this._some
      ? Str.fromRaw(`[Some ${this._value}]`)
      : Str.fromRaw("[None]");
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Option._type);
  }
}
