import { Task } from "../../concurrency/task.js";
import { Ok, Err } from "../../core/result.js";
import { Str } from "../../types/string.js";
import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";
import { setupEventListeners } from "./setupEventListeners.js";
import { AppError } from "../../core/error.js";
import { MiLostRendererOptions } from "./MiLostRenderer.js";

const useWasmRenderTask = () => {
  const initializeWasm = async () => {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.error("WASM initialization failed:", error);
        throw error;
      }
    }
  };

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
      await callWasmStaticMethod(
        "render_to_canvas_element",
        "",
        [canvasId, json, width, height],
        () => {
          throw new Error("Failed to render component to canvas");
        }
      );
    } catch (error) {
      console.error("Canvas rendering failed:", error);
      throw error;
    }
  };

  const getRenderNode = async (json: string) => {
    try {
      const renderNodeJson = await callWasmStaticMethod<string>(
        "get_render_node",
        "",
        [json],
        () => {
          throw new Error("Failed to get render node");
        }
      );

      return JSON.parse(renderNodeJson);
    } catch (error) {
      console.error("Render node retrieval failed:", error);
      throw error;
    }
  };

  return {
    initializeWasm,
    createRenderCanvas,
    createMetadataContainer,
    renderToCanvas,
    getRenderNode,
  };
};

export function renderWithMiLostTask(
  options: MiLostRendererOptions
): Task<void, AppError> {
  return Task.new(async (_signal) => {
    const {
      initializeWasm,
      createRenderCanvas,
      createMetadataContainer,
      renderToCanvas,
      getRenderNode,
    } = useWasmRenderTask();

    try {
      await initializeWasm();

      const {
        component,
        mountPoint,
        width = window.innerWidth || 800,
        height = window.innerHeight || 600,
      } = options;

      const json =
        typeof component === "string" ? component : component.toJSON();

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

      return Ok(undefined);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Unknown error";
      return Err(new AppError(Str.fromRaw(`MiLost render failed: ${message}`)));
    }
  });
}
