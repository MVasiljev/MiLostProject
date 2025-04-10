import { Task } from "../../concurrency/task.js";
import { Ok, Err } from "../../core/result.js";
import { Str } from "../../types/string.js";
import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";
import { UI } from "../ui.js";
import { setupEventListeners } from "./setupEventListeners.js";
import { AppError } from "../../core/error.js";

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

      const {
        component,
        mountPoint,
        width = window.innerWidth || 800,
        height = window.innerHeight || 600,
      } = options;

      const json =
        typeof component === "string" ? component : component.toJSON();

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

      callWasmStaticMethod(
        "render_to_canvas_element",
        "",
        [canvasId, json, width, height],
        () => {
          throw new Error("Failed to render component to canvas");
        }
      );

      const renderNodeJson = callWasmStaticMethod<string>(
        "get_render_node",
        "",
        [json],
        () => {
          throw new Error("Failed to get render node");
        }
      );

      const renderNode = JSON.parse(renderNodeJson);

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
