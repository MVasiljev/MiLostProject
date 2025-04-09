import { u32, Str } from "../types";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmStaticMethod, callWasmInstanceMethod } from "../initWasm/lib";

export class Rc<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;

  private constructor(
    initialValue: T,
    useWasm: boolean = true,
    existingWasmRc?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmRc) {
      this._inner = existingWasmRc;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "Rc",
          "create",
          [initialValue],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM Rc creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Rc<T> {
    return new Rc(initialValue);
  }

  borrow(): T {
    return callWasmInstanceMethod(this._inner, "borrow", [], () => this._value);
  }

  borrow_mut(updater: (value: T) => T): Rc<T> {
    return callWasmInstanceMethod(
      this._inner,
      "borrow_mut",
      [updater],
      () => new Rc(updater(this._value))
    );
  }

  clone(): Rc<T> {
    return callWasmInstanceMethod(this._inner, "clone", [], () => this);
  }

  drop(): Rc<T> {
    return callWasmInstanceMethod(this._inner, "drop", [], () => this);
  }

  refCount(): u32 {
    return callWasmInstanceMethod(this._inner, "refCount", [], () => u32(1));
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[Rc refCount=${this.refCount()}]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Rc");
  }
}

export class Weak<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;

  private constructor(
    initialValue: T,
    useWasm: boolean = true,
    existingWasmWeak?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmWeak) {
      this._inner = existingWasmWeak;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "Weak",
          "create",
          [initialValue],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM Weak creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Weak<T> {
    return new Weak(initialValue);
  }

  getOrDefault(defaultValue: T): T {
    return callWasmInstanceMethod(
      this._inner,
      "getOrDefault",
      [defaultValue],
      () => defaultValue
    );
  }

  drop(): Weak<T> {
    return callWasmInstanceMethod(this._inner, "drop", [], () => this);
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[Weak]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Weak");
  }
}

export class RefCell<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;

  private constructor(
    initialValue: T,
    useWasm: boolean = true,
    existingWasmRefCell?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmRefCell) {
      this._inner = existingWasmRefCell;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "RefCell",
          "create",
          [initialValue],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM RefCell creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): RefCell<T> {
    return new RefCell(initialValue);
  }

  borrow(): T {
    return callWasmInstanceMethod(this._inner, "borrow", [], () => this._value);
  }

  borrow_mut(updater: (value: T) => T): RefCell<T> {
    return callWasmInstanceMethod(
      this._inner,
      "borrow_mut",
      [updater],
      () => new RefCell(updater(this._value))
    );
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[RefCell]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("RefCell");
  }
}

export class RcRefCell<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;

  private constructor(
    initialValue: T,
    useWasm: boolean = true,
    existingWasmRcRefCell?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmRcRefCell) {
      this._inner = existingWasmRcRefCell;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "RcRefCell",
          "create",
          [initialValue],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM RcRefCell creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): RcRefCell<T> {
    return new RcRefCell(initialValue);
  }

  borrow(): T {
    return callWasmInstanceMethod(this._inner, "borrow", [], () => this._value);
  }

  borrow_mut(updater: (value: T) => T): RcRefCell<T> {
    return callWasmInstanceMethod(
      this._inner,
      "borrow_mut",
      [updater],
      () => new RcRefCell(updater(this._value))
    );
  }

  clone(): RcRefCell<T> {
    return callWasmInstanceMethod(this._inner, "clone", [], () => this);
  }

  drop(): RcRefCell<T> {
    return callWasmInstanceMethod(this._inner, "drop", [], () => this);
  }

  refCount(): u32 {
    return callWasmInstanceMethod(this._inner, "refCount", [], () => u32(1));
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[RcRefCell refCount=${this.refCount()}]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("RcRefCell");
  }
}

export class Arc<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;

  private constructor(
    initialValue: T,
    useWasm: boolean = true,
    existingWasmArc?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm && isWasmInitialized();

    if (existingWasmArc) {
      this._inner = existingWasmArc;
    } else if (this._useWasm) {
      try {
        this._inner = callWasmStaticMethod(
          "Arc",
          "create",
          [initialValue],
          () => null
        );
      } catch (error) {
        console.warn(
          `WASM Arc creation failed, falling back to JS implementation: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Arc<T> {
    return new Arc(initialValue);
  }

  get(): T {
    return callWasmInstanceMethod(this._inner, "get", [], () => this._value);
  }

  set(updater: (prev: T) => T): Arc<T> {
    return callWasmInstanceMethod(
      this._inner,
      "set",
      [updater],
      () => new Arc(updater(this._value))
    );
  }

  clone(): Arc<T> {
    return callWasmInstanceMethod(this._inner, "clone", [], () => this);
  }

  toString(): Str {
    return callWasmInstanceMethod(this._inner, "toString", [], () =>
      Str.fromRaw(`[Arc]`)
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Arc");
  }
}

export async function createRc<T>(initialValue: T): Promise<Rc<T>> {
  if (!isWasmInitialized()) {
    try {
      await import("../initWasm/init").then((mod) => mod.initWasm());
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return Rc.new(initialValue);
}

export async function createWeak<T>(initialValue: T): Promise<Weak<T>> {
  if (!isWasmInitialized()) {
    try {
      await import("../initWasm/init").then((mod) => mod.initWasm());
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return Weak.new(initialValue);
}

export async function createRefCell<T>(initialValue: T): Promise<RefCell<T>> {
  if (!isWasmInitialized()) {
    try {
      await import("../initWasm/init").then((mod) => mod.initWasm());
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return RefCell.new(initialValue);
}

export async function createRcRefCell<T>(
  initialValue: T
): Promise<RcRefCell<T>> {
  if (!isWasmInitialized()) {
    try {
      await import("../initWasm/init").then((mod) => mod.initWasm());
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return RcRefCell.new(initialValue);
}

export async function createArc<T>(initialValue: T): Promise<Arc<T>> {
  if (!isWasmInitialized()) {
    try {
      await import("../initWasm/init").then((mod) => mod.initWasm());
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return Arc.new(initialValue);
}
