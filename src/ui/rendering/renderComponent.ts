import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";

export async function renderComponent(json: string): Promise<any> {
  if (!isWasmInitialized()) {
    await initWasm();
  }

  try {
    const resultJson = callWasmStaticMethod<string>(
      "get_render_node",
      "",
      [json],
      () => {
        throw new Error(
          "Failed to render component - WASM function unavailable"
        );
      }
    );

    return JSON.parse(resultJson);
  } catch (error) {
    console.error("Render error:", error);
    throw error;
  }
}
