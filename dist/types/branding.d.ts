import { Result, ValidationError } from "../core";
import { Str } from "./string";
export type Brand<T, B extends Str> = T & {
    readonly __brand: B;
};
export declare class Branded<T, B extends Str> {
    private readonly _value;
    private readonly _brand;
    private constructor();
    static create<T, B extends Str>(value: T, brand: B, validator: (value: T) => boolean, errorMessage?: Str): Result<Branded<T, B>, ValidationError>;
    static is<T, B extends Str>(value: unknown, brand: B): value is Branded<T, B>;
    unwrap(): T;
    brand(): B;
    toJSON(): T;
    toString(): Str;
}
