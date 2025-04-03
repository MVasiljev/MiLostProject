import { BaseNodeBuilder, EdgeInsets } from "./BaseNodeBuilder";

/**
 * HStackNodeBuilder - For creating horizontal stacks
 */
export class HStackNodeBuilder extends BaseNodeBuilder {
  constructor(children: (BaseNodeBuilder | undefined | null)[] = []) {
    super("HStack", children);
  }

  /**
   * Set spacing between items
   */
  spacing(value: number): this {
    return this.setProp("spacing", value);
  }

  /**
   * Set vertical alignment of items in the HStack
   */
  alignment(value: string): this {
    return this.setProp("alignment", value);
  }

  /**
   * Set whether spacing is equally distributed
   */
  equalSpacing(value: boolean): this {
    return this.setProp("equalSpacing", value);
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
