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
  data?: Record<string, any>;
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
    } else if (
      (window as any)[handlerId] &&
      typeof (window as any)[handlerId] === "function"
    ) {
      (window as any)[handlerId](eventData);
    } else {
      console.warn(`No handler registered for ID: ${handlerId}`);
    }
  }
}

export function useEventRegistry() {
  const eventBus = EventBus.getInstance();

  const registerHandler = (callback: Function): string => {
    const handlerId = `handler_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    eventBus.register(handlerId, callback);
    return handlerId;
  };

  const unregisterHandler = (handlerId: string): void => {
    eventBus.unregister(handlerId);
  };

  return {
    registerHandler,
    unregisterHandler,
  };
}

export function useButtonEvents() {
  const { registerHandler } = useEventRegistry();

  const createTapHandler = (callback: Function): string => {
    return registerHandler(callback);
  };

  const createLongPressHandler = (callback: Function): string => {
    return registerHandler(callback);
  };

  return {
    createTapHandler,
    createLongPressHandler,
  };
}
