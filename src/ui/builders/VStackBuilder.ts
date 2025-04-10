import { UIComponent } from "../core/UIComponent.js";
import { UI } from "../ui.js";
import { EdgeInsets } from "../core/layout/EdgeInsets.js";
import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { WasmConnector } from "../../initWasm/wasm-connector.js";

export enum StackAlignment {
  Leading = "leading",
  Center = "center",
  Trailing = "trailing",
}

export class VStackBuilder extends UIComponent {
  constructor() {
    super();

    try {
      this._builder = WasmConnector.createComponent("VStack");
      console.log("VStack component created successfully");
    } catch (error) {
      console.error("Failed to create VStack component:", error);
      this._builder = {};
    }
  }

  spacing(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "spacing", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set spacing(${value}):`, error);
    }
    return this;
  }

  padding(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "padding", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set padding(${value}):`, error);
    }
    return this;
  }

  background(color: string): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "background", [
        color,
      ]);
    } catch (error) {
      console.warn(`Failed to set background(${color}):`, error);
    }
    return this;
  }

  alignment(alignment: StackAlignment): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "alignment", [
        alignment,
      ]);
    } catch (error) {
      console.warn(`Failed to set alignment(${alignment}):`, error);
    }
    return this;
  }

  edgeInsets(insets: EdgeInsets): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "edge_insets", [
        insets.top,
        insets.right,
        insets.bottom,
        insets.left,
      ]);
    } catch (error) {
      console.warn(`Failed to set edge_insets:`, error);
    }
    return this;
  }

  minWidth(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "min_width", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set min_width(${value}):`, error);
    }
    return this;
  }

  idealWidth(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "ideal_width", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set ideal_width(${value}):`, error);
    }
    return this;
  }

  maxWidth(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "max_width", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set max_width(${value}):`, error);
    }
    return this;
  }

  minHeight(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "min_height", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set min_height(${value}):`, error);
    }
    return this;
  }

  idealHeight(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "ideal_height", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set ideal_height(${value}):`, error);
    }
    return this;
  }

  maxHeight(value: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "max_height", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set max_height(${value}):`, error);
    }
    return this;
  }

  clipToBounds(value: boolean): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(
        this._builder,
        "clip_to_bounds",
        [value]
      );
    } catch (error) {
      console.warn(`Failed to set clip_to_bounds(${value}):`, error);
    }
    return this;
  }

  layoutPriority(priority: number): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(
        this._builder,
        "layout_priority",
        [priority]
      );
    } catch (error) {
      console.warn(`Failed to set layout_priority(${priority}):`, error);
    }
    return this;
  }

  equalSpacing(value: boolean): VStackBuilder {
    try {
      this._builder = WasmConnector.callMethod(this._builder, "equal_spacing", [
        value,
      ]);
    } catch (error) {
      console.warn(`Failed to set equal_spacing(${value}):`, error);
    }
    return this;
  }

  async child(component: UIComponent | UI): Promise<VStackBuilder> {
    let json: string;

    try {
      if (component instanceof UI) {
        json = component.toJSON();
      } else {
        const ui = await component.build();
        json = ui.toJSON();
      }

      this._builder = WasmConnector.callMethod(this._builder, "add_children", [
        json,
      ]);
    } catch (error) {
      console.warn("Failed to add child component:", error);
    }

    return this;
  }

  async build(): Promise<UI> {
    try {
      const json = WasmConnector.callMethod<string>(
        this._builder,
        "to_json",
        []
      );
      return await UI.fromJSON(json);
    } catch (error) {
      console.error("Failed to build VStack:", error);
      const fallbackJson = JSON.stringify({
        type: "VStack",
        error: `Build failed: ${error}`,
      });
      return await UI.fromJSON(fallbackJson);
    }
  }

  static async create(): Promise<VStackBuilder> {
    try {
      if (!isWasmInitialized()) {
        await initWasm();
      }

      if (!WasmConnector.isInitialized()) {
        await WasmConnector.initialize();
      }
    } catch (error) {
      console.warn("Failed to initialize WASM:", error);
    }
    return new VStackBuilder();
  }
}
