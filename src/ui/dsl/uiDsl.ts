import { VNodeBuilder } from "./VNodeBuilder";

export function VStack(...children: (VNodeBuilder | undefined | null)[]) {
  return new VNodeBuilder("VStack", children);
}

export function HStack(...children: (VNodeBuilder | undefined | null)[]) {
  return new VNodeBuilder("HStack", children);
}

export function ZStack(...children: (VNodeBuilder | undefined | null)[]) {
  return new VNodeBuilder("ZStack", children);
}

export function Text(text: string) {
  const node = new VNodeBuilder("Text");
  node.setProp("text", text);
  return node;
}

export function Button(label: string) {
  const node = new VNodeBuilder("Button");
  node.setProp("label", label);
  return node;
}

export function Spacer() {
  return new VNodeBuilder("Spacer");
}

export function Divider() {
  return new VNodeBuilder("Divider");
}

export function Image(src: string) {
  const node = new VNodeBuilder("Image");
  node.setProp("src", src);
  return node;
}
