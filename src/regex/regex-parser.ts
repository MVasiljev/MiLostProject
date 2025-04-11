/**
 * Regex Parser Module for MiLost
 *
 * Provides static methods for parsing and manipulating regex patterns
 * with WebAssembly acceleration and JavaScript fallback capabilities.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";

/**
 * Module definition for RegexParser WASM implementation
 */
const regexParserModule: WasmModule = {
  name: "RegexParser",

  initialize(wasmModule: any) {
    console.log("Initializing RegexParser module with WASM...");

    const requiredMethods = [
      "parse_regex",
      "extract_matches",
      "test_pattern",
      "replace_matches",
    ];

    const missingMethods = requiredMethods.filter(
      (method) => typeof wasmModule[method] !== "function"
    );

    if (missingMethods.length > 0) {
      console.warn(`Missing WASM methods: ${missingMethods.join(", ")}`);
      throw new Error(
        `Required WASM functions not found for RegexParser: ${missingMethods.join(
          ", "
        )}`
      );
    }

    RegexParser._useWasm = true;
    console.log("RegexParser WASM module initialized successfully");
  },

  fallback() {
    console.log("Using JavaScript fallback for RegexParser");
    RegexParser._useWasm = false;
  },
};

registerModule(regexParserModule);

/**
 * Regex Parser with WebAssembly acceleration
 */
export class RegexParser {
  static _useWasm: boolean = false;

  /**
   * Private constructor to prevent instantiation
   */
  private constructor() {}

  /**
   * Initialize the WASM module
   * @returns A Promise that resolves when initialization is complete
   */
  static async initialize(): Promise<void> {
    if (!RegexParser._useWasm) {
      try {
        await RegexParser.initializeFallback();
      } catch (error) {
        throw new Error(`Failed to initialize Regex Parser: ${error}`);
      }
      return;
    }

    const wasmModule = getWasmModule();
    if (!wasmModule) {
      await RegexParser.initializeFallback();
    }
  }

  /**
   * Initialize fallback implementation
   */
  private static async initializeFallback(): Promise<void> {
    console.log("Using JavaScript fallback for RegexParser");
  }

  /**
   * Create a fallback implementation for regex operations
   * @param method The method name to create a fallback for
   * @returns A fallback function
   */
  private static createFallbackMethod(
    method: "parse_regex"
  ): (pattern: string) => string[];
  private static createFallbackMethod(
    method: "extract_matches"
  ): (pattern: string, text: string) => string[];
  private static createFallbackMethod(
    method: "test_pattern"
  ): (pattern: string, text: string) => boolean;
  private static createFallbackMethod(
    method: "replace_matches"
  ): (pattern: string, text: string, replacement: string) => string;
  private static createFallbackMethod(method: string) {
    switch (method) {
      case "parse_regex":
        return (pattern: string): string[] => {
          try {
            const regex = new RegExp(pattern);
            return [`Regex: ${regex.source}`, `Flags: ${regex.flags}`];
          } catch (error) {
            console.warn(`Fallback parse_regex failed: ${error}`);
            return [];
          }
        };

      case "extract_matches":
        return (pattern: string, text: string): string[] => {
          try {
            const regex = new RegExp(pattern, "g");
            return Array.from(text.match(regex) || []);
          } catch (error) {
            console.warn(`Fallback extract_matches failed: ${error}`);
            return [];
          }
        };

      case "test_pattern":
        return (pattern: string, text: string): boolean => {
          try {
            return new RegExp(pattern).test(text);
          } catch (error) {
            console.warn(`Fallback test_pattern failed: ${error}`);
            return false;
          }
        };

      case "replace_matches":
        return (pattern: string, text: string, replacement: string): string => {
          try {
            return text.replace(new RegExp(pattern, "g"), replacement);
          } catch (error) {
            console.warn(`Fallback replace_matches failed: ${error}`);
            return text;
          }
        };

      default:
        return () => {
          throw new Error(`No fallback implementation for ${method}`);
        };
    }
  }

  /**
   * Parse a regex pattern
   * @param pattern The regex pattern to parse
   * @returns An array of parsing details
   */
  static parseRegex(pattern: string): string[] {
    if (RegexParser._useWasm) {
      try {
        const wasmModule = getWasmModule();
        return wasmModule.parse_regex(pattern);
      } catch (error) {
        console.warn(`WASM parse_regex failed, using JS fallback: ${error}`);
      }
    }

    return this.createFallbackMethod("parse_regex")(pattern);
  }

  /**
   * Extract matches from a text using a regex pattern
   * @param pattern The regex pattern
   * @param text The text to search
   * @returns An array of matched substrings
   */
  static extractMatches(pattern: string, text: string): string[] {
    if (RegexParser._useWasm) {
      try {
        const wasmModule = getWasmModule();
        return wasmModule.extract_matches(pattern, text);
      } catch (error) {
        console.warn(
          `WASM extract_matches failed, using JS fallback: ${error}`
        );
      }
    }

    return this.createFallbackMethod("extract_matches")(pattern, text);
  }

  /**
   * Test if a text matches a regex pattern
   * @param pattern The regex pattern
   * @param text The text to test
   * @returns True if the text matches the pattern
   */
  static testPattern(pattern: string, text: string): boolean {
    if (RegexParser._useWasm) {
      try {
        const wasmModule = getWasmModule();
        return wasmModule.test_pattern(pattern, text);
      } catch (error) {
        console.warn(`WASM test_pattern failed, using JS fallback: ${error}`);
      }
    }

    return this.createFallbackMethod("test_pattern")(pattern, text);
  }

  /**
   * Replace matches in a text using a regex pattern
   * @param pattern The regex pattern
   * @param text The text to modify
   * @param replacement The replacement string
   * @returns The modified text
   */
  static replaceMatches(
    pattern: string,
    text: string,
    replacement: string
  ): string {
    if (RegexParser._useWasm) {
      try {
        const wasmModule = getWasmModule();
        return wasmModule.replace_matches(pattern, text, replacement);
      } catch (error) {
        console.warn(
          `WASM replace_matches failed, using JS fallback: ${error}`
        );
      }
    }

    return this.createFallbackMethod("replace_matches")(
      pattern,
      text,
      replacement
    );
  }
}
