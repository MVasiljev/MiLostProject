import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";

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

export enum FilterType {
  Blur = "blur",
  Grayscale = "grayscale",
  Sepia = "sepia",
  Saturation = "saturation",
  Brightness = "brightness",
  Contrast = "contrast",
  Hue = "hue",
  Invert = "invert",
}

export enum CachePolicy {
  Default = "default",
  Reload = "reload",
  ReturnCacheDataElseLoad = "returnCacheDataElseLoad",
  ReturnCacheDataDontLoad = "returnCacheDataDontLoad",
}

export class ImageBuilder {
  private _builder: any;
  private _source: string;
  private _isAsset: boolean = false;

  constructor(src: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    this._source = src;
    const wasm = getWasmModule();
    this._builder = new wasm.ImageBuilder(src);
  }

  fromAsset(path: string): ImageBuilder {
    this._isAsset = true;
    this._builder = this._builder.from_asset(path);
    return this;
  }

  alt(altText: string): ImageBuilder {
    this._builder = this._builder.alt(altText);
    return this;
  }

  width(width: number): ImageBuilder {
    this._builder = this._builder.width(width);
    return this;
  }

  height(height: number): ImageBuilder {
    this._builder = this._builder.height(height);
    return this;
  }

  dimensions(width: number, height: number): ImageBuilder {
    this._builder = this._builder.width(width).height(height);
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
        .width(diameter)
        .height(diameter)
        .corner_radius(diameter / 2);
    } else {
      this._builder = this._builder.preserve_aspect_ratio(true);
    }
    return this;
  }

  border(width: number, color: string): ImageBuilder {
    this._builder = this._builder.border_width(width).border_color(color);
    return this;
  }

  shadow(
    radius: number,
    color: string,
    offsetX: number = 0,
    offsetY: number = 0
  ): ImageBuilder {
    this._builder = this._builder.shadow(radius, color, offsetX, offsetY);
    return this;
  }

  tintColor(color: string): ImageBuilder {
    this._builder = this._builder.tint_color(color);
    return this;
  }

  blur(radius: number): ImageBuilder {
    this._builder = this._builder.add_blur_filter(radius);
    return this;
  }

  grayscale(intensity: number = 1.0): ImageBuilder {
    this._builder = this._builder.add_grayscale_filter(intensity);
    return this;
  }

  sepia(intensity: number = 1.0): ImageBuilder {
    this._builder = this._builder.add_sepia_filter(intensity);
    return this;
  }

  saturation(value: number): ImageBuilder {
    this._builder = this._builder.add_saturation_filter(value);
    return this;
  }

  brightness(value: number): ImageBuilder {
    this._builder = this._builder.add_brightness_filter(value);
    return this;
  }

  contrast(value: number): ImageBuilder {
    this._builder = this._builder.add_contrast_filter(value);
    return this;
  }

  hueRotate(value: number): ImageBuilder {
    this._builder = this._builder.add_hue_filter(value);
    return this;
  }

  invert(enabled: boolean = true): ImageBuilder {
    this._builder = this._builder.add_invert_filter(enabled);
    return this;
  }

  opacity(value: number): ImageBuilder {
    this._builder = this._builder.opacity(value);
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

  preserveAspectRatio(preserve: boolean = true): ImageBuilder {
    this._builder = this._builder.preserve_aspect_ratio(preserve);
    return this;
  }

  animation(duration: number, isAnimating: boolean = true): ImageBuilder {
    this._builder = this._builder.animation(duration, isAnimating);
    return this;
  }

  cachePolicy(policy: CachePolicy): ImageBuilder {
    this._builder = this._builder.cache_policy(policy);
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
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new ImageBuilder(src);
  }

  static async fromAsset(path: string): Promise<ImageBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    const builder = new ImageBuilder("");
    return builder.fromAsset(path);
  }
}
