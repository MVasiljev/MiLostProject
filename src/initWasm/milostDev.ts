/**
 * MiLost development helper
 *
 * This file contains utilities to help with MiLost development and debugging.
 */

declare global {
  interface Window {
    __MILOST_DEBUG__?: boolean;
    __MILOST_CONFIG__?: {
      isDevelopment?: boolean;
      debug?: boolean;
      wasmBasePath?: string;
    };
  }
}

/**
 * Configure MiLost for development environment
 * Call this function before initializing MiLost
 */
export function configureMiLostForDevelopment(
  options: {
    wasmBasePath?: string;
    debug?: boolean;
  } = {}
) {
  const { wasmBasePath, debug = false } = options;

  if (typeof window !== "undefined") {
    if (!window.__MILOST_CONFIG__) {
      window.__MILOST_CONFIG__ = {};
    }

    window.__MILOST_CONFIG__.isDevelopment = true;
    window.__MILOST_CONFIG__.debug = debug;

    if (wasmBasePath) {
      window.__MILOST_CONFIG__.wasmBasePath = wasmBasePath;

      if (debug) {
        console.log(`MiLost configured with custom WASM path: ${wasmBasePath}`);
      }
    }

    if (debug) {
      console.log(
        "MiLost development configuration enabled",
        window.__MILOST_CONFIG__
      );
    }

    return true;
  }

  return false;
}

/**
 * Get the current MiLost configuration
 */
export function getMiLostConfig():
  | {
      isDevelopment?: boolean;
      debug?: boolean;
      wasmBasePath?: string;
    }
  | undefined {
  if (typeof window !== "undefined") {
    return window.__MILOST_CONFIG__;
  }
  return undefined;
}
