/**
 * Regex Language Module for MiLost
 *
 * Provides a fluent, natural-language-like regex builder with
 * WebAssembly acceleration and JavaScript fallback capabilities.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

/**
 * Module definition for RegexLanguage WASM implementation
 */
const regexLanguageModule: WasmModule = {
  name: "RegexLanguage",

  initialize(wasmModule: any) {
    console.log("Initializing RegexLanguage module with WASM...");

    if (typeof wasmModule.RegexLanguage === "function") {
      console.log("Found RegexLanguage constructor in WASM module");
      RegexLanguage._useWasm = true;

      const staticMethods = ["create"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.RegexLanguage[method] === "function") {
          console.log(`Found static method: RegexLanguage.${method}`);
        } else {
          console.warn(`Missing static method: RegexLanguage.${method}`);
        }
      });

      const instanceMethods = [
        "iWantToFind",
        "findMe",
        "anything",
        "something",
        "digits",
        "anEmail",
        "aUrl",
        "anIpAddress",
        "aPhoneNumber",
        "aDate",
        "aTime",
        "withEmailIn",
        "thatContainsKey",
        "followedBy",
        "orMaybe",
        "thatRepeatsAtLeast",
        "thatRepeatsExactly",
        "wordsStartingWith",
        "startCapturing",
        "endCapturing",
        "jsonObject",
        "jsonArray",
        "jsonString",
        "jsonNumber",
        "jsonKey",
        "thatRepeatsZeroOrMore",
        "thatRepeatsOneOrMore",
        "thatIsOptional",
        "done",
        "createRegex",
        "test",
        "extractMatches",
      ];

      try {
        const sampleLanguage = new wasmModule.RegexLanguage();
        instanceMethods.forEach((method) => {
          if (typeof sampleLanguage[method] === "function") {
            console.log(
              `Found instance method: RegexLanguage.prototype.${method}`
            );
          } else {
            console.warn(
              `Missing instance method: RegexLanguage.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample RegexLanguage instance:", error);
      }
    } else {
      throw new Error("Required WASM functions not found for RegexLanguage");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for RegexLanguage");
    RegexLanguage._useWasm = false;
  },
};

registerModule(regexLanguageModule);

/**
 * Regex Language Builder class with WASM acceleration
 */
export class RegexLanguage {
  private _inner: any;
  static _useWasm: boolean = false;

  /**
   * Private constructor to control instance creation
   */
  private constructor(existingWasmLanguage?: any) {
    if (existingWasmLanguage) {
      this._inner = existingWasmLanguage;
    } else if (RegexLanguage._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.RegexLanguage();
      } catch (error) {
        console.warn(
          `WASM RegexLanguage creation failed, using JS fallback: ${error}`
        );
        this._inner = this.createJsLanguage();
      }
    } else {
      this._inner = this.createJsLanguage();
    }
  }

  /**
   * Create a JS fallback implementation
   * @returns A simple JS-based regex language builder object
   */
  private createJsLanguage(): any {
    const builder = {
      _pattern: "",

      i_want_to_find: function () {
        this._pattern += "";
        return this;
      },

      find_me: function (text: string) {
        this._pattern += text;
        return this;
      },

      anything: function () {
        this._pattern += ".*";
        return this;
      },

      something: function () {
        this._pattern += ".+";
        return this;
      },

      digits: function () {
        this._pattern += "\\d+";
        return this;
      },

      an_email: function () {
        this._pattern += "\\S+@\\S+\\.\\S+";
        return this;
      },

      done: function () {
        return this._pattern;
      },

      createRegex: function () {
        return this._pattern;
      },

      test: function (text: string) {
        try {
          return new RegExp(this._pattern).test(text);
        } catch {
          return false;
        }
      },

      extractMatches: function (text: string) {
        try {
          return JSON.stringify(
            text.match(new RegExp(this._pattern, "g")) || []
          );
        } catch {
          return "[]";
        }
      },
    };

    return builder;
  }

  /**
   * Static async factory method to create a RegexLanguage
   * @returns A Promise resolving to a RegexLanguage instance
   */
  static async create(): Promise<RegexLanguage> {
    if (!RegexLanguage._useWasm) {
      return new RegexLanguage();
    }

    const wasmModule = getWasmModule();
    if (typeof wasmModule.RegexLanguage?.create === "function") {
      try {
        const wasmLanguage = await wasmModule.RegexLanguage.create();
        return new RegexLanguage(wasmLanguage);
      } catch (error) {
        console.warn(`WASM creation failed, using JS fallback: ${error}`);
        return new RegexLanguage();
      }
    }

    return new RegexLanguage();
  }

  private proxyMethod(methodName: string) {
    return (...args: any[]) => {
      if (RegexLanguage._useWasm) {
        try {
          this._inner = this._inner[methodName](...args);
        } catch (error) {
          console.warn(
            `WASM method ${methodName} failed, using JS fallback: ${error}`
          );
          this._inner[methodName](...args);
        }
      } else {
        this._inner[methodName](...args);
      }
      return this;
    };
  }

  iWantToFind = this.proxyMethod("i_want_to_find");
  findMe = this.proxyMethod("find_me");
  anything = this.proxyMethod("anything");
  something = this.proxyMethod("something");
  digits = this.proxyMethod("digits");
  anEmail = this.proxyMethod("an_email");
  aUrl = this.proxyMethod("a_url");
  anIpAddress = this.proxyMethod("an_ip_address");
  aPhoneNumber = this.proxyMethod("a_phone_number");
  aDate = this.proxyMethod("a_date");
  aTime = this.proxyMethod("a_time");
  withEmailIn = this.proxyMethod("with_email_in");
  thatContainsKey = this.proxyMethod("that_contains_key");
  followedBy = this.proxyMethod("followed_by");
  orMaybe = this.proxyMethod("or_maybe");
  wordsStartingWith = this.proxyMethod("words_starting_with");
  startCapturing = this.proxyMethod("start_capturing");
  endCapturing = this.proxyMethod("end_capturing");
  jsonObject = this.proxyMethod("json_object");
  jsonArray = this.proxyMethod("json_array");
  jsonString = this.proxyMethod("json_string");
  jsonNumber = this.proxyMethod("json_number");
  jsonKey = this.proxyMethod("json_key");
  thatRepeatsZeroOrMore = this.proxyMethod("that_repeats_zero_or_more");
  thatRepeatsOneOrMore = this.proxyMethod("that_repeats_one_or_more");
  thatIsOptional = this.proxyMethod("that_is_optional");

  /**
   * Repeat at least a specific number of times
   */
  thatRepeatsAtLeast(count: number): RegexLanguage {
    if (RegexLanguage._useWasm) {
      try {
        this._inner = this._inner.that_repeats_at_least(count);
      } catch (error) {
        console.warn(
          `WASM thatRepeatsAtLeast failed, using JS fallback: ${error}`
        );
        this._inner.that_repeats_at_least(count);
      }
    } else {
      this._inner.that_repeats_at_least(count);
    }
    return this;
  }

  /**
   * Repeat exactly a specific number of times
   */
  thatRepeatsExactly(count: number): RegexLanguage {
    if (RegexLanguage._useWasm) {
      try {
        this._inner = this._inner.that_repeats_exactly(count);
      } catch (error) {
        console.warn(
          `WASM thatRepeatsExactly failed, using JS fallback: ${error}`
        );
        this._inner.that_repeats_exactly(count);
      }
    } else {
      this._inner.that_repeats_exactly(count);
    }
    return this;
  }

  /**
   * Finalize the regex pattern
   * @returns The compiled regex pattern
   */
  done(): string {
    if (RegexLanguage._useWasm) {
      try {
        return this._inner.done();
      } catch (error) {
        console.warn(`WASM done failed, using JS fallback: ${error}`);
        return this._inner.done();
      }
    }
    return this._inner.done();
  }

  /**
   * Create the final regex pattern
   * @returns The compiled regex pattern
   */
  createRegex(): string {
    if (RegexLanguage._useWasm) {
      try {
        return this._inner.createRegex();
      } catch (error) {
        console.warn(`WASM createRegex failed, using JS fallback: ${error}`);
        return this._inner.createRegex();
      }
    }
    return this._inner.createRegex();
  }

  /**
   * Test if a text matches the regex pattern
   * @param text The text to test
   * @returns Whether the text matches the pattern
   */
  test(text: string): boolean {
    if (RegexLanguage._useWasm) {
      try {
        return this._inner.test(text);
      } catch (error) {
        console.warn(`WASM test failed, using JS fallback: ${error}`);
        return this._inner.test(text);
      }
    }
    return this._inner.test(text);
  }

  /**
   * Extract matches from a text
   * @param text The text to extract matches from
   * @returns An array of matched substrings
   */
  extractMatches(text: string): string[] {
    if (RegexLanguage._useWasm) {
      try {
        const result = this._inner.extractMatches(text);
        return JSON.parse(result);
      } catch (error) {
        console.warn(`WASM extractMatches failed, using JS fallback: ${error}`);
        return this._inner.extractMatches(text);
      }
    }
    return this._inner.extractMatches(text);
  }
}
