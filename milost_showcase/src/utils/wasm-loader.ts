import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs/promises";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  setExternalWasmInstance,
} from "milost";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const wasmBinaryPath = path.resolve(
  dirname,
  "../../node_modules/milost/dist/wasm/milost_wasm_bg.wasm"
);
const wasmJsPath = path.resolve(
  dirname,
  "../../node_modules/milost/dist/wasm/milost_wasm.js"
);

export async function loadWasm() {
  try {
    console.log(`Loading WASM from: ${wasmBinaryPath}`);
    console.log(`Loading JS from: ${wasmJsPath}`);

    const wasmInit = (await import(pathToFileURL(wasmJsPath).href)).default;

    const binary = await fs.readFile(wasmBinaryPath);

    const instance = await wasmInit(binary);

    setExternalWasmInstance(instance);

    await initWasm({
      skipWasmLoading: true,
      debug: true,
    });

    console.log("✅ WASM Initialized:", isWasmInitialized());
    console.log("📦 Exports:", Object.keys(getWasmModule()).slice(0, 10));

    return {
      isInitialized: isWasmInitialized(),
      exports: Object.keys(getWasmModule()),
    };
  } catch (error) {
    console.error("❌ Error initializing WASM:", error);
    throw error;
  }
}

export function getWasmStatus() {
  return {
    isInitialized: isWasmInitialized(),
    exports: isWasmInitialized()
      ? Object.keys(getWasmModule()).slice(0, 10)
      : [],
  };
}
