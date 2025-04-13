import { WasmModule } from "./registry";

interface WasmInitOptions {
  wasmPath?: string;
  debug?: boolean;
  throwOnError?: boolean;
}

/**
 * Enhanced WebAssembly loader that properly handles different instantiation methods
 * and provides comprehensive error handling
 */
export async function enhancedWasmLoader(
  options: WasmInitOptions = {}
): Promise<any> {
  const { wasmPath, debug = false, throwOnError = false } = options;

  const resolvedPath = resolveWasmPath(wasmPath);

  if (debug) {
    console.log(`Loading WebAssembly module from: ${resolvedPath}`);
  }

  try {
    const imports = {
      env: {},
      wasi_snapshot_preview1: {},
    };

    if (
      typeof WebAssembly.instantiateStreaming === "function" &&
      !isDataURI(resolvedPath)
    ) {
      try {
        if (debug) {
          console.log("Using WebAssembly.instantiateStreaming");
        }

        const response = await fetch(resolvedPath, {
          credentials: "same-origin",
          headers: {
            Accept: "application/wasm,application/octet-stream,*/*",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch WebAssembly module: ${response.status}`
          );
        }

        await verifyWasmResponse(response.clone(), debug);

        const result = await WebAssembly.instantiateStreaming(
          response,
          imports
        );
        return result.instance.exports;
      } catch (streamingError) {
        if (debug) {
          console.warn(
            "WebAssembly streaming instantiation failed:",
            streamingError
          );
          console.log("Falling back to ArrayBuffer instantiation");
        }
      }
    }

    if (debug) {
      console.log("Using ArrayBuffer instantiation");
    }

    const response = await fetch(resolvedPath, {
      credentials: "same-origin",
      headers: {
        Accept: "application/wasm,application/octet-stream,*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch WebAssembly module: ${response.status}`);
    }

    const wasmBinary = await response.arrayBuffer();

    verifyWasmBinary(wasmBinary, debug);

    const result = await WebAssembly.instantiate(wasmBinary, imports);
    return result.instance.exports;
  } catch (error) {
    console.error("Failed to load WebAssembly module:", error);

    if (throwOnError) {
      throw error;
    }

    return null;
  }
}

/**
 * Verify that the WASM binary is valid before instantiation
 */
function verifyWasmBinary(binary: ArrayBuffer, debug = false): void {
  const bytes = new Uint8Array(binary);

  if (bytes.length < 8) {
    throw new Error("WebAssembly binary too small");
  }

  if (
    bytes[0] !== 0x00 ||
    bytes[1] !== 0x61 ||
    bytes[2] !== 0x73 ||
    bytes[3] !== 0x6d
  ) {
    const magicHex = Array.from(bytes.slice(0, 4))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

    if (debug) {
      console.error(
        `Invalid WebAssembly binary: found ${magicHex} instead of 00 61 73 6d`
      );

      const hexDump = Array.from(bytes.slice(0, 32))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");
      console.error(`First 32 bytes: ${hexDump}`);
    }

    throw new Error("Invalid WebAssembly binary: magic number not found");
  }

  if (debug) {
    console.log("WebAssembly binary verification passed");
  }
}

/**
 * Verify fetched WASM response before instantiation
 */
async function verifyWasmResponse(
  response: Response,
  debug = false
): Promise<void> {
  const contentType = response.headers.get("Content-Type");

  if (debug) {
    console.log(`Received Content-Type: ${contentType}`);
  }

  if (
    !contentType ||
    (!contentType.includes("application/wasm") &&
      !contentType.includes("application/octet-stream"))
  ) {
    console.warn(`Unexpected MIME type for WebAssembly: ${contentType}`);
  }

  const buffer = await response.arrayBuffer();
  verifyWasmBinary(buffer, debug);
}

/**
 * Checks if a path is a data URI
 */
function isDataURI(uri: string): boolean {
  return String(uri).startsWith("data:");
}

/**
 * Determine the WebAssembly file path based on configuration
 */
function resolveWasmPath(wasmPath?: string): string {
  if (wasmPath) {
    return wasmPath;
  }

  if (typeof window !== "undefined" && window.__MILOST_CONFIG__) {
    const config = window.__MILOST_CONFIG__;

    if (config.wasmBasePath) {
      return `${config.wasmBasePath}/milost_wasm_bg.wasm`;
    }
  }

  return "./milost_wasm_bg.wasm";
}

/**
 * Direct initialization of the WASM module without the JS glue code
 */
export async function directWasmInit(
  wasmUrl: string,
  debug = false
): Promise<any> {
  if (debug) {
    console.log("Initializing WASM directly from binary URL:", wasmUrl);
  }

  try {
    const response = await fetch(wasmUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch WebAssembly binary: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    verifyWasmBinary(buffer, debug);

    const result = await WebAssembly.instantiate(buffer, {
      env: {},
      wasi_snapshot_preview1: {},
    });

    if (debug) {
      console.log("WASM module initialized successfully");
    }

    return result.instance.exports;
  } catch (error) {
    console.error("Direct WASM initialization failed:", error);
    throw error;
  }
}

/**
 * Initialize a list of WASM modules with proper error handling
 */
export async function initializeWasmModules(
  wasmInstance: any,
  modules: WasmModule[],
  debug = false
): Promise<string[]> {
  const initializedModules: string[] = [];

  if (!wasmInstance) {
    if (debug) {
      console.warn(
        "No WASM instance provided, all modules will use JS fallback"
      );
    }

    modules.forEach((module) => {
      try {
        module.fallback();
        if (debug) {
          console.log(`Using JavaScript fallback for module: ${module.name}`);
        }
      } catch (error) {
        console.error(`Error in fallback for module ${module.name}:`, error);
      }
    });

    return initializedModules;
  }

  for (const module of modules) {
    try {
      if (debug) {
        console.log(`Initializing module: ${module.name}`);
      }

      await module.initialize(wasmInstance);
      initializedModules.push(module.name);

      if (debug) {
        console.log(
          `Successfully initialized module: ${module.name} with WASM`
        );
      }
    } catch (error) {
      console.warn(`WASM initialization failed for ${module.name}:`, error);

      try {
        module.fallback();
        if (debug) {
          console.log(`Using JavaScript fallback for module: ${module.name}`);
        }
      } catch (fallbackError) {
        console.error(
          `Error in fallback for module ${module.name}:`,
          fallbackError
        );
      }
    }
  }

  return initializedModules;
}
