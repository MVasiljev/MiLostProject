import { BaseNodeBuilder, EdgeInsets } from "./BaseNodeBuilder";

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

export interface GradientStop {
  color: string;
  position: number;
}

export class ButtonNodeBuilder extends BaseNodeBuilder {
  constructor(label: string) {
    super("Button");
    this.setProp("label", label);
  }

  style(value: ButtonStyle): this {
    return this.setProp("style", value);
  }

  size(value: ButtonSize): this {
    return this.setProp("size", value);
  }

  textColor(color: string): this {
    return this.setProp("textColor", color);
  }

  backgroundColor(color: string): this {
    return this.setProp("backgroundColor", color);
  }

  elevation(value: number): this {
    return this.setProp("elevation", value);
  }

  shadow(
    color: string,
    offsetX: number,
    offsetY: number,
    radius: number
  ): this {
    this.setProp("shadowColor", color);
    this.setProp("shadowOffsetX", offsetX);
    this.setProp("shadowOffsetY", offsetY);
    this.setProp("shadowRadius", radius);
    return this;
  }

  fontSize(value: number): this {
    return this.setProp("fontSize", value);
  }

  fontWeight(value: FontWeight | string): this {
    return this.setProp("fontWeight", value);
  }

  textTransform(value: TextTransform): this {
    return this.setProp("textTransform", value);
  }

  textAlign(value: TextAlign): this {
    return this.setProp("textAlign", value);
  }

  letterSpacing(value: number): this {
    return this.setProp("letterSpacing", value);
  }

  overflow(value: Overflow): this {
    return this.setProp("overflow", value);
  }

  border(width: number, style: BorderStyle, color: string): this {
    this.setProp("borderWidth", width);
    this.setProp("borderStyle", style);
    this.setProp("borderColor", color);
    return this;
  }

  borderWidth(width: number): this {
    return this.setProp("borderWidth", width);
  }

  borderStyle(style: BorderStyle): this {
    return this.setProp("borderStyle", style);
  }

  borderColor(color: string): this {
    return this.setProp("borderColor", color);
  }

  minWidth(value: number): this {
    return this.setProp("minWidth", value);
  }

  maxWidth(value: number): this {
    return this.setProp("maxWidth", value);
  }

  fixedWidth(value: number): this {
    return this.setProp("fixedWidth", value);
  }

  fixedHeight(value: number): this {
    return this.setProp("fixedHeight", value);
  }

  icon(iconName: string, position: string = "leading"): this {
    this.setProp("icon", iconName);
    this.setProp("iconPosition", position);
    return this;
  }

  loading(isLoading: boolean): this {
    return this.setProp("isLoading", isLoading);
  }

  loadingIndicatorType(type: string): this {
    return this.setProp("loadingIndicatorType", type);
  }

  loadingIndicatorColor(color: string): this {
    return this.setProp("loadingIndicatorColor", color);
  }

  loadingIndicatorSize(size: number): this {
    return this.setProp("loadingIndicatorSize", size);
  }

  hideTextWhileLoading(hide: boolean): this {
    return this.setProp("hideTextWhileLoading", hide);
  }

  accessibilityLabel(label: string): this {
    return this.setProp("accessibilityLabel", label);
  }

  accessibilityHint(hint: string): this {
    return this.setProp("accessibilityHint", hint);
  }

  isAccessibilityElement(isElement: boolean): this {
    return this.setProp("isAccessibilityElement", isElement);
  }

  animationDuration(duration: number): this {
    return this.setProp("animationDuration", duration);
  }

  pressEffect(enabled: boolean): this {
    return this.setProp("pressEffect", enabled);
  }

  pressScale(scale: number): this {
    return this.setProp("pressScale", scale);
  }

  pressColorChange(color: string): this {
    return this.setProp("pressColorChange", color);
  }

  pressOffset(offsetX: number, offsetY: number): this {
    this.setProp("pressOffsetX", offsetX);
    this.setProp("pressOffsetY", offsetY);
    return this;
  }

  addGradientStop(color: string, position: number): this {
    const stopCount = Object.keys(this.props).filter((k) =>
      k.startsWith("gradientStop_")
    ).length;
    this.setProp(`gradientStop_${stopCount}`, { color, position });
    return this;
  }

  gradientStartPoint(x: number, y: number): this {
    this.setProp("gradientStartX", x);
    this.setProp("gradientStartY", y);
    return this;
  }

  gradientEndPoint(x: number, y: number): this {
    this.setProp("gradientEndX", x);
    this.setProp("gradientEndY", y);
    return this;
  }

  gradientIsRadial(isRadial: boolean): this {
    return this.setProp("gradientIsRadial", isRadial);
  }

  gradientColors(
    colors: string[],
    vertical: boolean = false,
    isRadial: boolean = false
  ): this {
    if (!colors || colors.length === 0) {
      return this;
    }

    if (vertical) {
      this.setProp("gradientStartX", 0.5);
      this.setProp("gradientStartY", 0);
      this.setProp("gradientEndX", 0.5);
      this.setProp("gradientEndY", 1);
    } else {
      this.setProp("gradientStartX", 0);
      this.setProp("gradientStartY", 0.5);
      this.setProp("gradientEndX", 1);
      this.setProp("gradientEndY", 0.5);
    }

    this.setProp("gradientIsRadial", isRadial);

    const numColors = colors.length;
    colors.forEach((color, index) => {
      const position = numColors > 1 ? index / (numColors - 1) : 0.5;
      this.setProp(`gradientStop_${index}`, { color, position });
    });

    return this;
  }

  onDoubleTap(handler: string | Function): this {
    return this.setProp("onDoubleTap", handler);
  }

  onLongPress(handler: string | Function): this {
    return this.setProp("onLongPress", handler);
  }

  onHoverEnter(handler: string | Function): this {
    return this.setProp("onHoverEnter", handler);
  }

  onHoverExit(handler: string | Function): this {
    return this.setProp("onHoverExit", handler);
  }

  onFocus(handler: string | Function): this {
    return this.setProp("onFocus", handler);
  }

  onBlur(handler: string | Function): this {
    return this.setProp("onBlur", handler);
  }

  disabled(isDisabled: boolean): this {
    return this.setProp("disabled", isDisabled);
  }
}
