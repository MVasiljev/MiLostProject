import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";

export enum ResizeMode {
  Fill = "fill",
  Fit = "fit",
  Cover = "cover",
  Contain = "contain",
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

export class ImageBuilder extends UIComponent {
  constructor(src: string) {
    super();
    this._builder = this.createWasmBuilder("Image", src);
  }

  fromAsset(path: string): ImageBuilder {
    return this.setBuilderProp("from_asset", path);
  }

  alt(altText: string): ImageBuilder {
    return this.setBuilderProp("alt", altText);
  }

  width(width: number): ImageBuilder {
    return this.setBuilderProp("width", width);
  }

  height(height: number): ImageBuilder {
    return this.setBuilderProp("height", height);
  }

  dimensions(width: number, height: number): ImageBuilder {
    this.width(width);
    this.height(height);
    return this;
  }

  aspectRatio(ratio: number): ImageBuilder {
    return this.setBuilderProp("aspect_ratio", ratio);
  }

  resizeMode(mode: ResizeMode): ImageBuilder {
    return this.setBuilderProp("resize_mode", mode);
  }

  contentMode(mode: ContentMode): ImageBuilder {
    return this.setBuilderProp("content_mode", mode);
  }

  cornerRadius(radius: number): ImageBuilder {
    return this.setBuilderProp("corner_radius", radius);
  }

  circular(diameter?: number): ImageBuilder {
    if (diameter) {
      this.dimensions(diameter, diameter);
      this.cornerRadius(diameter / 2);
    } else {
      this.setBuilderProp("preserve_aspect_ratio", true);
    }
    return this;
  }

  borderWidth(width: number): ImageBuilder {
    return this.setBuilderProp("border_width", width);
  }

  borderColor(color: ColorType): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("border_color", colorString);
  }

  border(width: number, color: ColorType, style?: string): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("border", [width, colorString, style]);
  }

  opacity(value: number): ImageBuilder {
    return this.setBuilderProp("opacity", value);
  }

  tintColor(color: ColorType): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("tint_color", colorString);
  }

  blur(radius: number): ImageBuilder {
    return this.setBuilderProp("blur_filter", radius);
  }

  grayscale(intensity: number = 1.0): ImageBuilder {
    return this.setBuilderProp("grayscale_filter", intensity);
  }

  loadingPlaceholder(src: string): ImageBuilder {
    return this.setBuilderProp("loading_placeholder", src);
  }

  errorPlaceholder(src: string): ImageBuilder {
    return this.setBuilderProp("error_placeholder", src);
  }

  clipToBounds(clip: boolean = true): ImageBuilder {
    return this.setBuilderProp("clip_to_bounds", clip);
  }

  preserveAspectRatio(preserve: boolean = true): ImageBuilder {
    return this.setBuilderProp("preserve_aspect_ratio", preserve);
  }

  shadow(
    radius: number,
    color: ColorType,
    offsetX: number = 0,
    offsetY: number = 0
  ): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("shadow", [
      radius,
      colorString,
      offsetX,
      offsetY,
    ]);
  }

  static async create(src: string): Promise<ImageBuilder> {
    await UIComponent.initialize();
    return new ImageBuilder(src);
  }

  static async fromAsset(path: string): Promise<ImageBuilder> {
    await UIComponent.initialize();
    const builder = new ImageBuilder("");
    return builder.fromAsset(path);
  }
}
