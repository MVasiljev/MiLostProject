import { UI } from "../ui.js";
import { Component } from "./Component.js";

export abstract class UIComponent extends Component<UI> {
  protected _builder: any;

  protected constructor() {
    super();
  }

  abstract build(): Promise<UI>;
}
