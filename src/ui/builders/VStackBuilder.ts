import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { EdgeInsets } from "../core/layout/EdgeInsets.js";
import { ColorType } from "../types.js";
import { UI } from "../ui.js";

export enum StackAlignment {
  Leading = "leading",
  Center = "center",
  Trailing = "trailing",
}

export class VStackBuilder extends UIComponent {
  constructor() {
    super();
    this._builder = this.createWasmBuilder("VStack");
  }

  spacing(value: number): VStackBuilder {
    return this.setBuilderProp("spacing", value);
  }

  padding(value: number): VStackBuilder {
    return this.setBuilderProp("padding", value);
  }

  background(color: ColorType): VStackBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();

    return this.setBuilderProp("background", colorString);
  }

  alignment(alignment: StackAlignment): VStackBuilder {
    return this.setBuilderProp("alignment", alignment);
  }

  edgeInsets(insets: EdgeInsets): VStackBuilder {
    return this.setBuilderProp("edge_insets", [
      insets.top,
      insets.right,
      insets.bottom,
      insets.left,
    ]);
  }

  minWidth(value: number): VStackBuilder {
    return this.setBuilderProp("min_width", value);
  }

  idealWidth(value: number): VStackBuilder {
    return this.setBuilderProp("ideal_width", value);
  }

  maxWidth(value: number): VStackBuilder {
    return this.setBuilderProp("max_width", value);
  }

  minHeight(value: number): VStackBuilder {
    return this.setBuilderProp("min_height", value);
  }

  idealHeight(value: number): VStackBuilder {
    return this.setBuilderProp("ideal_height", value);
  }

  maxHeight(value: number): VStackBuilder {
    return this.setBuilderProp("max_height", value);
  }

  clipToBounds(value: boolean): VStackBuilder {
    return this.setBuilderProp("clip_to_bounds", value);
  }

  layoutPriority(priority: number): VStackBuilder {
    return this.setBuilderProp("layout_priority", priority);
  }

  equalSpacing(value: boolean): VStackBuilder {
    return this.setBuilderProp("equal_spacing", value);
  }

  async child(component: UIComponent | UI): Promise<VStackBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await component.build().then((ui) => ui.toJSON());
    }

    this._builder = this._builder.add_children(json);
    return this;
  }

  static async create(): Promise<VStackBuilder> {
    await UIComponent.initialize();
    return new VStackBuilder();
  }
}
