/**
 * A Rust-like string type
 */
export declare class Str {
    private readonly _inner;
    private readonly _jsValue;
    private readonly _useWasm;
    private constructor();
    /**
     * Create a string from a raw value (synchronous, requires WASM to be initialized)
     */
    static fromRaw(value: string): Str;
    /**
     * Create a string (async to ensure WASM is initialized)
     */
    static create(value: string): Promise<Str>;
    /**
     * Get the underlying string value
     */
    unwrap(): string;
    /**
     * Convert to uppercase
     */
    toUpperCase(): Str;
    /**
     * Convert to lowercase
     */
    toLowerCase(): Str;
    /**
     * Get string length
     */
    len(): number;
    /**
     * Check if string is empty
     */
    isEmpty(): boolean;
    /**
     * Trim whitespace
     */
    trim(): Str;
    /**
     * Check if this string equals another
     */
    equals(other: Str): boolean;
    /**
     * Compare strings
     */
    compare(other: Str): number;
    /**
     * Check if string contains a substring
     */
    contains(substr: string): boolean;
    /**
     * Convert to string
     */
    toString(): string;
    /**
     * Convert to JSON
     */
    toJSON(): string;
}
