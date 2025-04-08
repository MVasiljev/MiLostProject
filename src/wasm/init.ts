let wasmModule: any = null;
let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const wasm = await import("../../pkg/milost_wasm.js");

      await wasm.default();

      wasmModule = wasm;
      initialized = true;

      console.log("WASM initialized successfully");
    } catch (error) {
      console.error("Failed to initialize WASM:", error);
      throw error;
    }
  })();

  return initPromise;
}

export function getWasmModule(): any {
  if (!initialized) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  return wasmModule;
}

export function isWasmInitialized(): boolean {
  return initialized;
}
