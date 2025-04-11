/**
 * Core WebAssembly module loader for MiLost
 * This module handles the low-level loading of the WASM module
 * from various possible paths.
 */

import initWasmLoader from "../wasm/milost_wasm.js";
import wasmUrl from "../wasm/milost_wasm_bg.wasm";

let wasmModule: any = null;
let initialized = false;
let loadPromise: Promise<any> | null = null;

const possiblePaths = [
  "./wasm/milost_wasm.js",
  "./milost_wasm.js",
  "../wasm/milost_wasm.js",
  "../milost_wasm.js",
  "/wasm/milost_wasm.js",
  "/milost_wasm.js",
  "milost/dist/initWasm/wasm/milost_wasm.js",
  "milost/dist/wasm/milost_wasm.js",
  "node_modules/milost/dist/initWasm/wasm/milost_wasm.js",
];

/**
 * Initialize WASM with proper MIME type handling
 */
async function loadWasmWithMimeFallback(): Promise<any> {
  try {
    console.log(`Loading WASM from URL: ${wasmUrl}`);
    return await initWasmLoader({ url: wasmUrl });
  } catch (error) {
    console.warn(
      "WASM streaming initialization failed, falling back to ArrayBuffer method:",
      error
    );

    const response = await fetch(wasmUrl as unknown as string);
    const wasmBytes = await response.arrayBuffer();

    return await initWasmLoader({ wasmBinary: wasmBytes });
  }
}

/**
 * Loads the WebAssembly module from one of the possible paths.
 * This is an internal function used by the registry.
 *
 * @returns A Promise that resolves to the loaded WASM module
 */
export async function loadWasmModule(): Promise<any> {
  if (initialized && wasmModule) return wasmModule;
  if (loadPromise) return loadPromise;

  console.log("Loading core WASM module...");

  loadPromise = (async () => {
    try {
      const wasm = await loadWasmWithMimeFallback();

      wasmModule = wasm;
      initialized = true;

      console.log("WASM module loaded successfully!");
      return wasm;
    } catch (error) {
      console.error("Failed to load WASM module:", error);

      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}
