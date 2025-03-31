import init, { Str as WasmStr, Vec as WasmVec } from "../../pkg/milost_wasm.js";
let initialized = false;
let initPromise = null;
export async function initWasm() {
    if (initialized)
        return;
    if (initPromise)
        return initPromise;
    initPromise = init().then(() => {
        initialized = true;
        console.log("WASM initialized successfully");
    });
    return initPromise;
}
export function ensureWasmInitialized() {
    if (!initialized && !initPromise) {
        throw new Error("WASM is not initialized. Call initWasm() first.");
    }
}
export { WasmStr, WasmVec };
