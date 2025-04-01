export declare class Str {
    private readonly _inner;
    private readonly _jsValue;
    private readonly _useWasm;
    private constructor();
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
    contains(substr: string): boolean;
    toString(): string;
    toJSON(): string;
}
