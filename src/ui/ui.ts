import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import type { FontStyleType, ColorType } from "./types.js";

export class UI {
  private readonly _json: string;
  private readonly _wasm: boolean;

  constructor(json: string, wasm: boolean) {
    this._json = json;
    this._wasm = wasm;
  }

  static async fromJSON(json: string): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new UI(json, true);
  }

  static async createText(
    content: string,
    fontStyle: FontStyleType,
    color: ColorType
  ): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    const wasm = getWasmModule();
    const result = wasm.UIParser.create_text(content, fontStyle, color);
    return new UI(result, true);
  }

  unwrap(): any {
    try {
      return JSON.parse(this._json);
    } catch (err) {
      console.error("Failed to parse WASM UI output:", err);
      return null;
    }
  }

  toJSON(): string {
    return this._json;
  }

  toString(): string {
    return JSON.stringify(this.unwrap(), null, 2);
  }
}
