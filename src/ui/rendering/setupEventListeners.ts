import { EventBus } from "./eventSystem.js";
import { callWasmStaticMethod } from "../../initWasm/lib.js";

export function setupEventListeners(
  canvas: HTMLCanvasElement,
  renderNode: any
): void {
  const hasInteractiveElements = containsInteractiveElements(renderNode);

  if (hasInteractiveElements) {
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const handled = callWasmStaticMethod<boolean>(
        "WebRenderer",
        "handle_event",
        ["tap", x, y, null],
        () => false
      );

      if (!handled) {
        const clickedNode = findNodeAtPoint(renderNode, x, y);
        if (clickedNode?.resolved_props?.on_tap) {
          handleNodeClick(clickedNode);
        }
      }
    });

    let longPressTimer: number | null = null;
    let pressPosition: { x: number; y: number } | null = null;

    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      pressPosition = { x, y };

      longPressTimer = window.setTimeout(() => {
        const handled = callWasmStaticMethod<boolean>(
          "WebRenderer",
          "handle_event",
          ["long_press", x, y, null],
          () => false
        );

        if (!handled && pressPosition) {
          const node = findNodeAtPoint(
            renderNode,
            pressPosition.x,
            pressPosition.y
          );
          if (node && node.resolved_props.on_long_press) {
            const handlerId = node.resolved_props.on_long_press;
            EventBus.getInstance().trigger(handlerId, { x, y });
          }
        }
      }, 500);
    });

    canvas.addEventListener("mousemove", (event) => {
      if (longPressTimer && pressPosition) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dx = x - pressPosition.x;
        const dy = y - pressPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
          pressPosition = null;
        }
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      pressPosition = null;
    });

    canvas.addEventListener("mouseleave", () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      pressPosition = null;
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
}

function handleNodeClick(node: any): void {
  if (node.resolved_props.on_tap) {
    const handlerId = node.resolved_props.on_tap;
    EventBus.getInstance().trigger(handlerId, {});
  }
}
