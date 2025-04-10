import { UIComponent } from "../core/UIComponent.js";
import { Color } from "../core/color/ColorSystem.js";
import { ColorType } from "../types.js";
import { UI } from "../ui.js";

export enum ScrollDirection {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export class ScrollBuilder extends UIComponent {
  constructor(direction: ScrollDirection = ScrollDirection.Vertical) {
    super();
    this._builder = this.createWasmBuilder("Scroll", direction);
  }

  showsIndicators(shows: boolean): ScrollBuilder {
    return this.setBuilderProp("shows_indicators", shows);
  }

  scrollbarColor(color: ColorType): ScrollBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("scrollbar_color", colorString);
  }

  scrollbarWidth(width: number): ScrollBuilder {
    return this.setBuilderProp("scrollbar_width", width);
  }

  scrollbarMargin(margin: number): ScrollBuilder {
    return this.setBuilderProp("scrollbar_margin", margin);
  }

  alwaysBouncesHorizontal(bounces: boolean): ScrollBuilder {
    return this.setBuilderProp("always_bounces_horizontal", bounces);
  }

  alwaysBouncesVertical(bounces: boolean): ScrollBuilder {
    return this.setBuilderProp("always_bounces_vertical", bounces);
  }

  scrollEnabled(enabled: boolean): ScrollBuilder {
    return this.setBuilderProp("scroll_enabled", enabled);
  }

  pagingEnabled(enabled: boolean): ScrollBuilder {
    return this.setBuilderProp("paging_enabled", enabled);
  }

  decelerationRate(rate: string | number): ScrollBuilder {
    return this.setBuilderProp("deceleration_rate", rate.toString());
  }

  contentInsets(
    top: number,
    left: number,
    bottom: number,
    right: number
  ): ScrollBuilder {
    return this.setBuilderProp("content_insets", [top, left, bottom, right]);
  }

  contentInsetTop(top: number): ScrollBuilder {
    return this.setBuilderProp("content_inset_top", top);
  }

  contentInsetLeft(left: number): ScrollBuilder {
    return this.setBuilderProp("content_inset_left", left);
  }

  contentInsetBottom(bottom: number): ScrollBuilder {
    return this.setBuilderProp("content_inset_bottom", bottom);
  }

  contentInsetRight(right: number): ScrollBuilder {
    return this.setBuilderProp("content_inset_right", right);
  }

  indicatorStyle(style: string): ScrollBuilder {
    return this.setBuilderProp("indicator_style", style);
  }

  customIndicatorStyle(color: ColorType): ScrollBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("custom_indicator_style", colorString);
  }

  backgroundColor(color: ColorType): ScrollBuilder {
    const colorString =
      typeof color === "string" ? color : new Color(color).toCssString();
    return this.setBuilderProp("background_color", colorString);
  }

  width(width: number): ScrollBuilder {
    return this.setBuilderProp("width", width);
  }

  height(height: number): ScrollBuilder {
    return this.setBuilderProp("height", height);
  }

  async child(component: UIComponent | UI): Promise<ScrollBuilder> {
    let json: string;

    if (component instanceof UI) {
      json = component.toJSON();
    } else {
      json = await component.build().then((ui) => ui.toJSON());
    }

    this._builder = this._builder.add_child(json);
    return this;
  }

  static async create(
    direction: ScrollDirection = ScrollDirection.Vertical
  ): Promise<ScrollBuilder> {
    await UIComponent.initialize();
    return new ScrollBuilder(direction);
  }

  static async createVertical(): Promise<ScrollBuilder> {
    await UIComponent.initialize();
    return new ScrollBuilder(ScrollDirection.Vertical);
  }

  static async createHorizontal(): Promise<ScrollBuilder> {
    await UIComponent.initialize();
    return new ScrollBuilder(ScrollDirection.Horizontal);
  }
}
