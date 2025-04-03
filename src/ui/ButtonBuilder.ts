import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";
import { EventBus, EventType } from "./rendering/eventSystem.js";

export enum ButtonStyle {
  Primary = "Primary",
  Secondary = "Secondary",
  Danger = "Danger",
  Success = "Success",
  Outline = "Outline",
  Text = "Text",
  Custom = "Custom",
}

export enum ButtonSize {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  Custom = "Custom",
}

export enum TextTransform {
  None = "none",
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Capitalize = "capitalize",
}

export enum TextAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum FontWeight {
  Thin = "thin",
  ExtraLight = "extraLight",
  Light = "light",
  Regular = "regular",
  Medium = "medium",
  SemiBold = "semiBold",
  Bold = "bold",
  ExtraBold = "extraBold",
  Black = "black",
}

export enum LoadingIndicatorType {
  Spinner = "spinner",
  DotPulse = "dotPulse",
  BarPulse = "barPulse",
  Custom = "custom",
}

export enum BorderStyle {
  Solid = "Solid",
  Dashed = "Dashed",
  Dotted = "Dotted",
  None = "None",
}

export enum Overflow {
  Visible = "visible",
  Hidden = "hidden",
  Scroll = "scroll",
  Ellipsis = "ellipsis",
}

export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientOptions {
  stops: GradientStop[];
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  isRadial?: boolean;
}

export interface TextStyleOptions {
  textTransform?: TextTransform;
  textAlign?: TextAlign;
  fontWeight?: FontWeight | number;
  fontSize?: number;
  letterSpacing?: number;
  overflow?: Overflow;
}

export interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  fixedWidth?: number;
  fixedHeight?: number;
  alignment?: string;
  edgeInsets?: EdgeInsets;
}

export interface LoadingOptions {
  indicatorType?: LoadingIndicatorType;
  color?: string;
  size?: number;
  hideText?: boolean;
}

export interface AccessibilityOptions {
  label?: string;
  hint?: string;
  isElement?: boolean;
}

export interface PressEffectOptions {
  enabled?: boolean;
  scale?: number;
  colorChange?: string;
  offsetX?: number;
  offsetY?: number;
  duration?: number;
}

export class ButtonBuilder {
  private _builder: any;

  constructor(label: string) {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
    const wasm = getWasmModule();
    this._builder = new wasm.ButtonBuilder(label);
  }

  // Basic properties
  onTap(
    handlerIdOrCallback: string | Function,
    eventType: EventType = EventType.Tap
  ): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Register with the event bus
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      // Add to window object as a fallback
      (window as any)[handlerId] = handlerIdOrCallback;

      this._builder = this._builder.on_tap(handlerId);
    } else if (typeof handlerIdOrCallback === "string") {
      this._builder = this._builder.on_tap(handlerIdOrCallback);
    }

    return this;
  }

  disabled(isDisabled: boolean): ButtonBuilder {
    this._builder = this._builder.disabled(isDisabled);
    return this;
  }

  style(style: ButtonStyle): ButtonBuilder {
    this._builder = this._builder.style(style);
    return this;
  }

  // Visual properties
  backgroundColor(color: string): ButtonBuilder {
    this._builder = this._builder.background_color(color);
    return this;
  }

  textColor(color: string): ButtonBuilder {
    this._builder = this._builder.text_color(color);
    return this;
  }

  borderColor(color: string): ButtonBuilder {
    this._builder = this._builder.border_color(color);
    return this;
  }

  cornerRadius(radius: number): ButtonBuilder {
    this._builder = this._builder.corner_radius(radius);
    return this;
  }

  padding(padding: number): ButtonBuilder {
    this._builder = this._builder.padding(padding);
    return this;
  }

  icon(
    iconName: string,
    position: "leading" | "trailing" = "leading"
  ): ButtonBuilder {
    this._builder = this._builder.icon(iconName, position);
    return this;
  }

  // Button size
  size(size: ButtonSize): ButtonBuilder {
    this._builder = this._builder.size(size);
    return this;
  }

  // Shadow and elevation effects
  elevation(value: number): ButtonBuilder {
    this._builder = this._builder.elevation(value);
    return this;
  }

  opacity(value: number): ButtonBuilder {
    this._builder = this._builder.opacity(value);
    return this;
  }

  shadow(
    color: string,
    offsetX: number,
    offsetY: number,
    radius: number
  ): ButtonBuilder {
    this._builder = this._builder.shadow(color, offsetX, offsetY, radius);
    return this;
  }

  // Border customization
  border(width: number, style: BorderStyle, color: string): ButtonBuilder {
    this._builder = this._builder.border(width, style, color);
    return this;
  }

  // Text styling
  textStyle(options: TextStyleOptions): ButtonBuilder {
    try {
      this._builder = this._builder.text_style(options);
    } catch (error) {
      console.error("Error setting text style:", error);
    }
    return this;
  }

  // Layout constraints
  layoutConstraints(constraints: LayoutConstraints): ButtonBuilder {
    try {
      this._builder = this._builder.layout_constraints(constraints);
    } catch (error) {
      console.error("Error setting layout constraints:", error);
    }
    return this;
  }

  // Loading state
  loading(isLoading: boolean, options?: LoadingOptions): ButtonBuilder {
    try {
      this._builder = this._builder.loading(isLoading, options || {});
    } catch (error) {
      console.error("Error setting loading state:", error);
    }
    return this;
  }

  // Advanced event handlers
  onDoubleTap(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_dbl_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_double_tap(handlerId);
    } else {
      this._builder = this._builder.on_double_tap(handlerIdOrCallback);
    }
    return this;
  }

  onLongPress(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_lp_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_long_press(handlerId);
    } else {
      this._builder = this._builder.on_long_press(handlerIdOrCallback);
    }
    return this;
  }

  onHoverEnter(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_he_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_hover_enter(handlerId);
    } else {
      this._builder = this._builder.on_hover_enter(handlerIdOrCallback);
    }
    return this;
  }

  onHoverExit(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_hx_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_hover_exit(handlerId);
    } else {
      this._builder = this._builder.on_hover_exit(handlerIdOrCallback);
    }
    return this;
  }

  onFocus(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_f_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_focus(handlerId);
    } else {
      this._builder = this._builder.on_focus(handlerIdOrCallback);
    }
    return this;
  }

  onBlur(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_b_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_blur(handlerId);
    } else {
      this._builder = this._builder.on_blur(handlerIdOrCallback);
    }
    return this;
  }

  // Accessibility
  accessibility(options: AccessibilityOptions): ButtonBuilder {
    try {
      this._builder = this._builder.accessibility(options);
    } catch (error) {
      console.error("Error setting accessibility options:", error);
    }
    return this;
  }

  // Press effects and animations
  pressEffect(options: PressEffectOptions): ButtonBuilder {
    try {
      this._builder = this._builder.press_effect(options);
    } catch (error) {
      console.error("Error setting press effect:", error);
    }
    return this;
  }

  // Gradient background
  gradient(options: GradientOptions): ButtonBuilder {
    try {
      this._builder = this._builder.gradient(options);
    } catch (error) {
      console.error("Error setting gradient:", error);
    }
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Button component:", error);
      throw error;
    }
  }

  static async create(label: string): Promise<ButtonBuilder> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new ButtonBuilder(label);
  }
}
