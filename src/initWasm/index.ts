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
} from "./registry.js";

export {
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
} from "./lib.js";

export { configureMiLostForDevelopment, getMiLostConfig } from "./milostDev.js";

export { initWasm as default } from "./registry.js";
