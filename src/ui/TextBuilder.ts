import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";
import type { FontStyleType, ColorType } from "./types";

export class TextBuilder {
  _builder: any;

  constructor(content: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.TextBuilder(content);
  }

  fontStyle(style: FontStyleType): TextBuilder {
    this._builder = this._builder.font_style(style);
    return this;
  }

  color(color: ColorType | string): TextBuilder {
    if (color === "White" || color === "Blue" || color === "Black") {
      this._builder = this._builder.color(color);
    } else {
      console.log(`Using custom color: ${color}`);
      this._builder = this._builder.color(color);
    }
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Text component:", error);
      throw error;
    }
  }

  static async create(content: string): Promise<TextBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new TextBuilder(content);
  }
}
