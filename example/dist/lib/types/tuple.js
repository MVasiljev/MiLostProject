import { Str } from "./string";
export class Tuple {
    constructor(items) {
        this.items = items;
    }
    static from(...items) {
        return new Tuple(items);
    }
    static pair(a, b) {
        return Tuple.from(a, b);
    }
    get(index) {
        return this.items[index];
    }
    replace(index, value) {
        const copy = this.items.slice();
        copy[Number(index)] = value;
        return new Tuple(copy);
    }
    first() {
        return this.get("0");
    }
    second() {
        return this.get("1");
    }
    toString() {
        return Str.fromRaw(`[Tuple ${JSON.stringify(this.items)}]`);
    }
    toJSON() {
        return this.items;
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Tuple._type);
    }
}
Tuple._type = "Tuple";
