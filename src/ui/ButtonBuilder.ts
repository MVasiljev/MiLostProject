import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";

export class ButtonBuilder {
  _builder: any;

  constructor(label: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ButtonBuilder(label);
  }

  onTap(handler: string): ButtonBuilder {
    this._builder = this._builder.on_tap(handler);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Button component:", error);
      throw error;
    }
  }

  static async create(label: string): Promise<ButtonBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new ButtonBuilder(label);
  }
}
