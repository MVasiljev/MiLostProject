import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";

export class SpacerBuilder extends UIComponent {
  constructor() {
    super();
    this._builder = this.createWasmBuilder("Spacer");
  }

  fixed(size: number): SpacerBuilder {
    return this.setBuilderProp("fixed", size);
  }

  flexible(grow: number): SpacerBuilder {
    return this.setBuilderProp("flexible", grow);
  }

  minimum(size: number): SpacerBuilder {
    return this.setBuilderProp("minimum", size);
  }

  maximum(size: number): SpacerBuilder {
    return this.setBuilderProp("maximum", size);
  }

  background(color: ColorType): SpacerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("background", colorString);
  }

  opacity(value: number): SpacerBuilder {
    return this.setBuilderProp("opacity", value);
  }

  border(
    width: number,
    color: ColorType,
    radius?: number,
    style?: string
  ): SpacerBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("border", [width, colorString, radius, style]);
  }

  edgeInsets(
    top: number,
    right: number,
    bottom: number,
    left: number
  ): SpacerBuilder {
    return this.setBuilderProp("edge_insets", [top, right, bottom, left]);
  }

  accessibility(
    label?: string,
    hint?: string,
    isElement?: boolean
  ): SpacerBuilder {
    return this.setBuilderProp("accessibility", [label, hint, isElement]);
  }

  static async create(): Promise<SpacerBuilder> {
    await UIComponent.initialize();
    return new SpacerBuilder();
  }

  static async fixed(size: number): Promise<SpacerBuilder> {
    const builder = await SpacerBuilder.create();
    return builder.fixed(size);
  }

  static async flexible(grow: number = 1): Promise<SpacerBuilder> {
    const builder = await SpacerBuilder.create();
    return builder.flexible(grow);
  }
}
