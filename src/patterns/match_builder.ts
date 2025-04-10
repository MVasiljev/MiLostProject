import {
  getWasmModule,
  initWasm,
  isWasmInitialized,
} from "../initWasm/init.js";
import {
  callWasmStaticMethod,
  callWasmInstanceMethod,
} from "../initWasm/lib.js";

type Pattern<T> = T | ((value: T) => boolean) | typeof __;

export const __ = Symbol("Wildcard");

export class MatchBuilder<T, R> {
  private readonly value: T;
  private readonly arms: { pattern: Pattern<T>; handler: (value: T) => R }[] =
    [];
  private _inner: any;
  private _useWasm: boolean;

  constructor(value: T) {
    this.value = value;
    this._useWasm = isWasmInitialized();

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = callWasmStaticMethod(
          "MatchBuilder",
          "create",
          [value],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM MatchBuilder creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }

  with(pattern: Pattern<T>, handler: (value: T) => R): this {
    if (this._useWasm) {
      try {
        callWasmInstanceMethod(this._inner, "with", [pattern, handler], () => {
          this._useWasm = false;
          this.arms.push({ pattern, handler });
        });
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

  otherwise(defaultHandler: (value: T) => R): R {
    return callWasmInstanceMethod(
      this._inner,
      "otherwise",
      [defaultHandler],
      () => {
        for (const arm of this.arms) {
          if (this.matchPattern(arm.pattern, this.value)) {
            return arm.handler(this.value);
          }
        }
        return defaultHandler(this.value);
      }
    );
  }

  private matchPattern(pattern: Pattern<T>, value: T): boolean {
    if (pattern === __) return true;
    if (typeof pattern === "function")
      return (pattern as (value: T) => boolean)(value);
    return pattern === value;
  }
}

export async function build<T>(value: T): Promise<MatchBuilder<T, any>> {
  await MatchBuilder.init();
  return new MatchBuilder<T, any>(value);
}
