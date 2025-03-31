import init, { Str as WasmStr, Vec as WasmVec } from "../../pkg/milost_wasm.js";

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = init().then(() => {
    initialized = true;
    console.log("WASM initialized successfully");
  });

  return initPromise;
}

export function ensureWasmInitialized(): void {
  if (!initialized && !initPromise) {
    throw new Error("WASM is not initialized. Call initWasm() first.");
  }
}

export { WasmStr, WasmVec };
