declare module "milost" {
  export class Str {
    static fromRaw(value: string): Str;
    static create(value: string): Promise<Str>;
    unwrap(): string;
    toUpperCase(): Str;
    toLowerCase(): Str;
    len(): number;
    isEmpty(): boolean;
    trim(): Str;
    equals(other: Str): boolean;
    compare(other: Str): number;
    toString(): string;
    toJSON(): string;
  }
}
