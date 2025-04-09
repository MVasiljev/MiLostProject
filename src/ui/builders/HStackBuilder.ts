import { getWasmModule } from "../../initWasm/init";
import {
  UIComponent,
  Color,
  HStackAlignment,
  EdgeInsets,
  LayoutPriority,
} from "../core";
import { ColorType } from "../types";
import { UI } from "../ui";

export class HStackBuilder extends UIComponent {
  protected _builder: any;

  constructor() {
    super();
    const wasm = getWasmModule();
    this._builder = new wasm.HStackBuilder();
  }

  spacing(value: number): HStackBuilder {
    this._builder = this._builder.spacing(value);
    return this;
  }

  padding(value: number): HStackBuilder {
    this._builder = this._builder.padding(value);
    return this;
  }

  background(color: ColorType): HStackBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    this._builder = this._builder.background(colorString);
    return this;
  }

  alignment(alignment: HStackAlignment): HStackBuilder {
    this._builder = this._builder.alignment(alignment);
    return this;
  }

  edgeInsets(insets: EdgeInsets): HStackBuilder {
    this._builder = this._builder.edge_insets(
      insets.top,
      insets.right,
      insets.bottom,
      insets.left
    );
    return this;
  }

  minWidth(value: number): HStackBuilder {
    this._builder = this._builder.min_width(value);
    return this;
  }

  idealWidth(value: number): HStackBuilder {
    this._builder = this._builder.ideal_width(value);
    return this;
  }

  maxWidth(value: number): HStackBuilder {
    this._builder = this._builder.max_width(value);
    return this;
  }

  minHeight(value: number): HStackBuilder {
    this._builder = this._builder.min_height(value);
    return this;
  }

  idealHeight(value: number): HStackBuilder {
    this._builder = this._builder.ideal_height(value);
    return this;
  }

  maxHeight(value: number): HStackBuilder {
    this._builder = this._builder.max_height(value);
    return this;
  }

  clipToBounds(value: boolean): HStackBuilder {
    this._builder = this._builder.clip_to_bounds(value);
    return this;
  }

  layoutPriority(priority: LayoutPriority | number): HStackBuilder {
    this._builder = this._builder.layout_priority(priority);
    return this;
  }

  equalSpacing(value: boolean): HStackBuilder {
    this._builder = this._builder.equal_spacing(value);
    return this;
  }

  async child(component: UIComponent | UI): Promise<HStackBuilder> {
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
      console.error("Error building HStack component:", error);
      throw error;
    }
  }

  static async create(): Promise<HStackBuilder> {
    await UIComponent.initialize();
    return new HStackBuilder();
  }
}
