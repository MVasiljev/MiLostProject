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

      const clickedNode = findNodeAtPoint(renderNode, x, y);
      if (clickedNode?.resolved_props?.on_tap) {
        handleNodeClick(clickedNode);
      }
    });
  }
}

function containsInteractiveElements(node: any): boolean {
  if (node.type_name === "Button" || node?.resolved_props?.on_tap) {
    return true;
  }

  return (node.children || []).some(containsInteractiveElements);
}

function findNodeAtPoint(node: any, x: number, y: number): any | null {
  const px = parseFloat(node.resolved_props?.x ?? "0");
  const py = parseFloat(node.resolved_props?.y ?? "0");
  const pw = parseFloat(node.resolved_props?.width ?? "0");
  const ph = parseFloat(node.resolved_props?.height ?? "0");

  const inBounds = x >= px && x <= px + pw && y >= py && y <= py + ph;
  if (!inBounds) return null;

  for (const child of [...(node.children || [])].reverse()) {
    const found = findNodeAtPoint(child, x, y);
    if (found) return found;
  }

  if (node.type_name === "Button" || node?.resolved_props?.on_tap) {
    return node;
  }

  return null;
}

function handleNodeClick(node: any): void {
  const handlerName = node.resolved_props?.on_tap;
  const handler = (window as any)[handlerName];

  if (typeof handler === "function") {
    try {
      handler();
    } catch (err) {
      console.error("Error executing click handler:", err);
    }
  } else {
    console.warn(`Handler '${handlerName}' not found`);
  }
}
