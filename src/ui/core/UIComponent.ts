import { Component } from "./Component.js";
import { UI } from "../ui.js";
import { callWasmInstanceMethod } from "../../initWasm/lib.js";

export abstract class UIComponent extends Component<UI> {
  protected _builder: any;

  protected constructor() {
    super();
  }

  async build(): Promise<UI> {
    try {
      const json = callWasmInstanceMethod<string>(
        this._builder,
        "to_json",
        [],
        () => {
          throw new Error(
            "Failed to build component - to_json method unavailable"
          );
        }
      );

      return UI.fromJSON(json);
    } catch (error) {
      console.error(
        `Error building ${this.constructor.name} component:`,
        error
      );
      throw error;
    }
  }

  protected setBuilderProp<T extends UIComponent>(key: string, value: any): T {
    const snakeKey = this.camelToSnakeCase(key);

    try {
      this._builder = callWasmInstanceMethod(
        this._builder,
        snakeKey,
        [value],
        () => {
          return callWasmInstanceMethod(
            this._builder,
            key,
            [value],
            () => this._builder
          );
        }
      );
    } catch (error) {
      console.warn(`Failed to set prop ${key} (${snakeKey}):`, error);
    }

    return this as unknown as T;
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
