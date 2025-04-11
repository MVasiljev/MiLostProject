/**
 * Synchronization primitives for MiLost
 *
 * Provides Mutex, RwLock, and ArcMutex implementations with
 * optional WebAssembly acceleration.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";
import { u32 } from "../types/primitives.js";
import { AppError, ValidationError } from "../core/error.js";

/**
 * Module definition for synchronization primitives WASM implementation
 */
const syncPrimitivesModule: WasmModule = {
  name: "SyncPrimitives",

  initialize(wasmModule: any) {
    console.log("Initializing SyncPrimitives module with WASM...");

    const classes = ["Mutex", "RwLock", "ArcMutex"];
    classes.forEach((className) => {
      if (
        typeof wasmModule[`Js${className}Num`] === "function" &&
        typeof wasmModule[`Js${className}Str`] === "function"
      ) {
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
      Mutex: ["lock", "get", "isLocked", "toString"],
      RwLock: [
        "read",
        "releaseRead",
        "write",
        "getReaders",
        "isWriteLocked",
        "toString",
      ],
      ArcMutex: ["get", "set", "setAsync", "clone", "isLocked", "toString"],
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
    console.log("Using JavaScript fallback for SyncPrimitives module");
    (globalThis as any).Mutex._useWasm = false;
    (globalThis as any).RwLock._useWasm = false;
    (globalThis as any).ArcMutex._useWasm = false;
  },
};

registerModule(syncPrimitivesModule);

export class Mutex<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private _state: { value: T };
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).Mutex._useWasm,
    existingWasmMutex?: any
  ) {
    this._state = { value: initialValue };
    this._useWasm = useWasm;

    if (existingWasmMutex) {
      this._inner = existingWasmMutex;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner =
          typeof initialValue === "number"
            ? new wasmModule.JsMutexNum(initialValue)
            : new wasmModule.JsMutexStr(String(initialValue));
      } catch (error) {
        console.warn(`WASM Mutex creation failed, using JS fallback: ${error}`);
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): Mutex<T> {
    return new Mutex(initialValue);
  }

  async lock(updater: (prev: T) => T | Promise<T>): Promise<void> {
    if (this._useWasm && this._inner) {
      try {
        const isLocked = this._inner.isLocked();
        if (isLocked) return;

        return new Promise((resolve, reject) => {
          try {
            const wrappedUpdater = (prev: any) => {
              const updated = updater(prev);
              return updated instanceof Promise
                ? Promise.resolve(updated).then((val) => val)
                : updated;
            };

            this._inner.lock(wrappedUpdater);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        console.warn(`WASM lock failed, using JS fallback: ${error}`);
      }
    }

    if (this._inner?.locked) return;
    this._inner.locked = true;

    try {
      this._state.value = await updater(this._state.value);
    } finally {
      this._inner.locked = false;
    }
  }

  get(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get();
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._state.value;
  }

  isLocked(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isLocked();
      } catch (error) {
        console.warn(`WASM isLocked failed, using JS fallback: ${error}`);
      }
    }
    return this._inner?.locked || false;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[Mutex locked=${this.isLocked()}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("Mutex");
  }
}

export class RwLock<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private _state: { value: T };
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).RwLock._useWasm,
    existingWasmRwLock?: any
  ) {
    this._state = { value: initialValue };
    this._useWasm = useWasm;

    if (existingWasmRwLock) {
      this._inner = existingWasmRwLock;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner =
          typeof initialValue === "number"
            ? new wasmModule.JsRwLockNum(initialValue)
            : new wasmModule.JsRwLockStr(String(initialValue));
      } catch (error) {
        console.warn(
          `WASM RwLock creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): RwLock<T> {
    return new RwLock(initialValue);
  }

  read(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.read();
      } catch (error) {
        console.warn(`WASM read failed, using JS fallback: ${error}`);
      }
    }

    if (this._inner?.locked) {
      throw new ValidationError(Str.fromRaw("RwLock is locked for writing"));
    }
    this._inner.readers = u32((this._inner.readers as unknown as number) + 1);
    return this._state.value;
  }

  releaseRead(): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.releaseRead();
        return;
      } catch (error) {
        console.warn(`WASM releaseRead failed, using JS fallback: ${error}`);
      }
    }

    if ((this._inner.readers as unknown as number) > 0) {
      this._inner.readers = u32((this._inner.readers as unknown as number) - 1);
    }
  }

  write(updater: (prev: T) => T): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.write(updater);
        return;
      } catch (error) {
        console.warn(`WASM write failed, using JS fallback: ${error}`);
      }
    }

    if (this._inner.locked || (this._inner.readers as unknown as number) > 0) {
      throw new ValidationError(Str.fromRaw("RwLock is in use"));
    }
    this._inner.locked = true;
    this._state.value = updater(this._state.value);
    this._inner.locked = false;
  }

  getReaders(): u32 {
    if (this._useWasm && this._inner) {
      try {
        return u32(this._inner.getReaders());
      } catch (error) {
        console.warn(`WASM getReaders failed, using JS fallback: ${error}`);
      }
    }
    return this._inner.readers;
  }

  isWriteLocked(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isWriteLocked();
      } catch (error) {
        console.warn(`WASM isWriteLocked failed, using JS fallback: ${error}`);
      }
    }
    return this._inner.locked;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(
      `[RwLock readers=${this._inner.readers} writeLocked=${this._inner.locked}]`
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("RwLock");
  }
}

export class ArcMutex<T> {
  private readonly _inner: any;
  private readonly _useWasm: boolean;
  private _state: { value: T };
  static _useWasm: boolean = false;

  private constructor(
    initialValue: T,
    useWasm: boolean = (globalThis as any).ArcMutex._useWasm,
    existingWasmArcMutex?: any
  ) {
    this._state = { value: initialValue };
    this._useWasm = useWasm;

    if (existingWasmArcMutex) {
      this._inner = existingWasmArcMutex;
    } else if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner =
          typeof initialValue === "number"
            ? new wasmModule.JsArcMutexNum(initialValue)
            : new wasmModule.JsArcMutexStr(String(initialValue));
      } catch (error) {
        console.warn(
          `WASM ArcMutex creation failed, using JS fallback: ${error}`
        );
        this._useWasm = false;
      }
    }
  }

  static new<T>(initialValue: T): ArcMutex<T> {
    return new ArcMutex(initialValue);
  }

  get(): T {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.get();
      } catch (error) {
        console.warn(`WASM get failed, using JS fallback: ${error}`);
      }
    }
    return this._state.value;
  }

  set(updater: (prev: T) => T): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.set(updater);
        return;
      } catch (error) {
        console.warn(`WASM set failed, using JS fallback: ${error}`);
      }
    }

    if (this._inner?.locked) return;
    this._inner.locked = true;
    this._state.value = updater(this._state.value);
    this._inner.locked = false;
  }

  async setAsync(
    updater: (prev: T) => Promise<T>,
    options?: { retries?: u32; fallback?: (error: AppError) => T }
  ): Promise<void> {
    if (this._useWasm && this._inner) {
      try {
        const retries = options?.retries
          ? (options.retries as unknown as number)
          : 3;

        const wrappedUpdater = async (prev: any) => {
          const updated = await updater(prev);
          return updated;
        };

        await this._inner.setAsync(
          wrappedUpdater,
          retries,
          options?.fallback
            ? (error: any) => options.fallback!(error)
            : undefined
        );
        return;
      } catch (error) {
        console.warn(`WASM setAsync failed, using JS fallback: ${error}`);
      }
    }

    if (this._inner?.locked) return;
    this._inner.locked = true;

    let retries = options?.retries ? (options.retries as unknown as number) : 3;
    while (retries > 0) {
      try {
        this._state.value = await updater(this._state.value);
        this._inner.locked = false;
        return;
      } catch (error) {
        retries--;
        if (retries === 0 && options?.fallback) {
          this._state.value = options.fallback(error as AppError);
        }
      }
    }

    this._inner.locked = false;
  }

  clone(): ArcMutex<T> {
    if (this._useWasm && this._inner) {
      try {
        const clonedWasmArcMutex = this._inner.clone();
        return new ArcMutex(this._state.value, true, clonedWasmArcMutex);
      } catch (error) {
        console.warn(`WASM clone failed, using JS fallback: ${error}`);
      }
    }
    return this;
  }

  isLocked(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isLocked();
      } catch (error) {
        console.warn(`WASM isLocked failed, using JS fallback: ${error}`);
      }
    }
    return this._inner?.locked || false;
  }

  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (error) {
        console.warn(`WASM toString failed, using JS fallback: ${error}`);
      }
    }
    return Str.fromRaw(`[ArcMutex locked=${this.isLocked()}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw("ArcMutex");
  }
}

export async function createMutex<T>(initialValue: T): Promise<Mutex<T>> {
  return Mutex.new(initialValue);
}

export async function createRwLock<T>(initialValue: T): Promise<RwLock<T>> {
  return RwLock.new(initialValue);
}

export async function createArcMutex<T>(initialValue: T): Promise<ArcMutex<T>> {
  return ArcMutex.new(initialValue);
}
