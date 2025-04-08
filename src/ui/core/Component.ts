import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";

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
}
