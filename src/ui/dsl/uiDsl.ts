import { BaseNodeBuilder, EdgeInsets } from "./BaseNodeBuilder";
import { VStackNodeBuilder } from "./VStackNodeBuilder";
import { HStackNodeBuilder } from "./HStackNodeBuilder";
import { ZStackNodeBuilder } from "./ZStackNodeBuilder";
import {
  ButtonNodeBuilder,
  ButtonStyle,
  ButtonSize,
  TextTransform,
  TextAlign,
  FontWeight,
  BorderStyle,
  Overflow,
} from "./ButtonNodeBuilder";
import { TextNodeBuilder } from "./TextNodeBuilder";
import { ImageNodeBuilder, ResizeMode } from "./ImageNodeBuilder";
import { SpacerNodeBuilder } from "./SpacerNodeBuilder";
import { DividerNodeBuilder, DividerStyle } from "./DividerNodeBuilder";

export {
  ButtonStyle,
  ButtonSize,
  TextTransform,
  TextAlign,
  FontWeight,
  BorderStyle,
  Overflow,
  ResizeMode,
  DividerStyle,
};

export enum VStackAlignmentOptions {
  Leading = "leading",
  Center = "center",
  Trailing = "trailing",
}

export enum HStackAlignmentOptions {
  Top = "top",
  Center = "center",
  Bottom = "bottom",
  FirstTextBaseline = "firstTextBaseline",
  LastTextBaseline = "lastTextBaseline",
}

export enum ZStackAlignmentOptions {
  Center = "center",
  TopLeading = "topLeading",
  Top = "top",
  TopTrailing = "topTrailing",
  Leading = "leading",
  Trailing = "trailing",
  BottomLeading = "bottomLeading",
  Bottom = "bottom",
  BottomTrailing = "bottomTrailing",
}

export function VStack(
  ...children: (BaseNodeBuilder | undefined | null)[]
): VStackNodeBuilder {
  return new VStackNodeBuilder(children);
}

export function VStackAligned(
  alignment: VStackAlignmentOptions,
  ...children: (BaseNodeBuilder | undefined | null)[]
): VStackNodeBuilder {
  return new VStackNodeBuilder(children).alignment(alignment);
}

export function HStack(
  ...children: (BaseNodeBuilder | undefined | null)[]
): HStackNodeBuilder {
  return new HStackNodeBuilder(children);
}

export function HStackAligned(
  alignment: HStackAlignmentOptions,
  ...children: (BaseNodeBuilder | undefined | null)[]
): HStackNodeBuilder {
  return new HStackNodeBuilder(children).alignment(alignment);
}

export function ZStack(
  ...children: (BaseNodeBuilder | undefined | null)[]
): ZStackNodeBuilder {
  return new ZStackNodeBuilder(children);
}

export function ZStackAligned(
  alignment: ZStackAlignmentOptions,
  ...children: (BaseNodeBuilder | undefined | null)[]
): ZStackNodeBuilder {
  return new ZStackNodeBuilder(children).alignment(alignment);
}

export function Text(text: string): TextNodeBuilder {
  return new TextNodeBuilder(text);
}

export function Button(label: string) {
  const node = new ButtonNodeBuilder("Button");
  node.setProp("label", label);
  return node;
}

export function Spacer(size?: number): SpacerNodeBuilder {
  const spacer = new SpacerNodeBuilder();
  if (size !== undefined) {
    spacer.size(size);
  }
  return spacer;
}

export function FlexSpacer(): SpacerNodeBuilder {
  return new SpacerNodeBuilder().flexGrow(1);
}

export function Divider(): DividerNodeBuilder {
  return new DividerNodeBuilder();
}

export function Image(src: string): ImageNodeBuilder {
  return new ImageNodeBuilder(src);
}

export function Group(
  ...children: (BaseNodeBuilder | undefined | null)[]
): ZStackNodeBuilder {
  return ZStack(...children);
}

export function HorizontalLayout(
  ...children: (BaseNodeBuilder | undefined | null)[]
): HStackNodeBuilder {
  return HStack(...children);
}

export function VerticalLayout(
  ...children: (BaseNodeBuilder | undefined | null)[]
): VStackNodeBuilder {
  return VStack(...children);
}

export function Card({
  title,
  content,
  footer,
}: {
  title?: BaseNodeBuilder | string;
  content: BaseNodeBuilder;
  footer?: BaseNodeBuilder;
}): VStackNodeBuilder {
  const children: BaseNodeBuilder[] = [];

  if (title) {
    if (typeof title === "string") {
      children.push(Text(title).fontStyle("Title").padding(16));
    } else {
      children.push(title.padding(16));
    }
  }

  children.push(content);

  if (footer) {
    children.push(footer.padding(16));
  }

  return VStack(...children)
    .background("White")
    .cornerRadius(8)
    .padding(0);
}

export function PrimaryButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Primary)
    .backgroundColor("#007AFF")
    .textColor("#FFFFFF")
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function SecondaryButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Secondary)
    .backgroundColor("#E5E5EA")
    .textColor("#000000")
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function OutlineButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Outline)
    .backgroundColor("transparent")
    .textColor("#007AFF")
    .border(1, BorderStyle.Solid, "#007AFF")
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function DangerButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Danger)
    .backgroundColor("#FF3B30")
    .textColor("#FFFFFF")
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function SuccessButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Success)
    .backgroundColor("#34C759")
    .textColor("#FFFFFF")
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function TextButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .style(ButtonStyle.Text)
    .backgroundColor("transparent")
    .textColor("#007AFF")
    .padding(8);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function SmallButton(
  label: string,
  style: ButtonStyle = ButtonStyle.Primary
): ButtonNodeBuilder {
  return Button(label)
    .style(style)
    .size(ButtonSize.Small)
    .padding(6)
    .fontSize(14);
}

export function LargeButton(
  label: string,
  style: ButtonStyle = ButtonStyle.Primary
): ButtonNodeBuilder {
  return Button(label)
    .style(style)
    .size(ButtonSize.Large)
    .padding(16)
    .fontSize(18);
}

export function IconButton(
  icon: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button("")
    .icon(icon)
    .cornerRadius(20)
    .fixedWidth(40)
    .fixedHeight(40);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function LoadingButton(
  label: string,
  isLoading: boolean = false,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .loading(isLoading)
    .loadingIndicatorType("spinner")
    .loadingIndicatorColor("#FFFFFF")
    .loadingIndicatorSize(16)
    .hideTextWhileLoading(true);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function GradientButton(
  label: string,
  stops: Array<{ color: string; position: number }>,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label).textColor("#FFFFFF").cornerRadius(8).padding(12);

  stops.forEach((stop) => {
    button.addGradientStop(stop.color, stop.position);
  });

  button.gradientStartPoint(0, 0);
  button.gradientEndPoint(1, 0);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function AnimatedButton(
  label: string,
  onTap?: string | Function
): ButtonNodeBuilder {
  const button = Button(label)
    .pressEffect(true)
    .pressScale(0.95)
    .animationDuration(0.1)
    .cornerRadius(8)
    .padding(12);

  if (onTap) {
    button.onTap(onTap);
  }

  return button;
}

export function insets(
  top: number,
  right: number,
  bottom: number,
  left: number
): EdgeInsets {
  return { top, right, bottom, left };
}

export function insetAll(value: number): EdgeInsets {
  return { top: value, right: value, bottom: value, left: value };
}

export function insetSymmetric(
  horizontal: number,
  vertical: number
): EdgeInsets {
  return {
    top: vertical,
    right: horizontal,
    bottom: vertical,
    left: horizontal,
  };
}

export function insetHorizontal(value: number): EdgeInsets {
  return { top: 0, right: value, bottom: 0, left: value };
}

export function insetVertical(value: number): EdgeInsets {
  return { top: value, right: 0, bottom: value, left: 0 };
}

export function CircleImage(src: string, size: number): ImageNodeBuilder {
  return Image(src)
    .width(size)
    .height(size)
    .cornerRadius(size / 2)
    .resizeMode(ResizeMode.Cover);
}

export function BackgroundImage(src: string): ImageNodeBuilder {
  return Image(src)
    .resizeMode(ResizeMode.Cover)
    .cornerRadius(0)
    .clipToBounds(true);
}

export function Heading(text: string): TextNodeBuilder {
  return Text(text)
    .fontStyle("Heading")
    .fontSize(20)
    .fontWeight(FontWeight.Bold);
}

export function Subheading(text: string): TextNodeBuilder {
  return Text(text)
    .fontStyle("Subheading")
    .fontSize(16)
    .fontWeight(FontWeight.Medium)
    .color("#666666");
}

export function Caption(text: string): TextNodeBuilder {
  return Text(text).fontStyle("Caption").fontSize(12).color("#999999");
}

export function HorizontalDivider(): DividerNodeBuilder {
  return Divider()
    .thickness(1)
    .color("#E0E0E0")
    .style(DividerStyle.Solid)
    .padding(8);
}

export function DashedDivider(): DividerNodeBuilder {
  return Divider()
    .thickness(1)
    .color("#CCCCCC")
    .style(DividerStyle.Dashed)
    .padding(8);
}
