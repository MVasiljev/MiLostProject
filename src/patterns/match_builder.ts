/**
 * Match Builder for MiLost
 *
 * Provides a fluent interface for building pattern matching expressions
 * with optional WebAssembly acceleration.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

/**
 * Module definition for MatchBuilder WASM implementation
 */
const matchBuilderModule: WasmModule = {
  name: "MatchBuilder",

  initialize(wasmModule: any) {
    console.log("Initializing MatchBuilder module with WASM...");

    if (typeof wasmModule.MatchBuilder === "function") {
      console.log("Found MatchBuilder constructor in WASM module");
      MatchBuilder._useWasm = true;

      const staticMethods = ["create"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.MatchBuilder[method] === "function") {
          console.log(`Found static method: MatchBuilder.${method}`);
        } else {
          console.warn(`Missing static method: MatchBuilder.${method}`);
        }
      });

      const instanceMethods = ["with", "otherwise"];
      try {
        const sampleBuilder = wasmModule.MatchBuilder.create(null);
        instanceMethods.forEach((method) => {
          if (typeof sampleBuilder[method] === "function") {
            console.log(
              `Found instance method: MatchBuilder.prototype.${method}`
            );
          } else {
            console.warn(
              `Missing instance method: MatchBuilder.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample MatchBuilder instance:", error);
      }
    } else {
      throw new Error(
        "Required WASM functions not found for MatchBuilder module"
      );
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for MatchBuilder module");
    MatchBuilder._useWasm = false;
  },
};

registerModule(matchBuilderModule);

type Pattern<T> = T | ((value: T) => boolean) | typeof __;

export const __ = Symbol("Wildcard");

/**
 * A fluent builder for pattern matching
 */
export class MatchBuilder<T, R> {
  private readonly value: T;
  private readonly arms: { pattern: Pattern<T>; handler: (value: T) => R }[] =
    [];
  private _inner: any;
  private _useWasm: boolean;
  static _useWasm: boolean = false;

  private constructor(value: T, useWasm: boolean = MatchBuilder._useWasm) {
    this.value = value;
    this._useWasm = useWasm;

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (
          wasmModule &&
          typeof wasmModule.MatchBuilder.create === "function"
        ) {
          this._inner = wasmModule.MatchBuilder.create(value);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM MatchBuilder creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a new MatchBuilder instance
   * @param value The value to match against
   * @returns A new MatchBuilder instance
   */
  static create<T>(value: T): MatchBuilder<T, any> {
    return new MatchBuilder<T, any>(value);
  }

  /**
   * Add a pattern matching arm
   * @param pattern The pattern to match
   * @param handler The handler to invoke on match
   * @returns The MatchBuilder instance for chaining
   */
  with(pattern: Pattern<T>, handler: (value: T) => R): this {
    if (this._useWasm && this._inner) {
      try {
        this._inner.with(pattern, handler);
      } catch (error) {
        console.warn(`WASM 'with' method failed, using JS fallback: ${error}`);
        this._useWasm = false;
        this.arms.push({ pattern, handler });
      }
    } else {
      this.arms.push({ pattern, handler });
    }
    return this;
  }

  /**
   * Provide a default handler
   * @param defaultHandler The default handler to invoke if no patterns match
   * @returns The result of the matching handler
   */
  otherwise(defaultHandler: (value: T) => R): R {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.otherwise(defaultHandler);
      } catch (error) {
        console.warn(
          `WASM 'otherwise' method failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }

    for (const arm of this.arms) {
      if (this.matchPattern(arm.pattern, this.value)) {
        return arm.handler(this.value);
      }
    }
    return defaultHandler(this.value);
  }

  private matchPattern(pattern: Pattern<T>, value: T): boolean {
    if (pattern === __) return true;
    if (typeof pattern === "function") {
      const predicateFn = pattern as (value: T) => boolean;
      return predicateFn(value);
    }
    return pattern === value;
  }
}
