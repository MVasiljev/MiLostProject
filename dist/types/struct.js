import { Vec } from "./vec";
export class Struct {
    constructor(fields) {
        this._fields = Object.freeze({ ...fields });
    }
    static from(fields, fallback) {
        const full = { ...fallback(), ...fields };
        return new Struct(full);
    }
    static empty() {
        return new Struct({});
    }
    get(key) {
        return this._fields[key];
    }
    set(key, value) {
        return new Struct({ ...this._fields, [key]: value });
    }
    keys() {
        return Vec.from(Object.keys(this._fields));
    }
    entries() {
        return Vec.from(Object.entries(this._fields));
    }
    toJSON() {
        return { ...this._fields };
    }
    toString() {
        return `[Struct ${JSON.stringify(this._fields)}]`;
    }
    get [Symbol.toStringTag]() {
        return Struct._type;
    }
}
Struct._type = "Struct";
//# sourceMappingURL=struct.js.map