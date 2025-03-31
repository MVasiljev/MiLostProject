import { u32 } from "./primitives";
import { Branded } from "./branding";
import { Result, Ok, Err } from "../core/result";
import { ValidationError } from "../core/error";
import { Str as StringBrand } from "./string";

export class Str {
  private readonly _inner: Branded<string, StringBrand>;

  private constructor(inner: Branded<string, StringBrand>) {
    this._inner = inner;
  }

  static createStr(raw: string): Result<Str, ValidationError> {
    return Branded.create(
      raw,
      Str.brand(),
      (value) => typeof value === "string" && value.length >= 0,
      Str.fromRaw("Invalid string value")
    ).map((branded) => new Str(branded));
  }

  static fromRaw(raw: string): Str {
    return new Str(
      Branded.create(
        raw,
        Str.brand(),
        (value) => typeof value === "string" && value.length >= 0
      ).unwrap()
    );
  }

  static brand(): StringBrand {
    return Str.fromRaw("Str");
  }

  static isStr(value: unknown): value is Str {
    return value instanceof Str;
  }

  unwrap(): string {
    return this._inner.unwrap();
  }

  len(): u32 {
    return u32(this.unwrap().length);
  }

  isEmpty(): boolean {
    return this.len() === u32(0);
  }

  push(char: Str): Str {
    const c = char.unwrap();
    if (c.length !== 1) {
      throw new ValidationError(
        Str.fromRaw("push requires a single character")
      );
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

  equals(other: Str): boolean {
    return this.unwrap() === other.unwrap();
  }

  compare(other: Str): number {
    return this.unwrap().localeCompare(other.unwrap());
  }
}
