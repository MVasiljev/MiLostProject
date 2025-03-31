import { u32, Str } from "../types";
export class Rc {
    state;
    static _type = "Rc";
    constructor(initialValue) {
        this.state = { value: initialValue, refCount: u32(1) };
    }
    static new(initialValue) {
        return new Rc(initialValue);
    }
    borrow() {
        return this.state.value;
    }
    borrow_mut(updater) {
        updater(this.state.value);
    }
    clone() {
        this.state.refCount++;
        return this;
    }
    drop() {
        this.state.refCount--;
        if (this.state.refCount === 0) {
            this.state = undefined;
        }
    }
    refCount() {
        return u32(this.state.refCount);
    }
    toString() {
        return Str.fromRaw(`[Rc refCount=${this.state.refCount}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Rc._type);
    }
}
export class Weak {
    strongRef;
    weakRef;
    static _type = "Weak";
    constructor(initialValue) {
        this.strongRef = { value: initialValue };
        this.weakRef = new WeakMap();
        if (this.strongRef) {
            this.weakRef.set(this.strongRef, this.strongRef);
        }
    }
    static new(initialValue) {
        return new Weak(initialValue);
    }
    getOrDefault(defaultValue) {
        return this.strongRef ? this.strongRef.value : defaultValue;
    }
    drop() {
        this.strongRef = null;
    }
    toString() {
        return Str.fromRaw(`[Weak]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Weak._type);
    }
}
export class RefCell {
    state;
    static _type = "RefCell";
    constructor(initialValue) {
        this.state = initialValue;
    }
    static new(initialValue) {
        return new RefCell(initialValue);
    }
    borrow() {
        return this.state;
    }
    borrow_mut(updater) {
        updater(this.state);
    }
    toString() {
        return Str.fromRaw(`[RefCell]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(RefCell._type);
    }
}
export class RcRefCell {
    state;
    static _type = "RcRefCell";
    constructor(initialValue) {
        this.state = { value: initialValue, refCount: u32(1) };
    }
    static new(initialValue) {
        return new RcRefCell(initialValue);
    }
    borrow() {
        return this.state.value;
    }
    borrow_mut(updater) {
        updater(this.state.value);
    }
    clone() {
        this.state.refCount++;
        return this;
    }
    drop() {
        this.state.refCount--;
        if (this.state.refCount === 0) {
            this.state = undefined;
        }
    }
    refCount() {
        return u32(this.state.refCount);
    }
    toString() {
        return Str.fromRaw(`[RcRefCell refCount=${this.state.refCount}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(RcRefCell._type);
    }
}
export class Arc {
    sharedState;
    static _type = "Arc";
    constructor(initialValue) {
        this.sharedState = { value: initialValue };
    }
    static new(initialValue) {
        return new Arc(initialValue);
    }
    get() {
        return this.sharedState.value;
    }
    set(updater) {
        this.sharedState.value = updater(this.sharedState.value);
    }
    clone() {
        return this;
    }
    toString() {
        return Str.fromRaw(`[Arc]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Arc._type);
    }
}
export function createRc(initialValue) {
    return Rc.new(initialValue);
}
export function createWeak(initialValue) {
    return Weak.new(initialValue);
}
export function createRefCell(initialValue) {
    return RefCell.new(initialValue);
}
export function createRcRefCell(initialValue) {
    return RcRefCell.new(initialValue);
}
export function createArc(initialValue) {
    return Arc.new(initialValue);
}
