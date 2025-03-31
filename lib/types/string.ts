import { ValidationError } from "../core";
import { WasmStr, ensureWasmInitialized, initWasm } from "../wasm/init";

export class Str {
  private readonly _inner: WasmStr;

  private constructor(inner: WasmStr) {
    this._inner = inner;
  }

  static fromRaw(value: string): Str {
    ensureWasmInitialized();
    try {
      return new Str(WasmStr.fromRaw(value));
    } catch (error) {
      throw new ValidationError(this.fromRaw(`Failed to create Str: ${error}`));
    }
  }

  static async create(value: string): Promise<Str> {
    await initWasm();

    try {
      const wasmStr = WasmStr.create(value);
      return new Str(wasmStr);
    } catch (error) {
      throw new Error(`Failed to create Str: ${error}`);
    }
  }

  unwrap(): string {
    return this._inner.unwrap();
  }

  toUpperCase(): Str {
    return new Str(this._inner.toUpperCase());
  }

  toLowerCase(): Str {
    return new Str(this._inner.toLowerCase());
  }

  len(): number {
    return this._inner.len();
  }

  isEmpty(): boolean {
    return this._inner.isEmpty();
  }

  trim(): Str {
    return new Str(this._inner.trim());
  }

  equals(other: Str): boolean {
    return this._inner.equals(other._inner);
  }

  compare(other: Str): number {
    return this._inner.compare(other._inner);
  }

  toString(): string {
    return this._inner.unwrap();
  }

  toJSON(): string {
    return this._inner.toJSON();
  }
}
