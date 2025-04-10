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
  // Vite-specific paths
  "milost/dist/initWasm/wasm/milost_wasm.js",
  "milost/dist/wasm/milost_wasm.js",
  // Absolute import paths
  "node_modules/milost/dist/initWasm/wasm/milost_wasm.js",
];

export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let lastError: Error | null = null;

    for (const path of possiblePaths) {
      try {
        const wasm = await import(/* @vite-ignore */ path);

        if (wasm && (wasm.default || wasm.__esModule)) {
          if (typeof wasm.default === "function") {
            await wasm.default();
          } else if (typeof wasm.initWasm === "function") {
            await wasm.initWasm();
          }

          wasmModule = wasm;
          initialized = true;
          return;
        }
      } catch (error) {
        console.warn(`Failed to load WASM from path: ${path}`, error);
        lastError = error as Error;
      }
    }

    throw new Error(
      `Failed to initialize WASM module. Tried paths: ${possiblePaths.join(
        ", "
      )}. Last error: ${lastError?.message || "Unknown error"}`
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
