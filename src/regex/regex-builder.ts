import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

export class RegexBuilder {
  private _inner: any;
  private readonly _useWasm: boolean;

  private constructor(existingWasmBuilder?: any) {
    this._useWasm = isWasmInitialized();

    if (existingWasmBuilder) {
      this._inner = existingWasmBuilder;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.RegexBuilder();
      } catch (error) {
        console.warn(
          `WASM RegexBuilder creation failed, cannot continue: ${error}`
        );
        throw new Error("Failed to initialize RegexBuilder");
      }
    } else {
      throw new Error("WASM module not initialized");
    }
  }

  static async create(): Promise<RegexBuilder> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        throw new Error(`Failed to initialize WASM module: ${error}`);
      }
    }

    return new RegexBuilder();
  }

  and(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.and();
    }
    return this;
  }

  or(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.or();
    }
    return this;
  }

  find(text: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find(text);
    }
    return this;
  }

  anything(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.anything();
    }
    return this;
  }

  something(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.something();
    }
    return this;
  }

  maybe(text: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.maybe(text);
    }
    return this;
  }

  digits(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.digits();
    }
    return this;
  }

  letters(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.letters();
    }
    return this;
  }

  whitespace(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.whitespace();
    }
    return this;
  }

  optionalWhitespace(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.optional_whitespace();
    }
    return this;
  }

  findEmail(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_email();
    }
    return this;
  }

  findUrl(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_url();
    }
    return this;
  }

  findIpAddress(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_ip_address();
    }
    return this;
  }

  findPhoneNumber(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_phone_number();
    }
    return this;
  }

  findDate(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_date();
    }
    return this;
  }

  findTime(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_time();
    }
    return this;
  }

  findObjectWithEmail(key: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_object_with_email(key);
    }
    return this;
  }

  findObjectWithId(key: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_object_with_id(key);
    }
    return this;
  }

  findObjectsThatContainsKey(key: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_objects_that_contains_key(key);
    }
    return this;
  }

  findWordThatStartsWith(prefix: string): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.find_word_that_starts_with(prefix);
    }
    return this;
  }

  startCapture(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.start_capture();
    }
    return this;
  }

  endCapture(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.end_capture();
    }
    return this;
  }

  startGroup(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.start_group();
    }
    return this;
  }

  endGroup(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.end_group();
    }
    return this;
  }

  repeatPrevious(min: number, max?: number): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.repeat_previous(
        min,
        max === undefined ? null : max
      );
    }
    return this;
  }

  repeatZeroOrMore(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.repeatZeroOrMore();
    }
    return this;
  }

  repeatOneOrMore(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.repeatOneOrMore();
    }
    return this;
  }

  repeatZeroOrOne(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.repeatZeroOrOne();
    }
    return this;
  }

  findJsonObject(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.findJsonObject();
    }
    return this;
  }

  findJsonArray(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.findJsonArray();
    }
    return this;
  }

  findJsonString(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.findJsonString();
    }
    return this;
  }

  findJsonKey(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.findJsonKey();
    }
    return this;
  }

  findJsonNumber(): RegexBuilder {
    if (this._useWasm) {
      this._inner = this._inner.findJsonNumber();
    }
    return this;
  }

  done(): string {
    if (this._useWasm) {
      return this._inner.done();
    }
    return "";
  }

  createRegex(): string {
    if (this._useWasm) {
      try {
        return this._inner.createRegex();
      } catch (error) {
        throw new Error(`Failed to create regex: ${error}`);
      }
    }
    return "";
  }

  test(text: string): boolean {
    if (this._useWasm) {
      try {
        return this._inner.test(text);
      } catch (error) {
        throw new Error(`Failed to test regex: ${error}`);
      }
    }
    return false;
  }

  extractMatches(text: string): string[] {
    if (this._useWasm) {
      try {
        const result = this._inner.extractMatches(text);
        return JSON.parse(result);
      } catch (error) {
        throw new Error(`Failed to extract matches: ${error}`);
      }
    }
    return [];
  }
}
