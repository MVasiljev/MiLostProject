import {
  initWasm as internalInitWasm,
  setExternalWasmInstance,
} from "./registry.js";

/**
 * Automatically initialize WASM for both Node.js and browser environments
 *
 * This method detects the runtime, loads the appropriate WASM binary or glue code,
 * registers it via setExternalWasmInstance, and calls internalInitWasm() to complete setup.
 *
 * Consumers can simply call: `await initWasm();`
 */
export async function initWasm(
  options: {
    debug?: boolean;
    skipWasmLoading?: boolean;
    forceJsFallback?: boolean;
    resetIfInitialized?: boolean;
  } = {}
): Promise<boolean> {
  const {
    debug = false,
    skipWasmLoading = false,
    forceJsFallback = false,
    resetIfInitialized = false,
  } = options;

  const isNode = typeof process !== "undefined" && !!process.versions?.node;
  const isBrowser =
    typeof window !== "undefined" && typeof fetch !== "undefined";

  if (!isNode && !isBrowser) {
    console.error("Unsupported environment for WASM initialization");
    return false;
  }

  try {
    if (isNode && !forceJsFallback) {
      const path = await import("path");
      const fs = await import("fs/promises");
      const { fileURLToPath, pathToFileURL } = await import("url");

      const currentFile = fileURLToPath(import.meta.url);
      const currentDir = path.dirname(currentFile);

      const wasmBinaryPath = path.resolve(
        currentDir,
        "../../dist/wasm/milost_wasm_bg.wasm"
      );
      const wasmJsPath = path.resolve(
        currentDir,
        "../../dist/wasm/milost_wasm.js"
      );

      const wasmInit = (await import(pathToFileURL(wasmJsPath).href)).default;
      const wasmBinary = await fs.readFile(wasmBinaryPath);
      const instance = await wasmInit(wasmBinary);

      setExternalWasmInstance(instance);

      return await internalInitWasm({
        debug,
        skipWasmLoading: true,
        resetIfInitialized,
        forceJsFallback,
      });
    }

    if (isBrowser && !forceJsFallback) {
      const isDev =
        typeof import.meta === "object" &&
        typeof (import.meta as any).env === "object" &&
        (import.meta as any).env.DEV === true;

      let wasmInit: any;
      let wasmBinary: ArrayBuffer;

      if (isDev) {
        const wasmJsUrl = "/wasm/milost_wasm.js";
        const wasmBinaryUrl = "/wasm/milost_wasm_bg.wasm";

        wasmInit = (await import(/* @vite-ignore */ wasmJsUrl)).default;
        wasmBinary = await fetch(wasmBinaryUrl).then((r) => r.arrayBuffer());
      } else {
        const wasmJsUrl = new URL(
          "../../dist/wasm/milost_wasm.js",
          import.meta.url
        ).href;
        const wasmBinaryUrl = new URL(
          "../../dist/wasm/milost_wasm_bg.wasm",
          import.meta.url
        ).href;

        wasmInit = (await import(wasmJsUrl)).default;
        wasmBinary = await fetch(wasmBinaryUrl).then((r) => r.arrayBuffer());
      }

      const instance = await wasmInit(wasmBinary);
      setExternalWasmInstance(instance);

      return await internalInitWasm({
        debug,
        skipWasmLoading: true,
        resetIfInitialized,
        forceJsFallback,
      });
    }

    return await internalInitWasm({
      debug,
      skipWasmLoading,
      resetIfInitialized,
      forceJsFallback: true,
    });
  } catch (err) {
    console.error("initWasm() failed:", err);
    return false;
  }
}
