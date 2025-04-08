import { StackAlignment, HStackAlignment, ZStackAlignment } from "./Alignment";
import { EdgeInsets } from "./EdgeInsets";
import { LayoutPriority } from "./LayoutPriority";

export interface SizeConstraints {
  minWidth?: number;
  idealWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  idealHeight?: number;
  maxHeight?: number;
}

export interface LayoutOptions extends SizeConstraints {
  alignment?: StackAlignment | HStackAlignment | ZStackAlignment;
  edgeInsets?: EdgeInsets;
  clipToBounds?: boolean;
  layoutPriority?: LayoutPriority | number;
}
