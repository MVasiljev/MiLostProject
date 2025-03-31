import { Str } from '../types/string.js';
import { OwnershipError } from './ownership.js';
export class RefMut {
    constructor(value) {
        this._active = true;
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
RefMut._type = "RefMut";
//# sourceMappingURL=refmut.js.map