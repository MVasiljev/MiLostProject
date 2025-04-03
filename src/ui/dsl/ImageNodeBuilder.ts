import { BaseNodeBuilder } from "./BaseNodeBuilder";
import { BorderStyle } from "./ButtonNodeBuilder";

export enum ResizeMode {
  Cover = "cover",
  Contain = "contain",
  Fill = "fill",
  ScaleDown = "scaleDown",
  None = "none",
}

export class ImageNodeBuilder extends BaseNodeBuilder {
  constructor(src: string) {
    super("Image");
    this.setProp("src", src);
  }

  alt(text: string): this {
    return this.setProp("alt", text);
  }

  width(value: number): this {
    return this.setProp("width", value);
  }

  height(value: number): this {
    return this.setProp("height", value);
  }

  aspectRatio(ratio: number): this {
    return this.setProp("aspectRatio", ratio);
  }

  resizeMode(mode: ResizeMode): this {
    return this.setProp("resizeMode", mode);
  }

  placeholder(enabled: boolean): this {
    return this.setProp("placeholder", enabled);
  }

  borderWidth(width: number): this {
    return this.setProp("borderWidth", width);
  }

  borderColor(color: string): this {
    return this.setProp("borderColor", color);
  }

  borderStyle(style: BorderStyle): this {
    return this.setProp("borderStyle", style);
  }

  border(width: number, style: BorderStyle, color: string): this {
    this.setProp("borderWidth", width);
    this.setProp("borderStyle", style);
    this.setProp("borderColor", color);
    return this;
  }

  tintColor(color: string): this {
    return this.setProp("tintColor", color);
  }

  blur(radius: number): this {
    return this.setProp("blurRadius", radius);
    return this;
  }

  minWidth(value: number): this {
    return this.setProp("minWidth", value);
  }

  maxWidth(value: number): this {
    return this.setProp("maxWidth", value);
  }

  minHeight(value: number): this {
    return this.setProp("minHeight", value);
  }

  maxHeight(value: number): this {
    return this.setProp("maxHeight", value);
  }

  lazyLoad(enabled: boolean): this {
    return this.setProp("lazyLoad", enabled);
  }

  fallbackSrc(src: string): this {
    return this.setProp("fallbackSrc", src);
  }
}
