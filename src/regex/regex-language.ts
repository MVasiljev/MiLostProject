import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class RegexLanguage {
  private _inner: any;
  private readonly _useWasm: boolean;

  private constructor(existingWasmLanguage?: any) {
    this._useWasm = isWasmInitialized();

    if (existingWasmLanguage) {
      this._inner = existingWasmLanguage;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.RegexLanguage();
      } catch (error) {
        console.warn(
          `WASM RegexLanguage creation failed, cannot continue: ${error}`
        );
        throw new Error("Failed to initialize RegexLanguage");
      }
    } else {
      throw new Error("WASM module not initialized");
    }
  }

  static async create(): Promise<RegexLanguage> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        throw new Error(`Failed to initialize WASM module: ${error}`);
      }
    }

    return new RegexLanguage();
  }

  iWantToFind(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.i_want_to_find();
    }
    return this;
  }

  findMe(text: string): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.find_me(text);
    }
    return this;
  }

  anything(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.anything();
    }
    return this;
  }

  something(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.something();
    }
    return this;
  }

  digits(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.digits();
    }
    return this;
  }

  anEmail(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.an_email();
    }
    return this;
  }

  aUrl(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.a_url();
    }
    return this;
  }

  anIpAddress(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.an_ip_address();
    }
    return this;
  }

  aPhoneNumber(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.a_phone_number();
    }
    return this;
  }

  aDate(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.a_date();
    }
    return this;
  }

  aTime(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.a_time();
    }
    return this;
  }

  withEmailIn(field: string): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.with_email_in(field);
    }
    return this;
  }

  thatContainsKey(key: string): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_contains_key(key);
    }
    return this;
  }

  followedBy(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.followed_by();
    }
    return this;
  }

  orMaybe(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.or_maybe();
    }
    return this;
  }

  thatRepeatsAtLeast(count: number): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_repeats_at_least(count);
    }
    return this;
  }

  thatRepeatsExactly(count: number): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_repeats_exactly(count);
    }
    return this;
  }

  wordsStartingWith(prefix: string): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.words_starting_with(prefix);
    }
    return this;
  }

  startCapturing(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.start_capturing();
    }
    return this;
  }

  endCapturing(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.end_capturing();
    }
    return this;
  }

  jsonObject(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.json_object();
    }
    return this;
  }

  jsonArray(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.json_array();
    }
    return this;
  }

  jsonString(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.json_string();
    }
    return this;
  }

  jsonNumber(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.json_number();
    }
    return this;
  }

  jsonKey(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.json_key();
    }
    return this;
  }

  thatRepeatsZeroOrMore(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_repeats_zero_or_more();
    }
    return this;
  }

  thatRepeatsOneOrMore(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_repeats_one_or_more();
    }
    return this;
  }

  thatIsOptional(): RegexLanguage {
    if (this._useWasm) {
      this._inner = this._inner.that_is_optional();
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
