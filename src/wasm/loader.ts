export interface WasmLoadOptions {
  path?: string;
  debug?: boolean;
  fallback?: () => any;
}

export async function loadWasmModule(
  options: WasmLoadOptions = {}
): Promise<WebAssembly.Exports | null> {
  const {
    path = "/wasm/milost.wasm",
    debug = false,
    fallback = () => null,
  } = options;

  if (debug) {
    console.log(`[WASM] Attempting to load module from: ${path}`);
  }

  if (typeof WebAssembly !== "object" || !WebAssembly.instantiateStreaming) {
    console.warn("[WASM] WebAssembly not supported");
    return fallback();
  }

  try {
    const response = await fetch(path, {
      headers: {
        Accept: "application/wasm,application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch WASM: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (debug) {
      console.log(`[WASM] Content-Type: ${contentType}`);
    }

    if (
      !contentType?.includes("application/wasm") &&
      !contentType?.includes("application/octet-stream")
    ) {
      throw new Error(`Invalid MIME type: ${contentType}`);
    }

    const module = await WebAssembly.instantiateStreaming(response, {
      env: {},
    });

    if (debug) {
      console.log("[WASM] Module loaded successfully");
    }

    return module.instance.exports;
  } catch (error) {
    console.error("[WASM] Initialization error:", error);

    try {
      const response = await fetch(path);
      const buffer = await response.arrayBuffer();
      const module = await WebAssembly.instantiate(buffer, {
        env: {},
      });

      return module.instance.exports;
    } catch (fallbackError) {
      console.error("[WASM] ArrayBuffer fallback failed:", fallbackError);
      return fallback();
    }
  }
}

export function isWasmSupported(): boolean {
  return (
    typeof WebAssembly === "object" &&
    typeof WebAssembly.instantiate === "function" &&
    typeof WebAssembly.compile === "function"
  );
}
