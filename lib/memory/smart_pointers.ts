import { u32, Str } from "lib/types";

export class Rc<T> {
  private state: { value: T; refCount: u32 };

  static readonly _type = "Rc";

  private constructor(initialValue: T) {
    this.state = { value: initialValue, refCount: u32(1) };
  }

  static new<T>(initialValue: T): Rc<T> {
    return new Rc(initialValue);
  }

  borrow(): T {
    return this.state.value;
  }

  borrow_mut(updater: (value: T) => void): void {
    updater(this.state.value);
  }

  clone(): Rc<T> {
    this.state.refCount++;
    return this;
  }

  drop(): void {
    this.state.refCount--;
    if (this.state.refCount === 0) {
      this.state = undefined as any;
    }
  }

  refCount(): u32 {
    return u32(this.state.refCount);
  }

  toString(): Str {
    return Str.fromRaw(`[Rc refCount=${this.state.refCount}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Rc._type);
  }
}

export class Weak<T> {
  private strongRef: { value: T } | null;
  private weakRef: WeakMap<object, { value: T }>;

  static readonly _type = "Weak";

  private constructor(initialValue: T) {
    this.strongRef = { value: initialValue };
    this.weakRef = new WeakMap<object, { value: T }>();
    if (this.strongRef) {
      this.weakRef.set(this.strongRef, this.strongRef);
    }
  }

  static new<T>(initialValue: T): Weak<T> {
    return new Weak(initialValue);
  }

  getOrDefault(defaultValue: T): T {
    return this.strongRef ? this.strongRef.value : defaultValue;
  }

  drop(): void {
    this.strongRef = null;
  }

  toString(): Str {
    return Str.fromRaw(`[Weak]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Weak._type);
  }
}

export class RefCell<T> {
  private state: T;

  static readonly _type = "RefCell";

  private constructor(initialValue: T) {
    this.state = initialValue;
  }

  static new<T>(initialValue: T): RefCell<T> {
    return new RefCell(initialValue);
  }

  borrow(): T {
    return this.state;
  }

  borrow_mut(updater: (value: T) => void): void {
    updater(this.state);
  }

  toString(): Str {
    return Str.fromRaw(`[RefCell]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(RefCell._type);
  }
}

export class RcRefCell<T> {
  private state: { value: T; refCount: u32 };

  static readonly _type = "RcRefCell";

  private constructor(initialValue: T) {
    this.state = { value: initialValue, refCount: u32(1) };
  }

  static new<T>(initialValue: T): RcRefCell<T> {
    return new RcRefCell(initialValue);
  }

  borrow(): T {
    return this.state.value;
  }

  borrow_mut(updater: (value: T) => void): void {
    updater(this.state.value);
  }

  clone(): RcRefCell<T> {
    this.state.refCount++;
    return this;
  }

  drop(): void {
    this.state.refCount--;
    if (this.state.refCount === 0) {
      this.state = undefined as any;
    }
  }

  refCount(): u32 {
    return u32(this.state.refCount);
  }

  toString(): Str {
    return Str.fromRaw(`[RcRefCell refCount=${this.state.refCount}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(RcRefCell._type);
  }
}

export class Arc<T> {
  private sharedState: { value: T };

  static readonly _type = "Arc";

  private constructor(initialValue: T) {
    this.sharedState = { value: initialValue };
  }

  static new<T>(initialValue: T): Arc<T> {
    return new Arc(initialValue);
  }

  get(): T {
    return this.sharedState.value;
  }

  set(updater: (prev: T) => T): void {
    this.sharedState.value = updater(this.sharedState.value);
  }

  clone(): Arc<T> {
    return this;
  }

  toString(): Str {
    return Str.fromRaw(`[Arc]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Arc._type);
  }
}

export function createRc<T>(initialValue: T): Rc<T> {
  return Rc.new(initialValue);
}

export function createWeak<T>(initialValue: T): Weak<T> {
  return Weak.new(initialValue);
}

export function createRefCell<T>(initialValue: T): RefCell<T> {
  return RefCell.new(initialValue);
}

export function createRcRefCell<T>(initialValue: T): RcRefCell<T> {
  return RcRefCell.new(initialValue);
}

export function createArc<T>(initialValue: T): Arc<T> {
  return Arc.new(initialValue);
}
