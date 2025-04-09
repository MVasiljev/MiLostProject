import { getWasmModule } from "../../initWasm/init";
import {
  UIComponent,
  ZStackAlignment,
  Color,
  EdgeInsets,
  LayoutPriority,
} from "../core";
import { ColorType } from "../types";
import { UI } from "../ui";

export class ZStackBuilder extends UIComponent {
  protected _builder: any;

  constructor() {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.ZStackBuilder();
  }

  alignment(alignment: ZStackAlignment): ZStackBuilder {
    this._builder = this._builder.alignment(alignment);
    return this;
  }

  background(color: ColorType): ZStackBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.background(colorString);
    return this;
  }

  edgeInsets(insets: EdgeInsets): ZStackBuilder {
    this._builder = this._builder.edge_insets(
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );
    return this;
  }

  minWidth(value: number): ZStackBuilder {
    this._builder = this._builder.min_width(value);
    return this;
  }

  idealWidth(value: number): ZStackBuilder {
    this._builder = this._builder.ideal_width(value);
    return this;
  }

  maxWidth(value: number): ZStackBuilder {
    this._builder = this._builder.max_width(value);
    return this;
  }

  minHeight(value: number): ZStackBuilder {
    this._builder = this._builder.min_height(value);
    return this;
  }

  idealHeight(value: number): ZStackBuilder {
    this._builder = this._builder.ideal_height(value);
    return this;
  }

  maxHeight(value: number): ZStackBuilder {
    this._builder = this._builder.max_height(value);
    return this;
  }

  clipToBounds(value: boolean): ZStackBuilder {
    this._builder = this._builder.clip_to_bounds(value);
    return this;
  }

  layoutPriority(priority: LayoutPriority | number): ZStackBuilder {
    this._builder = this._builder.layout_priority(priority);
    return this;
  }

  async child(component: UIComponent | UI): Promise<ZStackBuilder> {
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
      console.error("Error building ZStack component:", error);
      throw error;
    }
  }

  static async create(): Promise<ZStackBuilder> {
    await UIComponent.initialize();
    return new ZStackBuilder();
  }
}
