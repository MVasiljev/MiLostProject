import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import type { ColorType } from "./types";
import { TextBuilder } from "./TextBuilder";
import { HStackBuilder } from "./HStackBuilder";
import { ButtonBuilder } from "./ButtonBuilder";
import { UI } from "./index.js";

export class VStackBuilder {
  private _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.VStackBuilder();
  }

  spacing(value: number): VStackBuilder {
    this._builder = this._builder.spacing(value);
    return this;
  }

  padding(value: number): VStackBuilder {
    this._builder = this._builder.padding(value);
    return this;
  }

  background(color: ColorType): VStackBuilder {
    this._builder = this._builder.background(color);
    return this;
  }

  async child(
    component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder
  ): Promise<VStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await this.convertBuilderToJson(component);
    }

    this._builder = this._builder.child(json);
    return this;
  }

  private async convertBuilderToJson(builder: any): Promise<string> {
    const wasmBuilder = builder._builder;
    if (!wasmBuilder || !wasmBuilder.build) {
      throw new Error("Invalid builder object");
    }

    try {
      const result = wasmBuilder.build();
      return result;
    } catch (error) {
      console.error("Error converting builder to JSON:", error);
      throw error;
    }
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building VStack component:", error);
      throw error;
    }
  }

  static async create(): Promise<VStackBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new VStackBuilder();
  }
}
