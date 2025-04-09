import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../../initWasm/init.js";
import { BaseNodeBuilder } from "./BaseNodeBuilder";
import { ButtonNodeBuilder } from "./ButtonNodeBuilder";
import { DividerNodeBuilder } from "./DividerNodeBuilder";
import { HStackNodeBuilder } from "./HStackNodeBuilder";
import { ImageNodeBuilder } from "./ImageNodeBuilder";
import { SpacerNodeBuilder } from "./SpacerNodeBuilder";
import { TextNodeBuilder } from "./TextNodeBuilder";
import { VStackNodeBuilder } from "./VStackNodeBuilder";
import { ZStackNodeBuilder } from "./ZStackNodeBuilder";
import { UI } from "../ui.js";

type SpecificNodeBuilder =
  | ButtonNodeBuilder
  | VStackNodeBuilder
  | HStackNodeBuilder
  | ZStackNodeBuilder
  | TextNodeBuilder
  | ImageNodeBuilder
  | SpacerNodeBuilder
  | DividerNodeBuilder;

export async function renderNodeTree(
  vnode: BaseNodeBuilder | SpecificNodeBuilder
): Promise<UI> {
  if (!isWasmInitialized()) {
    await initWasm();
  }

  const convertedNode =
    vnode instanceof BaseNodeBuilder ? convertBaseNodeToSpecific(vnode) : vnode;

  try {
    const builder = await createBuilderFromType(convertedNode);

    if (
      convertedNode.children.length > 0 &&
      builder &&
      typeof builder.child === "function"
    ) {
      for (const child of convertedNode.children) {
        const builtChild = await renderNodeTree(child);
        if (builtChild) {
          await builder.child(builtChild);
        }
      }
    }

    const built = await builder.build();
    return built;
  } catch (error) {
    console.error(`Error rendering node type ${convertedNode.type}:`, error);
    throw error;
  }
}

function convertBaseNodeToSpecific(
  baseNode: BaseNodeBuilder
): SpecificNodeBuilder {
  switch (baseNode.type) {
    case "VStack":
      return createVStackNodeBuilder(baseNode);
    case "HStack":
      return createHStackNodeBuilder(baseNode);
    case "ZStack":
      return createZStackNodeBuilder(baseNode);
    case "Text":
      return createTextNodeBuilder(baseNode);
    case "Button":
      return createButtonNodeBuilder(baseNode);
    case "Spacer":
      return createSpacerNodeBuilder(baseNode);
    case "Divider":
      return createDividerNodeBuilder(baseNode);
    case "Image":
      return createImageNodeBuilder(baseNode);
    default:
      throw new Error(`Unknown node type: ${baseNode.type}`);
  }
}

function createVStackNodeBuilder(baseNode: BaseNodeBuilder): VStackNodeBuilder {
  return new VStackNodeBuilder(baseNode.children)
    .setProp("spacing", baseNode.props.spacing)
    .setProp("padding", baseNode.props.padding)
    .setProp("background", baseNode.props.background)
    .setProp("alignment", baseNode.props.alignment)
    .setProp("cornerRadius", baseNode.props.cornerRadius)
    .setProp("edgeInsets", baseNode.props.edgeInsets)
    .setProp("minWidth", baseNode.props.minWidth)
    .setProp("maxWidth", baseNode.props.maxWidth)
    .setProp("minHeight", baseNode.props.minHeight)
    .setProp("maxHeight", baseNode.props.maxHeight)
    .setProp("clipToBounds", baseNode.props.clipToBounds);
}

function createHStackNodeBuilder(baseNode: BaseNodeBuilder): HStackNodeBuilder {
  return new HStackNodeBuilder(baseNode.children)
    .setProp("spacing", baseNode.props.spacing)
    .setProp("padding", baseNode.props.padding)
    .setProp("background", baseNode.props.background)
    .setProp("alignment", baseNode.props.alignment)
    .setProp("cornerRadius", baseNode.props.cornerRadius)
    .setProp("edgeInsets", baseNode.props.edgeInsets)
    .setProp("minWidth", baseNode.props.minWidth)
    .setProp("maxWidth", baseNode.props.maxWidth)
    .setProp("minHeight", baseNode.props.minHeight)
    .setProp("maxHeight", baseNode.props.maxHeight)
    .setProp("clipToBounds", baseNode.props.clipToBounds);
}

function createZStackNodeBuilder(baseNode: BaseNodeBuilder): ZStackNodeBuilder {
  return new ZStackNodeBuilder(baseNode.children)
    .setProp("padding", baseNode.props.padding)
    .setProp("background", baseNode.props.background)
    .setProp("alignment", baseNode.props.alignment)
    .setProp("cornerRadius", baseNode.props.cornerRadius)
    .setProp("edgeInsets", baseNode.props.edgeInsets)
    .setProp("minWidth", baseNode.props.minWidth)
    .setProp("maxWidth", baseNode.props.maxWidth)
    .setProp("minHeight", baseNode.props.minHeight)
    .setProp("maxHeight", baseNode.props.maxHeight)
    .setProp("clipToBounds", baseNode.props.clipToBounds);
}

function createTextNodeBuilder(baseNode: BaseNodeBuilder): TextNodeBuilder {
  return new TextNodeBuilder(baseNode.props.text || "")
    .setProp("color", baseNode.props.color)
    .setProp("fontStyle", baseNode.props.fontStyle)
    .setProp("fontSize", baseNode.props.fontSize)
    .setProp("fontWeight", baseNode.props.fontWeight)
    .setProp("textAlign", baseNode.props.textAlign)
    .setProp("lineHeight", baseNode.props.lineHeight)
    .setProp("letterSpacing", baseNode.props.letterSpacing)
    .setProp("maxLines", baseNode.props.maxLines)
    .setProp("overflow", baseNode.props.overflow);
}

function createButtonNodeBuilder(baseNode: BaseNodeBuilder): ButtonNodeBuilder {
  const builder = new ButtonNodeBuilder(baseNode.props.label || "")
    .setProp("style", baseNode.props.style)
    .setProp("backgroundColor", baseNode.props.backgroundColor)
    .setProp("textColor", baseNode.props.textColor)
    .setProp("cornerRadius", baseNode.props.cornerRadius)
    .setProp("padding", baseNode.props.padding)
    .setProp("fontSize", baseNode.props.fontSize)
    .setProp("fontWeight", baseNode.props.fontWeight)
    .setProp("borderWidth", baseNode.props.borderWidth)
    .setProp("borderColor", baseNode.props.borderColor)
    .setProp("borderStyle", baseNode.props.borderStyle)
    .setProp("onTap", baseNode.props.onTap)
    .setProp("disabled", baseNode.props.disabled);

  if (baseNode.props.gradientColors) {
    builder.gradientColors(baseNode.props.gradientColors);
  }

  return builder;
}

function createSpacerNodeBuilder(baseNode: BaseNodeBuilder): SpacerNodeBuilder {
  return new SpacerNodeBuilder()
    .setProp("size", baseNode.props.size)
    .setProp("minSize", baseNode.props.minSize)
    .setProp("maxSize", baseNode.props.maxSize)
    .setProp("flexGrow", baseNode.props.flexGrow);
}

function createDividerNodeBuilder(
  baseNode: BaseNodeBuilder
): DividerNodeBuilder {
  return new DividerNodeBuilder()
    .setProp("thickness", baseNode.props.thickness)
    .setProp("color", baseNode.props.color)
    .setProp("style", baseNode.props.style)
    .setProp("padding", baseNode.props.padding)
    .setProp("opacity", baseNode.props.opacity);
}

function createImageNodeBuilder(baseNode: BaseNodeBuilder): ImageNodeBuilder {
  return new ImageNodeBuilder(baseNode.props.src || "")
    .setProp("width", baseNode.props.width)
    .setProp("height", baseNode.props.height)
    .setProp("cornerRadius", baseNode.props.cornerRadius)
    .setProp("resizeMode", baseNode.props.resizeMode)
    .setProp("contentMode", baseNode.props.contentMode)
    .setProp("borderWidth", baseNode.props.borderWidth)
    .setProp("borderColor", baseNode.props.borderColor)
    .setProp("opacity", baseNode.props.opacity)
    .setProp("clipToBounds", baseNode.props.clipToBounds);
}

async function createBuilderFromType(vnode: SpecificNodeBuilder) {
  const wasm = getWasmModule();
  const { type, props } = vnode;

  try {
    switch (type) {
      case "VStack": {
        const builder =
          typeof wasm.create_vertical_stack === "function"
            ? wasm.create_vertical_stack()
            : typeof wasm.VStackBuilder === "function"
            ? wasm.VStackBuilder()
            : null;

        if (!builder) {
          throw new Error("VStack builder not found in WASM module");
        }

        return await applyStackProps(builder, props);
      }
      case "HStack": {
        const builder =
          typeof wasm.create_horizontal_stack === "function"
            ? wasm.create_horizontal_stack()
            : typeof wasm.HStackBuilder === "function"
            ? wasm.HStackBuilder()
            : null;

        if (!builder) {
          throw new Error("HStack builder not found in WASM module");
        }

        return await applyStackProps(builder, props);
      }
      case "ZStack": {
        const builder =
          typeof wasm.create_zstack === "function"
            ? wasm.create_zstack()
            : typeof wasm.ZStackBuilder === "function"
            ? wasm.ZStackBuilder()
            : null;

        if (!builder) {
          throw new Error("ZStack builder not found in WASM module");
        }

        return await applyStackProps(builder, props);
      }
      case "Text": {
        // Use TextBuilder with content parameter instead of constructor
        const builder =
          typeof wasm.TextBuilder === "function"
            ? wasm.TextBuilder(props.text ?? "")
            : null;

        if (!builder) {
          throw new Error("Text builder not found in WASM module");
        }

        return await applyTextProps(builder, props);
      }
      case "Button": {
        // Use ButtonBuilder with label parameter instead of constructor
        const builder =
          typeof wasm.ButtonBuilder === "function"
            ? wasm.ButtonBuilder(props.label ?? "")
            : null;

        if (!builder) {
          throw new Error("Button builder not found in WASM module");
        }

        return await applyButtonProps(builder, props);
      }
      case "Spacer": {
        const builder =
          typeof wasm.SpacerBuilder === "function"
            ? wasm.SpacerBuilder()
            : typeof wasm.default_flexible_spacer === "function"
            ? wasm.default_flexible_spacer(1)
            : null;

        if (!builder) {
          throw new Error("Spacer builder not found in WASM module");
        }

        return await applySpacerProps(builder, props);
      }
      case "Divider": {
        const builder =
          typeof wasm.DividerBuilder === "function"
            ? wasm.DividerBuilder()
            : typeof wasm.light_divider === "function"
            ? wasm.light_divider()
            : null;

        if (!builder) {
          throw new Error("Divider builder not found in WASM module");
        }

        return await applyDividerProps(builder, props);
      }
      case "Image": {
        // Use ImageBuilder with src parameter instead of constructor
        const builder =
          typeof wasm.ImageBuilder === "function"
            ? wasm.ImageBuilder(props.src ?? "")
            : null;

        if (!builder) {
          throw new Error("Image builder not found in WASM module");
        }

        return await applyImageProps(builder, props);
      }
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  } catch (error) {
    console.error(`Error creating builder for ${type}:`, error);
    throw error;
  }
}

async function applyStackProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applyTextProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applyButtonProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applySpacerProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applyDividerProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applyImageProps(builder: any, props: Record<string, any>) {
  return applyPropsToWasmBuilder(builder, props);
}

async function applyPropsToWasmBuilder(
  builder: any,
  props: Record<string, any>
) {
  // Return early if builder is null or invalid
  if (!builder) {
    console.error("Builder is null or invalid");
    throw new Error("Builder is null or invalid");
  }

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) {
      continue;
    }

    try {
      if (key === "onTap" && typeof value === "function") {
        const handlerId = `btn_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}`;
        (window as any)[handlerId] = value;

        if (typeof builder.on_tap === "function") {
          builder = builder.on_tap(handlerId);
        }
        continue;
      }

      // Try different key formats
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const snakeKey = camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();

      if (typeof builder[key] === "function") {
        builder = builder[key](value);
      } else if (typeof builder[camelKey] === "function") {
        builder = builder[camelKey](value);
      } else if (typeof builder[snakeKey] === "function") {
        builder = builder[snakeKey](value);
      }
    } catch (error) {
      console.error(`Error applying prop ${key}:`, error);
    }
  }

  return builder;
}
