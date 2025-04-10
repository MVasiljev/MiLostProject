import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../../initWasm/init.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";
import { UI } from "../ui.js";
import { setupEventListeners } from "./setupEventListeners.js";

export interface MiLostRendererOptions {
  component: UI | string;
  mountPoint: HTMLElement;
  width?: number;
  height?: number;
}

export async function MiLost({
  component,
  mountPoint,
  width = window.innerWidth || 800,
  height = window.innerHeight || 600,
}: MiLostRendererOptions): Promise<void> {
  try {
    if (!isWasmInitialized()) {
      await initWasm();
    }

    const json = typeof component === "string" ? component : component.toJSON();

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

    await callWasmStaticMethod(
      "render_to_canvas_element",
      "",
      [canvasId, json, width, height],
      () => {
        throw new Error("Failed to render component to canvas");
      }
    );

    const renderNodeJson = await callWasmStaticMethod<string>(
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
  } catch (err) {
    console.error("Failed to mount MiLost component:", err);
  }
}

export function mountMiLostRenderer(
  options: MiLostRendererOptions
): Promise<void> {
  return MiLost(options);
}
