import { Str, Vec } from "../types";
import { ValidationError } from "./error";
export class Option {
    _value;
    _some;
    static _type = "Option";
    constructor(some, value) {
        this._some = some;
        this._value = value;
    }
    static Some(value) {
        if (value === null || value === undefined) {
            throw new ValidationError(Str.fromRaw("Cannot create Some with null or undefined value"));
        }
        return new Option(true, value);
    }
    static None() {
        return new Option(false);
    }
    static from(value) {
        return value !== null && value !== undefined
            ? Option.Some(value)
            : Option.None();
    }
    isSome() {
        return this._some;
    }
    isNone() {
        return !this._some;
    }
    expect(message) {
        if (this._some && this._value !== undefined) {
            return this._value;
        }
        throw new ValidationError(message);
    }
    unwrap() {
        if (this._some && this._value !== undefined) {
            return this._value;
        }
        throw new ValidationError(Str.fromRaw("Called unwrap on a None value"));
    }
    unwrapOr(defaultValue) {
        return this._some && this._value !== undefined ? this._value : defaultValue;
    }
    unwrapOrElse(fn) {
        return this._some && this._value !== undefined ? this._value : fn();
    }
    map(fn) {
        if (this._some && this._value !== undefined) {
            return Option.Some(fn(this._value));
        }
        return Option.None();
    }
    andThen(fn) {
        if (this._some && this._value !== undefined) {
            return fn(this._value);
        }
        return Option.None();
    }
    or(optb) {
        return this._some ? this : optb;
    }
    match(onSome, onNone) {
        return this._some && this._value !== undefined
            ? onSome(this._value)
            : onNone();
    }
    filter(predicate) {
        if (this._some && this._value !== undefined && predicate(this._value)) {
            return this;
        }
        return Option.None();
    }
    exists(predicate) {
        return this._some && this._value !== undefined && predicate(this._value);
    }
    static firstSome(...options) {
        return Vec.from(options)
            .find((option) => option.isSome())
            .unwrapOr(Option.None());
    }
    static all(options) {
        const values = [];
        for (const option of options) {
            if (option.isNone()) {
                return Option.None();
            }
            values.push(option.unwrap());
        }
        return Option.Some(Vec.from(values));
    }
    toString() {
        return this._some
            ? Str.fromRaw(`[Some ${this._value}]`)
            : Str.fromRaw("[None]");
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Option._type);
    }
}
