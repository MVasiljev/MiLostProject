import { initWasm, getWasmModule, isWasmInitialized } from "../../wasm/init.js";
import { MiLostRendererOptions } from "./index.js";

export enum EventType {
  Tap = "Tap",
  DoubleTap = "DoubleTap",
  LongPress = "LongPress",
  Drag = "Drag",
  Focus = "Focus",
  Blur = "Blur",
  ValueChange = "ValueChange",
  Custom = "Custom",
}

export interface EventHandler {
  eventType: EventType;
  handlerId: string;
  data?: Record<string, string>;
}

export class EventBus {
  private static instance: EventBus;
  private eventHandlers: Map<string, Function>;

  private constructor() {
    this.eventHandlers = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public register(handlerId: string, callback: Function): void {
    this.eventHandlers.set(handlerId, callback);
  }

  public unregister(handlerId: string): void {
    this.eventHandlers.delete(handlerId);
  }

  public trigger(handlerId: string, eventData?: any): void {
    const handler = this.eventHandlers.get(handlerId);
    if (handler) {
      handler(eventData);
    } else {
      console.warn(`No handler registered for ID: ${handlerId}`);
    }
  }
}

export async function mountMiLostRenderer({
  component,
  mountPoint,
  width = 800,
  height = 600,
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

function setupEventListeners(canvas: HTMLCanvasElement, renderNode: any): void {
  const hasInteractiveElements = containsInteractiveElements(renderNode);

  if (hasInteractiveElements) {
    canvas.addEventListener("click", (event) =>
      handleEvent(event, "click", renderNode, canvas)
    );

    canvas.addEventListener("dblclick", (event) =>
      handleEvent(event, "dblclick", renderNode, canvas)
    );

    let longPressTimer: number | null = null;
    canvas.addEventListener("mousedown", (event) => {
      longPressTimer = window.setTimeout(() => {
        handleEvent(event, "longpress", renderNode, canvas);
      }, 500);
    });

    canvas.addEventListener("mouseup", () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    });

    canvas.addEventListener("mousemove", (event) =>
      handleEvent(event, "mousemove", renderNode, canvas)
    );
  }
}

function handleEvent(
  event: MouseEvent,
  eventName: string,
  renderNode: any,
  canvas: HTMLCanvasElement
): void {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const nodeAtPoint = findNodeAtPoint(renderNode, x, y);
  if (!nodeAtPoint) return;

  const eventTypeMap: Record<string, EventType> = {
    click: EventType.Tap,
    dblclick: EventType.DoubleTap,
    longpress: EventType.LongPress,
    mousemove: EventType.Custom,
  };

  const eventType = eventTypeMap[eventName];
  if (!eventType) return;

  if (nodeAtPoint.event_handlers) {
    for (const handler of nodeAtPoint.event_handlers) {
      if (handler.event_type === eventType.toString()) {
        triggerEventHandler(handler, event, nodeAtPoint);
      }
    }
  }

  if (eventName === "click" && nodeAtPoint.resolved_props.on_tap) {
    const handlerId = nodeAtPoint.resolved_props.on_tap;
    triggerLegacyHandler(handlerId);
  }
}

function triggerEventHandler(handler: any, event: MouseEvent, node: any): void {
  const eventBus = EventBus.getInstance();

  const eventData = {
    node: {
      id: node.id,
      type: node.type_name,
      props: node.resolved_props,
    },
    originalEvent: event,
    handlerData: handler.data || {},
  };

  eventBus.trigger(handler.handler_id, eventData);
}

function triggerLegacyHandler(handlerId: string): void {
  const eventBus = EventBus.getInstance();
  eventBus.trigger(handlerId, {});

  const handler = (window as any)[handlerId];
  if (typeof handler === "function") {
    handler();
  }
}

function containsInteractiveElements(node: any): boolean {
  if (node.event_handlers && node.event_handlers.length > 0) {
    return true;
  }

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

  if (
    node.event_handlers?.length > 0 ||
    node.type_name === "Button" ||
    node.resolved_props?.on_tap
  ) {
    return node;
  }

  return node;
}
