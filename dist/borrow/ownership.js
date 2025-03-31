import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
export class OwnershipError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Owned {
    _value;
    _consumed = false;
    static _type = "Owned";
    constructor(value) {
        this._value = value;
    }
    static new(value) {
        return new Owned(value);
    }
    consume() {
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Value has already been consumed"));
        }
        this._consumed = true;
        const value = this._value;
        this._value = null;
        return value;
    }
    borrow(fn) {
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
    }
    borrowMut(fn) {
        if (this._consumed || this._value === null) {
            throw new OwnershipError(Str.fromRaw("Cannot borrow consumed value"));
        }
        return fn(this._value);
    }
    isConsumed() {
        return this._consumed;
    }
    toString() {
        return Str.fromRaw(`[Owned ${this._consumed ? "consumed" : "active"}]`);
    }
    isAlive() {
        return this._value !== null;
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Owned._type);
    }
}
