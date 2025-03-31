import { u32 } from "./primitives";
import { Branded, Brand } from "./branding";
import { AppError } from "../core/error";

export class Str {
  private readonly inner: Branded<string, Str>;

  private static makeSelfType(): Str {
    return new Str(Branded.create("Str" as string, null as unknown as Str));
  }

  static readonly _type = Str.makeSelfType();

  private constructor(inner: Branded<string, Str>) {
    this.inner = inner;
  }

  static fromRaw(raw: string): Str {
    return new Str(Branded.create(raw, Str._type));
  }

  static isStr(value: unknown): value is Str {
    return value instanceof Str;
  }

  unwrap(): string {
    return this.inner.unwrap();
  }

  len(): u32 {
    return u32(this.inner.unwrap().length);
  }

  isEmpty(): boolean {
    return this.len() === u32(0);
  }

  push(char: Str): Str {
    const c = char.unwrap();
    if (c.length !== 1) {
      throw new AppError(Str.fromRaw("push requires a single character"));
    }
    return Str.fromRaw(this.unwrap() + c);
  }

  toUpperCase(): Str {
    return Str.fromRaw(this.unwrap().toUpperCase());
  }

  toLowerCase(): Str {
    return Str.fromRaw(this.unwrap().toLowerCase());
  }

  trim(): Str {
    return Str.fromRaw(this.unwrap().trim());
  }

  split(pattern: Str): Str[] {
    return this.unwrap().split(pattern.unwrap()).map(Str.fromRaw);
  }

  substr(start: u32, length?: u32): Str {
    const s = start as unknown as number;
    const l = length !== undefined ? (length as unknown as number) : undefined;
    const sliced = this.unwrap().substring(
      s,
      l !== undefined ? s + l : undefined
    );
    return Str.fromRaw(sliced);
  }

  replace(pattern: Str | RegExp, replacement: Str): Str {
    const target = pattern instanceof Str ? pattern.unwrap() : pattern;
    return Str.fromRaw(this.unwrap().replace(target, replacement.unwrap()));
  }

  toString(): Str {
    return this;
  }

  toJSON(): string {
    return this.unwrap();
  }

  get [Symbol.toStringTag](): string {
    return this.unwrap();
  }
}
