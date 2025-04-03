import { Task } from "../../concurrency/task.js";
import { AppError } from "../../core/error.js";
import { Ok, Err } from "../../core/result.js";
import { Patterns } from "../../patterns/matching.js";
import { u32 } from "../../types/index.js";
import { Str } from "../../types/string.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";
import { MiLost } from "./MiLostRenderer.js";
import { UI } from "../ui.js";

export async function renderComponent(json: string): Promise<any> {
  if (!isWasmInitialized()) {
    await initWasm();
  }

  const wasm = getWasmModule();

  try {
    const result = wasm.render_component(json);
    return JSON.parse(result);
  } catch (error) {
    console.error("Render error:", error);
    throw error;
  }
}
