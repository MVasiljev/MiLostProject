import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./index.js";
import { VStackBuilder } from "./VStackBuilder";
import { HStackBuilder } from "./HStackBuilder";
import { TextBuilder } from "./TextBuilder";
import { ButtonBuilder } from "./ButtonBuilder";

export class ZStackBuilder {
  _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ZStackBuilder();
  }

  async child(
    component: UI | VStackBuilder | HStackBuilder | TextBuilder | ButtonBuilder
  ): Promise<ZStackBuilder> {
    const json = await this.convertBuilderToJson(component);
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
      console.error("Error building ZStack component:", error);
      throw error;
    }
  }

  static async create(): Promise<ZStackBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new ZStackBuilder();
  }
}
