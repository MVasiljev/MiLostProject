import { Str } from '../types/string.js';
import { OwnershipError } from './ownership.js';
export class RefMut {
    _value;
    _active = true;
    static _type = "RefMut";
    constructor(value) {
        this._value = value;
    }
    static new(value) {
        return new RefMut(value);
    }
    get() {
        if (!this._active) {
            throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
        }
        return this._value;
    }
    set(updater) {
        if (!this._active) {
            throw new OwnershipError(Str.fromRaw("Mutable reference is no longer valid"));
        }
        this._value = updater(this._value);
    }
    drop() {
        this._active = false;
    }
    isActive() {
        return this._active;
    }
    toString() {
        return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(RefMut._type);
    }
}
