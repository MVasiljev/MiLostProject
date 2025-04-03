import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";

export enum ResizeMode {
  Fill = "fill",
  Fit = "fit",
  Cover = "cover",
  Contain = "contain",
}

export class ImageBuilder {
  private _builder: any;

  constructor(src: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ImageBuilder(src);
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

  aspectRatio(ratio: number): ImageBuilder {
    this._builder = this._builder.aspect_ratio(ratio);
    return this;
  }

  resizeMode(mode: ResizeMode): ImageBuilder {
    this._builder = this._builder.resize_mode(mode);
    return this;
  }

  cornerRadius(radius: number): ImageBuilder {
    this._builder = this._builder.corner_radius(radius);
    return this;
  }

  borderWidth(width: number): ImageBuilder {
    this._builder = this._builder.border_width(width);
    return this;
  }

  borderColor(color: string): ImageBuilder {
    this._builder = this._builder.border_color(color);
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
}
