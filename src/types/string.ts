// src/types/string.ts
import { ValidationError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

/**
 * A Rust-like string type
 */
export class Str {
  private readonly _inner: any;
  private readonly _jsValue: string;
  private readonly _useWasm: boolean;

  private constructor(value: string, useWasm: boolean = true) {
    this._jsValue = value;
    this._useWasm = useWasm && isWasmInitialized();

    if (this._useWasm) {
      try {
        // Get the WASM module
        const wasmModule = getWasmModule();

        // Create a WASM string
        this._inner = new wasmModule.Str(value);
      } catch (error) {
        // Fall back to pure JS if WASM fails
        console.warn(
          `WASM string creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a string from a raw value (synchronous, requires WASM to be initialized)
   */
  static fromRaw(value: string): Str {
    return new Str(value);
  }

  /**
   * Create a string (async to ensure WASM is initialized)
   */
  static async create(value: string): Promise<Str> {
    // Ensure WASM is initialized if available
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }

    return new Str(value);
  }

  /**
   * Get the underlying string value
   */
  unwrap(): string {
    if (this._useWasm) {
      try {
        return this._inner.unwrap();
      } catch (error) {
        console.warn(`WASM unwrap failed, using JS fallback: ${error}`);
        return this._jsValue;
      }
    }
    return this._jsValue;
  }

  /**
   * Convert to uppercase
   */
  toUpperCase(): Str {
    if (this._useWasm) {
      try {
        // Changed to use the correct snake_case method name from Rust
        const upper = this._inner.to_uppercase();
        return new Str(upper.unwrap(), true);
      } catch (error) {
        console.warn(`WASM toUpperCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toUpperCase(), false);
  }

  /**
   * Convert to lowercase
   */
  toLowerCase(): Str {
    if (this._useWasm) {
      try {
        // Changed to use the correct snake_case method name from Rust
        const lower = this._inner.to_lowercase();
        return new Str(lower.unwrap(), true);
      } catch (error) {
        console.warn(`WASM toLowerCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toLowerCase(), false);
  }

  /**
   * Get string length
   */
  len(): number {
    if (this._useWasm) {
      try {
        return this._inner.len();
      } catch (error) {
        console.warn(`WASM len failed, using JS fallback: ${error}`);
      }
    }
    return this._jsValue.length;
  }

  /**
   * Check if string is empty
   */
  isEmpty(): boolean {
    if (this._useWasm) {
      try {
        // Changed to use the correct snake_case method name from Rust
        return this._inner.is_empty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
      }
    }
    return this._jsValue.length === 0;
  }

  /**
   * Trim whitespace
   */
  trim(): Str {
    if (this._useWasm) {
      try {
        const trimmed = this._inner.trim();
        return new Str(trimmed.unwrap(), true);
      } catch (error) {
        console.warn(`WASM trim failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.trim(), false);
  }

  /**
   * Check if this string equals another
   */
  equals(other: Str): boolean {
    return this.unwrap() === other.unwrap();
  }

  /**
   * Compare strings
   */
  compare(other: Str): number {
    const thisStr = this.unwrap();
    const otherStr = other.unwrap();

    if (thisStr < otherStr) return -1;
    if (thisStr > otherStr) return 1;
    return 0;
  }

  /**
   * Check if string contains a substring
   */
  contains(substr: string): boolean {
    if (this._useWasm) {
      try {
        return this._inner.contains(substr);
      } catch (error) {
        console.warn(`WASM contains failed, using JS fallback: ${error}`);
      }
    }
    return this._jsValue.includes(substr);
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.unwrap();
  }

  /**
   * Convert to JSON
   */
  toJSON(): string {
    return JSON.stringify(this.unwrap());
  }
}
