// src/wasm/init.ts

// We'll create a variable to hold the wasm module once initialized
let wasmModule: any = null;
let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the WASM module
 */
export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Import the WASM module dynamically
      const wasm = await import("../../pkg/milost_wasm.js");

      // Initialize the WASM module
      await wasm.default();

      // Store the initialized module
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

/**
 * Get the WASM module
 * Only available after initialization
 */
export function getWasmModule(): any {
  if (!initialized) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  return wasmModule;
}

/**
 * Check if WASM is initialized
 */
export function isWasmInitialized(): boolean {
  return initialized;
}
