import { loadWasmModule } from "./init.js";
import "./types";
// @ts-expect-error: This import exists after WASM build
import * as glue from "milost/dist/wasm/milost_wasm.js";
/**
 * Interface for modules that need WASM initialization
 */
export interface WasmModule {
  /** Name of the module for logging and status reporting */
  name: string;

  /**
   * Initialize the module with the WASM module
   * Should throw an error if initialization fails
   */
  initialize(wasmModule: any): void;

  /**
   * Fall back to JavaScript implementation
   * Called when WASM initialization fails or is not available
   */
  fallback(): void;
}

const modules: WasmModule[] = [];
let isInitialized = false;
let isInitializing = false;
let wasmModuleInstance: any = null;
let initializedModules: string[] = [];
let initializationError: Error | null = null;

let externalWasmInstance: any = null;

/**
 * Set an externally initialized WASM instance for modules to use
 * This is used when the WASM is loaded via the bootstrap process
 */
export function setExternalWasmInstance(instance: any): void {
  if (instance && typeof instance === "object") {
    externalWasmInstance = instance;
    console.log("External WASM instance registered");
  } else {
    console.warn("Invalid external WASM instance provided");
  }
}

/**
 * Register a module for initialization
 * @param module The module to register
 */
export function registerModule(module: WasmModule): void {
  if (!modules.find((m) => m.name === module.name)) {
    modules.push(module);
    console.log(`Registered WASM module: ${module.name}`);
  }
}

/**
 * Get the initialization status of registered modules
 * @returns Object with initialization status details
 */
export function getInitializationStatus(): {
  isInitialized: boolean;
  registeredModules: string[];
  initializedModules: string[];
  error: Error | null;
} {
  return {
    isInitialized,
    registeredModules: modules.map((m) => m.name),
    initializedModules,
    error: initializationError,
  };
}

/**
 * Get the WASM module instance
 * @returns The WASM module or null if not initialized
 */
export function getWasmModule(): any {
  return wasmModuleInstance || externalWasmInstance;
}

/**
 * Check if the WASM module is initialized
 * @returns True if the WASM module is initialized
 */
export function isWasmInitialized(): boolean {
  return (
    isInitialized &&
    (wasmModuleInstance !== null || externalWasmInstance !== null)
  );
}

/**
 * Reset the WASM initialization state
 * This allows re-initialization, especially useful during development
 */
export function resetWasmInitialization(): void {
  if (isInitializing) {
    console.warn("Cannot reset while initialization is in progress");
    return;
  }

  isInitialized = false;
  wasmModuleInstance = null;
  initializedModules = [];
  initializationError = null;
  console.log("WASM initialization state reset");
}

/**
 * Initialize all registered modules
 * @param options Configuration options
 * @returns Promise that resolves to true if all modules were initialized successfully
 */
export async function initWasm(
  options: {
    throwOnError?: boolean;
    wasmPath?: string;
    debug?: boolean;
    skipWasmLoading?: boolean;
    forceJsFallback?: boolean;
    resetIfInitialized?: boolean;
    wasmBinary?: ArrayBuffer;
  } = {}
): Promise<boolean> {
  const {
    throwOnError = false,
    wasmPath,
    debug = false,
    skipWasmLoading = false,
    forceJsFallback = false,
    resetIfInitialized = false,
    wasmBinary,
  } = options;

  if (isInitialized && resetIfInitialized) {
    console.log("Resetting previous WASM initialization");
    resetWasmInitialization();
  } else if (isInitialized) {
    console.log("WASM already initialized");
    return true;
  }

  if (isInitializing) {
    console.log("WASM initialization already in progress");
    return false;
  }

  isInitializing = true;
  console.log(`Initializing WASM with ${modules.length} registered modules...`);

  if (debug && typeof window !== "undefined") {
    window.__MILOST_DEBUG__ = true;
  }

  try {
    if (!forceJsFallback && glue && Object.keys(glue).length > 0) {
      setExternalWasmInstance(glue);
    }
    if (forceJsFallback) {
      console.log("Forcing JavaScript fallbacks for all modules");
      wasmModuleInstance = null;
    } else if (skipWasmLoading && externalWasmInstance) {
      console.log("Using externally provided WASM instance");
      wasmModuleInstance = externalWasmInstance;
    } else if (wasmBinary) {
      console.log("Using provided WASM binary buffer");
      try {
        const imports = { env: {}, wasi_snapshot_preview1: {} };
        const result = await WebAssembly.instantiate(wasmBinary, imports);
        wasmModuleInstance = result.instance.exports;
        console.log("Successfully instantiated WASM from provided binary");
      } catch (instantiateError) {
        console.error(
          "Failed to instantiate WASM from binary:",
          instantiateError
        );
        throw instantiateError;
      }
    } else {
      wasmModuleInstance = await loadWasmModule(wasmPath);
    }

    if (!wasmModuleInstance && !forceJsFallback) {
      console.warn(
        "Core WASM module loading failed, falling back to JS for all modules"
      );
      await fallbackAllModules();
      isInitialized = true;
      isInitializing = false;
      initializationError = new Error("Core WASM module loading failed");
      return false;
    }

    if (!forceJsFallback) {
      console.log("Core WASM module loaded successfully");

      if (debug) {
        console.log("Available WASM exports:");
        const exports = Object.keys(wasmModuleInstance).slice(0, 20);
        console.log(exports.join(", "));
        if (Object.keys(wasmModuleInstance).length > 20) {
          console.log(
            `...and ${Object.keys(wasmModuleInstance).length - 20} more exports`
          );
        }
      }
    }

    initializedModules = [];

    if (forceJsFallback) {
      await Promise.all(
        modules.map(async (module) => {
          try {
            module.fallback();
            console.log(`Using JavaScript fallback for module: ${module.name}`);
          } catch (fallbackError) {
            console.error(
              `Error in fallback for module ${module.name}:`,
              fallbackError
            );
          }
        })
      );
    } else {
      const initPromises = modules.map(async (module) => {
        try {
          console.log(`Initializing module: ${module.name}`);
          await module.initialize(wasmModuleInstance);
          initializedModules.push(module.name);
          console.log(
            `Successfully initialized module: ${module.name} with WASM`
          );
          return true;
        } catch (error) {
          console.warn(`WASM initialization failed for ${module.name}:`, error);
          try {
            module.fallback();
            console.log(`Using JavaScript fallback for module: ${module.name}`);
          } catch (fallbackError) {
            console.error(
              `Error in fallback for module ${module.name}:`,
              fallbackError
            );
          }
          return false;
        }
      });

      await Promise.all(initPromises);
    }

    isInitialized = true;
    isInitializing = false;

    const success =
      forceJsFallback || initializedModules.length === modules.length;

    if (success && !forceJsFallback) {
      console.log("All modules initialized successfully with WASM");
    } else if (!forceJsFallback) {
      console.log(
        `${initializedModules.length}/${modules.length} modules initialized with WASM`
      );
    }

    initializationError = null;
    return success;
  } catch (error) {
    console.error("Fatal error during WASM initialization:", error);

    await fallbackAllModules();
    isInitialized = true;
    isInitializing = false;
    initializationError = error as Error;

    if (throwOnError) {
      throw error;
    }

    return false;
  }
}

/**
 * Private helper to fall back all modules to JavaScript
 */
async function fallbackAllModules(): Promise<void> {
  await Promise.all(
    modules.map(async (module) => {
      try {
        module.fallback();
        console.log(`Using JavaScript fallback for module: ${module.name}`);
      } catch (fallbackError) {
        console.error(
          `Error in fallback for module ${module.name}:`,
          fallbackError
        );
      }
    })
  );
  initializedModules = [];
}
