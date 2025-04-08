let wasmModule: any = null;
let initialized = false;
let initializing = false;
let initPromise: Promise<void> | null = null;
let initError: Error | null = null;

export async function initWasm(): Promise<void> {
  if (initialized) return;
  if (initializing) return initPromise!;

  initializing = true;

  initPromise = (async () => {
    try {
      const wasm = await import("../../pkg/milost_wasm.js");
      await wasm.default();
      wasmModule = wasm;
      initialized = true;
    } catch (error) {
      initError = error as Error;
      initialized = false;
      initializing = false;
      throw error;
    } finally {
      initializing = false;
    }
  })();

  return initPromise;
}

export function getWasmModule(): any {
  if (!initialized) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  return wasmModule;
}

export function isWasmInitialized(): boolean {
  return initialized;
}

export function getWasmError(): Error | null {
  return initError;
}

export function resetWasmState(): void {
  wasmModule = null;
  initialized = false;
  initializing = false;
  initPromise = null;
  initError = null;
}

export async function ensureWasmInitialized(): Promise<boolean> {
  if (initialized) return true;

  try {
    await initWasm();
    return true;
  } catch (error) {
    return false;
  }
}
