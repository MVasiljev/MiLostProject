import { EdgeInsets } from "../core/layout/EdgeInsets";

export class BaseNodeBuilder {
  type: string;
  props: Record<string, any>;
  children: BaseNodeBuilder[];

  constructor(
    type: string,
    children: (BaseNodeBuilder | undefined | null)[] = []
  ) {
    this.type = type;
    this.props = {};
    this.children = children.filter(Boolean) as BaseNodeBuilder[];
  }

  setProp(key: string, value: any): this {
    this.props[key] = value;
    return this;
  }

  child(child: BaseNodeBuilder): this {
    this.children.push(child);
    return this;
  }

  childrenList(...children: BaseNodeBuilder[]): this {
    this.children.push(...children);
    return this;
  }

  padding(value: number): this {
    return this.setProp("padding", value);
  }

  background(value: string): this {
    return this.setProp("background", value);
  }

  cornerRadius(value: number): this {
    return this.setProp("cornerRadius", value);
  }

  opacity(value: number): this {
    return this.setProp("opacity", value);
  }

  clipToBounds(value: boolean): this {
    return this.setProp("clipToBounds", value);
  }

  onTap(handler: string | Function): this {
    return this.setProp("onTap", handler);
  }

  edgeInsets(insets: EdgeInsets): this {
    return this.setProp("edgeInsets", insets);
  }

  minWidth(value: number): this {
    return this.setProp("minWidth", value);
  }

  maxWidth(value: number): this {
    return this.setProp("maxWidth", value);
  }

  minHeight(value: number): this {
    return this.setProp("minHeight", value);
  }

  maxHeight(value: number): this {
    return this.setProp("maxHeight", value);
  }
}
