import { u32, Str } from "../types";
import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

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
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.JsRc(initialValue);
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
    if (this._useWasm) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): Rc<T> {
    if (this._useWasm) {
      try {
        const updatedValue = updater(this._inner.borrow());
        const clonedWasmRc = this._inner.clone();
        return new Rc(updatedValue, true, clonedWasmRc);
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new Rc(updater(this._value));
  }

  clone(): Rc<T> {
    if (this._useWasm) {
      try {
        const clonedWasmRc = this._inner.clone();
        return new Rc(this._value, true, clonedWasmRc);
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  drop(): Rc<T> {
    if (this._useWasm) {
      try {
        this._inner.drop();
        return this;
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  refCount(): u32 {
    if (this._useWasm) {
      try {
        return u32(this._inner.refCount());
      } catch (error) {
        console.warn(`WASM refCount failed, using JS fallback: ${error}`);
      }
    }
    return u32(1);
  }

  toString(): Str {
    return Str.fromRaw(`[Rc refCount=${this.refCount()}]`);
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
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.JsWeak(initialValue);
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
    if (this._useWasm) {
      try {
        return this._inner.getOrDefault(defaultValue);
      } catch (error) {
        console.warn(`WASM getOrDefault failed, using JS fallback: ${error}`);
      }
    }
    return defaultValue;
  }

  drop(): Weak<T> {
    if (this._useWasm) {
      try {
        this._inner.drop();
        return this;
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  toString(): Str {
    return Str.fromRaw(`[Weak]`);
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
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.JsRefCell(initialValue);
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
    if (this._useWasm) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): RefCell<T> {
    if (this._useWasm) {
      try {
        const updatedValue = updater(this._inner.borrow());
        return new RefCell(updatedValue, true, this._inner);
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new RefCell(updater(this._value));
  }

  toString(): Str {
    return Str.fromRaw(`[RefCell]`);
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
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.JsRcRefCell(initialValue);
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
    if (this._useWasm) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): RcRefCell<T> {
    if (this._useWasm) {
      try {
        const updatedValue = updater(this._inner.borrow());
        const clonedWasmRcRefCell = this._inner.clone();
        return new RcRefCell(updatedValue, true, clonedWasmRcRefCell);
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new RcRefCell(updater(this._value));
  }

  clone(): RcRefCell<T> {
    if (this._useWasm) {
      try {
        const clonedWasmRcRefCell = this._inner.clone();
        return new RcRefCell(this._value, true, clonedWasmRcRefCell);
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  drop(): RcRefCell<T> {
    if (this._useWasm) {
      try {
        this._inner.drop();
        return this;
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  refCount(): u32 {
    if (this._useWasm) {
      try {
        return u32(this._inner.refCount());
      } catch (error) {
        console.warn(`WASM refCount failed, using JS fallback: ${error}`);
      }
    }
    return u32(1);
  }

  toString(): Str {
    return Str.fromRaw(`[RcRefCell refCount=${this.refCount()}]`);
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
        const wasmModule = getWasmModule();
        this._inner = new wasmModule.JsArc(initialValue);
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
    if (this._useWasm) {
      try {
        return this._inner.get();
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  set(updater: (prev: T) => T): Arc<T> {
    if (this._useWasm) {
      try {
        const updatedValue = updater(this._inner.get());
        this._inner.set(() => updatedValue);
        return new Arc(updatedValue, true, this._inner);
      } catch (error) {
        console.warn(`WASM set failed, using JS fallback: ${error}`);
      }
    }
    return new Arc(updater(this._value));
  }

  clone(): Arc<T> {
    if (this._useWasm) {
      try {
        const clonedWasmArc = this._inner.clone();
        return new Arc(this._value, true, clonedWasmArc);
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  toString(): Str {
    return Str.fromRaw(`[Arc]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Arc");
  }
}

export async function createRc<T>(initialValue: T): Promise<Rc<T>> {
  if (!isWasmInitialized()) {
    try {
      await initWasm();
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
      await initWasm();
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
      await initWasm();
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
      await initWasm();
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
      await initWasm();
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
  return Arc.new(initialValue);
}
