import { initWasm } from "../wasm/init.js";

export { UI } from "./ui.js";

export { UIComponent } from "./core/UIComponent.js";
export { Component } from "./core/Component.js";

export {
  Color,
  ColorType,
  ColorVariant,
  RGBColor,
  Colors,
} from "./core/color/ColorSystem.js";

export {
  FontFamily,
  FontDescriptor,
  FontRegistry,
  FontTheme,
  FontPresets,
  FontWeight,
  FontStyle,
  FontWidth,
  FontSlant,
  TextCapitalization,
  TextBaseline,
  TextStyle,
} from "./core/font/FontSystem.js";

export { VStackBuilder } from "./builders/VStackBuilder.js";

export { HStackBuilder } from "./builders/HStackBuilder.js";

export { ZStackBuilder } from "./builders/ZStackBuilder.js";

export { TextBuilder, TextAlignment } from "./builders/TextBuilder.js";

export {
  ButtonBuilder,
  ButtonStyle,
  ButtonSize,
  BorderStyle,
} from "./builders/ButtonBuilder.js";

export {
  ImageBuilder,
  ResizeMode,
  ContentMode,
} from "./builders/ImageBuilder.js";

export { SpacerBuilder } from "./builders/SpacerBuilder.js";

export {
  DividerBuilder,
  DividerStyle,
  LabelPosition,
} from "./builders/DividerBuilder.js";

export { ScrollBuilder, ScrollDirection } from "./builders/ScrollBuilder.js";

export { EdgeInsets, EdgeInsetsFactory } from "./core/layout/EdgeInsets.js";

export {
  StackAlignment,
  HStackAlignment,
  ZStackAlignment,
} from "./core/layout/Alignment.js";

export { LayoutPriority } from "./core/layout/LayoutPriority.js";

export {
  SizeConstraints,
  LayoutOptions,
  Size,
  Position,
  Rect,
} from "./core/layout";

export { renderComponent } from "./rendering/renderComponent.js";

export { MiLost } from "./rendering/MiLostRenderer.js";

export async function initialize(): Promise<void> {
  await initWasm();
}
