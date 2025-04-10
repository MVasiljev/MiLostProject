// wasm-connector.ts
import { initWasm, getWasmModule, isWasmInitialized } from "../initWasm/init";
import {
  createWasmInstance,
  callWasmInstanceMethod,
  callWasmStaticMethod,
} from "../initWasm/lib";

/**
 * This class serves as a bridge between your TypeScript code and the WASM exports.
 * It handles finding the correct constructor names and methods in the WASM module.
 */
export class WasmConnector {
  private static initialized = false;
  private static constructorMap: Record<string, string> = {};
  private static factoryMethodMap: Record<string, string> = {};
  private static staticMethodMap: Record<string, string> = {};

  /**
   * Check if the WasmConnector is initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Initialize the WASM connector by loading the WASM module and mapping exports
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initWasm();

      // Log WASM contents to help with debugging
      const wasmModule = getWasmModule();
      const exports = Object.keys(wasmModule);
      console.log(
        `Found ${exports.length} WASM exports. First 10:`,
        exports.slice(0, 10)
      );

      // Map component constructors
      // This detects what names your components have in the WASM module
      this.mapConstructors(wasmModule, exports);

      // Map factory methods
      this.mapFactoryMethods(wasmModule, exports);

      // Map static methods
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

  /**
   * Create a WASM component instance
   */
  static createComponent<T>(componentType: string, args: any[] = []): T {
    // Try to create even if not initialized, with appropriate fallbacks
    if (!this.initialized) {
      console.warn(
        `WasmConnector not initialized when creating ${componentType}`
      );
      // Return empty object as fallback
      return {} as T;
    }

    // Look up the actual constructor name in our map
    const constructorName = this.constructorMap[componentType] || componentType;

    return createWasmInstance<T>(constructorName, args, () => {
      console.error(
        `Failed to create WASM component: ${componentType} (mapped to ${constructorName})`
      );
      // Return empty object as fallback
      return {} as T;
    });
  }

  /**
   * Call a method on a WASM component instance
   */
  static callMethod<T>(instance: any, methodName: string, args: any[] = []): T {
    if (!this.initialized) {
      console.warn(`WasmConnector not initialized when calling ${methodName}`);

      // Try direct method call as fallback
      if (instance && typeof instance[methodName] === "function") {
        try {
          return instance[methodName](...args);
        } catch (e) {
          console.warn(`Direct method call failed for ${methodName}:`, e);
        }
      }

      // For methods that return the builder itself
      if (methodName !== "to_json" && methodName !== "build") {
        return instance as T;
      }

      // Fallback for to_json methods
      if (methodName === "to_json") {
        return '{"type":"FallbackComponent"}' as T;
      }

      return null as T;
    }

    // Try the method as-is and with snake_case conversion
    const snakeCaseMethod = this.camelToSnakeCase(methodName);

    return callWasmInstanceMethod<T>(instance, methodName, args, () =>
      callWasmInstanceMethod<T>(instance, snakeCaseMethod, args, () => {
        console.warn(`Method not found: ${methodName} or ${snakeCaseMethod}`);

        // For methods that return the builder itself
        if (methodName !== "to_json" && methodName !== "build") {
          return instance as T;
        }

        // Fallback for to_json methods
        if (methodName === "to_json") {
          return '{"type":"FallbackComponent"}' as T;
        }

        return null as T;
      })
    );
  }

  /**
   * Call a factory method to create a component
   */
  static callFactoryMethod<T>(factoryName: string, args: any[] = []): T {
    this.ensureInitialized();

    // Look up the actual factory method name in our map
    const methodName = this.factoryMethodMap[factoryName] || factoryName;

    return callWasmStaticMethod<T>(
      "", // No class name needed as we're using the full method name
      methodName,
      args,
      () => {
        console.error(
          `Factory method not found: ${factoryName} (mapped to ${methodName})`
        );
        throw new Error(`Factory method not found: ${factoryName}`);
      }
    );
  }

  /**
   * Call a static method
   */
  static callStaticMethod<T>(methodName: string, args: any[] = []): T {
    if (!this.initialized) {
      console.warn(
        `WasmConnector not initialized when calling static method ${methodName}`
      );

      // Provide reasonable fallbacks for common methods
      if (methodName === "get_render_node") {
        return '{"type":"FallbackRenderNode"}' as T;
      }

      if (methodName === "render_to_canvas_element") {
        return undefined as T;
      }

      // Generic fallback
      return null as T;
    }

    // Look up the actual static method name in our map
    const fullMethodName = this.staticMethodMap[methodName] || methodName;

    return callWasmStaticMethod<T>(
      "", // No class name needed as we're using the full method name
      fullMethodName,
      args,
      () => {
        console.warn(
          `Static method not found: ${methodName} (mapped to ${fullMethodName})`
        );

        // Provide reasonable fallbacks for common methods
        if (methodName === "get_render_node") {
          return '{"type":"FallbackRenderNode"}' as T;
        }

        if (methodName === "render_to_canvas_element") {
          return undefined as T;
        }

        // Generic fallback
        return null as T;
      }
    );
  }

  /**
   * Scan WASM exports to map component constructors
   */
  private static mapConstructors(wasmModule: any, exports: string[]): void {
    // Define the core component types to look for
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

    // For each component type, find a matching export
    for (const type of componentTypes) {
      // Direct match
      if (typeof wasmModule[type] === "function") {
        this.constructorMap[type] = type;
        continue;
      }

      // Look for prefixed/namespaced variants
      const matchingExport = exports.find(
        (name) => name.endsWith(type) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.constructorMap[type] = matchingExport;
      }
    }
  }

  /**
   * Scan WASM exports to map factory methods
   */
  private static mapFactoryMethods(wasmModule: any, exports: string[]): void {
    // Define factory methods to look for
    const factoryMethods = [
      "create_heading",
      "create_paragraph",
      "create_avatar_image",
      "light_divider",
      "dark_divider",
      "create_primary_button",
    ];

    // For each factory method, find a matching export
    for (const method of factoryMethods) {
      // Direct match
      if (typeof wasmModule[method] === "function") {
        this.factoryMethodMap[method] = method;
        continue;
      }

      // Look for prefixed/namespaced variants
      const matchingExport = exports.find(
        (name) =>
          name.endsWith(method) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.factoryMethodMap[method] = matchingExport;
      }
    }
  }

  /**
   * Scan WASM exports to map static methods
   */
  private static mapStaticMethods(wasmModule: any, exports: string[]): void {
    // Define static methods to look for
    const staticMethods = ["render_to_canvas_element", "get_render_node"];

    // For each static method, find a matching export
    for (const method of staticMethods) {
      // Direct match
      if (typeof wasmModule[method] === "function") {
        this.staticMethodMap[method] = method;
        continue;
      }

      // Look for prefixed/namespaced variants
      const matchingExport = exports.find(
        (name) =>
          name.endsWith(method) && typeof wasmModule[name] === "function"
      );

      if (matchingExport) {
        this.staticMethodMap[method] = matchingExport;
      }
    }
  }

  /**
   * Convert camelCase to snake_case for method names
   */
  private static camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  /**
   * Ensure the connector is initialized
   */
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
