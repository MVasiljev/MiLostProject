/**
 * Smart pointers for MiLost
 *
 * Provides Rc, Weak, RefCell, RcRefCell, and Arc implementations with
 * optional WebAssembly acceleration.
 */
import { u32, Str } from "../types/index.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

/**
 * Module definition for smart pointers WASM implementation
 */
const smartPointersModule: WasmModule = {
  name: "SmartPointers",

  initialize(wasmModule: any) {
    console.log("Initializing SmartPointers module with WASM...");

    const classes = ["Rc", "Weak", "RefCell", "RcRefCell", "Arc"];
    classes.forEach((className) => {
      if (typeof wasmModule[className] === "function") {
        console.log(`Found ${className} constructor in WASM module`);
        (globalThis as any)[className]._useWasm = true;
      } else {
        console.warn(`${className} constructor not found in WASM module`);
      }
    });

    const staticMethods = ["new"];
    classes.forEach((className) => {
      staticMethods.forEach((method) => {
        if (typeof wasmModule[className][method] === "function") {
          console.log(`Found static method: ${className}.${method}`);
        } else {
          console.warn(`Missing static method: ${className}.${method}`);
        }
      });
    });

    const instanceMethods = {
      Rc: ["borrow", "borrow_mut", "clone", "drop", "refCount", "toString"],
      Weak: ["getOrDefault", "drop", "toString"],
      RefCell: ["borrow", "borrow_mut", "toString"],
      RcRefCell: [
        "borrow",
        "borrow_mut",
        "clone",
        "drop",
        "refCount",
        "toString",
      ],
      Arc: ["get", "set", "clone", "toString"],
    };

    for (const [className, methods] of Object.entries(instanceMethods)) {
      try {
        const sampleInstance = wasmModule[className].new(0);
        methods.forEach((method) => {
          if (typeof sampleInstance[method] === "function") {
            console.log(
              `Found instance method: ${className}.prototype.${method}`
            );
          } else {
            console.warn(
              `Missing instance method: ${className}.prototype.${method}`
            );
          }
        });
      } catch (error) {
        console.warn(`Couldn't create sample ${className} instance:`, error);
      }
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for SmartPointers module");
    (globalThis as any).Rc._useWasm = false;
    (globalThis as any).Weak._useWasm = false;
    (globalThis as any).RefCell._useWasm = false;
    (globalThis as any).RcRefCell._useWasm = false;
    (globalThis as any).Arc._useWasm = false;
  },
};

registerModule(smartPointersModule);

export class Rc<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private readonly _value: T;
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).Rc._useWasm,
    existingWasmRc?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm;

    if (existingWasmRc) {
      this._inner = existingWasmRc;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Rc.new === "function") {
          this._inner = wasmModule.Rc.new(initialValue);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(`WASM Rc creation failed, using JS fallback: ${error}`);
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Rc<T> {
    return new Rc(initialValue);
  }

  borrow(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): Rc<T> {
    if (this._useWasm && this._inner) {
      try {
        return new Rc(this._inner.borrow_mut(updater));
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new Rc(updater(this._value));
  }

  clone(): Rc<T> {
    if (this._useWasm && this._inner) {
      try {
        return new Rc(this._value, true, this._inner.clone());
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  drop(): Rc<T> {
    if (this._useWasm && this._inner) {
      try {
        this._inner.drop();
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  refCount(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return u32(this._inner.refCount());
      } catch (error) {
        console.warn(`WASM refCount failed, using JS fallback: ${error}`);
      }
    }
    return u32(1);
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
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
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).Weak._useWasm,
    existingWasmWeak?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm;

    if (existingWasmWeak) {
      this._inner = existingWasmWeak;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Weak.new === "function") {
          this._inner = wasmModule.Weak.new(initialValue);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(`WASM Weak creation failed, using JS fallback: ${error}`);
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Weak<T> {
    return new Weak(initialValue);
  }

  getOrDefault(defaultValue: T): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.getOrDefault(defaultValue);
      } catch (error) {
        console.warn(`WASM getOrDefault failed, using JS fallback: ${error}`);
      }
    }
    return defaultValue;
  }

  drop(): Weak<T> {
    if (this._useWasm && this._inner) {
      try {
        this._inner.drop();
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
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
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).RefCell._useWasm,
    existingWasmRefCell?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm;

    if (existingWasmRefCell) {
      this._inner = existingWasmRefCell;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.RefCell.new === "function") {
          this._inner = wasmModule.RefCell.new(initialValue);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM RefCell creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): RefCell<T> {
    return new RefCell(initialValue);
  }

  borrow(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): RefCell<T> {
    if (this._useWasm && this._inner) {
      try {
        return new RefCell(this._inner.borrow_mut(updater));
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new RefCell(updater(this._value));
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
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
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).RcRefCell._useWasm,
    existingWasmRcRefCell?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm;

    if (existingWasmRcRefCell) {
      this._inner = existingWasmRcRefCell;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.RcRefCell.new === "function") {
          this._inner = wasmModule.RcRefCell.new(initialValue);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(
          `WASM RcRefCell creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): RcRefCell<T> {
    return new RcRefCell(initialValue);
  }

  borrow(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.borrow();
      } catch (error) {
        console.warn(`WASM borrow failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  borrow_mut(updater: (value: T) => T): RcRefCell<T> {
    if (this._useWasm && this._inner) {
      try {
        return new RcRefCell(this._inner.borrow_mut(updater));
      } catch (error) {
        console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
      }
    }
    return new RcRefCell(updater(this._value));
  }

  clone(): RcRefCell<T> {
    if (this._useWasm && this._inner) {
      try {
        return new RcRefCell(this._value, true, this._inner.clone());
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  drop(): RcRefCell<T> {
    if (this._useWasm && this._inner) {
      try {
        this._inner.drop();
      } catch (error) {
        console.warn(`WASM drop failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  refCount(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return u32(this._inner.refCount());
      } catch (error) {
        console.warn(`WASM refCount failed, using JS fallback: ${error}`);
      }
    }
    return u32(1);
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
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
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).Arc._useWasm,
    existingWasmArc?: any
  ) {
    this._value = initialValue;
    this._useWasm = useWasm;

    if (existingWasmArc) {
      this._inner = existingWasmArc;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule && typeof wasmModule.Arc.new === "function") {
          this._inner = wasmModule.Arc.new(initialValue);
        } else {
          this._useWasm = false;
        }
      } catch (error) {
        console.warn(`WASM Arc creation failed, using JS fallback: ${error}`);
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Arc<T> {
    return new Arc(initialValue);
  }

  get(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get();
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._value;
  }

  set(updater: (prev: T) => T): Arc<T> {
    if (this._useWasm && this._inner) {
      try {
        return new Arc(this._inner.set(updater));
      } catch (error) {
        console.warn(`WASM set failed, using JS fallback: ${error}`);
      }
    }
    return new Arc(updater(this._value));
  }

  clone(): Arc<T> {
    if (this._useWasm && this._inner) {
      try {
        return new Arc(this._value, true, this._inner.clone());
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Arc]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Arc");
  }
}

export async function createRc<T>(initialValue: T): Promise<Rc<T>> {
  return Rc.new(initialValue);
}

export async function createWeak<T>(initialValue: T): Promise<Weak<T>> {
  return Weak.new(initialValue);
}

export async function createRefCell<T>(initialValue: T): Promise<RefCell<T>> {
  return RefCell.new(initialValue);
}

export async function createRcRefCell<T>(
  initialValue: T
): Promise<RcRefCell<T>> {
  return RcRefCell.new(initialValue);
}

export async function createArc<T>(initialValue: T): Promise<Arc<T>> {
  return Arc.new(initialValue);
}
