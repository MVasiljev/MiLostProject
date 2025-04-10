import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";

export enum DividerStyle {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
  Gradient = "gradient",
  Inset = "inset",
  Outset = "outset",
}

export enum LabelPosition {
  Left = "left",
  Center = "center",
  Right = "right",
  Overlay = "overlay",
}

export class DividerBuilder extends UIComponent {
  constructor() {
    super();
    this._builder = this.createWasmBuilder("Divider");
  }

  thickness(value: number): DividerBuilder {
    return this.setBuilderProp("thickness", value);
  }

  color(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("color", colorString);
  }

  style(style: DividerStyle): DividerBuilder {
    return this.setBuilderProp("style", style);
  }

  padding(value: number): DividerBuilder {
    return this.setBuilderProp("padding", value);
  }

  dashLength(value: number): DividerBuilder {
    return this.setBuilderProp("dash_length", value);
  }

  gapLength(value: number): DividerBuilder {
    return this.setBuilderProp("gap_length", value);
  }

  dotRadius(value: number): DividerBuilder {
    return this.setBuilderProp("dot_radius", value);
  }

  dotSpacing(value: number): DividerBuilder {
    return this.setBuilderProp("dot_spacing", value);
  }

  label(text: string): DividerBuilder {
    return this.setBuilderProp("label", text);
  }

  labelColor(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("label_color", colorString);
  }

  labelPosition(position: LabelPosition): DividerBuilder {
    return this.setBuilderProp("label_position", position);
  }

  labelPadding(value: number): DividerBuilder {
    return this.setBuilderProp("label_padding", value);
  }

  labelBackground(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("label_background", colorString);
  }

  addGradientColor(color: ColorType): DividerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("add_gradient_color", colorString);
  }

  gradientDirection(direction: string): DividerBuilder {
    return this.setBuilderProp("gradient_direction", direction);
  }

  opacity(value: number): DividerBuilder {
    return this.setBuilderProp("opacity", value);
  }

  static async create(): Promise<DividerBuilder> {
    await UIComponent.initialize();
    return new DividerBuilder();
  }

  static async light(): Promise<DividerBuilder> {
    await UIComponent.initialize();
    const json = callWasmStaticMethod<string>("light_divider", "", [], () => {
      throw new Error(
        "Failed to create light divider - WASM function unavailable"
      );
    });

    const builder = new DividerBuilder();
    builder._builder = json;
    return builder;
  }

  static async dark(): Promise<DividerBuilder> {
    await UIComponent.initialize();
    const json = callWasmStaticMethod<string>("dark_divider", "", [], () => {
      throw new Error(
        "Failed to create dark divider - WASM function unavailable"
      );
    });

    const builder = new DividerBuilder();
    builder._builder = json;
    return builder;
  }

  static async accent(): Promise<DividerBuilder> {
    await UIComponent.initialize();
    const json = callWasmStaticMethod<string>("accent_divider", "", [], () => {
      throw new Error(
        "Failed to create accent divider - WASM function unavailable"
      );
    });

    const builder = new DividerBuilder();
    builder._builder = json;
    return builder;
  }

  static async gradient(): Promise<DividerBuilder> {
    await UIComponent.initialize();
    const json = callWasmStaticMethod<string>(
      "gradient_divider",
      "",
      [],
      () => {
        throw new Error(
          "Failed to create gradient divider - WASM function unavailable"
        );
      }
    );

    const builder = new DividerBuilder();
    builder._builder = json;
    return builder;
  }
}
