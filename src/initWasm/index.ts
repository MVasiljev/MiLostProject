import { initWasm, getWasmModule, isWasmInitialized } from "./init.js";
import {
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
} from "./lib.js";

export {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
};
