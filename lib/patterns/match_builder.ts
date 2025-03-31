type Pattern<T> = T | ((value: T) => boolean) | typeof __;

export const __ = Symbol("Wildcard");

export class MatchBuilder<T, R> {
  private readonly value: T;
  private readonly arms: { pattern: Pattern<T>; handler: (value: T) => R }[] =
    [];

  constructor(value: T) {
    this.value = value;
  }

  with(pattern: Pattern<T>, handler: (value: T) => R): this {
    this.arms.push({ pattern, handler });
    return this;
  }

  otherwise(defaultHandler: (value: T) => R): R {
    for (const arm of this.arms) {
      if (this.matchPattern(arm.pattern, this.value)) {
        return arm.handler(this.value);
      }
    }
    return defaultHandler(this.value);
  }

  private matchPattern(pattern: Pattern<T>, value: T): boolean {
    if (pattern === __) return true;
    if (typeof pattern === "function")
      return (pattern as (value: T) => boolean)(value);
    return pattern === value;
  }
}

export function build<T>(value: T) {
  return new MatchBuilder<T, any>(value);
}
