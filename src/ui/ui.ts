import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

// Type definitions for UI components
export type FontStyleType = "Title" | "Body" | "Caption";
export type ColorType = "White" | "Blue" | "Black";

export class UI {
  private readonly _json: string;
  private readonly _wasm: boolean;

  constructor(json: string, wasm: boolean) {
    this._json = json;
    this._wasm = wasm;
  }

  // Legacy method for backward compatibility
  // Factory method to create UI instance from raw JSON
  static async fromJSON(json: string): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    return new UI(json, true);
  }

  // Legacy method for backward compatibility
  static async createText(
    content: string,
    fontStyle: FontStyleType,
    color: ColorType
  ): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    const wasm = getWasmModule();
    const result = wasm.UIParser.create_text(content, fontStyle, color);

    return new UI(result, true);
  }

  unwrap(): any {
    try {
      return JSON.parse(this._json);
    } catch (err) {
      console.error("Failed to parse WASM UI output:", err);
      return null;
    }
  }

  toJSON(): string {
    return this._json;
  }

  toString(): string {
    return JSON.stringify(this.unwrap(), null, 2);
  }
}

// Builder classes for SwiftUI-like syntax
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
    } else if (component instanceof TextBuilder) {
      // We don't need to call build() on TextBuilder, just convert it directly
      json = await this.convertBuilderToJson(component);
    } else if (
      component instanceof HStackBuilder ||
      component instanceof VStackBuilder ||
      component instanceof ButtonBuilder
    ) {
      json = await this.convertBuilderToJson(component);
    } else {
      throw new Error("Invalid component type");
    }

    this._builder = this._builder.child(json);
    return this;
  }

  // Helper method to convert a builder to JSON
  private async convertBuilderToJson(builder: any): Promise<string> {
    // Access the internal builder and build it at the WASM level
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

  // Static factory for async initialization
  static async create(): Promise<VStackBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    return new VStackBuilder();
  }
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

  async child(
    component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder
  ): Promise<HStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else if (component instanceof TextBuilder) {
      // We don't need to call build() on TextBuilder, just convert it directly
      json = await this.convertBuilderToJson(component);
    } else if (
      component instanceof HStackBuilder ||
      component instanceof VStackBuilder ||
      component instanceof ButtonBuilder
    ) {
      json = await this.convertBuilderToJson(component);
    } else {
      throw new Error("Invalid component type");
    }

    this._builder = this._builder.child(json);
    return this;
  }

  // Helper method to convert a builder to JSON
  private async convertBuilderToJson(builder: any): Promise<string> {
    // Access the internal builder and build it at the WASM level
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

  // Static factory for async initialization
  static async create(): Promise<HStackBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    return new HStackBuilder();
  }
}

export class TextBuilder {
  private _builder: any;

  constructor(content: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }

    const wasm = getWasmModule();
    this._builder = new wasm.TextBuilder(content);
  }

  fontStyle(style: FontStyleType): TextBuilder {
    this._builder = this._builder.font_style(style);
    return this;
  }

  color(color: ColorType): TextBuilder {
    this._builder = this._builder.color(color);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Text component:", error);
      throw error;
    }
  }

  // Static factory for async initialization
  static async create(content: string): Promise<TextBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    return new TextBuilder(content);
  }
}

export class ButtonBuilder {
  private _builder: any;

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

  // Static factory for async initialization
  static async create(label: string): Promise<ButtonBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    return new ButtonBuilder(label);
  }
}
