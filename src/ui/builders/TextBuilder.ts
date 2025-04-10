import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";

export type TextAlignment = "left" | "center" | "right" | "justify";

export class TextBuilder extends UIComponent {
  constructor(content: string) {
    super();
    this._builder = this.createWasmBuilder("Text", content);
  }

  color(color: ColorType): TextBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("color", colorString);
  }

  fontSize(size: number): TextBuilder {
    return this.setBuilderProp("font_size", size);
  }

  fontWeight(weight: string): TextBuilder {
    return this.setBuilderProp("font_weight", weight);
  }

  fontFamily(family: string): TextBuilder {
    return this.setBuilderProp("font_family", family);
  }

  textAlign(align: TextAlignment): TextBuilder {
    return this.setBuilderProp("text_align", align);
  }

  fontStyle(style: string): TextBuilder {
    return this.setBuilderProp("font_style", style);
  }

  backgroundColor(color: ColorType): TextBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("background_color", colorString);
  }

  lineHeight(height: number): TextBuilder {
    return this.setBuilderProp("line_height", height);
  }

  letterSpacing(spacing: number): TextBuilder {
    return this.setBuilderProp("letter_spacing", spacing);
  }

  maxLines(lines: number): TextBuilder {
    return this.setBuilderProp("max_lines", lines);
  }

  padding(value: number): TextBuilder {
    return this.setBuilderProp("padding", value);
  }

  opacity(value: number): TextBuilder {
    return this.setBuilderProp("opacity", value);
  }

  underline(enabled: boolean = true): TextBuilder {
    return this.setBuilderProp("underline", enabled);
  }

  strikethrough(enabled: boolean = true): TextBuilder {
    return this.setBuilderProp("strikethrough", enabled);
  }

  italic(enabled: boolean = true): TextBuilder {
    return this.setBuilderProp("italic", enabled);
  }

  truncationMode(mode: string): TextBuilder {
    return this.setBuilderProp("truncation_mode", mode);
  }

  static async create(content: string): Promise<TextBuilder> {
    await UIComponent.initialize();
    return new TextBuilder(content);
  }
}
