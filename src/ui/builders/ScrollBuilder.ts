import { getWasmModule } from "../../initWasm/init";
import { UIComponent } from "../core";
import { UI } from "../ui";

export enum ScrollDirection {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export class ScrollBuilder extends UIComponent {
  protected _builder: any;

  constructor(direction: ScrollDirection = ScrollDirection.Vertical) {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.ScrollBuilder(direction);
  }

  async child(component: UIComponent | UI): Promise<ScrollBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await component.build().then((ui) => ui.toJSON());
    }

    this._builder = this._builder.child(json);
    return this;
  }

  async build(): Promise<UI> {
    try {
      const result = this._builder.build();
      return UI.fromJSON(result);
    } catch (error) {
      console.error("Error building Scroll component:", error);
      throw error;
    }
  }

  static async create(
    direction: ScrollDirection = ScrollDirection.Vertical
  ): Promise<ScrollBuilder> {
    await UIComponent.initialize();
    return new ScrollBuilder(direction);
  }

  static async createVertical(): Promise<ScrollBuilder> {
    return ScrollBuilder.create(ScrollDirection.Vertical);
  }

  static async createHorizontal(): Promise<ScrollBuilder> {
    return ScrollBuilder.create(ScrollDirection.Horizontal);
  }
}
