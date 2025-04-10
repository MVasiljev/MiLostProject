import { WasmConnector } from "../../initWasm/wasm-connector.js";
import { EventBus } from "./eventSystem.js";

const useNodeInteraction = () => {
  const findNodeAtPoint = (node: any, x: number, y: number): any | null => {
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
        const found = findNodeAtPoint(child, x, y);
        if (found) {
          return found;
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
  };

  const containsInteractiveElements = (node: any): boolean => {
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
  };

  const triggerNodeEvent = (
    node: any,
    eventType: string,
    coords?: { x: number; y: number }
  ) => {
    const handlerId = node.resolved_props[eventType];
    if (handlerId) {
      EventBus.getInstance().trigger(handlerId, coords || {});
    }
  };

  return {
    findNodeAtPoint,
    containsInteractiveElements,
    triggerNodeEvent,
  };
};

const useLongPressHandler = (
  canvas: HTMLCanvasElement,
  renderNode: any,
  findNodeAtPoint: (node: any, x: number, y: number) => any | null,
  triggerNodeEvent: (
    node: any,
    eventType: string,
    coords?: { x: number; y: number }
  ) => void
) => {
  let longPressTimer: number | null = null;
  let pressPosition: { x: number; y: number } | null = null;

  const startLongPressTracking = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pressPosition = { x, y };

    longPressTimer = window.setTimeout(() => {
      const handled = WasmConnector.callStaticMethod<boolean>("handle_event", [
        "long_press",
        x,
        y,
        null,
      ]);

      if (!handled && pressPosition) {
        const node = findNodeAtPoint(
          renderNode,
          pressPosition.x,
          pressPosition.y
        );
        if (node && node.resolved_props.on_long_press) {
          triggerNodeEvent(node, "on_long_press", { x, y });
        }
      }
    }, 500);
  };

  const cancelLongPressTracking = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    pressPosition = null;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (longPressTimer && pressPosition) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const dx = x - pressPosition.x;
      const dy = y - pressPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        cancelLongPressTracking();
      }
    }
  };

  return {
    startLongPressTracking,
    cancelLongPressTracking,
    handleMouseMove,
  };
};

export function setupEventListeners(
  canvas: HTMLCanvasElement,
  renderNode: any
): void {
  const { findNodeAtPoint, containsInteractiveElements, triggerNodeEvent } =
    useNodeInteraction();

  const { startLongPressTracking, cancelLongPressTracking, handleMouseMove } =
    useLongPressHandler(canvas, renderNode, findNodeAtPoint, triggerNodeEvent);

  const hasInteractiveElements = containsInteractiveElements(renderNode);

  if (hasInteractiveElements) {
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const handled = WasmConnector.callStaticMethod<boolean>("handle_event", [
        "tap",
        x,
        y,
        null,
      ]);

      if (!handled) {
        const clickedNode = findNodeAtPoint(renderNode, x, y);
        if (clickedNode?.resolved_props?.on_tap) {
          triggerNodeEvent(clickedNode, "on_tap");
        }
      }
    });

    canvas.addEventListener("mousedown", startLongPressTracking);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", cancelLongPressTracking);
    canvas.addEventListener("mouseleave", cancelLongPressTracking);
  }
}
