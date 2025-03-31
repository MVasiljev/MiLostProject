import { Str } from '../types/string.js';
import { OwnershipError } from './ownership.js';
export class Ref {
    _value;
    _active = true;
    static _type = "Ref";
    constructor(value) {
        this._value = value;
    }
    static new(value) {
        return new Ref(value);
    }
    get() {
        if (!this._active) {
            throw new OwnershipError(Str.fromRaw("Reference is no longer valid"));
        }
        return this._value;
    }
    drop() {
        this._active = false;
    }
    isActive() {
        return this._active;
    }
    toString() {
        return Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Ref._type);
    }
}
