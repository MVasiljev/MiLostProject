import { Component } from "./Component.js";
import { UI } from "../ui.js";
import { isWasmInitialized, initWasm } from "../../initWasm/init.js";
import { WasmConnector } from "../../initWasm/wasm-connector.js";

export abstract class UIComponent extends Component<UI> {
  protected _builder: any;

  protected constructor() {
    super();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
      }
    }
  }

  async build(): Promise<UI> {
    return this.safeBuildOperation();
  }

  protected async safeBuildOperation(): Promise<UI> {
    try {
      if (!isWasmInitialized()) {
        await initWasm();
      }

      let json = "";
      if (WasmConnector.isInitialized()) {
        json = WasmConnector.callMethod<string>(this._builder, "to_json", []);
      } else {
        if (this._builder && typeof this._builder.to_json === "function") {
          json = this._builder.to_json();
        } else {
          throw new Error("Builder does not have to_json method");
        }
      }

      return await UI.fromJSON(json);
    } catch (error) {
      console.warn(`Component build failed: ${error}`);
      return this.createFallbackUI();
    }
  }

  protected async createFallbackUI(): Promise<UI> {
    const fallbackJson = JSON.stringify({
      type: this.constructor.name,
      error: "WASM build failed",
    });
    return await UI.fromJSON(fallbackJson);
  }

  protected setBuilderProp<T extends UIComponent>(key: string, value: any): T {
    try {
      if (WasmConnector.isInitialized()) {
        this._builder = WasmConnector.callMethod(this._builder, key, [value]);
      } else {
        if (this._builder && typeof this._builder[key] === "function") {
          this._builder = this._builder[key](value);
        } else {
          const snakeKey = this.camelToSnakeCase(key);
          if (this._builder && typeof this._builder[snakeKey] === "function") {
            this._builder = this._builder[snakeKey](value);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to set prop ${key}:`, error);
    }

    return this as unknown as T;
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
