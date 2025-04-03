import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./index.js";
import type { ColorType } from "./types";
import { TextBuilder } from "./TextBuilder";
import { VStackBuilder } from "./VStackBuilder";
import { ButtonBuilder } from "./ButtonBuilder";

export class HStackBuilder {
  private _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.HStackBuilder();
  }

  spacing(value: number): HStackBuilder {
    this._builder = this._builder.spacing(value);
    return this;
  }

  padding(value: number): HStackBuilder {
    this._builder = this._builder.padding(value);
    return this;
  }

  background(color: ColorType): HStackBuilder {
    this._builder = this._builder.background(color);
    return this;
  }

  async child(
    component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder
  ): Promise<HStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      // If it's already a UI object, just get its JSON
      json = component.toJSON();
    } else {
      // Otherwise it's a builder, so convert it
      json = await this.convertBuilderToJson(component);
    }

    this._builder = this._builder.child(json);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building HStack component:", error);
      throw error;
    }
  }

  static async create(): Promise<HStackBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new HStackBuilder();
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
}
