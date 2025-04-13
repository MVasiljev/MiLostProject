/**
 * WebAssembly Integration for MiLost
 *
 * This module exports all the functions needed to work with WebAssembly in MiLost.
 * It coordinates the initialization of WASM modules and provides utilities for
 * working with WASM instances.
 */
export {
  initWasm,
  registerModule,
  getInitializationStatus,
  isWasmInitialized,
  getWasmModule,
  WasmModule,
  resetWasmInitialization,
  setExternalWasmInstance,
} from "./registry.js";

export {
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
} from "./lib.js";

export { configureMiLostForDevelopment, getMiLostConfig } from "./milostDev.js";

export { isWasmSupported } from "./init.js";

export { initWasm as default } from "./registry.js";

export type { MiLostConfig } from "./types.js";
