import { BaseNodeBuilder } from "./BaseNodeBuilder";

export class SpacerNodeBuilder extends BaseNodeBuilder {
  constructor() {
    super("Spacer");
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
}
