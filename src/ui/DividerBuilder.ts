import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";
import { ColorType } from "./types.js";

export enum DividerStyle {
  Solid = "Solid",
  Dashed = "Dashed",
  Dotted = "Dotted",
}

export class DividerBuilder {
  private _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.DividerBuilder();
  }

  thickness(value: number): DividerBuilder {
    this._builder = this._builder.thickness(value);
    return this;
  }

  color(color: ColorType): DividerBuilder {
    this._builder = this._builder.color(color);
    return this;
  }

  style(style: DividerStyle): DividerBuilder {
    this._builder = this._builder.style(style);
    return this;
  }

  padding(value: number): DividerBuilder {
    this._builder = this._builder.padding(value);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Divider component:", error);
      throw error;
    }
  }

  static async create(): Promise<DividerBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new DividerBuilder();
  }
}
