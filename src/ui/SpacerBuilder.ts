import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";

export class SpacerBuilder {
  private _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.SpacerBuilder();
  }

  size(value: number): SpacerBuilder {
    this._builder = this._builder.size(value);
    return this;
  }

  minSize(value: number): SpacerBuilder {
    this._builder = this._builder.min_size(value);
    return this;
  }

  maxSize(value: number): SpacerBuilder {
    this._builder = this._builder.max_size(value);
    return this;
  }

  flexGrow(value: number): SpacerBuilder {
    this._builder = this._builder.flex_grow(value);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Spacer component:", error);
      throw error;
    }
  }

  static async create(): Promise<SpacerBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new SpacerBuilder();
  }
}
