import { getWasmModule } from "../../wasm/init";
import { UIComponent, Color } from "../core";
import { ColorType } from "../types";
import { UI } from "../ui";

export type TextAlignment = "left" | "center" | "right" | "justify";

export class TextBuilder extends UIComponent {
  protected _builder: any;

  constructor(content: string) {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.TextBuilder(content);
  }

  color(color: ColorType): TextBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.color(colorString);
    return this;
  }

  fontSize(size: number): TextBuilder {
    this._builder = this._builder.font_size(size);
    return this;
  }

  fontWeight(weight: string): TextBuilder {
    this._builder = this._builder.font_weight(weight);
    return this;
  }

  fontFamily(family: string): TextBuilder {
    this._builder = this._builder.font_family(family);
    return this;
  }

  textAlign(align: TextAlignment): TextBuilder {
    this._builder = this._builder.text_align(align);
    return this;
  }

  fontStyle(style: string): TextBuilder {
    this._builder = this._builder.font_style(style);
    return this;
  }

  backgroundColor(color: ColorType): TextBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.background_color(colorString);
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

  static async create(content: string): Promise<TextBuilder> {
    await UIComponent.initialize();
    return new TextBuilder(content);
  }
}
