import { ValidationError, Err, Ok } from "../core";
import { Str } from "./string";
export class Branded {
    _value;
    _brand;
    constructor(value, brand) {
        this._value = value;
        this._brand = brand;
    }
    static create(value, brand, validator, errorMessage) {
        if (!validator(value)) {
            return Err(new ValidationError(errorMessage ||
                Str.fromRaw(`Invalid ${brand.unwrap()} value: ${value}`)));
        }
        return Ok(new Branded(value, brand));
    }
    static is(value, brand) {
        return value instanceof Branded && value._brand.unwrap() === brand.unwrap();
    }
    unwrap() {
        return this._value;
    }
    brand() {
        return this._brand;
    }
    toJSON() {
        return this._value;
    }
    toString() {
        return Str.fromRaw(`[Branded ${this._brand.unwrap()}]`);
    }
}
