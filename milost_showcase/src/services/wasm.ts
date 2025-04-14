import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs/promises";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  setExternalWasmInstance,
} from "milost";
import config from "../config/index.js";
import logger from "../utils/logger.js";
import { WasmStatus } from "../types/index.js";

/**
 * Initialize the WASM module for MiLost
 */
export async function initializeWasm(): Promise<boolean> {
  try {
    const wasmJsUrl = pathToFileURL(config.wasm.jsPath).href;
    const wasmInitModule = await import(wasmJsUrl);
    const wasmInit = wasmInitModule.default;

    const binary = await fs.readFile(config.wasm.binaryPath);

    const instance = await wasmInit(binary);

    setExternalWasmInstance(instance);

    await initWasm({
      skipWasmLoading: true,
      debug: config.debug,
    });

    logger.info("WASM initialized successfully");

    if (config.debug) {
      const moduleExports = Object.keys(getWasmModule()).slice(0, 10);
      logger.debug({ exports: moduleExports }, "WASM exports sample");
    }

    return true;
  } catch (error) {
    logger.error({ error }, "Failed to initialize WASM");
    return false;
  }
}

/**
 * Get WASM status information
 */
export function getWasmStatus(): WasmStatus {
  return {
    initialized: isWasmInitialized(),
    exports: isWasmInitialized()
      ? Object.keys(getWasmModule()).slice(0, 10)
      : [],
  };
}
