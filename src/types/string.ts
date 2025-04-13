/**
 * String type implementation for MiLost
 *
 * Provides a type-safe, immutable string implementation with WebAssembly
 * acceleration when available.
 */

import { WasmModule, registerModule, getWasmModule } from "../initWasm";

/**
 * Module definition for Str WASM implementation
 */
const strModule: WasmModule = {
  name: "Str",

  initialize(wasmModule: any) {
    console.log("Initializing Str module with WASM...");

    if (typeof wasmModule.Str === "function") {
      console.log("Found Str constructor in WASM module");
      Str._useWasm = true;

      const staticMethods = ["fromRaw", "empty"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.Str[method] === "function") {
          console.log(`Found static method: Str.${method}`);
        } else {
          console.warn(`Missing static method: Str.${method}`);
        }
      });

      const instanceMethods = [
        "unwrap",
        "toString",
        "len",
        "isEmpty",
        "toUpperCase",
        "toLowerCase",
        "contains",
        "trim",
        "charAt",
        "substring",
        "concat",
        "startsWith",
        "endsWith",
        "indexOf",
        "lastIndexOf",
        "split",
        "replace",
        "valueOf",
        "equals",
      ];

      try {
        const sampleStr = new wasmModule.Str("test");
        instanceMethods.forEach((method) => {
          if (typeof sampleStr[method] === "function") {
            console.log(`Found instance method: Str.prototype.${method}`);
          } else {
            console.warn(`Missing instance method: Str.prototype.${method}`);
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample Str instance:", error);
      }
    } else {
      console.warn("Str constructor not found in WASM module");

      if (
        typeof wasmModule.StringModule === "object" &&
        wasmModule.StringModule !== null
      ) {
        console.log("Found StringModule object, checking methods...");
        Object.keys(wasmModule.StringModule).forEach((key) => {
          console.log(`Found StringModule.${key}`);
        });

        if (typeof wasmModule.StringModule.createStr === "function") {
          console.log("Found alternative constructor: StringModule.createStr");
          Str._useWasm = true;
          return;
        }
      }

      throw new Error("Required WASM functions not found for Str module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Str module");
    Str._useWasm = false;
  },
};

registerModule(strModule);

/**
 * An immutable string type with WASM acceleration
 */
export class Str {
  private readonly _inner: any;
  private readonly _jsValue: string;
  private readonly _useWasm: boolean;
  static _useWasm: boolean = false;

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    value: string,
    useWasm: boolean = Str._useWasm,
    existingWasmStr?: any
  ) {
    this._jsValue = value;
    this._useWasm = useWasm && Str._useWasm;

    if (existingWasmStr) {
      this._inner = existingWasmStr;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Str === "function") {
          this._inner = new wasmModule.Str(value);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM Str creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a string from a raw JavaScript string
   * @param value The raw string value
   * @returns A new Str instance
   */
  static fromRaw(value: string): Str {
    if (Str._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Str &&
        typeof wasmModule.Str.fromRaw === "function"
      ) {
        try {
          return wasmModule.Str.fromRaw(value);
        } catch (error) {
          console.warn(`WASM Str.fromRaw failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Str(value, false);
  }

  /**
   * Create an empty string
   * @returns A new empty Str instance
   */
  static empty(): Str {
    if (Str._useWasm) {
      const wasmModule = getWasmModule();
      if (
        wasmModule &&
        wasmModule.Str &&
        typeof wasmModule.Str.empty === "function"
      ) {
        try {
          return wasmModule.Str.empty();
        } catch (error) {
          console.warn(`WASM Str.empty failed, using JS fallback: ${error}`);
        }
      }
    }
    return new Str("", false);
  }

  /**
   * Get the raw JavaScript string value
   * @returns The raw string value
   */
  unwrap(): string {
    if (this._useWasm && this._inner) {
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
   * Convert to string
   * @returns The string representation
   */
  toString(): string {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.toString();
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
        return this._jsValue;
      }
    }
    return this._jsValue;
  }

  /**
   * Get the length of the string
   * @returns The string length
   */
  len(): number {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.len();
      } catch (error) {
        console.warn(`WASM len failed, using JS fallback: ${error}`);
        return this._jsValue.length;
      }
    }
    return this._jsValue.length;
  }

  /**
   * Check if the string is empty
   * @returns True if the string is empty
   */
  isEmpty(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isEmpty();
      } catch (error) {
        console.warn(`WASM isEmpty failed, using JS fallback: ${error}`);
        return this._jsValue.length === 0;
      }
    }
    return this._jsValue.length === 0;
  }

  /**
   * Convert to uppercase
   * @returns A new Str with uppercase content
   */
  toUpperCase(): Str {
    if (this._useWasm && this._inner) {
      try {
        const upper = this._inner.toUpperCase();
        return new Str(this._jsValue.toUpperCase(), true, upper);
      } catch (error) {
        console.warn(`WASM toUpperCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toUpperCase(), false);
  }

  /**
   * Convert to lowercase
   * @returns A new Str with lowercase content
   */
  toLowerCase(): Str {
    if (this._useWasm && this._inner) {
      try {
        const lower = this._inner.toLowerCase();
        return new Str(this._jsValue.toLowerCase(), true, lower);
      } catch (error) {
        console.warn(`WASM toLowerCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toLowerCase(), false);
  }

  /**
   * Check if the string contains a substring
   * @param substr The substring to check for
   * @returns True if the substring is found
   */
  contains(substr: string): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.contains(substr);
      } catch (error) {
        console.warn(`WASM contains failed, using JS fallback: ${error}`);
        return this._jsValue.includes(substr);
      }
    }
    return this._jsValue.includes(substr);
  }

  /**
   * Trim whitespace from both ends of the string
   * @returns A new Str with trimmed content
   */
  trim(): Str {
    if (this._useWasm && this._inner) {
      try {
        const trimmed = this._inner.trim();
        return new Str(this._jsValue.trim(), true, trimmed);
      } catch (error) {
        console.warn(`WASM trim failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.trim(), false);
  }

  /**
   * Get the character at a specific index
   * @param index The index of the character
   * @returns The character at the index, or empty string if out of bounds
   */
  charAt(index: number): string {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.charAt(index);
      } catch (error) {
        console.warn(`WASM charAt failed, using JS fallback: ${error}`);
        return index >= this._jsValue.length ? "" : this._jsValue.charAt(index);
      }
    }
    return index >= this._jsValue.length ? "" : this._jsValue.charAt(index);
  }

  /**
   * Get a substring
   * @param start The start index
   * @param end The end index
   * @returns A new Str with the substring
   */
  substring(start: number, end: number): Str {
    if (this._useWasm && this._inner) {
      try {
        const substr = this._inner.substring(start, end);
        const jsSubstr = this._jsValue.substring(start, end);
        return new Str(jsSubstr, true, substr);
      } catch (error) {
        console.warn(`WASM substring failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.substring(start, end), false);
  }

  /**
   * Concatenate with another string
   * @param other The string to concatenate with
   * @returns A new Str with the concatenated content
   */
  concat(other: Str): Str {
    if (this._useWasm && this._inner && other._useWasm && other._inner) {
      try {
        const newWasmStr = this._inner.concat(other._inner);
        const newValue = this._jsValue + other._jsValue;
        return new Str(newValue, true, newWasmStr);
      } catch (error) {
        console.warn(`WASM concat failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue + other._jsValue, false);
  }

  /**
   * Check if the string starts with a prefix
   * @param prefix The prefix to check for
   * @returns True if the string starts with the prefix
   */
  startsWith(prefix: string): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.startsWith(prefix);
      } catch (error) {
        console.warn(`WASM startsWith failed, using JS fallback: ${error}`);
        return this._jsValue.startsWith(prefix);
      }
    }
    return this._jsValue.startsWith(prefix);
  }

  /**
   * Check if the string ends with a suffix
   * @param suffix The suffix to check for
   * @returns True if the string ends with the suffix
   */
  endsWith(suffix: string): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.endsWith(suffix);
      } catch (error) {
        console.warn(`WASM endsWith failed, using JS fallback: ${error}`);
        return this._jsValue.endsWith(suffix);
      }
    }
    return this._jsValue.endsWith(suffix);
  }

  /**
   * Find the index of a substring
   * @param searchStr The substring to find
   * @param position Optional starting position
   * @returns The index of the substring, or -1 if not found
   */
  indexOf(searchStr: string, position?: number): number {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.indexOf(searchStr, position);
      } catch (error) {
        console.warn(`WASM indexOf failed, using JS fallback: ${error}`);
        return this._jsValue.indexOf(searchStr, position);
      }
    }
    return this._jsValue.indexOf(searchStr, position);
  }

  /**
   * Find the last index of a substring
   * @param searchStr The substring to find
   * @returns The last index of the substring, or -1 if not found
   */
  lastIndexOf(searchStr: string): number {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.lastIndexOf(searchStr);
      } catch (error) {
        console.warn(`WASM lastIndexOf failed, using JS fallback: ${error}`);
        return this._jsValue.lastIndexOf(searchStr);
      }
    }
    return this._jsValue.lastIndexOf(searchStr);
  }

  /**
   * Split the string by a separator
   * @param separator The separator
   * @returns An array of strings
   */
  split(separator: string): string[] {
    if (this._useWasm && this._inner) {
      try {
        const parts = this._inner.split(separator);
        return Array.from(parts).map((part) =>
          part instanceof Str ? part.toString() : String(part)
        );
      } catch (error) {
        console.warn(`WASM split failed, using JS fallback: ${error}`);
      }
    }
    return this._jsValue.split(separator);
  }

  /**
   * Replace occurrences of a search string with a replacement
   * @param searchValue The string to search for
   * @param replaceValue The replacement string
   * @returns A new Str with the replacements made
   */
  replace(searchValue: string, replaceValue: string): Str {
    if (this._useWasm && this._inner) {
      try {
        const replaced = this._inner.replace(searchValue, replaceValue);
        const newValue = this._jsValue.replace(searchValue, replaceValue);
        return new Str(newValue, true, replaced);
      } catch (error) {
        console.warn(`WASM replace failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.replace(searchValue, replaceValue), false);
  }

  /**
   * Get the primitive value
   * @returns The raw string value
   */
  valueOf(): string {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.valueOf();
      } catch (error) {
        console.warn(`WASM valueOf failed, using JS fallback: ${error}`);
        return this._jsValue;
      }
    }
    return this._jsValue;
  }

  /**
   * Check if two strings are equal
   * @param other The string to compare with
   * @returns True if the strings are equal
   */
  equals(other: Str): boolean {
    if (this._useWasm && this._inner && other._useWasm && other._inner) {
      try {
        return this._inner.equals(other._inner);
      } catch (error) {
        console.warn(`WASM equals failed, using JS fallback: ${error}`);
        return this._jsValue === other._jsValue;
      }
    }
    return this._jsValue === other.unwrap();
  }

  /**
   * Convert to JSON
   * @returns The JSON representation
   */
  toJSON(): string {
    return JSON.stringify(this.unwrap());
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): string {
    return "Str";
  }
}
