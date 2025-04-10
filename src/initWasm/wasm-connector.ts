import { initWasm, getWasmModule, isWasmInitialized } from "../initWasm/init";
import {
  createWasmInstance,
  callWasmInstanceMethod,
  callWasmStaticMethod,
} from "../initWasm/lib";

export class WasmConnector {
  private static initialized = false;
  private static constructorMap: Record<string, string> = {};
  private static factoryMethodMap: Record<string, string> = {};
  private static staticMethodMap: Record<string, string> = {};

  static isInitialized(): boolean {
    return this.initialized;
  }

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initWasm();

      const wasmModule = getWasmModule();
      const exports = Object.keys(wasmModule);
      console.log(
        `Found ${exports.length} WASM exports. First 10:`,
        exports.slice(0, 10)
      );

      this.mapConstructors(wasmModule, exports);

      this.mapFactoryMethods(wasmModule, exports);

      this.mapStaticMethods(wasmModule, exports);

      this.initialized = true;
      console.log("WASM connector initialized successfully");
      console.log("Mapped constructors:", this.constructorMap);
      console.log("Mapped factory methods:", this.factoryMethodMap);
      console.log("Mapped static methods:", this.staticMethodMap);
    } catch (error) {
      console.error("Failed to initialize WASM connector:", error);
      throw error;
    }
  }

  static createComponent<T>(componentType: string, args: any[] = []): T {
    if (!this.initialized) {
      console.warn(
        `WasmConnector not initialized when creating ${componentType}`
      );
      return {} as T;
    }

    const constructorName = this.constructorMap[componentType] || componentType;

    return createWasmInstance<T>(constructorName, args, () => {
      console.error(
        `Failed to create WASM component: ${componentType} (mapped to ${constructorName})`
      );
      return {} as T;
    });
  }

  static callMethod<T>(instance: any, methodName: string, args: any[] = []): T {
    if (!this.initialized) {
      console.warn(`WasmConnector not initialized when calling ${methodName}`);

      if (instance && typeof instance[methodName] === "function") {
        try {
          return instance[methodName](...args);
        } catch (e) {
          console.warn(`Direct method call failed for ${methodName}:`, e);
        }
      }

      if (methodName !== "to_json" && methodName !== "build") {
        return instance as T;
      }

      if (methodName === "to_json") {
        return '{"type":"FallbackComponent"}' as T;
      }

      return null as T;
    }

    const snakeCaseMethod = this.camelToSnakeCase(methodName);

    return callWasmInstanceMethod<T>(instance, methodName, args, () =>
      callWasmInstanceMethod<T>(instance, snakeCaseMethod, args, () => {
        console.warn(`Method not found: ${methodName} or ${snakeCaseMethod}`);

        if (methodName !== "to_json" && methodName !== "build") {
          return instance as T;
        }

        if (methodName === "to_json") {
          return '{"type":"FallbackComponent"}' as T;
        }

        return null as T;
      })
    );
  }

  static callFactoryMethod<T>(factoryName: string, args: any[] = []): T {
    this.ensureInitialized();

    const methodName = this.factoryMethodMap[factoryName] || factoryName;

    return callWasmStaticMethod<T>("", methodName, args, () => {
      console.error(
        `Factory method not found: ${factoryName} (mapped to ${methodName})`
      );
      throw new Error(`Factory method not found: ${factoryName}`);
    });
  }

  static callStaticMethod<T>(methodName: string, args: any[] = []): T {
    if (!this.initialized) {
      console.warn(
        `WasmConnector not initialized when calling static method ${methodName}`
      );

      if (methodName === "get_render_node") {
        return '{"type":"FallbackRenderNode"}' as T;
      }

      if (methodName === "render_to_canvas_element") {
        return undefined as T;
      }

      return null as T;
    }

    const fullMethodName = this.staticMethodMap[methodName] || methodName;

    return callWasmStaticMethod<T>("", fullMethodName, args, () => {
      console.warn(
        `Static method not found: ${methodName} (mapped to ${fullMethodName})`
      );

      if (methodName === "get_render_node") {
        return '{"type":"FallbackRenderNode"}' as T;
      }

      if (methodName === "render_to_canvas_element") {
        return undefined as T;
      }

      return null as T;
    });
  }

  private static mapConstructors(wasmModule: any, exports: string[]): void {
    const componentTypes = [
      "VStack",
      "HStack",
      "ZStack",
      "Text",
      "Button",
      "Image",
      "ImageComponent",
      "Spacer",
      "Divider",
      "Scroll",
    ];

    for (const type of componentTypes) {
      if (typeof wasmModule[type] === "function") {
        this.constructorMap[type] = type;
        continue;
      }

      const matchingExport = exports.find(
        (name) => name.endsWith(type) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.constructorMap[type] = matchingExport;
      }
    }
  }

  private static mapFactoryMethods(wasmModule: any, exports: string[]): void {
    const factoryMethods = [
      "create_heading",
      "create_paragraph",
      "create_avatar_image",
      "light_divider",
      "dark_divider",
      "create_primary_button",
    ];

    for (const method of factoryMethods) {
      if (typeof wasmModule[method] === "function") {
        this.factoryMethodMap[method] = method;
        continue;
      }

      const matchingExport = exports.find(
        (name) =>
          name.endsWith(method) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.factoryMethodMap[method] = matchingExport;
      }
    }
  }

  private static mapStaticMethods(wasmModule: any, exports: string[]): void {
    const staticMethods = ["render_to_canvas_element", "get_render_node"];

    for (const method of staticMethods) {
      if (typeof wasmModule[method] === "function") {
        this.staticMethodMap[method] = method;
        continue;
      }

      const matchingExport = exports.find(
        (name) =>
          name.endsWith(method) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.staticMethodMap[method] = matchingExport;
      }
    }
  }

  private static camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  private static ensureInitialized(): boolean {
    if (!this.initialized) {
      console.warn(
        "WASM connector not initialized. Some features may not work properly."
      );
      return false;
    }
    return true;
  }
}
