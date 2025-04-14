import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs/promises";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  setExternalWasmInstance,
} from "milost";
import logger from "../utils/logger.js";
import path from "path";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export async function initializeWasm(): Promise<boolean> {
  try {
    const wasmBinaryPath = path.resolve(
      dirname,
      "../../node_modules/milost/dist/wasm/milost_wasm_bg.wasm"
    );
    const wasmJsPath = path.resolve(
      dirname,
      "../../node_modules/milost/dist/wasm/milost_wasm.js"
    );

    const wasmInit = (await import(pathToFileURL(wasmJsPath).href)).default;
    const binary = await fs.readFile(wasmBinaryPath);
    const instance = await wasmInit(binary);

    setExternalWasmInstance(instance);

    await initWasm({
      skipWasmLoading: true,
      debug: true,
    });

    logger.info("WASM initialized successfully");

    const moduleExports = Object.keys(getWasmModule()).slice(0, 10);
    logger.debug({ exports: moduleExports }, "WASM exports sample");

    return true;
  } catch (error) {
    logger.error({ error }, "Failed to initialize WASM");
    return false;
  }
}

export function getWasmStatus() {
  return {
    initialized: isWasmInitialized(),
    exports: isWasmInitialized()
      ? Object.keys(getWasmModule()).slice(0, 10)
      : [],
  };
}
