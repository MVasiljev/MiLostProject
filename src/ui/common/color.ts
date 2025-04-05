import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init";

export enum ColorVariant {
  White = "White",
  Black = "Black",

  Red = "Red",
  Green = "Green",
  Blue = "Blue",
  Yellow = "Yellow",

  Orange = "Orange",
  Purple = "Purple",
  Pink = "Pink",
  Teal = "Teal",
  Indigo = "Indigo",
  Cyan = "Cyan",

  Gray = "Gray",
  LightGray = "LightGray",
  DarkGray = "DarkGray",

  Primary = "Primary",
  Secondary = "Secondary",
  Accent = "Accent",
  Background = "Background",
  Surface = "Surface",
  Error = "Error",
  OnPrimary = "OnPrimary",
  OnSecondary = "OnSecondary",
  OnBackground = "OnBackground",
  OnSurface = "OnSurface",
  OnError = "OnError",

  Success = "Success",
  Warning = "Warning",
  Info = "Info",
  Danger = "Danger",

  Twitter = "Twitter",
  Facebook = "Facebook",
  LinkedIn = "LinkedIn",
  Instagram = "Instagram",

  Link = "Link",
  Disabled = "Disabled",
  Placeholder = "Placeholder",

  Transparent = "Transparent",
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export class Color {
  private _wasmColor: any;

  constructor(color: ColorVariant | RGBColor | string) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();

    if (typeof color === "string") {
      if (color.startsWith("#")) {
        this._wasmColor = new wasm.ColorBuilder(wasm.ColorJs.Hex).with_hex(
          color
        );
      } else {
        this._wasmColor = new wasm.ColorBuilder(wasm.ColorJs[color]);
      }
    } else if ("r" in color) {
      if (color.a !== undefined) {
        this._wasmColor = new wasm.ColorBuilder(
          wasm.ColorJs.CustomWithAlpha
        ).with_rgba(color.r, color.g, color.b, color.a);
      } else {
        this._wasmColor = new wasm.ColorBuilder(wasm.ColorJs.Custom).with_rgb(
          color.r,
          color.g,
          color.b
        );
      }
    }
  }

  toCssString(): string {
    return this._wasmColor.to_css_string();
  }

  isDark(): boolean {
    return this._wasmColor.is_dark();
  }

  contrastingTextColor(): Color {
    const wasmColor = this._wasmColor.contrasting_text_color();
    const colorName = Object.keys(ColorVariant).find(
      (key) => ColorVariant[key as keyof typeof ColorVariant] === wasmColor
    );

    if (colorName) {
      return new Color(ColorVariant[colorName as keyof typeof ColorVariant]);
    }

    return new Color(ColorVariant.Black);
  }

  lighten(amount: number): Color {
    this._wasmColor.lighten(amount);
    return this;
  }

  darken(amount: number): Color {
    this._wasmColor.darken(amount);
    return this;
  }

  withOpacity(opacity: number): Color {
    this._wasmColor.with_opacity(opacity);
    return this;
  }

  static fromHex(hex: string): Color {
    return new Color(hex);
  }

  static fromRGB(r: number, g: number, b: number): Color {
    return new Color({ r, g, b });
  }

  static fromRGBA(r: number, g: number, b: number, a: number): Color {
    return new Color({ r, g, b, a });
  }

  static lightColorScheme() {
    const wasm = getWasmModule();
    return wasm.light_color_scheme();
  }

  static darkColorScheme() {
    const wasm = getWasmModule();
    return wasm.dark_color_scheme();
  }

  static blueColorScheme() {
    const wasm = getWasmModule();
    return wasm.blue_light_color_scheme();
  }

  static redColorScheme() {
    const wasm = getWasmModule();
    return wasm.red_light_color_scheme();
  }

  static greenColorScheme() {
    const wasm = getWasmModule();
    return wasm.green_light_color_scheme();
  }
}

export const Colors = {
  ...ColorVariant,
};
