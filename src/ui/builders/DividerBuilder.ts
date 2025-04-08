import { getWasmModule } from "../../wasm/init";
import { UIComponent, Color } from "../core";
import { ColorType } from "../types";
import { UI } from "../ui";

export enum DividerStyle {
  Solid = "Solid",
  Dashed = "Dashed",
  Dotted = "Dotted",
  Gradient = "Gradient",
  Inset = "Inset",
  Outset = "Outset",
}

export enum LabelPosition {
  Left = "Left",
  Center = "Center",
  Right = "Right",
  Overlay = "Overlay",
}

export class DividerBuilder extends UIComponent {
  protected _builder: any;

  constructor() {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.DividerBuilder();
  }

  thickness(value: number): DividerBuilder {
    this._builder = this._builder.thickness(value);
    return this;
  }

  color(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.color(colorString);
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

  label(text: string): DividerBuilder {
    this._builder = this._builder.label(text);
    return this;
  }

  labelColor(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.label_color(colorString);
    return this;
  }

  labelPosition(position: LabelPosition): DividerBuilder {
    this._builder = this._builder.label_position(position);
    return this;
  }

  labelPadding(value: number): DividerBuilder {
    this._builder = this._builder.label_padding(value);
    return this;
  }

  labelBackground(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.label_background(colorString);
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
    await UIComponent.initialize();
    return new DividerBuilder();
  }

  static async light(): Promise<UI> {
    await UIComponent.initialize();
    const wasm = getWasmModule();
    const result = wasm.light_divider();
    return UI.fromJSON(result);
  }

  static async dark(): Promise<UI> {
    await UIComponent.initialize();
    const wasm = getWasmModule();
    const result = wasm.dark_divider();
    return UI.fromJSON(result);
  }

  static async accent(): Promise<UI> {
    await UIComponent.initialize();
    const wasm = getWasmModule();
    const result = wasm.accent_divider();
    return UI.fromJSON(result);
  }

  static async gradient(): Promise<UI> {
    await UIComponent.initialize();
    const wasm = getWasmModule();
    const result = wasm.gradient_divider();
    return UI.fromJSON(result);
  }
}
