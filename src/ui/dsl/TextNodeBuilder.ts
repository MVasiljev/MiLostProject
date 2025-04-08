import { BaseNodeBuilder } from "./BaseNodeBuilder";
import {
  FontWeight,
  TextAlign,
  TextTransform,
  Overflow,
} from "./ButtonNodeBuilder";

export class TextNodeBuilder extends BaseNodeBuilder {
  constructor(text: string) {
    super("Text");
    this.setProp("text", text);
  }

  fontStyle(style: string): this {
    return this.setProp("fontStyle", style);
  }

  fontSize(size: number): this {
    return this.setProp("fontSize", size);
  }

  fontWeight(weight: FontWeight | string): this {
    return this.setProp("fontWeight", weight);
  }

  textColor(color: string): this {
    return this.setProp("textColor", color);
  }

  color(color: string): this {
    return this.setProp("color", color);
  }

  textAlign(align: TextAlign): this {
    return this.setProp("textAlign", align);
  }

  textTransform(transform: TextTransform): this {
    return this.setProp("textTransform", transform);
  }

  letterSpacing(spacing: number): this {
    return this.setProp("letterSpacing", spacing);
  }

  lineHeight(height: number): this {
    return this.setProp("lineHeight", height);
  }

  overflow(overflow: Overflow): this {
    return this.setProp("overflow", overflow);
  }

  truncationMode(mode: string): this {
    return this.setProp("truncationMode", mode);
  }

  maxLines(lines: number): this {
    return this.setProp("maxLines", lines);
  }

  underline(enabled: boolean = true): this {
    return this.setProp("underline", enabled);
  }

  strikethrough(enabled: boolean = true): this {
    return this.setProp("strikethrough", enabled);
  }

  italic(enabled: boolean = true): this {
    return this.setProp("italic", enabled);
  }
}
