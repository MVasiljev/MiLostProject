import { u32, Str } from "../types";
export declare class Rc<T> {
    private readonly _inner;
    private readonly _useWasm;
    private readonly _value;
    private constructor();
    static new<T>(initialValue: T): Rc<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => T): Rc<T>;
    clone(): Rc<T>;
    drop(): Rc<T>;
    refCount(): u32;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class Weak<T> {
    private readonly _inner;
    private readonly _useWasm;
    private readonly _value;
    private constructor();
    static new<T>(initialValue: T): Weak<T>;
    getOrDefault(defaultValue: T): T;
    drop(): Weak<T>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class RefCell<T> {
    private readonly _inner;
    private readonly _useWasm;
    private readonly _value;
    private constructor();
    static new<T>(initialValue: T): RefCell<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => T): RefCell<T>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class RcRefCell<T> {
    private readonly _inner;
    private readonly _useWasm;
    private readonly _value;
    private constructor();
    static new<T>(initialValue: T): RcRefCell<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => T): RcRefCell<T>;
    clone(): RcRefCell<T>;
    drop(): RcRefCell<T>;
    refCount(): u32;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class Arc<T> {
    private readonly _inner;
    private readonly _useWasm;
    private readonly _value;
    private constructor();
    static new<T>(initialValue: T): Arc<T>;
    get(): T;
    set(updater: (prev: T) => T): Arc<T>;
    clone(): Arc<T>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare function createRc<T>(initialValue: T): Promise<Rc<T>>;
export declare function createWeak<T>(initialValue: T): Promise<Weak<T>>;
export declare function createRefCell<T>(initialValue: T): Promise<RefCell<T>>;
export declare function createRcRefCell<T>(initialValue: T): Promise<RcRefCell<T>>;
export declare function createArc<T>(initialValue: T): Promise<Arc<T>>;
