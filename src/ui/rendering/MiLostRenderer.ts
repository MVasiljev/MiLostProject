import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { WasmConnector } from "../../initWasm/wasm-connector.js";
import { UI } from "../ui.js";
import { setupEventListeners } from "./setupEventListeners.js";

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

const useWasmRenderer = () => {
  const createRenderCanvas = (width: number, height: number) => {
    const canvasId = `milost-canvas-${Date.now()}`;
    const canvas = document.createElement("canvas");
    canvas.id = canvasId;
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = "block";
    return { canvasId, canvas };
  };

  const createMetadataContainer = () => {
    const container = document.createElement("div");
    container.setAttribute("data-rendered-by", "milost");
    container.style.display = "none";
    return container;
  };

  const renderToCanvas = async (
    canvasId: string,
    json: string,
    width: number,
    height: number
  ) => {
    try {
      WasmConnector.callStaticMethod("render_to_canvas_element", [
        canvasId,
        json,
        width,
        height,
      ]);
    } catch (error) {
      console.error("Canvas rendering failed:", error);
      throw error;
    }
  };

  const getRenderNode = async (json: string) => {
    try {
      const renderNodeJson = WasmConnector.callStaticMethod<string>(
        "get_render_node",
        [json]
      );

      return JSON.parse(renderNodeJson);
    } catch (error) {
      console.error("Render node retrieval failed:", error);
      throw error;
    }
  };

  return {
    createRenderCanvas,
    createMetadataContainer,
    renderToCanvas,
    getRenderNode,
  };
};

export const MiLost = async ({
  component,
  mountPoint,
  width = window.innerWidth || 800,
  height = window.innerHeight || 600,
}: {
  component: UI | string;
  mountPoint: HTMLElement;
  width?: number;
  height?: number;
}) => {
  try {
    await ensureWasmInitialized();

    const {
      createRenderCanvas,
      createMetadataContainer,
      renderToCanvas,
      getRenderNode,
    } = useWasmRenderer();

    const json = typeof component === "string" ? component : component.toJSON();

    mountPoint.innerHTML = "";

    const { canvasId, canvas } = createRenderCanvas(width, height);
    mountPoint.appendChild(canvas);

    const metadataContainer = createMetadataContainer();
    mountPoint.appendChild(metadataContainer);

    await renderToCanvas(canvasId, json, width, height);

    const renderNode = await getRenderNode(json);

    metadataContainer.setAttribute(
      "data-render-node",
      JSON.stringify(renderNode)
    );

    setupEventListeners(canvas, renderNode);
  } catch (err) {
    console.error("Failed to mount MiLost component:", err);
  }
};

export interface MiLostRendererOptions {
  component: UI | string;
  mountPoint: HTMLElement;
  width?: number;
  height?: number;
}

export const mountMiLostRenderer = (options: MiLostRendererOptions) =>
  MiLost(options);
