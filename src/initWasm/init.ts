/**
 * WebAssembly initialization for MiLost
 *
 * This module handles loading and initializing the WebAssembly module,
 * handling various browser compatibility issues and MIME type problems.
 */

import "./types.js";

/**
 * Checks if a path is a data URI
 * @param {string} uri The URI to check
 * @returns {boolean} True if the URI is a data URI
 */
function isDataURI(uri: string): boolean {
  return String(uri).startsWith("data:");
}

/**
 * Fetch WebAssembly binary as an ArrayBuffer, handling MIME type issues
 * @param {string} url The URL to fetch
 * @returns {Promise<ArrayBuffer>} The WebAssembly binary as an ArrayBuffer
 */
async function fetchWasmBinary(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        Accept: "application/wasm,application/octet-stream,*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error(`Failed to fetch WebAssembly binary from ${url}:`, error);
    throw error;
  }
}

/**
 * Determine the WebAssembly file path based on configuration
 *
 * This preserves the existing path configuration logic while adding
 * additional fallbacks and debug information.
 *
 * @param {string | undefined} wasmPath Optional custom path to the WASM file
 * @returns {string} The resolved path to the WASM file
 */
function resolveWasmPath(wasmPath?: string): string {
  if (wasmPath) {
    return wasmPath;
  }
  return "./dist/wasm/milost_wasm_bg.wasm";
}

/**
 * Instantiate WebAssembly module from ArrayBuffer
 * @param {ArrayBuffer} wasmBinary The WebAssembly binary
 * @param {Record<string, any>} imports The imports object for the module
 * @returns {Promise<WebAssembly.Instance>} The instantiated WebAssembly module
 */
async function instantiateArrayBuffer(
  wasmBinary: ArrayBuffer,
  imports: Record<string, any>
): Promise<WebAssembly.Instance> {
  try {
    const source = new Uint8Array(wasmBinary);
    if (
      source.length < 8 ||
      source[0] !== 0x00 ||
      source[1] !== 0x61 ||
      source[2] !== 0x73 ||
      source[3] !== 0x6d
    ) {
      throw new Error("Invalid WebAssembly binary: magic number not found");
    }

    const result = await WebAssembly.instantiate(source, imports);
    return result.instance;
  } catch (error) {
    console.error("Failed to instantiate WebAssembly module:", error);
    throw error;
  }
}

/**
 * Load the WebAssembly module
 * @param {string | undefined} wasmPath Optional custom path to the wasm file
 * @returns {Promise<any>} The WebAssembly module instance
 */
export async function loadWasmModule(wasmPath?: string): Promise<any> {
  const resolvedPath = resolveWasmPath(wasmPath);
  const debug =
    typeof window !== "undefined" &&
    (window.__MILOST_DEBUG__ ||
      (window.__MILOST_CONFIG__ && window.__MILOST_CONFIG__.debug));

  if (debug) {
    console.log(`Loading WebAssembly module from: ${resolvedPath}`);
  }

  try {
    const imports: Record<string, Record<string, any>> = {
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
          if (debug) {
            console.warn(
              `Failed to fetch WebAssembly module: ${response.status} ${response.statusText}`
            );
          }
          throw new Error(
            `Failed to fetch WebAssembly module: ${response.status}`
          );
        }

        const contentType = response.headers.get("Content-Type");
        if (debug) {
          console.log(`Received Content-Type: ${contentType}`);
        }

        if (
          !contentType ||
          (!contentType.includes("application/wasm") &&
            !contentType.includes("application/octet-stream"))
        ) {
          if (debug) {
            console.warn(
              "Incorrect MIME type for WebAssembly, falling back to ArrayBuffer instantiation"
            );
          }

          const responseClone = response.clone();
          const wasmBinary = await responseClone.arrayBuffer();
          return await instantiateArrayBuffer(wasmBinary, imports);
        }

        const result = await WebAssembly.instantiateStreaming(
          response,
          imports
        );
        return result.instance;
      } catch (error) {
        if (debug) {
          console.warn("WebAssembly streaming instantiation failed:", error);
          console.log("Falling back to ArrayBuffer instantiation");
        }
      }
    }

    if (debug) {
      console.log("Using ArrayBuffer instantiation");
    }

    const wasmBinary = await fetchWasmBinary(resolvedPath);
    return await instantiateArrayBuffer(wasmBinary, imports);
  } catch (error) {
    console.error("Failed to load WebAssembly module:", error);
    return null;
  }
}

/**
 * Check if WebAssembly is supported in the current environment
 * @returns {boolean} True if WebAssembly is supported
 */
export function isWasmSupported(): boolean {
  return (
    typeof WebAssembly === "object" &&
    typeof WebAssembly.instantiate === "function" &&
    typeof WebAssembly.compile === "function"
  );
}
