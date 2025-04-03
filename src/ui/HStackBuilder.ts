import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import type { ColorType } from "./types";
import { TextBuilder } from "./TextBuilder";
import { VStackBuilder } from "./VStackBuilder";
import { ButtonBuilder } from "./ButtonBuilder";
import { UI } from "./index.js";
import { EdgeInsetsOptions, LayoutPriority } from "./VStackBuilder";

export enum HStackAlignment {
  Top = "top",
  Center = "center",
  Bottom = "bottom",
  FirstTextBaseline = "firstTextBaseline",
  LastTextBaseline = "lastTextBaseline",
}

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

  alignment(alignment: HStackAlignment): HStackBuilder {
    this._builder = this._builder.alignment(alignment);
    return this;
  }

  edgeInsets(insets: EdgeInsetsOptions): HStackBuilder {
    this._builder = this._builder.edge_insets(
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );
    return this;
  }

  minWidth(value: number): HStackBuilder {
    this._builder = this._builder.min_width(value);
    return this;
  }

  idealWidth(value: number): HStackBuilder {
    this._builder = this._builder.ideal_width(value);
    return this;
  }

  maxWidth(value: number): HStackBuilder {
    this._builder = this._builder.max_width(value);
    return this;
  }

  minHeight(value: number): HStackBuilder {
    this._builder = this._builder.min_height(value);
    return this;
  }

  idealHeight(value: number): HStackBuilder {
    this._builder = this._builder.ideal_height(value);
    return this;
  }

  maxHeight(value: number): HStackBuilder {
    this._builder = this._builder.max_height(value);
    return this;
  }

  clipToBounds(value: boolean): HStackBuilder {
    this._builder = this._builder.clip_to_bounds(value);
    return this;
  }

  layoutPriority(priority: LayoutPriority | number): HStackBuilder {
    this._builder = this._builder.layout_priority(priority);
    return this;
  }

  equalSpacing(value: boolean): HStackBuilder {
    this._builder = this._builder.equal_spacing(value);
    return this;
  }

  async child(
    component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder
  ): Promise<HStackBuilder> {
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
}
