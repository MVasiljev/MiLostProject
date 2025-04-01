import { u32, Str } from "../types";
export declare class Rc<T> {
    private state;
    static readonly _type = "Rc";
    private constructor();
    static new<T>(initialValue: T): Rc<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => void): void;
    clone(): Rc<T>;
    drop(): void;
    refCount(): u32;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class Weak<T> {
    private strongRef;
    private weakRef;
    static readonly _type = "Weak";
    private constructor();
    static new<T>(initialValue: T): Weak<T>;
    getOrDefault(defaultValue: T): T;
    drop(): void;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class RefCell<T> {
    private state;
    static readonly _type = "RefCell";
    private constructor();
    static new<T>(initialValue: T): RefCell<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => void): void;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class RcRefCell<T> {
    private state;
    static readonly _type = "RcRefCell";
    private constructor();
    static new<T>(initialValue: T): RcRefCell<T>;
    borrow(): T;
    borrow_mut(updater: (value: T) => void): void;
    clone(): RcRefCell<T>;
    drop(): void;
    refCount(): u32;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class Arc<T> {
    private sharedState;
    static readonly _type = "Arc";
    private constructor();
    static new<T>(initialValue: T): Arc<T>;
    get(): T;
    set(updater: (prev: T) => T): void;
    clone(): Arc<T>;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare function createRc<T>(initialValue: T): Rc<T>;
export declare function createWeak<T>(initialValue: T): Weak<T>;
export declare function createRefCell<T>(initialValue: T): RefCell<T>;
export declare function createRcRefCell<T>(initialValue: T): RcRefCell<T>;
export declare function createArc<T>(initialValue: T): Arc<T>;
