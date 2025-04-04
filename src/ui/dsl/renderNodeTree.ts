import { ButtonBuilder } from "../ButtonBuilder";
import { DividerBuilder } from "../DividerBuilder";
import { HStackBuilder } from "../HStackBuilder";
import { ImageBuilder } from "../ImageBuilder";
import { EventBus } from "../rendering";
import { SpacerBuilder } from "../SpacerBuilder";
import { TextBuilder } from "../TextBuilder";
import { VStackBuilder } from "../VStackBuilder";
import { ZStackBuilder } from "../ZStackBuilder";

import { BaseNodeBuilder } from "./BaseNodeBuilder";
import { ButtonNodeBuilder } from "./ButtonNodeBuilder";
import { DividerNodeBuilder } from "./DividerNodeBuilder";
import { HStackNodeBuilder } from "./HStackNodeBuilder";
import { ImageNodeBuilder } from "./ImageNodeBuilder";
import { SpacerNodeBuilder } from "./SpacerNodeBuilder";
import { TextNodeBuilder } from "./TextNodeBuilder";
import { VStackNodeBuilder } from "./VStackNodeBuilder";
import { ZStackNodeBuilder } from "./ZStackNodeBuilder";

type SpecificNodeBuilder =
  | ButtonNodeBuilder
  | VStackNodeBuilder
  | HStackNodeBuilder
  | ZStackNodeBuilder
  | TextNodeBuilder
  | ImageNodeBuilder
  | SpacerNodeBuilder
  | DividerNodeBuilder;

type BuiltComponent = any;

export async function renderNodeTree(
  vnode: BaseNodeBuilder | SpecificNodeBuilder
): Promise<BuiltComponent> {
  const convertedNode =
    vnode instanceof BaseNodeBuilder ? convertBaseNodeToSpecific(vnode) : vnode;

  const builder = await createBuilderFromType(convertedNode);

  if (convertedNode.children.length > 0 && "child" in builder) {
    for (const child of convertedNode.children) {
      const builtChild = await renderNodeTree(child);
      if (builtChild) {
        await builder.child(builtChild);
      }
    }
  }

  const built = await builder.build();
  return built;
}

function convertBaseNodeToSpecific(
  baseNode: BaseNodeBuilder
): SpecificNodeBuilder {
  switch (baseNode.type) {
    case "VStack":
      return new VStackNodeBuilder(baseNode.children)
        .setProp("spacing", baseNode.props.spacing)
        .setProp("padding", baseNode.props.padding)
        .setProp("background", baseNode.props.background);

    case "HStack":
      return new HStackNodeBuilder(baseNode.children)
        .setProp("spacing", baseNode.props.spacing)
        .setProp("padding", baseNode.props.padding)
        .setProp("background", baseNode.props.background);

    case "ZStack":
      return new ZStackNodeBuilder(baseNode.children);

    case "Text":
      return new TextNodeBuilder(baseNode.props.text || "")
        .setProp("color", baseNode.props.color)
        .setProp("fontStyle", baseNode.props.fontStyle);

    case "Button":
      return new ButtonNodeBuilder(baseNode.props.label || "")
        .setProp("style", baseNode.props.style)
        .setProp("backgroundColor", baseNode.props.backgroundColor)
        .setProp("textColor", baseNode.props.textColor)
        .setProp("cornerRadius", baseNode.props.cornerRadius)
        .setProp("padding", baseNode.props.padding)
        .setProp("onTap", baseNode.props.onTap);

    case "Spacer":
      return new SpacerNodeBuilder().setProp(
        "flexGrow",
        baseNode.props.flexGrow
      );

    case "Divider":
      return new DividerNodeBuilder();

    // In the convertBaseNodeToSpecific function in renderNodeTree.ts
    case "Image":
      // Create a new image builder
      const imageBuilder = new ImageNodeBuilder(baseNode.props.src || "");

      // Apply key image properties explicitly
      if (baseNode.props.width !== undefined) {
        imageBuilder.width(baseNode.props.width);
      }

      if (baseNode.props.height !== undefined) {
        imageBuilder.height(baseNode.props.height);
      }

      if (baseNode.props.cornerRadius !== undefined) {
        imageBuilder.cornerRadius(baseNode.props.cornerRadius);
      }

      if (baseNode.props.borderWidth !== undefined) {
        imageBuilder.borderWidth(baseNode.props.borderWidth);
      }

      if (baseNode.props.borderColor !== undefined) {
        imageBuilder.borderColor(baseNode.props.borderColor);
      }

      return imageBuilder;

    default:
      throw new Error(`Unknown node type: ${baseNode.type}`);
  }
}

async function createBuilderFromType(vnode: SpecificNodeBuilder) {
  const { type, props } = vnode;

  switch (type) {
    case "VStack": {
      const builder = await VStackBuilder.create();
      return applyProps(builder, props);
    }
    case "HStack": {
      const builder = await HStackBuilder.create();
      return applyProps(builder, props);
    }
    case "ZStack": {
      const builder = await ZStackBuilder.create();
      return applyProps(builder, props);
    }
    case "Text": {
      const builder = await TextBuilder.create(props.text ?? "");
      return applyProps(builder, props);
    }
    case "Button": {
      const builder = await ButtonBuilder.create(props.label ?? "");
      console.log(
        "Button builder after prop application:",
        builder,
        JSON.stringify(props)
      );
      return applyButtonProps(builder, props);
    }
    case "Spacer": {
      const builder = await SpacerBuilder.create();
      return applyProps(builder, props);
    }
    case "Divider": {
      const builder = await DividerBuilder.create();
      return applyProps(builder, props);
    }
    case "Image": {
      const builder = await ImageBuilder.create(props.src ?? "");
      return applyProps(builder, props);
    }
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

function applyProps(builder: any, props: Record<string, any>) {
  console.log("Applying props to builder:", props);

  if (
    props.src &&
    builder.constructor.name.includes("Image") &&
    typeof builder.src === "function"
  ) {
    builder.src(props.src);
    // Or alternatively if that's not the right method name:
    // builder._builder = builder._builder.src(props.src);
  }

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) {
      console.log(`Skipping undefined prop: ${key}`);
      continue;
    }

    console.log(`Trying to apply prop: ${key} with value:`, value);

    try {
      if (key === "onTap" && typeof value === "function") {
        const handlerId = `btn_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}`;
        const eventBus = EventBus.getInstance();
        eventBus.register(handlerId, value);
        (window as any)[handlerId] = value;

        if (typeof builder.onTap === "function") {
          builder.onTap(handlerId);
        }
        continue;
      }

      if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (trimmedValue === "") {
          console.log(`Skipping empty string prop: ${key}`);
          continue;
        }
      }

      if (typeof builder[key] === "function") {
        console.log(`Calling method: ${key}`);
        builder[key](value);
        continue;
      }

      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      if (typeof builder[camelKey] === "function") {
        console.log(`Calling camelCase method: ${camelKey}`);
        builder[camelKey](value);
        continue;
      }

      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      if (typeof builder[snakeKey] === "function") {
        console.log(`Calling snake_case method: ${snakeKey}`);
        builder[snakeKey](value);
        continue;
      }

      console.warn(`Could not find method to apply prop: ${key}`);
    } catch (error) {
      console.error(`Error applying prop ${key}:`, error);
    }
  }

  return builder;
}

function applyButtonProps(builder: any, props: Record<string, any>) {
  const shadowProps: {
    color?: string;
    offsetX?: number;
    offsetY?: number;
    radius?: number;
  } = {};
  const borderProps: { width?: number; style?: string; color?: string } = {};
  const pressOffsetProps: { x?: number; y?: number } = {};
  const gradientStops: Array<{ color: string; position: number }> = [];
  const gradientProps: {
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    isRadial?: boolean;
  } = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "shadowColor") shadowProps.color = value;
    else if (key === "shadowOffsetX") shadowProps.offsetX = value;
    else if (key === "shadowOffsetY") shadowProps.offsetY = value;
    else if (key === "shadowRadius") shadowProps.radius = value;
    else if (key === "borderWidth") borderProps.width = value;
    else if (key === "borderStyle") borderProps.style = value;
    else if (key === "borderColor") borderProps.color = value;
    else if (key === "pressOffsetX") pressOffsetProps.x = value;
    else if (key === "pressOffsetY") pressOffsetProps.y = value;
    else if (key.startsWith("gradientStop_")) {
      gradientStops.push(value);
    } else if (key === "gradientStartX") gradientProps.startX = value;
    else if (key === "gradientStartY") gradientProps.startY = value;
    else if (key === "gradientEndX") gradientProps.endX = value;
    else if (key === "gradientEndY") gradientProps.endY = value;
    else if (key === "gradientIsRadial") gradientProps.isRadial = value;
  }

  builder = applyProps(builder, props);

  if (
    shadowProps.color &&
    shadowProps.offsetX !== undefined &&
    shadowProps.offsetY !== undefined &&
    shadowProps.radius !== undefined
  ) {
    builder.shadow(
      shadowProps.color,
      shadowProps.offsetX,
      shadowProps.offsetY,
      shadowProps.radius
    );
  }

  if (
    borderProps.width !== undefined &&
    borderProps.style &&
    borderProps.color
  ) {
    builder.border(borderProps.width, borderProps.style, borderProps.color);
  }

  if (pressOffsetProps.x !== undefined && pressOffsetProps.y !== undefined) {
    builder.press_offset(pressOffsetProps.x, pressOffsetProps.y);
  }

  if (gradientStops.length > 0) {
    for (const stop of gradientStops) {
      builder.add_gradient_stop(stop.color, stop.position);
    }

    if (
      gradientProps.startX !== undefined &&
      gradientProps.startY !== undefined
    ) {
      builder.gradient_start_point(gradientProps.startX, gradientProps.startY);
    }

    if (gradientProps.endX !== undefined && gradientProps.endY !== undefined) {
      builder.gradient_end_point(gradientProps.endX, gradientProps.endY);
    }

    if (gradientProps.isRadial !== undefined) {
      builder.gradient_is_radial(gradientProps.isRadial);
    }
  }

  return builder;
}

function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function registerEventHandler(handler: Function, eventName: string): string {
  const handlerId = `handler_${eventName}_${Date.now()}_${Math.floor(
    Math.random() * 1000
  )}`;

  if (typeof window !== "undefined") {
    if (!(window as any).eventBus) {
      (window as any).eventBus = {
        handlers: {},
        register(id: string, fn: Function) {
          this.handlers[id] = fn;
        },
        trigger(id: string, data?: any) {
          const handler = this.handlers[id];
          if (handler) {
            handler(data);
          }
        },
      };
    }

    (window as any).eventBus.register(handlerId, handler);
  }

  return handlerId;
}
