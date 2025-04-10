import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { EdgeInsets } from "../core/layout/EdgeInsets.js";
import { ColorType } from "../types.js";
import { UI } from "../ui.js";

export enum HStackAlignment {
  Top = "top",
  Center = "center",
  Bottom = "bottom",
  FirstTextBaseline = "firstTextBaseline",
  LastTextBaseline = "lastTextBaseline",
}

export class HStackBuilder extends UIComponent {
  constructor() {
    super();
    this._builder = this.createWasmBuilder("HStack");
  }

  spacing(value: number): HStackBuilder {
    return this.setBuilderProp("spacing", value);
  }

  padding(value: number): HStackBuilder {
    return this.setBuilderProp("padding", value);
  }

  background(color: ColorType): HStackBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("background", colorString);
  }

  alignment(alignment: HStackAlignment): HStackBuilder {
    return this.setBuilderProp("alignment", alignment);
  }

  edgeInsets(insets: EdgeInsets): HStackBuilder {
    return this.setBuilderProp("edge_insets", [
      insets.top,
      insets.right,
      insets.bottom,
      insets.left,
    ]);
  }

  minWidth(value: number): HStackBuilder {
    return this.setBuilderProp("min_width", value);
  }

  idealWidth(value: number): HStackBuilder {
    return this.setBuilderProp("ideal_width", value);
  }

  maxWidth(value: number): HStackBuilder {
    return this.setBuilderProp("max_width", value);
  }

  minHeight(value: number): HStackBuilder {
    return this.setBuilderProp("min_height", value);
  }

  idealHeight(value: number): HStackBuilder {
    return this.setBuilderProp("ideal_height", value);
  }

  maxHeight(value: number): HStackBuilder {
    return this.setBuilderProp("max_height", value);
  }

  clipToBounds(value: boolean): HStackBuilder {
    return this.setBuilderProp("clip_to_bounds", value);
  }

  layoutPriority(priority: number): HStackBuilder {
    return this.setBuilderProp("layout_priority", priority);
  }

  equalSpacing(value: boolean): HStackBuilder {
    return this.setBuilderProp("equal_spacing", value);
  }

  async child(component: UIComponent | UI): Promise<HStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await component.build().then((ui) => ui.toJSON());
    }

    this._builder = this._builder.add_children(json);
    return this;
  }

  static async create(): Promise<HStackBuilder> {
    await UIComponent.initialize();
    return new HStackBuilder();
  }
}
