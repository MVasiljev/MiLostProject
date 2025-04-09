let wasmModule: any = null;
let initialized = false;
let initPromise: Promise<void> | null = null;

const possiblePaths = [
  "./wasm/milost_wasm.js",
  "./milost_wasm.js",
  "../wasm/milost_wasm.js",
  "../milost_wasm.js",
  "/wasm/milost_wasm.js",
  "/milost_wasm.js",
];

export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let lastError: Error | null = null;

    for (const path of possiblePaths) {
      try {
        // Dynamically import the WASM module
        const wasm = await import(/* @vite-ignore */ path);
        if (wasm && wasm.default) {
          await wasm.default(); // Initialize the WASM module
          wasmModule = wasm;
          initialized = true;
          return;
        }
      } catch (error) {
        lastError = error as Error;
      }
    }

    // If all paths fail, throw the last encountered error
    throw new Error(
      `Failed to initialize WASM module. Last error: ${
        lastError?.message || "Unknown error"
      }`
    );
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
