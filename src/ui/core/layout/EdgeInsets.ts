export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export class EdgeInsetsFactory {
  static all(value: number): EdgeInsets {
    return {
      top: value,
      right: value,
      bottom: value,
      left: value,
    };
  }

  static symmetric(vertical: number, horizontal: number): EdgeInsets {
    return {
      top: vertical,
      right: horizontal,
      bottom: vertical,
      left: horizontal,
    };
  }

  static only({
    top = 0,
    right = 0,
    bottom = 0,
    left = 0,
  }: Partial<EdgeInsets>): EdgeInsets {
    return { top, right, bottom, left };
  }

  static horizontal(value: number): EdgeInsets {
    return {
      top: 0,
      right: value,
      bottom: 0,
      left: value,
    };
  }

  static vertical(value: number): EdgeInsets {
    return {
      top: value,
      right: 0,
      bottom: value,
      left: 0,
    };
  }
}
