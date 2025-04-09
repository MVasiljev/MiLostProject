// src/ui/core/font/FontSystem.ts
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../../../initWasm/init.js";

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
  Title = "Title",
  Caption = "Caption",
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

export enum TextCapitalization {
  None = "none",
  Words = "words",
  Sentences = "sentences",
  Characters = "characters",
}

export enum TextBaseline {
  Alphabetic = "alphabetic",
  Ideographic = "ideographic",
  Top = "top",
  Bottom = "bottom",
  Middle = "middle",
  Hanging = "hanging",
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

export class FontDescriptor {
  private _wasmDescriptor: any;

  constructor(family: string | FontFamily) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();

    if (typeof family === "string") {
      const familyBuilder = new wasm.FontFamilyBuilder(family);
      this._wasmDescriptor = new wasm.FontDescriptorBuilder(family);
    } else {
      this._wasmDescriptor = new wasm.FontDescriptorBuilder(
        family.getWasmBuilder()
      );
    }
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

  getWasmDescriptor(): any {
    return this._wasmDescriptor;
  }

  static forStyle(style: FontStyle): FontDescriptor {
    const wasm = getWasmModule();

    try {
      const cssString = wasm.get_font_css_for_style(wasm.FontStyleJs[style]);
      const size = wasm.get_font_size_for_style(wasm.FontStyleJs[style]);

      const match = cssString.match(/^(?:([^0-9]+)[\s]+)?([0-9.]+)px\s*(.+)$/);
      if (match) {
        const [, weight, , family] = match;
        const descriptor = new FontDescriptor(family);

        if (weight) {
          descriptor.withWeight(this.weightFromCssString(weight));
        }

        if (size !== null) {
          descriptor.withSize(size);
        }

        return descriptor;
      }
    } catch (e) {
      console.error("Error creating font descriptor for style:", e);
    }

    // Default fallback
    return new FontDescriptor("system-ui");
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

export class TextStyle {
  private _wasmTextStyle: any;

  constructor(fontDescriptor: FontDescriptor) {
    if (!isWasmInitialized()) {
      throw new Error("WASM module not initialized. Call initWasm() first.");
    }

    const wasm = getWasmModule();
    this._wasmTextStyle = new wasm.TextStyleBuilder(
      fontDescriptor.getWasmDescriptor()
    );
  }

  withLineSpacing(spacing: number): TextStyle {
    this._wasmTextStyle.with_line_spacing(spacing);
    return this;
  }

  withParagraphSpacing(spacing: number): TextStyle {
    this._wasmTextStyle.with_paragraph_spacing(spacing);
    return this;
  }

  withTextCase(textCase: TextCapitalization): TextStyle {
    this._wasmTextStyle.with_text_case(textCase);
    return this;
  }

  withBaseline(baseline: TextBaseline): TextStyle {
    this._wasmTextStyle.with_baseline(baseline);
    return this;
  }

  getWasmTextStyle(): any {
    return this._wasmTextStyle;
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

  async build(): Promise<any> {
    return this._wasmThemeBuilder.build();
  }
}

export const FontPresets = {
  System: () => new FontFamily("system-ui"),
  Inter: () => new FontFamily("Inter"),
  Roboto: () => new FontFamily("Roboto"),
  RobotoMono: () => new FontFamily("Roboto Mono"),
  SFPro: () => new FontFamily("SF Pro Text"),
  OpenSans: () => new FontFamily("Open Sans"),
  JetBrainsMono: () => new FontFamily("JetBrains Mono"),
  Poppins: () => new FontFamily("Poppins"),
  Lato: () => new FontFamily("Lato"),
};
