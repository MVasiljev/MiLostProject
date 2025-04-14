import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs/promises";
import os from "os";
import path from "path";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  setExternalWasmInstance,
} from "milost";
import logger from "../utils/logger.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

let initializationTime: Date | null = null;
let initializationDuration: number | null = null;

const moduleStatus: Record<
  string,
  {
    initialized: boolean;
    available: boolean;
    methods?: { static: string[]; instance: string[] };
    error?: string;
  }
> = {};

export async function initializeWasm(): Promise<boolean> {
  try {
    const startTime = performance.now();
    initializationTime = new Date();

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

    const wasmModule = getWasmModule();
    const endTime = performance.now();
    initializationDuration = endTime - startTime;

    if (wasmModule) {
      for (const moduleName of Object.keys(wasmModule)) {
        const mod = wasmModule[moduleName];
        const moduleExists =
          typeof mod === "function" || typeof mod === "object";

        moduleStatus[moduleName] = {
          initialized: isWasmInitialized() && moduleExists,
          available: moduleExists,
        };

        if (moduleExists) {
          try {
            const methods = {
              static: [] as string[],
              instance: [] as string[],
            };

            // Collect static methods
            if (typeof mod === "function") {
              Object.getOwnPropertyNames(mod)
                .filter(
                  (name) =>
                    typeof mod[name] === "function" && name !== "constructor"
                )
                .forEach((name) => methods.static.push(name));
            } else if (typeof mod === "object" && mod !== null) {
              Object.getOwnPropertyNames(mod)
                .filter((name) => typeof mod[name] === "function")
                .forEach((name) => methods.static.push(name));
            }

            // Try to create an instance and get instance methods
            try {
              let testInstance: any = null;

              if (typeof mod === "function") {
                if (typeof mod.from === "function") {
                  testInstance = mod.from([]);
                } else if (typeof mod.fromRaw === "function") {
                  testInstance = mod.fromRaw("");
                } else {
                  try {
                    testInstance = new mod();
                  } catch {}
                }
              }

              if (testInstance) {
                Object.getOwnPropertyNames(Object.getPrototypeOf(testInstance))
                  .filter(
                    (name) =>
                      typeof testInstance[name] === "function" &&
                      name !== "constructor"
                  )
                  .forEach((name) => methods.instance.push(name));
              }
            } catch (e) {
              moduleStatus[moduleName].error =
                `Instance method detection failed: ${e}`;
            }

            moduleStatus[moduleName].methods = methods;
          } catch (error) {
            moduleStatus[moduleName].error =
              error instanceof Error ? error.message : String(error);
          }
        }
      }

      logger.info("WASM initialized successfully");
      const moduleExports = Object.keys(wasmModule).slice(0, 10);
      logger.debug({ exports: moduleExports }, "WASM exports sample");
    }

    return true;
  } catch (error) {
    logger.error({ error }, "Failed to initialize WASM");
    return false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)} seconds`;
  return `${(ms / 60000).toFixed(2)} minutes`;
}

export function getWasmStatus() {
  const initialized = isWasmInitialized();
  const exports = initialized ? Object.keys(getWasmModule()) : [];

  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem()),
    uptime: formatUptime(os.uptime()),
  };

  return {
    initialized,
    exports,
    modules: moduleStatus,
    system: systemInfo,
    initTime: initializationTime ? initializationTime.toISOString() : undefined,
    timeToInit: initializationDuration
      ? formatDuration(initializationDuration)
      : undefined,
  };
}
