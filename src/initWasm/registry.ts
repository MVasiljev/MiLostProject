// src/initWasm/registry.ts
import { loadWasmModule } from "./init.js";
import "./types";

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
let wasmModuleInstance: any = null;
let initializedModules: string[] = [];
let initializationError: Error | null = null;

// Save external WASM instance if provided by bootstrapper
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
  modules.push(module);
  console.log(`Registered WASM module: ${module.name}`);
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
  } = {}
): Promise<boolean> {
  const {
    throwOnError = false,
    wasmPath,
    debug = false,
    skipWasmLoading = false,
    forceJsFallback = false,
  } = options;

  if (isInitialized) {
    console.log("WASM already initialized");
    return true;
  }

  console.log(`Initializing WASM with ${modules.length} registered modules...`);

  if (debug && typeof window !== "undefined") {
    window.__MILOST_DEBUG__ = true;
  }

  try {
    // Use externally provided WASM instance or load one
    if (forceJsFallback) {
      console.log("Forcing JavaScript fallbacks for all modules");
      wasmModuleInstance = null;
    } else if (skipWasmLoading) {
      console.log("Using externally provided WASM instance");
      wasmModuleInstance = externalWasmInstance;
    } else {
      wasmModuleInstance = await loadWasmModule(wasmPath);
    }

    if (!wasmModuleInstance && !forceJsFallback) {
      console.warn(
        "Core WASM module loading failed, falling back to JS for all modules"
      );
      fallbackAllModules();
      isInitialized = true;
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
      // Initialize all modules with fallbacks
      modules.forEach((module) => {
        try {
          module.fallback();
          console.log(`Using JavaScript fallback for module: ${module.name}`);
        } catch (fallbackError) {
          console.error(
            `Error in fallback for module ${module.name}:`,
            fallbackError
          );
        }
      });
    } else {
      // Initialize modules with WASM
      const results = await Promise.all(
        modules.map(async (module) => {
          try {
            console.log(`Initializing module: ${module.name}`);
            await module.initialize(wasmModuleInstance);
            initializedModules.push(module.name);
            console.log(
              `Successfully initialized module: ${module.name} with WASM`
            );
            return true;
          } catch (error) {
            console.warn(
              `WASM initialization failed for ${module.name}:`,
              error
            );
            try {
              module.fallback();
              console.log(
                `Using JavaScript fallback for module: ${module.name}`
              );
            } catch (fallbackError) {
              console.error(
                `Error in fallback for module ${module.name}:`,
                fallbackError
              );
            }
            return false;
          }
        })
      );
    }

    isInitialized = true;
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

    fallbackAllModules();
    isInitialized = true;
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
function fallbackAllModules(): void {
  modules.forEach((module) => {
    try {
      module.fallback();
      console.log(`Using JavaScript fallback for module: ${module.name}`);
    } catch (fallbackError) {
      console.error(
        `Error in fallback for module ${module.name}:`,
        fallbackError
      );
    }
  });
  initializedModules = [];
}
