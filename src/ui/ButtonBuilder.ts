import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { UI } from "./ui.js";
import { EventBus, EventType } from "./eventSystem.js";

export enum ButtonStyle {
  Primary = "Primary",
  Secondary = "Secondary",
  Danger = "Danger",
  Success = "Success",
  Outline = "Outline",
  Text = "Text",
  Custom = "Custom",
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

  onTap(
    handlerIdOrCallback: string | Function,
    eventType: EventType = EventType.Tap
  ): ButtonBuilder {
    if (typeof handlerIdOrCallback === "function") {
      const handlerId = `btn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const eventBus = EventBus.getInstance();
      eventBus.register(handlerId, handlerIdOrCallback);

      this._builder = this._builder.on_tap(handlerId);
    } else {
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
    this._builder = this._builder.icon(iconName).icon_position(position);
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
