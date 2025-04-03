import { Task } from "../../concurrency/task.js";
import { AppError } from "../../core/error.js";
import { Ok, Err } from "../../core/result.js";
import { Patterns } from "../../patterns/matching.js";
import { u32 } from "../../types/primitives.js";
import { Str } from "../../types/string.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";
import { renderNodeTree } from "../dsl/renderNodeTree.js";
import type { UI } from "../ui.js";

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

    function renderWithMiLostTask(
      component: UI,
      mountPoint: HTMLElement,
      width?: u32,
      height?: u32
    ): Task<void, AppError> {
      return Task.new(async (_signal) => {
        try {
          await MiLost({
            component,
            mountPoint,
            width,
            height,
          });

          return Ok(undefined);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "string"
              ? err
              : "Unknown error";

          return Err(
            new AppError(Str.fromRaw(`MiLost render failed: ${message}`))
          );
        }
      });
    }

    const resultTask = renderWithMiLostTask(
      component as unknown as UI,
      document.body
    );

    resultTask.run().then(async (result) => {
      await Patterns.match(result, {
        Ok: () => {
          console.log("✅ MiLost successfully rendered.");
        },
        Err: (err) => {
          console.error("❌ Rendering failed:", Str.fromRaw(err.message));
        },
      });
    });
  } catch (err) {
    console.error("Failed to mount MiLost component:", err);
  }
}

function containsInteractiveElements(node: any): boolean {
  if (
    node.type_name === "Button" ||
    (node.resolved_props && node.resolved_props.on_tap)
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

function setupEventListeners(canvas: HTMLCanvasElement, renderNode: any): void {
  const hasInteractiveElements = containsInteractiveElements(renderNode);

  if (hasInteractiveElements) {
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedNode = findNodeAtPoint(renderNode, x, y);
      if (clickedNode && clickedNode.resolved_props.on_tap) {
        handleNodeClick(clickedNode);
      }
    });
  }
}

function findNodeAtPoint(node: any, x: number, y: number): any | null {
  const nodeX = parseFloat(node.resolved_props.x || "0");
  const nodeY = parseFloat(node.resolved_props.y || "0");
  const nodeWidth = parseFloat(node.resolved_props.width || "0");
  const nodeHeight = parseFloat(node.resolved_props.height || "0");

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

  if (node.type_name === "Button" || node.resolved_props.on_tap) {
    return node;
  }

  return null;
}

function handleNodeClick(node: any): void {
  if (node.resolved_props.on_tap) {
    try {
      const handlerName = node.resolved_props.on_tap;

      const handler = (window as any)[handlerName];

      if (typeof handler === "function") {
        handler();
      } else {
        console.warn(`Handler function '${handlerName}' not found`);
      }
    } catch (err) {
      console.error("Error executing click handler:", err);
    }
  }
}
