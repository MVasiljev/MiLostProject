import { BaseNodeBuilder } from "./BaseNodeBuilder";

export enum DividerStyle {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
}

export class DividerNodeBuilder extends BaseNodeBuilder {
  constructor() {
    super("Divider");
  }

  thickness(value: number): this {
    return this.setProp("thickness", value);
  }

  color(value: string): this {
    return this.setProp("color", value);
  }

  style(value: DividerStyle): this {
    return this.setProp("style", value);
  }

  padding(value: number): this {
    return this.setProp("padding", value);
  }

  opacity(value: number): this {
    return this.setProp("opacity", value);
  }

  indent(value: number): this {
    return this.setProp("indent", value);
  }

  indentBoth(value: number): this {
    return this.setProp("indentStart", value);
    return this.setProp("indentEnd", value);
  }

  caption(text: string): this {
    return this.setProp("caption", text);
  }

  captionAlignment(alignment: string): this {
    return this.setProp("captionAlignment", alignment);
  }

  captionColor(color: string): this {
    return this.setProp("captionColor", color);
  }
}
