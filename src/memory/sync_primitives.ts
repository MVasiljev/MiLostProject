import { Str } from "../types/string";
import { u32 } from "../types/primitives";
import { AppError, ValidationError } from "../core/error";

export class Mutex<T> {
  private state: T;
  private locked: boolean;

  static readonly _type = "Mutex";

  private constructor(initialValue: T) {
    this.state = initialValue;
    this.locked = false;
  }

  static new<T>(initialValue: T): Mutex<T> {
    return new Mutex(initialValue);
  }

  async lock(updater: (prev: T) => T | Promise<T>): Promise<void> {
    if (this.locked) return;
    this.locked = true;

    try {
      this.state = await updater(this.state);
    } finally {
      this.locked = false;
    }
  }

  get(): T {
    return this.state;
  }

  isLocked(): boolean {
    return this.locked;
  }

  toString(): Str {
    return Str.fromRaw(`[Mutex locked=${this.locked}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Mutex._type);
  }
}

export class RwLock<T> {
  private state: T;
  private readers: u32;
  private locked: boolean;

  static readonly _type = "RwLock";

  private constructor(initialValue: T) {
    this.state = initialValue;
    this.readers = u32(0);
    this.locked = false;
  }

  static new<T>(initialValue: T): RwLock<T> {
    return new RwLock(initialValue);
  }

  read(): T {
    if (this.locked) {
      throw new ValidationError(Str.fromRaw("RwLock is locked for writing"));
    }
    this.readers = u32((this.readers as unknown as number) + 1);
    return this.state;
  }

  releaseRead(): void {
    if ((this.readers as unknown as number) > 0) {
      this.readers = u32((this.readers as unknown as number) - 1);
    }
  }

  write(updater: (prev: T) => T): void {
    if (this.locked || (this.readers as unknown as number) > 0) {
      throw new ValidationError(Str.fromRaw("RwLock is in use"));
    }
    this.locked = true;
    this.state = updater(this.state);
    this.locked = false;
  }

  getReaders(): u32 {
    return this.readers;
  }

  isWriteLocked(): boolean {
    return this.locked;
  }

  toString(): Str {
    return Str.fromRaw(
      `[RwLock readers=${this.readers} writeLocked=${this.locked}]`
    );
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(RwLock._type);
  }
}

export class ArcMutex<T> {
  private sharedState: { value: T };
  private locked: boolean;

  static readonly _type = "ArcMutex";

  private constructor(initialValue: T) {
    this.sharedState = { value: initialValue };
    this.locked = false;
  }

  static new<T>(initialValue: T): ArcMutex<T> {
    return new ArcMutex(initialValue);
  }

  get(): T {
    return this.sharedState.value;
  }

  set(updater: (prev: T) => T): void {
    if (this.locked) return;
    this.locked = true;
    this.sharedState.value = updater(this.sharedState.value);
    this.locked = false;
  }

  async setAsync(
    updater: (prev: T) => Promise<T>,
    options?: { retries?: u32; fallback?: (error: AppError) => T }
  ): Promise<void> {
    if (this.locked) return;
    this.locked = true;

    let retries = options?.retries ? (options.retries as unknown as number) : 3;
    while (retries > 0) {
      try {
        this.sharedState.value = await updater(this.sharedState.value);
        this.locked = false;
        return;
      } catch (error) {
        retries--;
        if (retries === 0 && options?.fallback) {
          this.sharedState.value = options.fallback(error as AppError);
        }
      }
    }

    this.locked = false;
  }

  clone(): ArcMutex<T> {
    return this;
  }

  isLocked(): boolean {
    return this.locked;
  }

  toString(): Str {
    return Str.fromRaw(`[ArcMutex locked=${this.locked}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(ArcMutex._type);
  }
}

export function createMutex<T>(initialValue: T): Mutex<T> {
  return Mutex.new(initialValue);
}

export function createRwLock<T>(initialValue: T): RwLock<T> {
  return RwLock.new(initialValue);
}

export function createArcMutex<T>(initialValue: T): ArcMutex<T> {
  return ArcMutex.new(initialValue);
}
