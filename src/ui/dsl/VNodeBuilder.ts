export class VNodeBuilder {
  type: string;
  props: Record<string, any>;
  children: VNodeBuilder[];

  constructor(
    type: string,
    children: (VNodeBuilder | undefined | null)[] = []
  ) {
    this.type = type;
    this.props = {};
    this.children = children.filter(Boolean) as VNodeBuilder[];
  }

  setProp(key: string, value: any): this {
    this.props[key] = value;
    return this;
  }

  spacing(value: number): this {
    return this.setProp("spacing", value);
  }

  padding(value: number): this {
    return this.setProp("padding", value);
  }

  background(value: string): this {
    return this.setProp("background", value);
  }

  color(value: string): this {
    return this.setProp("color", value);
  }

  fontStyle(value: string): this {
    return this.setProp("fontStyle", value);
  }

  onTap(handlerName: string): this {
    return this.setProp("onTap", handlerName);
  }

  size(value: number): this {
    return this.setProp("size", value);
  }

  minSize(value: number): this {
    return this.setProp("minSize", value);
  }

  maxSize(value: number): this {
    return this.setProp("maxSize", value);
  }

  flexGrow(value: number): this {
    return this.setProp("flexGrow", value);
  }

  alt(text: string): this {
    return this.setProp("alt", text);
  }

  width(value: number): this {
    return this.setProp("width", value);
  }

  height(value: number): this {
    return this.setProp("height", value);
  }

  cornerRadius(value: number): this {
    return this.setProp("cornerRadius", value);
  }

  borderWidth(value: number): this {
    return this.setProp("borderWidth", value);
  }

  borderColor(value: string): this {
    return this.setProp("borderColor", value);
  }

  style(value: any): this {
    return this.setProp("style", value);
  }

  resizeMode(value: any): this {
    return this.setProp("resizeMode", value);
  }

  textColor(value: string): this {
    return this.setProp("textColor", value);
  }

  backgroundColor(value: string): this {
    return this.setProp("backgroundColor", value);
  }

  paddingAll(value: number): this {
    return this.setProp("padding", value);
  }

  child(child: VNodeBuilder): this {
    this.children.push(child);
    return this;
  }

  childrenList(...children: VNodeBuilder[]): this {
    this.children.push(...children);
    return this;
  }
}
