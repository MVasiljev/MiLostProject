import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { WasmConnector } from "../../initWasm/wasm-connector.js";

async function ensureWasmInitialized(): Promise<void> {
  if (!isWasmInitialized()) {
    try {
      await initWasm();

      if (!WasmConnector.isInitialized()) {
        await WasmConnector.initialize();
      }
    } catch (error) {
      console.warn("WASM initialization failed:", error);
    }
  }
}

const useWasmRender = () => {
  const renderComponent = async (json: string) => {
    await ensureWasmInitialized();

    try {
      const resultJson = WasmConnector.callStaticMethod<string>(
        "get_render_node",
        [json]
      );

      return JSON.parse(resultJson);
    } catch (error) {
      console.error("Render error:", error);
      throw error;
    }
  };

  return { renderComponent };
};

export const renderComponent = async (json: string): Promise<any> => {
  const { renderComponent: render } = useWasmRender();
  return render(json);
};
