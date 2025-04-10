import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";
import { EventBus } from "../rendering/eventSystem.js";

export enum ButtonStyle {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Success = "success",
  Outline = "outline",
  Text = "text",
  Custom = "custom",
}

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  Custom = "custom",
}

export enum BorderStyle {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
  None = "none",
}

export class ButtonBuilder extends UIComponent {
  constructor(label: string) {
    super();
    this._builder = this.createWasmBuilder("Button", label);
  }

  onTap(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      (window as any)[handlerId] = handlerIdOrCallback;

      return this.setBuilderProp("on_tap", handlerId);
    } else {
      return this.setBuilderProp("on_tap", handlerIdOrCallback);
    }
  }

  style(style: ButtonStyle): ButtonBuilder {
    return this.setBuilderProp("style", style);
  }

  size(size: ButtonSize): ButtonBuilder {
    return this.setBuilderProp("size", size);
  }

  backgroundColor(color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("background_color", colorString);
  }

  textColor(color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("text_color", colorString);
  }

  cornerRadius(radius: number): ButtonBuilder {
    return this.setBuilderProp("corner_radius", radius);
  }

  padding(padding: number): ButtonBuilder {
    return this.setBuilderProp("padding", padding);
  }

  icon(iconName: string, position: string = "leading"): ButtonBuilder {
    return this.setBuilderProp("icon", [iconName, position]);
  }

  border(width: number, style: BorderStyle, color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("border", [width, colorString, style]);
  }

  disabled(isDisabled: boolean): ButtonBuilder {
    return this.setBuilderProp("disabled", isDisabled);
  }

  loading(isLoading: boolean): ButtonBuilder {
    return this.setBuilderProp("loading", [isLoading, "spinner", null, false]);
  }

  fontSize(size: number): ButtonBuilder {
    return this.setBuilderProp("text_style", [null, null, size]);
  }

  fontWeight(weight: string): ButtonBuilder {
    return this.setBuilderProp("text_style", [null, null, null, weight, null]);
  }

  elevation(value: number): ButtonBuilder {
    return this.setBuilderProp("elevation", value);
  }

  shadow(
    radius: number,
    color: ColorType,
    offsetX: number = 0,
    offsetY: number = 0
  ): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("shadow", [
      radius,
      colorString,
      offsetX,
      offsetY,
    ]);
  }

  opacity(value: number): ButtonBuilder {
    return this.setBuilderProp("opacity", value);
  }

  static async create(label: string): Promise<ButtonBuilder> {
    await UIComponent.initialize();
    return new ButtonBuilder(label);
  }
}
