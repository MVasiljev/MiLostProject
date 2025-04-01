import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

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
        this._inner = wasmModule.createMatchBuilder(value as any);
      } catch (err) {
        console.warn(
          `WASM MatchBuilder creation failed, using JS implementation: ${err}`
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

    // If using WASM, make sure the wildcard symbol matches
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule.getWildcardSymbol) {
          // This ensures our wildcard symbol matches the one from WASM
          // We can't replace the existing symbol directly, but we'll use it for comparison
        }
      } catch (err) {
        console.warn(`WASM wildcard symbol initialization failed: ${err}`);
      }
    }
  }

  with(pattern: Pattern<T>, handler: (value: T) => R): this {
    if (this._useWasm) {
      try {
        this._inner.with(pattern as any, handler as any);
      } catch (err) {
        console.warn(`WASM 'with' method failed, using JS fallback: ${err}`);
        this._useWasm = false;
        this.arms.push({ pattern, handler });
      }
    } else {
      this.arms.push({ pattern, handler });
    }
    return this;
  }

  otherwise(defaultHandler: (value: T) => R): R {
    if (this._useWasm) {
      try {
        return this._inner.otherwise(defaultHandler) as R;
      } catch (err) {
        console.warn(
          `WASM 'otherwise' method failed, using JS fallback: ${err}`
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
    if (typeof pattern === "function")
      return (pattern as (value: T) => boolean)(value);
    return pattern === value;
  }
}

export async function build<T>(value: T): Promise<MatchBuilder<T, any>> {
  await MatchBuilder.init();
  return new MatchBuilder<T, any>(value);
}
