/**
 * Framework-specific configuration for MiLost WebAssembly
 *
 * This module provides utilities for configuring MiLost WebAssembly
 * in different frameworks and build systems.
 */

import { configureMiLostForDevelopment } from "./milostDev.js";
import { initWasm as initializeWasm } from "./registry.js";

/**
 * Framework configuration options for MiLost
 */
export interface MiLostFrameworkOptions {
  wasmBasePath?: string;
  debug?: boolean;
  framework?: "webpack" | "vite" | "nextjs" | "rollup" | "custom";
}

let initialized = false;

declare const __webpack_public_path__: string | undefined;

type WasmInitFn = (input?: RequestInfo | URL) => Promise<any>;

async function loadWasmRuntime(): Promise<{
  initWasm: WasmInitFn;
  wasmUrl: string;
}> {
  // Dynamically import WASM JS glue and binary URL
  const initWasm = (await import("milost/wasm/milost_wasm.js")).default;
  // @ts-expect-error: dynamically available after build
  const wasmUrl = (await import("milost/wasm/milost_wasm_bg.wasm?url")).default;

  return { initWasm, wasmUrl };
}

/**
 * Configure the WebAssembly path based on your build system
 */
export function configureMiLostForFramework(
  options: MiLostFrameworkOptions = {}
): void {
  const { wasmBasePath, debug = false, framework = "custom" } = options;

  if (typeof window !== "undefined") {
    if (!window.__MILOST_CONFIG__) {
      window.__MILOST_CONFIG__ = {};
    }
    window.__MILOST_CONFIG__.framework = framework;
  }

  if (debug) {
    console.log(`Configuring MiLost for ${framework} environment`);
  }

  let detectedPath = wasmBasePath;

  if (framework === "vite") {
    if (debug) {
      console.log("Using Vite configuration for MiLost WebAssembly");
      console.log(
        'Make sure to add { assetsInclude: ["**/*.wasm"] } to your vite.config.js'
      );
    }

    if (!detectedPath) {
      detectedPath = "/node_modules/milost/dist/wasm";
    }
  } else if (framework === "webpack") {
    if (debug) {
      console.log("Using Webpack configuration for MiLost WebAssembly");
      console.log(
        'Make sure to add { test: /\\.wasm$/, type: "asset/resource" } to your webpack.config.js module rules'
      );
    }

    if (!detectedPath && typeof __webpack_public_path__ !== "undefined") {
      detectedPath = __webpack_public_path__ + "wasm";
    } else if (!detectedPath) {
      detectedPath = "/dist/wasm";
    }
  } else if (framework === "nextjs") {
    if (debug) {
      console.log("Using Next.js configuration for MiLost WebAssembly");
      console.log(
        "Make sure to enable WebAssembly via config.experiments.asyncWebAssembly in next.config.js"
      );
    }

    if (!detectedPath) {
      detectedPath = "/wasm";
    }
  } else if (framework === "rollup") {
    if (debug) {
      console.log("Using Rollup configuration for MiLost WebAssembly");
      console.log("Use @rollup/plugin-wasm to support .wasm files");
    }

    if (!detectedPath) {
      detectedPath = "/dist/wasm";
    }
  }

  configureMiLostForDevelopment({ wasmBasePath: detectedPath, debug });

  if (typeof window !== "undefined" && window.__MILOST_CONFIG__) {
    window.__MILOST_CONFIG__.originalWasmPath = wasmBasePath;
  }
}

/**
 * Automatically initializes MiLost WebAssembly using framework-aware paths
 */
export async function setupMiLostFramework(
  options: MiLostFrameworkOptions = {}
): Promise<boolean> {
  if (initialized) {
    if (options.debug) {
      console.debug("MiLost WASM already initialized");
    }
    return true;
  }

  try {
    if (options.debug) {
      console.debug("⏳ Initializing MiLost WASM...");
    }

    const { initWasm, wasmUrl } = await loadWasmRuntime();

    if (options.framework !== "vite") {
      configureMiLostForFramework(options);
    } else {
      configureMiLostForDevelopment({
        wasmBasePath: wasmUrl,
        debug: options.debug ?? false,
      });
    }

    if (options.debug) {
      console.debug("Resolved wasmUrl:", wasmUrl);
    }

    await initWasm(wasmUrl);

    const success = await initializeWasm({
      wasmPath: wasmUrl,
      throwOnError: false,
      debug: options.debug ?? false,
    });

    initialized = success;
    return success;
  } catch (err) {
    console.error("❌ MiLost WASM initialization failed:", err);
    return false;
  }
}

/**
 * Get the recommended WebAssembly file path based on the current framework
 */
export function getFrameworkWasmPath(
  preferredPath?: string
): string | undefined {
  if (preferredPath) {
    return preferredPath;
  }

  if (typeof window !== "undefined" && window.__MILOST_CONFIG__) {
    const framework = window.__MILOST_CONFIG__.framework;
    const basePath = window.__MILOST_CONFIG__.wasmBasePath;

    if (basePath) {
      return `${basePath}/milost_wasm_bg.wasm`;
    }

    if (framework === "vite") {
      return "/node_modules/milost/dist/wasm/milost_wasm_bg.wasm";
    } else if (framework === "webpack") {
      return "/dist/wasm/milost_wasm_bg.wasm";
    } else if (framework === "nextjs") {
      return "/wasm/milost_wasm_bg.wasm";
    }
  }

  return "./milost_wasm_bg.wasm";
}
