import { EdgeInsets } from "../core/layout";
import { BaseNodeBuilder } from "./BaseNodeBuilder";

export class HStackNodeBuilder extends BaseNodeBuilder {
  constructor(children: (BaseNodeBuilder | undefined | null)[] = []) {
    super("HStack", children);
  }

  spacing(value: number): this {
    return this.setProp("spacing", value);
  }

  alignment(value: string): this {
    return this.setProp("alignment", value);
  }

  equalSpacing(value: boolean): this {
    return this.setProp("equalSpacing", value);
  }

  edgeInsets(insets: EdgeInsets): this {
    return this.setProp("edgeInsets", insets);
  }

  minWidth(value: number): this {
    return this.setProp("minWidth", value);
  }

  idealWidth(value: number): this {
    return this.setProp("idealWidth", value);
  }

  maxWidth(value: number): this {
    return this.setProp("maxWidth", value);
  }

  minHeight(value: number): this {
    return this.setProp("minHeight", value);
  }

  idealHeight(value: number): this {
    return this.setProp("idealHeight", value);
  }

  maxHeight(value: number): this {
    return this.setProp("maxHeight", value);
  }

  layoutPriority(value: number): this {
    return this.setProp("layoutPriority", value);
  }
}
