import { getWasmModule, isWasmInitialized } from "../wasm/init";
import { callWasmInstanceMethod, callWasmStaticMethod } from "../wasm/lib";

export class Str {
  private readonly _inner: any;
  private readonly _jsValue: string;
  private readonly _useWasm: boolean;

  private constructor(
    value: string,
    useWasm: boolean = true,
    existingWasmStr?: any
  ) {
    this._jsValue = value;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmStr) {
      this._inner = existingWasmStr;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.Str(value);
      } catch (error) {
        console.warn(
          `WASM Str creation failed, using JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static fromRaw(value: string): Str {
    return callWasmStaticMethod(
      "Str",
      "fromRaw",
      [value],
      () => new Str(value, false)
    );
  }

  static empty(): Str {
    return callWasmStaticMethod("Str", "empty", [], () => new Str("", false));
  }

  unwrap(): string {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "unwrap",
        [],
        () => this._jsValue
      );
    }
    return this._jsValue;
  }

  toString(): string {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "toString",
        [],
        () => this._jsValue
      );
    }
    return this._jsValue;
  }

  len(): number {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "len",
        [],
        () => this._jsValue.length
      );
    }
    return this._jsValue.length;
  }

  isEmpty(): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "isEmpty",
        [],
        () => this._jsValue.length === 0
      );
    }
    return this._jsValue.length === 0;
  }

  toUpperCase(): Str {
    if (this._useWasm) {
      try {
        const upper = this._inner.toUpperCase();
        return new Str(this._jsValue.toUpperCase(), true, upper);
      } catch (error) {
        console.warn(`WASM toUpperCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toUpperCase(), false);
  }

  toLowerCase(): Str {
    if (this._useWasm) {
      try {
        const lower = this._inner.toLowerCase();
        return new Str(this._jsValue.toLowerCase(), true, lower);
      } catch (error) {
        console.warn(`WASM toLowerCase failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.toLowerCase(), false);
  }

  contains(substr: string): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "contains", [substr], () =>
        this._jsValue.includes(substr)
      );
    }
    return this._jsValue.includes(substr);
  }

  trim(): Str {
    if (this._useWasm) {
      try {
        const trimmed = this._inner.trim();
        return new Str(this._jsValue.trim(), true, trimmed);
      } catch (error) {
        console.warn(`WASM trim failed, using JS fallback: ${error}`);
      }
    }
    return new Str(this._jsValue.trim(), false);
  }

  charAt(index: number): string {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "charAt", [index], () =>
        index >= this._jsValue.length ? "" : this._jsValue.charAt(index)
      );
    }
    return index >= this._jsValue.length ? "" : this._jsValue.charAt(index);
  }

  substring(start: number, end: number): Str {
    if (this._useWasm) {
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

  concat(other: Str): Str {
    if (this._useWasm && other._useWasm) {
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

  startsWith(prefix: string): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "startsWith", [prefix], () =>
        this._jsValue.startsWith(prefix)
      );
    }
    return this._jsValue.startsWith(prefix);
  }

  endsWith(suffix: string): boolean {
    if (this._useWasm) {
      return callWasmInstanceMethod(this._inner, "endsWith", [suffix], () =>
        this._jsValue.endsWith(suffix)
      );
    }
    return this._jsValue.endsWith(suffix);
  }

  indexOf(searchStr: string, position?: number): number {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "indexOf",
        [searchStr, position],
        () => this._jsValue.indexOf(searchStr, position)
      );
    }
    return this._jsValue.indexOf(searchStr, position);
  }

  lastIndexOf(searchStr: string): number {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "lastIndexOf",
        [searchStr],
        () => this._jsValue.lastIndexOf(searchStr)
      );
    }
    return this._jsValue.lastIndexOf(searchStr);
  }

  split(separator: string): string[] {
    if (this._useWasm) {
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

  replace(searchValue: string, replaceValue: string): Str {
    if (this._useWasm) {
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

  valueOf(): string {
    if (this._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "valueOf",
        [],
        () => this._jsValue
      );
    }
    return this._jsValue;
  }

  equals(other: Str): boolean {
    if (this._useWasm && other._useWasm) {
      return callWasmInstanceMethod(
        this._inner,
        "equals",
        [other._inner],
        () => this._jsValue === other._jsValue
      );
    }
    return this._jsValue === other.unwrap();
  }

  toJSON(): string {
    return JSON.stringify(this.unwrap());
  }

  get [Symbol.toStringTag](): string {
    return "Str";
  }
}
