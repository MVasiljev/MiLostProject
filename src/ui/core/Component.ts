import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { createWasmInstance } from "../../initWasm/lib.js";

export abstract class Component<T> {
  protected constructor() {
    if (!isWasmInitialized()) {
      throw new Error(
        "WASM module not initialized. Please call initWasm() first."
      );
    }
  }

  abstract build(): Promise<T>;

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
  }

  protected createWasmBuilder<B>(className: string, ...args: any[]): B {
    return createWasmInstance<B>(className, args, () => {
      throw new Error(`Failed to create WASM instance of ${className}`);
    });
  }
}
