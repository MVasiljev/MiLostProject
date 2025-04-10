import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { EdgeInsets } from "../core/layout/EdgeInsets.js";
import { ColorType } from "../types.js";
import { UI } from "../ui.js";

export enum ZStackAlignment {
  Center = "center",
  TopLeading = "topLeading",
  Top = "top",
  TopTrailing = "topTrailing",
  Leading = "leading",
  Trailing = "trailing",
  BottomLeading = "bottomLeading",
  Bottom = "bottom",
  BottomTrailing = "bottomTrailing",
}

export class ZStackBuilder extends UIComponent {
  constructor() {
    super();
    this._builder = this.createWasmBuilder("ZStack");
  }

  alignment(alignment: ZStackAlignment): ZStackBuilder {
    return this.setBuilderProp("alignment", alignment);
  }

  background(color: ColorType): ZStackBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("background", colorString);
  }

  edgeInsets(insets: EdgeInsets): ZStackBuilder {
    return this.setBuilderProp("edge_insets", [
      insets.top,
      insets.right,
      insets.bottom,
      insets.left,
    ]);
  }

  minWidth(value: number): ZStackBuilder {
    return this.setBuilderProp("min_width", value);
  }

  idealWidth(value: number): ZStackBuilder {
    return this.setBuilderProp("ideal_width", value);
  }

  maxWidth(value: number): ZStackBuilder {
    return this.setBuilderProp("max_width", value);
  }

  minHeight(value: number): ZStackBuilder {
    return this.setBuilderProp("min_height", value);
  }

  idealHeight(value: number): ZStackBuilder {
    return this.setBuilderProp("ideal_height", value);
  }

  maxHeight(value: number): ZStackBuilder {
    return this.setBuilderProp("max_height", value);
  }

  clipToBounds(value: boolean): ZStackBuilder {
    return this.setBuilderProp("clip_to_bounds", value);
  }

  layoutPriority(priority: number): ZStackBuilder {
    return this.setBuilderProp("layout_priority", priority);
  }

  async child(component: UIComponent | UI): Promise<ZStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await component.build().then((ui) => ui.toJSON());
    }

    this._builder = this._builder.add_children(json);
    return this;
  }

  static async create(): Promise<ZStackBuilder> {
    await UIComponent.initialize();
    return new ZStackBuilder();
  }
}
