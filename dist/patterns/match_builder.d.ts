type Pattern<T> = T | ((value: T) => boolean) | typeof __;
export declare const __: unique symbol;
export declare class MatchBuilder<T, R> {
    private readonly value;
    private readonly arms;
    constructor(value: T);
    with(pattern: Pattern<T>, handler: (value: T) => R): this;
    otherwise(defaultHandler: (value: T) => R): R;
    private matchPattern;
}
export declare function build<T>(value: T): MatchBuilder<T, any>;
export {};
