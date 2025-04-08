import { getWasmModule } from "../../wasm/init";
import { UIComponent } from "../core";
import { UI } from "../ui";

export class SpacerBuilder extends UIComponent {
  protected _builder: any;

  constructor() {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.SpacerBuilder();
  }

  fixed(size: number): SpacerBuilder {
    this._builder = this._builder.fixed(size);
    return this;
  }

  flexible(grow: number): SpacerBuilder {
    this._builder = this._builder.flexible(grow);
    return this;
  }

  min(size: number): SpacerBuilder {
    this._builder = this._builder.min(size);
    return this;
  }

  max(size: number): SpacerBuilder {
    this._builder = this._builder.max(size);
    return this;
  }

  accessibilityLabel(label: string): SpacerBuilder {
    this._builder = this._builder.accessibility_label(label);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Spacer component:", error);
      throw error;
    }
  }

  static async create(): Promise<SpacerBuilder> {
    await UIComponent.initialize();
    return new SpacerBuilder();
  }

  static async fixed(size: number): Promise<SpacerBuilder> {
    const builder = await SpacerBuilder.create();
    return builder.fixed(size);
  }

  static async flexible(grow: number = 1): Promise<SpacerBuilder> {
    const builder = await SpacerBuilder.create();
    return builder.flexible(grow);
  }
}
