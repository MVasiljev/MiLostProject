import { getWasmModule } from "../../wasm/init";
import { UIComponent, Color } from "../core";
import { EventBus } from "../rendering";
import { ColorType } from "../types";
import { UI } from "../ui";

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

export enum BorderStyle {
  Solid = "Solid",
  Dashed = "Dashed",
  Dotted = "Dotted",
  None = "None",
}

export class ButtonBuilder extends UIComponent {
  protected _builder: any;

  constructor(label: string) {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.ButtonBuilder(label);
  }

  onTap(handlerIdOrCallback: string | Function): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      (window as any)[handlerId] = handlerIdOrCallback;

      this._builder = this._builder.on_tap(handlerId);
    } else {
      this._builder = this._builder.on_tap(handlerIdOrCallback);
    }

    return this;
  }

  style(style: ButtonStyle): ButtonBuilder {
    this._builder = this._builder.style(style);
    return this;
  }

  size(size: ButtonSize): ButtonBuilder {
    this._builder = this._builder.size(size);
    return this;
  }

  backgroundColor(color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.background_color(colorString);
    return this;
  }

  textColor(color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.text_color(colorString);
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

  icon(iconName: string, position: string = "leading"): ButtonBuilder {
    this._builder = this._builder.icon(iconName, position);
    return this;
  }

  border(width: number, style: BorderStyle, color: ColorType): ButtonBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.border(width, colorString, style);
    return this;
  }

  disabled(isDisabled: boolean): ButtonBuilder {
    this._builder = this._builder.disabled(isDisabled);
    return this;
  }

  loading(isLoading: boolean): ButtonBuilder {
    this._builder = this._builder.loading(isLoading);
    return this;
  }

  fontSize(size: number): ButtonBuilder {
    this._builder = this._builder.text_style(null, null, null, size, null);
    return this;
  }

  fontWeight(weight: string): ButtonBuilder {
    this._builder = this._builder.text_style(null, null, weight, null, null);
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
    await UIComponent.initialize();
    return new ButtonBuilder(label);
  }
}
