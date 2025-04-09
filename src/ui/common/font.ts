import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../../initWasm/init";

export enum FontWeight {
  Thin = "Thin",
  ExtraLight = "ExtraLight",
  Light = "Light",
  Regular = "Regular",
  Medium = "Medium",
  SemiBold = "SemiBold",
  Bold = "Bold",
  ExtraBold = "ExtraBold",
  Black = "Black",
}

export enum FontStyle {
  LargeTitle = "LargeTitle",
  Title1 = "Title1",
  Title2 = "Title2",
  Title3 = "Title3",
  Headline = "Headline",
  Subheadline = "Subheadline",
  Body = "Body",
  Callout = "Callout",
  Caption1 = "Caption1",
  Caption2 = "Caption2",
  Footnote = "Footnote",
  Code = "Code",
  Button = "Button",
  Link = "Link",
}

export enum FontWidth {
  UltraCondensed = "ultraCondensed",
  ExtraCondensed = "extraCondensed",
  Condensed = "condensed",
  SemiCondensed = "semiCondensed",
  Normal = "normal",
  SemiExpanded = "semiExpanded",
  Expanded = "expanded",
  ExtraExpanded = "extraExpanded",
  UltraExpanded = "ultraExpanded",
}

export enum FontSlant {
  Normal = "normal",
  Italic = "italic",
  Oblique = "oblique",
}

export class FontDescriptor {
  private _wasmDescriptor: any;

  constructor(family: string) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();
    const familyBuilder = new wasm.FontFamilyBuilder(family);
    this._wasmDescriptor = new wasm.FontDescriptorBuilder(familyBuilder);
  }

  withWeight(weight: FontWeight | number): FontDescriptor {
    const wasm = getWasmModule();
    if (typeof weight === "number") {
      this._wasmDescriptor.with_custom_weight(weight);
    } else {
      this._wasmDescriptor.with_weight(wasm.FontWeightJs[weight]);
    }
    return this;
  }

  withSize(size: number): FontDescriptor {
    this._wasmDescriptor.with_size(size);
    return this;
  }

  withSlant(slant: FontSlant): FontDescriptor {
    this._wasmDescriptor.with_slant(slant);
    return this;
  }

  withWidth(width: FontWidth): FontDescriptor {
    this._wasmDescriptor.with_width(width);
    return this;
  }

  withLineHeight(height: number): FontDescriptor {
    this._wasmDescriptor.with_line_height(height);
    return this;
  }

  withLetterSpacing(spacing: number): FontDescriptor {
    this._wasmDescriptor.with_letter_spacing(spacing);
    return this;
  }

  toCssString(): string {
    return this._wasmDescriptor.to_css_string();
  }

  static forStyle(style: FontStyle): FontDescriptor {
    const wasm = getWasmModule();
    const cssString = wasm.get_font_css_for_style(wasm.FontStyleJs[style]);
    const size = wasm.get_font_size_for_style(wasm.FontStyleJs[style]);

    const match = cssString.match(/^(?:([^0-9]+)[\s]+)?([0-9.]+)px\s*(.+)$/);
    if (match) {
      const [, weight, sizeStr, family] = match;
      const descriptor = new FontDescriptor(family);

      if (weight) {
        descriptor.withWeight(this.weightFromCssString(weight));
      }

      if (size !== null) {
        descriptor.withSize(size);
      }

      return descriptor;
    }

    throw new Error("Could not parse font CSS string");
  }

  private static weightFromCssString(weight: string): FontWeight {
    const weightMap: { [key: string]: FontWeight } = {
      bold: FontWeight.Bold,
      italic: FontWeight.Regular,
      "italic bold": FontWeight.Bold,
    };

    return weightMap[weight.toLowerCase()] || FontWeight.Regular;
  }
}

export class FontFamily {
  private _wasmFamilyBuilder: any;

  constructor(primary: string) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();
    this._wasmFamilyBuilder = new wasm.FontFamilyBuilder(primary);
  }

  getWasmBuilder() {
    return this._wasmFamilyBuilder;
  }

  addFallback(fallback: string): FontFamily {
    this._wasmFamilyBuilder.add_fallback(fallback);
    return this;
  }

  withSystemFallback(
    fallback:
      | "default"
      | "serif"
      | "sans-serif"
      | "monospace"
      | "cursive"
      | "fantasy"
      | "system-ui"
  ): FontFamily {
    this._wasmFamilyBuilder.with_system_fallback(fallback);
    return this;
  }

  toCssString(): string {
    return this._wasmFamilyBuilder.to_css_string();
  }
}

export class FontRegistry {
  private _wasmRegistry: any;

  constructor() {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();
    this._wasmRegistry = new wasm.FontRegistryJs();
  }

  registerFont(name: string, sources: string[]): FontRegistry {
    this._wasmRegistry.register_font(name, sources);
    return this;
  }

  applyToDocument(): void {
    this._wasmRegistry.apply_to_document();
  }
}

export class FontTheme {
  private _wasmThemeBuilder: any;

  constructor(primaryFont: FontFamily, codeFont: FontFamily) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();
    this._wasmThemeBuilder = new wasm.FontThemeBuilder(
      primaryFont.getWasmBuilder(),
      codeFont.getWasmBuilder()
    );
  }

  withHeadingFont(headingFont: FontFamily): FontTheme {
    this._wasmThemeBuilder.with_heading_font(headingFont.getWasmBuilder());
    return this;
  }

  useDefaultTypography(): FontTheme {
    this._wasmThemeBuilder.use_default_typography();
    return this;
  }

  usePreset(
    preset:
      | "minimalist"
      | "classic_serif"
      | "modern_geometric"
      | "accessibility_focused"
  ): FontTheme {
    this._wasmThemeBuilder.use_preset(preset);
    return this;
  }

  build() {
    return this._wasmThemeBuilder.build();
  }
}

export const Fonts = {
  Inter: () => new FontFamily("Inter"),
  Roboto: () => new FontFamily("Roboto"),
  RobotoMono: () => new FontFamily("Roboto Mono"),
  OpenSans: () => new FontFamily("Open Sans"),

  minimalist: () => {
    const wasm = getWasmModule();
    const inter = new FontFamily("Inter");
    const jetBrainsMono = new FontFamily("JetBrains Mono");
    const theme = new FontTheme(inter, jetBrainsMono).usePreset("minimalist");
    return theme.build();
  },

  classicSerif: () => {
    const wasm = getWasmModule();
    const inter = new FontFamily("Inter");
    const jetBrainsMono = new FontFamily("JetBrains Mono");
    const theme = new FontTheme(inter, jetBrainsMono).usePreset(
      "classic_serif"
    );
    return theme.build();
  },
};
