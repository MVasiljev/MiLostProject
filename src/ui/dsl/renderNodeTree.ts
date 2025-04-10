import { initWasm, isWasmInitialized } from "../../initWasm/init.js";
import { WasmConnector } from "../../initWasm/wasm-connector.js";
import { UI } from "../ui.js";
import { BaseNodeBuilder } from "./BaseNodeBuilder.js";
import { ButtonNodeBuilder } from "./ButtonNodeBuilder.js";
import { DividerNodeBuilder } from "./DividerNodeBuilder.js";
import { HStackNodeBuilder } from "./HStackNodeBuilder.js";
import { ImageNodeBuilder } from "./ImageNodeBuilder.js";
import { SpacerNodeBuilder } from "./SpacerNodeBuilder.js";
import { TextNodeBuilder } from "./TextNodeBuilder.js";
import { VStackNodeBuilder } from "./VStackNodeBuilder.js";
import { ZStackNodeBuilder } from "./ZStackNodeBuilder.js";

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
    try {
      await initWasm();

      if (!WasmConnector.isInitialized()) {
        await WasmConnector.initialize();
      }
    } catch (error) {
      console.warn("Failed to initialize WASM:", error);
    }
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

    const fallbackJson = JSON.stringify({
      type: convertedNode.type,
      error: `Failed to render: ${error}`,
    });

    return await UI.fromJSON(fallbackJson);
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
  const { type, props } = vnode;

  try {
    if (!WasmConnector.isInitialized()) {
      await WasmConnector.initialize();
    }

    let builder: any;

    switch (type) {
      case "VStack": {
        builder = WasmConnector.createComponent("VStack");
        if (!builder) {
          builder = WasmConnector.createComponent("VStackBuilder");
        }
        break;
      }
      case "HStack": {
        builder = WasmConnector.createComponent("HStack");
        if (!builder) {
          builder = WasmConnector.createComponent("HStackBuilder");
        }
        break;
      }
      case "ZStack": {
        builder = WasmConnector.createComponent("ZStack");
        if (!builder) {
          builder = WasmConnector.createComponent("ZStackBuilder");
        }
        break;
      }
      case "Text": {
        builder = WasmConnector.createComponent("Text", [props.text || ""]);
        if (!builder) {
          builder = WasmConnector.createComponent("TextBuilder", [
            props.text || "",
          ]);
        }
        break;
      }
      case "Button": {
        builder = WasmConnector.createComponent("Button", [props.label || ""]);
        if (!builder) {
          builder = WasmConnector.createComponent("ButtonBuilder", [
            props.label || "",
          ]);
        }
        break;
      }
      case "Spacer": {
        builder = WasmConnector.createComponent("Spacer");
        if (!builder) {
          builder = WasmConnector.createComponent("SpacerBuilder");
        }
        break;
      }
      case "Divider": {
        builder = WasmConnector.createComponent("Divider");
        if (!builder) {
          builder = WasmConnector.createComponent("DividerBuilder");
          if (!builder) {
            builder = WasmConnector.callStaticMethod("light_divider", []);
          }
        }
        break;
      }
      case "Image": {
        builder = WasmConnector.createComponent("Image", [props.src || ""]);
        if (!builder) {
          builder = WasmConnector.createComponent("ImageComponent", [
            props.src || "",
          ]);
          if (!builder) {
            builder = WasmConnector.createComponent("ImageBuilder", [
              props.src || "",
            ]);
          }
        }
        break;
      }
      default:
        throw new Error(`Unknown node type: ${type}`);
    }

    if (!builder) {
      throw new Error(`${type} builder not found in WASM module`);
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

          WasmConnector.callMethod(builder, "on_tap", [handlerId]);
          continue;
        }

        builder = WasmConnector.callMethod(builder, key, [value]);
      } catch (error) {
        console.warn(`Error applying prop ${key}:`, error);
      }
    }

    return builder;
  } catch (error) {
    console.error(`Error creating builder for ${type}:`, error);
    throw error;
  }
}
