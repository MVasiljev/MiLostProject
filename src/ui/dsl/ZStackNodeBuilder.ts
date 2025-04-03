import { BaseNodeBuilder, EdgeInsets } from "./BaseNodeBuilder";

/**
 * ZStackNodeBuilder - For creating layered stacks (z-axis)
 */
export class ZStackNodeBuilder extends BaseNodeBuilder {
  constructor(children: (BaseNodeBuilder | undefined | null)[] = []) {
    super("ZStack", children);
  }

  /**
   * Set alignment of items within the ZStack
   */
  alignment(value: string): this {
    return this.setProp("alignment", value);
  }

  /**
   * Set edge insets
   */
  edgeInsets(insets: EdgeInsets): this {
    return this.setProp("edgeInsets", insets);
  }

  /**
   * Set minimum width constraint
   */
  minWidth(value: number): this {
    return this.setProp("minWidth", value);
  }

  /**
   * Set ideal width constraint
   */
  idealWidth(value: number): this {
    return this.setProp("idealWidth", value);
  }

  /**
   * Set maximum width constraint
   */
  maxWidth(value: number): this {
    return this.setProp("maxWidth", value);
  }

  /**
   * Set minimum height constraint
   */
  minHeight(value: number): this {
    return this.setProp("minHeight", value);
  }

  /**
   * Set ideal height constraint
   */
  idealHeight(value: number): this {
    return this.setProp("idealHeight", value);
  }

  /**
   * Set maximum height constraint
   */
  maxHeight(value: number): this {
    return this.setProp("maxHeight", value);
  }

  /**
   * Set layout priority
   */
  layoutPriority(value: number): this {
    return this.setProp("layoutPriority", value);
  }
}
