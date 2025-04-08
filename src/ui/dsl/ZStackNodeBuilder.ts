import { EdgeInsets } from "../core/layout";
import { BaseNodeBuilder } from "./BaseNodeBuilder";

export class ZStackNodeBuilder extends BaseNodeBuilder {
  constructor(children: (BaseNodeBuilder | undefined | null)[] = []) {
    super("ZStack", children);
  }

  alignment(value: string): this {
    return this.setProp("alignment", value);
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
