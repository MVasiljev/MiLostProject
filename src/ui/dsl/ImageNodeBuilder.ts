import { BaseNodeBuilder } from "./BaseNodeBuilder";
import { BorderStyle } from "./ButtonNodeBuilder";

export enum ResizeMode {
  Cover = "cover",
  Contain = "contain",
  Fill = "fill",
  ScaleDown = "scaleDown",
  None = "none",
}

export enum ContentMode {
  ScaleToFill = "scaleToFill",
  ScaleAspectFit = "scaleAspectFit",
  ScaleAspectFill = "scaleAspectFill",
  Center = "center",
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
  TopLeft = "topLeft",
  TopRight = "topRight",
  BottomLeft = "bottomLeft",
  BottomRight = "bottomRight",
}

export class ImageNodeBuilder extends BaseNodeBuilder {
  constructor(src: string) {
    super("Image");
    this.setProp("src", src);
    this.setProp("sourceType", "remote");
  }

  fromAsset(path: string): this {
    this.setProp("sourceType", "asset");
    this.setProp("sourcePath", path);
    return this;
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

  dimensions(width: number, height: number): this {
    this.setProp("width", width);
    return this.setProp("height", height);
  }

  aspectRatio(ratio: number): this {
    return this.setProp("aspectRatio", ratio);
  }

  resizeMode(mode: ResizeMode): this {
    return this.setProp("resizeMode", mode);
  }

  contentMode(mode: ContentMode): this {
    return this.setProp("contentMode", mode);
  }

  circular(diameter?: number): this {
    if (diameter) {
      this.setProp("width", diameter);
      this.setProp("height", diameter);
      this.setProp("cornerRadius", diameter / 2);
    } else {
      this.setProp("circular", true);
      this.setProp("preserveAspectRatio", true);
    }
    return this;
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

  shadow(
    radius: number,
    color: string,
    offsetX: number = 0,
    offsetY: number = 0
  ): this {
    this.setProp("shadowRadius", radius);
    this.setProp("shadowColor", color);
    this.setProp("shadowOffsetX", offsetX);
    this.setProp("shadowOffsetY", offsetY);
    return this;
  }

  tintColor(color: string): this {
    return this.setProp("tintColor", color);
  }

  blur(radius: number): this {
    return this.setProp("blurRadius", radius);
  }

  grayscale(intensity: number = 1.0): this {
    return this.setProp("filter_grayscale", intensity);
  }

  opacity(value: number): this {
    return this.setProp("opacity", value);
  }

  loadingPlaceholder(src: string): this {
    return this.setProp("loadingPlaceholder", src);
  }

  errorPlaceholder(src: string): this {
    return this.setProp("errorPlaceholder", src);
  }

  clipToBounds(clip: boolean = true): this {
    return this.setProp("clipToBounds", clip);
  }

  preserveAspectRatio(preserve: boolean = true): this {
    return this.setProp("preserveAspectRatio", preserve);
  }
}
