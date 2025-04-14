import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs/promises";
import os from "os";
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

let initializationTime: Date | null = null;
let initializationDuration: number | null = null;

const moduleStatus: Record<
  string,
  {
    initialized: boolean;
    available: boolean;
    methods?: string[];
    error?: string;
  }
> = {
  Struct: { initialized: false, available: false },
  Vec: { initialized: false, available: false },
  Str: { initialized: false, available: false },
  Tuple: { initialized: false, available: false },
  Result: { initialized: false, available: false },
  Option: { initialized: false, available: false },
};

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
      for (const moduleName of Object.keys(moduleStatus)) {
        const moduleExists =
          typeof wasmModule[moduleName] === "function" ||
          typeof wasmModule[moduleName] === "object";

        moduleStatus[moduleName].available = moduleExists;
        moduleStatus[moduleName].initialized =
          isWasmInitialized() && moduleExists;

        if (moduleExists) {
          try {
            const methods: string[] = [];

            if (typeof wasmModule[moduleName] === "function") {
              Object.getOwnPropertyNames(wasmModule[moduleName])
                .filter(
                  (name) =>
                    typeof wasmModule[moduleName][name] === "function" &&
                    name !== "constructor"
                )
                .forEach((name) => methods.push(`${name} (static)`));

              try {
                let instance;
                switch (moduleName) {
                  case "Struct":
                    instance = new wasmModule.Struct.from({});
                    break;
                  case "Vec":
                    instance = new wasmModule.Vec.from([]);
                    break;
                  case "Str":
                    instance = new wasmModule.Str.fromRaw("");
                    break;
                  case "Tuple":
                    instance = new wasmModule.Tuple.from(0, "");
                    break;
                  default:
                    break;
                }

                if (instance) {
                  Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
                    .filter(
                      (name) =>
                        typeof instance[name] === "function" &&
                        name !== "constructor"
                    )
                    .forEach((name) => methods.push(name));
                }
              } catch (error) {}
            } else if (
              typeof wasmModule[moduleName] === "object" &&
              wasmModule[moduleName] !== null
            ) {
              Object.getOwnPropertyNames(wasmModule[moduleName])
                .filter(
                  (name) => typeof wasmModule[moduleName][name] === "function"
                )
                .forEach((name) => methods.push(name));
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

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)} seconds`;
  } else {
    return `${(ms / 60000).toFixed(2)} minutes`;
  }
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
