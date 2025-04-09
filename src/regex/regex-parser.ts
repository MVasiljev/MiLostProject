import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

export class RegexParser {
  private constructor() {}

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        throw new Error(`Failed to initialize WASM module: ${error}`);
      }
    }
  }

  static parseRegex(pattern: string): string[] {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized");
    }

    const wasmModule = getWasmModule();
    try {
      const result = wasmModule.parse_regex(pattern);
      return result;
    } catch (error) {
      throw new Error(`Failed to parse regex: ${error}`);
    }
  }

  static extractMatches(pattern: string, text: string): string[] {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized");
    }

    const wasmModule = getWasmModule();
    try {
      const result = wasmModule.extract_matches(pattern, text);
      return result;
    } catch (error) {
      throw new Error(`Failed to extract matches: ${error}`);
    }
  }

  static testPattern(pattern: string, text: string): boolean {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized");
    }

    const wasmModule = getWasmModule();
    try {
      return wasmModule.test_pattern(pattern, text);
    } catch (error) {
      throw new Error(`Failed to test pattern: ${error}`);
    }
  }

  static replaceMatches(
    pattern: string,
    text: string,
    replacement: string
  ): string {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized");
    }

    const wasmModule = getWasmModule();
    try {
      return wasmModule.replace_matches(pattern, text, replacement);
    } catch (error) {
      throw new Error(`Failed to replace matches: ${error}`);
    }
  }
}
