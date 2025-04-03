import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import type { ColorType } from "./types";
import { TextBuilder } from "./TextBuilder";
import { HStackBuilder } from "./HStackBuilder";
import { ButtonBuilder } from "./ButtonBuilder";
import { UI } from "./index.js";

export enum StackAlignment {
  Leading = "leading",
  Trailing = "trailing",
  Center = "center",
}

export enum LayoutPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export interface EdgeInsetsOptions {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

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

  alignment(alignment: StackAlignment): VStackBuilder {
    this._builder = this._builder.alignment(alignment);
    return this;
  }

  edgeInsets(insets: EdgeInsetsOptions): VStackBuilder {
    this._builder = this._builder.edge_insets(
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );
    return this;
  }

  minWidth(value: number): VStackBuilder {
    this._builder = this._builder.min_width(value);
    return this;
  }

  idealWidth(value: number): VStackBuilder {
    this._builder = this._builder.ideal_width(value);
    return this;
  }

  maxWidth(value: number): VStackBuilder {
    this._builder = this._builder.max_width(value);
    return this;
  }

  minHeight(value: number): VStackBuilder {
    this._builder = this._builder.min_height(value);
    return this;
  }

  idealHeight(value: number): VStackBuilder {
    this._builder = this._builder.ideal_height(value);
    return this;
  }

  maxHeight(value: number): VStackBuilder {
    this._builder = this._builder.max_height(value);
    return this;
  }

  clipToBounds(value: boolean): VStackBuilder {
    this._builder = this._builder.clip_to_bounds(value);
    return this;
  }

  layoutPriority(priority: LayoutPriority | number): VStackBuilder {
    this._builder = this._builder.layout_priority(priority);
    return this;
  }

  equalSpacing(value: boolean): VStackBuilder {
    this._builder = this._builder.equal_spacing(value);
    return this;
  }

  async child(
    component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder
  ): Promise<VStackBuilder> {
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
