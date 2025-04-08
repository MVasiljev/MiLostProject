import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";
import { UI } from "../ui.js";
import { EventBus } from "./eventSystem.js";

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

    const wasm = getWasmModule();
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

    await wasm.render_to_canvas_element(canvasId, json);

    const renderNode = JSON.parse(await wasm.render_component(json));

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

function setupEventListeners(canvas: HTMLCanvasElement, renderNode: any): void {
  if (containsInteractiveElements(renderNode)) {
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedNode = findNodeAtPoint(renderNode, x, y);
      if (clickedNode && clickedNode.resolved_props.on_tap) {
        handleNodeClick(clickedNode);
      }
    });

    let longPressTimer: number | null = null;

    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      longPressTimer = window.setTimeout(() => {
        const node = findNodeAtPoint(renderNode, x, y);
        if (node && node.resolved_props.on_long_press) {
          const handlerId = node.resolved_props.on_long_press;
          EventBus.getInstance().trigger(handlerId, { x, y });
        }
      }, 500);
    });

    canvas.addEventListener("mouseup", () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    });
  }
}

function containsInteractiveElements(node: any): boolean {
  if (
    node.type_name === "Button" ||
    (node.resolved_props &&
      (node.resolved_props.on_tap || node.resolved_props.on_long_press))
  ) {
    return true;
  }

  if (node.children && node.children.length > 0) {
    return node.children.some((child: any) =>
      containsInteractiveElements(child)
    );
  }

  return false;
}

function findNodeAtPoint(node: any, x: number, y: number): any | null {
  const nodeX = parseFloat(node.resolved_props?.x || "0");
  const nodeY = parseFloat(node.resolved_props?.y || "0");
  const nodeWidth = parseFloat(node.resolved_props?.width || "0");
  const nodeHeight = parseFloat(node.resolved_props?.height || "0");

  const isInBounds =
    x >= nodeX &&
    x <= nodeX + nodeWidth &&
    y >= nodeY &&
    y <= nodeY + nodeHeight;

  if (!isInBounds) {
    return null;
  }

  if (node.children && node.children.length > 0) {
    const reversedChildren = [...node.children].reverse();

    for (const child of reversedChildren) {
      const hitChild = findNodeAtPoint(child, x, y);
      if (hitChild) {
        return hitChild;
      }
    }
  }

  if (
    node.type_name === "Button" ||
    node.resolved_props?.on_tap ||
    node.resolved_props?.on_long_press
  ) {
    return node;
  }

  return null;
}

function handleNodeClick(node: any): void {
  if (node.resolved_props.on_tap) {
    const handlerId = node.resolved_props.on_tap;
    EventBus.getInstance().trigger(handlerId, {});
  }
}
