import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";
import { TextBuilder } from "./TextBuilder";
import { VStackBuilder } from "./VStackBuilder";
import { HStackBuilder } from "./HStackBuilder";
import { ButtonBuilder } from "./ButtonBuilder";

export enum ScrollDirection {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export class ScrollBuilder {
  private _builder: any;

  constructor(direction: ScrollDirection = ScrollDirection.Vertical) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ScrollBuilder(direction);
  }

  async child(
    component: UI | TextBuilder | VStackBuilder | HStackBuilder | ButtonBuilder
  ): Promise<ScrollBuilder> {
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
    if (builder instanceof UI) {
      return builder.toJSON();
    }

    const wasmBuilder = builder._builder;

    if (!wasmBuilder) {
      throw new Error("Invalid builder object: missing _builder property");
    }

    try {
      if (typeof wasmBuilder.build === "function") {
        return await wasmBuilder.build();
      }

      throw new Error("Builder does not have a build method");
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
      console.error("Error building Scroll component:", error);
      throw error;
    }
  }

  static async create(
    direction: ScrollDirection = ScrollDirection.Vertical
  ): Promise<ScrollBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new ScrollBuilder(direction);
  }
}
