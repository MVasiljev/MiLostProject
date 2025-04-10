import { WasmConnector } from "../../initWasm/wasm-connector.js";
import { initWasm, isWasmInitialized } from "../../initWasm/init.js";

export abstract class Component<T> {
  protected async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed:`, error);
      }
    }
  }

  abstract build(): Promise<T>;

  protected createWasmBuilder<B>(className: string, ...args: any[]): B {
    try {
      return WasmConnector.createComponent<B>(className, args);
    } catch (error) {
      console.warn(`WASM builder creation failed for ${className}:`, error);
      throw error;
    }
  }

  protected async safeWasmOperation<R>(
    operation: () => Promise<R> | R,
    fallback: () => R
  ): Promise<R> {
    try {
      if (!isWasmInitialized()) {
        await initWasm();
      }
      return await Promise.resolve(operation());
    } catch (error) {
      console.warn("WASM operation failed:", error);
      return fallback();
    }
  }
}
