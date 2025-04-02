import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

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
