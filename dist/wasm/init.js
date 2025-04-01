let wasmModule = null;
let initialized = false;
let initPromise = null;
export async function initWasm() {
    if (initialized)
        return;
    if (initPromise)
        return initPromise;
    initPromise = (async () => {
        try {
            const wasm = await import("../../pkg/milost_wasm.js");
            await wasm.default();
            wasmModule = wasm;
            initialized = true;
            console.log("WASM initialized successfully");
        }
        catch (error) {
            console.error("Failed to initialize WASM:", error);
            throw error;
        }
    })();
    return initPromise;
}
export function getWasmModule() {
    if (!initialized) {
        throw new Error("WASM module not initialized. Call initWasm() first.");
    }
    return wasmModule;
}
export function isWasmInitialized() {
    return initialized;
}
//# sourceMappingURL=init.js.map