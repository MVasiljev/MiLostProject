/**
 * Core WebAssembly module loader for MiLost
 * This module handles the low-level loading of the WASM module
 * from various possible paths.
 */

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
 * Loads the WebAssembly module from one of the possible paths.
 * This is an internal function used by the registry.
 *
 * @returns A Promise that resolves to the loaded WASM module
 */
export async function loadWasmModule(): Promise<any> {
  if (initialized && wasmModule) return wasmModule;

  if (loadPromise) return loadPromise;

  console.log("Loading core WASM module...");
  console.log("Trying paths:", possiblePaths);

  loadPromise = (async () => {
    let lastError: Error | null = null;

    for (const path of possiblePaths) {
      try {
        console.log(`Attempting to load WASM from: ${path}`);
        const wasm = await import(path);

        if (wasm && (wasm.default || wasm.__esModule)) {
          console.log(`Found WASM module at: ${path}`);

          if (typeof wasm.default === "function") {
            console.log("Initializing module with default function");
            await wasm.default();
          } else if (typeof wasm.initWasm === "function") {
            console.log("Initializing module with initWasm function");
            await wasm.initWasm();
          } else {
            console.log(
              "No initialization function found, assuming module is self-initializing"
            );
          }

          wasmModule = wasm;
          initialized = true;

          console.log("WASM module loaded. Available exports:");
          const exports = Object.keys(wasm);
          exports.slice(0, 20).forEach((name) => console.log(`- ${name}`));

          if (exports.length > 20) {
            console.log(`...and ${exports.length - 20} more exports`);
          }

          return wasm;
        } else {
          console.warn(
            `Module found at ${path}, but it doesn't have expected structure`
          );
        }
      } catch (error) {
        console.warn(`Failed to load WASM from path: ${path}`, error);
        lastError = error as Error;
      }
    }

    const errorMsg = `Failed to load WASM module. Tried paths: ${possiblePaths.join(
      ", "
    )}. Last error: ${lastError?.message || "Unknown error"}`;
    console.error(errorMsg);

    loadPromise = null;
    throw new Error(errorMsg);
  })();

  return loadPromise;
}
