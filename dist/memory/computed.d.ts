export declare class Computed<T> {
    private _value;
    private _watchValues;
    private readonly _compute;
    static readonly _type = "Computed";
    constructor(compute: () => T, watchValues: unknown[]);
    static from<U>(compute: () => U, watchValues: unknown[]): Computed<U>;
    get(): T;
    update(newWatchValues: unknown[]): void;
    toJSON(): T;
    toString(): string;
    get [Symbol.toStringTag](): string;
}
export declare class Watcher<T> {
    private readonly watch;
    private readonly callback;
    private lastValue;
    constructor(watch: () => T, callback: (val: T) => void);
    check(): void;
    toString(): string;
    get [Symbol.toStringTag](): string;
}
export declare class AsyncEffect {
    private _active;
    constructor(effect: () => Promise<void>);
    cancel(): void;
    get [Symbol.toStringTag](): string;
}
