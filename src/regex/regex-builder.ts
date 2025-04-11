/**
 * Regex Builder Module for MiLost
 *
 * Provides a flexible regex builder with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";

/**
 * Module definition for RegexBuilder WASM implementation
 */
const regexBuilderModule: WasmModule = {
  name: "RegexBuilder",

  initialize(wasmModule: any) {
    console.log("Initializing RegexBuilder module with WASM...");

    if (typeof wasmModule.RegexBuilder === "function") {
      console.log("Found RegexBuilder constructor in WASM module");
      RegexBuilder._useWasm = true;

      const staticMethods = ["create"];
      staticMethods.forEach((method) => {
        if (typeof wasmModule.RegexBuilder[method] === "function") {
          console.log(`Found static method: RegexBuilder.${method}`);
        } else {
          console.warn(`Missing static method: RegexBuilder.${method}`);
        }
      });

      const instanceMethods = [
        "and",
        "or",
        "find",
        "anything",
        "something",
        "maybe",
        "digits",
        "letters",
        "whitespace",
        "optionalWhitespace",
        "findEmail",
        "findUrl",
        "findIpAddress",
        "findPhoneNumber",
        "findDate",
        "findTime",
        "findObjectWithEmail",
        "findObjectWithId",
        "findObjectsThatContainsKey",
        "findWordThatStartsWith",
        "startCapture",
        "endCapture",
        "startGroup",
        "endGroup",
        "repeatPrevious",
        "repeatZeroOrMore",
        "repeatOneOrMore",
        "repeatZeroOrOne",
        "findJsonObject",
        "findJsonArray",
        "findJsonString",
        "findJsonKey",
        "findJsonNumber",
        "done",
        "createRegex",
        "test",
        "extractMatches",
      ];

      try {
        const sampleBuilder = new wasmModule.RegexBuilder();
        instanceMethods.forEach((method) => {
          if (typeof sampleBuilder[method] === "function") {
            console.log(
              `Found instance method: RegexBuilder.prototype.${method}`
            );
          } else {
            console.warn(
              `Missing instance method: RegexBuilder.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn("Couldn't create sample RegexBuilder instance:", error);
      }
    } else {
      throw new Error("Required WASM functions not found for RegexBuilder");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for RegexBuilder");
    RegexBuilder._useWasm = false;
  },
};

registerModule(regexBuilderModule);

/**
 * Regex Builder class with WASM acceleration
 */
export class RegexBuilder {
  private _inner: any;
  static _useWasm: boolean = false;

  /**
   * Private constructor to control instance creation
   */
  private constructor(existingWasmBuilder?: any) {
    if (existingWasmBuilder) {
      this._inner = existingWasmBuilder;
    } else if (RegexBuilder._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.RegexBuilder();
      } catch (error) {
        console.warn(
          `WASM RegexBuilder creation failed, using JS fallback: ${error}`
        );
        this._inner = this.createJsBuilder();
      }
    } else {
      this._inner = this.createJsBuilder();
    }
  }

  /**
   * Create a JS fallback implementation
   * @returns A simple JS-based regex builder object
   */
  private createJsBuilder(): any {
    const builder = {
      _pattern: "",

      and: function () {
        this._pattern += "";
        return this;
      },

      or: function () {
        this._pattern += "|";
        return this;
      },

      find: function (text: string) {
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

      maybe: function (text: string) {
        this._pattern += `(${text})?`;
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
   * Static async factory method to create a RegexBuilder
   * @returns A Promise resolving to a RegexBuilder instance
   */
  static async create(): Promise<RegexBuilder> {
    if (!RegexBuilder._useWasm) {
      return new RegexBuilder();
    }

    const wasmModule = getWasmModule();
    if (typeof wasmModule.RegexBuilder?.create === "function") {
      try {
        const wasmBuilder = await wasmModule.RegexBuilder.create();
        return new RegexBuilder(wasmBuilder);
      } catch (error) {
        console.warn(`WASM creation failed, using JS fallback: ${error}`);
        return new RegexBuilder();
      }
    }

    return new RegexBuilder();
  }

  private proxyMethod(methodName: string) {
    return (...args: any[]) => {
      if (RegexBuilder._useWasm) {
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

  and = this.proxyMethod("and");
  or = this.proxyMethod("or");
  find = this.proxyMethod("find");
  anything = this.proxyMethod("anything");
  something = this.proxyMethod("something");
  maybe = this.proxyMethod("maybe");
  digits = this.proxyMethod("digits");
  letters = this.proxyMethod("letters");
  whitespace = this.proxyMethod("whitespace");
  optionalWhitespace = this.proxyMethod("optional_whitespace");
  findEmail = this.proxyMethod("find_email");
  findUrl = this.proxyMethod("find_url");
  findIpAddress = this.proxyMethod("find_ip_address");
  findPhoneNumber = this.proxyMethod("find_phone_number");
  findDate = this.proxyMethod("find_date");
  findTime = this.proxyMethod("find_time");
  findObjectWithEmail = this.proxyMethod("find_object_with_email");
  findObjectWithId = this.proxyMethod("find_object_with_id");
  findObjectsThatContainsKey = this.proxyMethod(
    "find_objects_that_contains_key"
  );
  findWordThatStartsWith = this.proxyMethod("find_word_that_starts_with");
  startCapture = this.proxyMethod("start_capture");
  endCapture = this.proxyMethod("end_capture");
  startGroup = this.proxyMethod("start_group");
  endGroup = this.proxyMethod("end_group");
  repeatZeroOrMore = this.proxyMethod("repeatZeroOrMore");
  repeatOneOrMore = this.proxyMethod("repeatOneOrMore");
  repeatZeroOrOne = this.proxyMethod("repeatZeroOrOne");
  findJsonObject = this.proxyMethod("findJsonObject");
  findJsonArray = this.proxyMethod("findJsonArray");
  findJsonString = this.proxyMethod("findJsonString");
  findJsonKey = this.proxyMethod("findJsonKey");
  findJsonNumber = this.proxyMethod("findJsonNumber");

  /**
   * Repeat previous pattern with optional max repetitions
   */
  repeatPrevious(min: number, max?: number): RegexBuilder {
    if (RegexBuilder._useWasm) {
      try {
        this._inner = this._inner.repeat_previous(
          min,
          max === undefined ? null : max
        );
      } catch (error) {
        console.warn(`WASM repeatPrevious failed, using JS fallback: ${error}`);
        this._inner.repeat_previous(min, max);
      }
    } else {
      this._inner.repeat_previous(min, max);
    }
    return this;
  }

  /**
   * Finalize the regex pattern
   * @returns The compiled regex pattern
   */
  done(): string {
    if (RegexBuilder._useWasm) {
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
    if (RegexBuilder._useWasm) {
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
    if (RegexBuilder._useWasm) {
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
    if (RegexBuilder._useWasm) {
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
