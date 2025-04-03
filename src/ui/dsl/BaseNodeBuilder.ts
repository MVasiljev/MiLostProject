export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * BaseNodeBuilder - Base class for all node builders
 */
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

  /**
   * Set a property on the node
   */
  setProp(key: string, value: any): this {
    this.props[key] = value;
    return this;
  }

  /**
   * Add a child to this node
   */
  child(child: BaseNodeBuilder): this {
    this.children.push(child);
    return this;
  }

  /**
   * Add multiple children to this node
   */
  childrenList(...children: BaseNodeBuilder[]): this {
    this.children.push(...children);
    return this;
  }

  // Common properties shared by most components

  /**
   * Set padding around the component
   */
  padding(value: number): this {
    return this.setProp("padding", value);
  }

  /**
   * Set the background color
   */
  background(value: string): this {
    return this.setProp("background", value);
  }

  /**
   * Set the corner radius
   */
  cornerRadius(value: number): this {
    return this.setProp("cornerRadius", value);
  }

  /**
   * Set opacity of the component
   */
  opacity(value: number): this {
    return this.setProp("opacity", value);
  }

  /**
   * Define whether content is clipped to bounds
   */
  clipToBounds(value: boolean): this {
    return this.setProp("clipToBounds", value);
  }

  /**
   * General handler for tap/click events
   */
  onTap(handler: string | Function): this {
    return this.setProp("onTap", handler);
  }
}
