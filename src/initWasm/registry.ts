/**
 * WebAssembly Module Registry for MiLost
 *
 * This module provides a central registry for all modules that need
 * WebAssembly initialization. It coordinates the initialization process
 * and provides access to the loaded WASM module.
 */

import { loadWasmModule } from "./init.js";

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
} {
  return {
    isInitialized,
    registeredModules: modules.map((m) => m.name),
    initializedModules,
  };
}

/**
 * Get the WASM module instance
 * @returns The WASM module or null if not initialized
 */
export function getWasmModule(): any {
  return wasmModuleInstance;
}

/**
 * Check if the WASM module is initialized
 * @returns True if the WASM module is initialized
 */
export function isWasmInitialized(): boolean {
  return isInitialized && wasmModuleInstance !== null;
}

/**
 * Initialize all registered modules
 * @param options Configuration options
 * @returns Promise that resolves to true if all modules were initialized successfully
 */
export async function initWasm(
  options: { throwOnError?: boolean } = {}
): Promise<boolean> {
  if (isInitialized) {
    console.log("WASM already initialized");
    return true;
  }

  console.log(`Initializing WASM with ${modules.length} registered modules...`);

  try {
    wasmModuleInstance = await loadWasmModule();

    if (!wasmModuleInstance) {
      console.warn(
        "Core WASM module loading failed, falling back to JS for all modules"
      );
      fallbackAllModules();
      isInitialized = true;
      return false;
    }

    console.log("Core WASM module loaded successfully");

    console.log("Available WASM exports:");
    const exports = Object.keys(wasmModuleInstance).slice(0, 20);
    console.log(exports.join(", "));
    if (Object.keys(wasmModuleInstance).length > 20) {
      console.log(
        `...and ${Object.keys(wasmModuleInstance).length - 20} more exports`
      );
    }

    initializedModules = [];
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
      })
    );

    isInitialized = true;
    const success = results.every(Boolean);

    if (success) {
      console.log("All modules initialized successfully with WASM");
    } else {
      console.log(
        `${initializedModules.length}/${modules.length} modules initialized with WASM`
      );
    }

    return success;
  } catch (error) {
    console.error("Fatal error during WASM initialization:", error);

    fallbackAllModules();
    isInitialized = true;

    if (options.throwOnError) {
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
