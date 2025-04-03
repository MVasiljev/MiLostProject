import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./index.js";
import { VStackBuilder } from "./VStackBuilder";
import { HStackBuilder } from "./HStackBuilder";
import { TextBuilder } from "./TextBuilder";
import { ButtonBuilder } from "./ButtonBuilder";
import { EdgeInsetsOptions, LayoutPriority } from "./VStackBuilder";
import { ColorType } from "./types";

export enum ZStackAlignment {
  Center = "center",
  TopLeading = "topLeading",
  Top = "top",
  TopTrailing = "topTrailing",
  Leading = "leading",
  Trailing = "trailing",
  BottomLeading = "bottomLeading",
  Bottom = "bottom",
  BottomTrailing = "bottomTrailing",
}

export class ZStackBuilder {
  private _builder: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ZStackBuilder();
  }

  alignment(alignment: ZStackAlignment): ZStackBuilder {
    this._builder = this._builder.alignment(alignment);
    return this;
  }

  edgeInsets(insets: EdgeInsetsOptions): ZStackBuilder {
    this._builder = this._builder.edge_insets(
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );
    return this;
  }

  background(color: ColorType): ZStackBuilder {
    this._builder = this._builder.background(color);
    return this;
  }

  minWidth(value: number): ZStackBuilder {
    this._builder = this._builder.min_width(value);
    return this;
  }

  idealWidth(value: number): ZStackBuilder {
    this._builder = this._builder.ideal_width(value);
    return this;
  }

  maxWidth(value: number): ZStackBuilder {
    this._builder = this._builder.max_width(value);
    return this;
  }

  minHeight(value: number): ZStackBuilder {
    this._builder = this._builder.min_height(value);
    return this;
  }

  idealHeight(value: number): ZStackBuilder {
    this._builder = this._builder.ideal_height(value);
    return this;
  }

  maxHeight(value: number): ZStackBuilder {
    this._builder = this._builder.max_height(value);
    return this;
  }

  clipToBounds(value: boolean): ZStackBuilder {
    this._builder = this._builder.clip_to_bounds(value);
    return this;
  }

  layoutPriority(priority: LayoutPriority | number): ZStackBuilder {
    this._builder = this._builder.layout_priority(priority);
    return this;
  }

  async child(
    component: UI | VStackBuilder | HStackBuilder | TextBuilder | ButtonBuilder
  ): Promise<ZStackBuilder> {
    const json = await this.convertBuilderToJson(component);
    this._builder = this._builder.child(json);
    return this;
  }

  private async convertBuilderToJson(builder: any): Promise<string> {
    if (builder instanceof UI) {
      return builder.toJSON();
    }

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
