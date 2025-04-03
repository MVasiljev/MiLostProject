import { ButtonBuilder } from "../ButtonBuilder";
import { DividerBuilder } from "../DividerBuilder";
import { HStackBuilder } from "../HStackBuilder";
import { ImageBuilder } from "../ImageBuilder";
import { SpacerBuilder } from "../SpacerBuilder";
import { TextBuilder } from "../TextBuilder";
import { VStackBuilder } from "../VStackBuilder";
import { ZStackBuilder } from "../ZStackBuilder";
import { VNodeBuilder } from "./VNodeBuilder";

type BuiltComponent = any;

export async function renderVNodeTree(
  vnode: VNodeBuilder
): Promise<BuiltComponent> {
  const builder = await createBuilderFromType(vnode.type, vnode.props);

  if (vnode.children.length > 0 && "child" in builder) {
    for (const child of vnode.children) {
      const builtChild = await renderVNodeTree(child);
      if (builtChild) {
        await builder.child(builtChild);
      }
    }
  }

  const built = await builder.build();
  return built;
}

async function createBuilderFromType(type: string, props: Record<string, any>) {
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
      return applyProps(builder, props);
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
      throw new Error(`Unknown VNode type: ${type}`);
  }
}

function applyProps(builder: any, props: Record<string, any>) {
  for (const [key, value] of Object.entries(props)) {
    if (typeof builder[key] === "function") {
      builder[key](value);
    }
  }
  return builder;
}
