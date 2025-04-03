import { Task } from "../../concurrency";
import { AppError, Ok, Err } from "../../core";
import { Str } from "../../types";
import { isWasmInitialized, initWasm, getWasmModule } from "../../wasm/init";
import { UI } from "../ui";
import { setupEventListeners } from "./setupEventListeners";

export interface MiLostRendererOptions {
  component: UI | string;
  mountPoint: HTMLElement;
  width?: number;
  height?: number;
}

export function renderWithMiLostTask(
  options: MiLostRendererOptions
): Task<void, AppError> {
  return Task.new(async (_signal) => {
    try {
      if (!isWasmInitialized()) {
        await initWasm();
      }

      const wasm = getWasmModule();
      const {
        component,
        mountPoint,
        width = window.innerWidth || 800,
        height = window.innerHeight || 600,
      } = options;

      const json =
        typeof component === "string" ? component : JSON.stringify(component);

      mountPoint.innerHTML = "";

      const canvasId = `milost-canvas-${Date.now()}`;
      const canvas = document.createElement("canvas");
      canvas.id = canvasId;
      canvas.width = width;
      canvas.height = height;
      canvas.style.display = "block";
      mountPoint.appendChild(canvas);

      const metadataContainer = document.createElement("div");
      metadataContainer.setAttribute("data-rendered-by", "milost");
      metadataContainer.style.display = "none";
      mountPoint.appendChild(metadataContainer);

      await wasm.render_to_canvas_element(canvasId, json);

      const renderNode = JSON.parse(await wasm.render_component(json));
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
