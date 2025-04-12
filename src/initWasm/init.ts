/**
 * Core WebAssembly module loader for MiLost
 * This module handles the low-level loading of the WASM module
 * from various possible paths.
 */

let wasmModule: any = null;
let initialized = false;
let loadPromise: Promise<any> | null = null;

const isDevelopment =
  process.env.NODE_ENV === "development" ||
  (typeof window !== "undefined" && window.location?.hostname === "localhost");

const possiblePaths = [
  "./wasm/milost_wasm.js",
  "./milost_wasm.js",
  "../wasm/milost_wasm.js",
  "../milost_wasm.js",
  "/wasm/milost_wasm.js",
  "/milost_wasm.js",
  "milost/dist/initWasm/wasm/milost_wasm.js",
  "milost/dist/wasm/milost_wasm.js",
  "node_modules/milost/dist/initWasm/wasm/milost_wasm.js",
];

const developmentPaths = [
  "./node_modules/milost/dist/wasm/milost_wasm.js",
  "../../milost/dist/wasm/milost_wasm.js",
  "../../node_modules/milost/dist/wasm/milost_wasm.js",
  "../../../milost/dist/wasm/milost_wasm.js",
];

function getBaseUrl(): string {
  if (typeof document !== "undefined") {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes("milost")) {
        const lastSlash = src.lastIndexOf("/");
        if (lastSlash >= 0) {
          return src.substring(0, lastSlash + 1);
        }
      }
    }
  }
  return "";
}

/**
 * Loads the WebAssembly module from one of the possible paths.
 * This is an internal function used by the registry.
 *
 * @param customPath Optional custom path to try first
 * @returns A Promise that resolves to the loaded WASM module
 */
export async function loadWasmModule(customPath?: string): Promise<any> {
  if (initialized && wasmModule) return wasmModule;
  if (loadPromise) return loadPromise;

  console.log("Loading core WASM module...");

  const config =
    typeof window !== "undefined" ? window.__MILOST_CONFIG__ : undefined;
  const isDev =
    config?.isDevelopment ||
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      window.location?.hostname === "localhost");

  let allPaths: string[] = [];

  if (customPath) {
    allPaths.push(customPath);
  }

  if (config?.wasmBasePath) {
    allPaths.push(`${config.wasmBasePath}/milost_wasm.js`);
    allPaths.push(`${config.wasmBasePath}/wasm/milost_wasm.js`);
  }

  const baseUrl = getBaseUrl();
  if (baseUrl) {
    allPaths.push(`${baseUrl}wasm/milost_wasm.js`);
    allPaths.push(`${baseUrl}milost_wasm.js`);
  }

  allPaths = [
    ...allPaths,
    ...possiblePaths,
    ...(isDev ? developmentPaths : []),
  ];

  console.log("Environment:", isDev ? "Development" : "Production");
  console.log("Trying paths:", allPaths);

  loadPromise = (async () => {
    let lastError: Error | null = null;

    for (const path of allPaths) {
      try {
        console.log(`Attempting to load WASM from: ${path}`);
        let wasm;

        try {
          wasm = await import(path);
        } catch (importError) {
          console.warn(`Dynamic import failed for ${path}:`, importError);

          if (typeof fetch === "function" && typeof WebAssembly === "object") {
            try {
              const wasmPath = path.replace(".js", ".wasm");
              console.log(`Trying direct WebAssembly fetch from: ${wasmPath}`);

              const response = await fetch(wasmPath);
              if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

              const wasmBytes = await response.arrayBuffer();
              const wasmResult = await WebAssembly.instantiate(wasmBytes);

              wasm = wasmResult.instance.exports;
              console.log(
                `Successfully loaded WASM via fetch from: ${wasmPath}`
              );
            } catch (fetchError) {
              console.warn(`WebAssembly fetch failed for ${path}:`, fetchError);
              throw fetchError;
            }
          } else {
            throw importError;
          }
        }

        if (wasm && (wasm.default || wasm.__esModule)) {
          console.log(`Found WASM module at: ${path}`);

          if (typeof wasm.default === "function") {
            console.log("Initializing module with default function");
            await wasm.default();
          } else if (typeof wasm.initWasm === "function") {
            console.log("Initializing module with initWasm function");
            await wasm.initWasm();
          } else {
            console.log(
              "No initialization function found, assuming module is self-initializing"
            );
          }

          wasmModule = wasm;
          initialized = true;

          console.log("WASM module loaded. Available exports:");
          const exports = Object.keys(wasm);
          exports.slice(0, 20).forEach((name) => console.log(`- ${name}`));

          if (exports.length > 20) {
            console.log(`...and ${exports.length - 20} more exports`);
          }

          return wasm;
        } else if (wasm) {
          console.log(`Found direct WASM exports at: ${path}`);
          wasmModule = wasm;
          initialized = true;

          console.log("WASM module loaded. Available exports:");
          const exports = Object.keys(wasm);
          exports.slice(0, 20).forEach((name) => console.log(`- ${name}`));

          if (exports.length > 20) {
            console.log(`...and ${exports.length - 20} more exports`);
          }

          return wasm;
        } else {
          console.warn(
            `Module found at ${path}, but it doesn't have expected structure`
          );
        }
      } catch (error) {
        console.warn(`Failed to load WASM from path: ${path}`);
        lastError = error as Error;
      }
    }

    const errorMsg = `Failed to load WASM module. Tried paths: ${allPaths.join(
      ", "
    )}. Last error: ${lastError?.message || "Unknown error"}`;
    console.error(errorMsg);

    loadPromise = null;
    throw new Error(errorMsg);
  })();

  return loadPromise;
}
