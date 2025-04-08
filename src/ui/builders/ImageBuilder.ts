import { getWasmModule } from "../../wasm/init";
import { UIComponent, Color } from "../core";
import { ColorType } from "../types";
import { UI } from "../ui";

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
  protected _builder: any;

  constructor(src: string) {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.ImageBuilder(src);
  }

  fromAsset(path: string): ImageBuilder {
    this._builder = this._builder.from_asset(path);
    return this;
  }

  alt(altText: string): ImageBuilder {
    this._builder = this._builder.alt(altText);
    return this;
  }

  width(width: number): ImageBuilder {
    this._builder = this._builder.dimensions(width, null);
    return this;
  }

  height(height: number): ImageBuilder {
    this._builder = this._builder.dimensions(null, height);
    return this;
  }

  dimensions(width: number, height: number): ImageBuilder {
    this._builder = this._builder.dimensions(width, height);
    return this;
  }

  aspectRatio(ratio: number): ImageBuilder {
    this._builder = this._builder.aspect_ratio(ratio);
    return this;
  }

  resizeMode(mode: ResizeMode): ImageBuilder {
    this._builder = this._builder.resize_mode(mode);
    return this;
  }

  contentMode(mode: ContentMode): ImageBuilder {
    this._builder = this._builder.content_mode(mode);
    return this;
  }

  cornerRadius(radius: number): ImageBuilder {
    this._builder = this._builder.corner_radius(radius);
    return this;
  }

  circular(diameter?: number): ImageBuilder {
    if (diameter) {
      this._builder = this._builder
        .dimensions(diameter, diameter)
        .corner_radius(diameter / 2);
    } else {
      this._builder = this._builder.preserve_aspect_ratio(true);
    }
    return this;
  }

  border(width: number, color: ColorType): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.border(width, colorString, null);
    return this;
  }

  opacity(value: number): ImageBuilder {
    this._builder = this._builder.opacity(value);
    return this;
  }

  tintColor(color: ColorType): ImageBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.tint_color(colorString);
    return this;
  }

  blur(radius: number): ImageBuilder {
    this._builder = this._builder.blur_filter(radius);
    return this;
  }

  grayscale(intensity: number = 1.0): ImageBuilder {
    this._builder = this._builder.grayscale_filter(intensity);
    return this;
  }

  loadingPlaceholder(src: string): ImageBuilder {
    this._builder = this._builder.loading_placeholder(src);
    return this;
  }

  errorPlaceholder(src: string): ImageBuilder {
    this._builder = this._builder.error_placeholder(src);
    return this;
  }

  clipToBounds(clip: boolean = true): ImageBuilder {
    this._builder = this._builder.clip_to_bounds(clip);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Image component:", error);
      throw error;
    }
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
