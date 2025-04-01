import { Str } from "../types/string";
import { u32 } from "../types/primitives";
import { AppError } from "../core/error";
export declare class Mutex<T> {
    private state;
    private locked;
    static readonly _type = "Mutex";
    private constructor();
    static new<T>(initialValue: T): Mutex<T>;
    lock(updater: (prev: T) => T | Promise<T>): Promise<void>;
    get(): T;
    isLocked(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class RwLock<T> {
    private state;
    private readers;
    private locked;
    static readonly _type = "RwLock";
    private constructor();
    static new<T>(initialValue: T): RwLock<T>;
    read(): T;
    releaseRead(): void;
    write(updater: (prev: T) => T): void;
    getReaders(): u32;
    isWriteLocked(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class ArcMutex<T> {
    private sharedState;
    private locked;
    static readonly _type = "ArcMutex";
    private constructor();
    static new<T>(initialValue: T): ArcMutex<T>;
    get(): T;
    set(updater: (prev: T) => T): void;
    setAsync(updater: (prev: T) => Promise<T>, options?: {
        retries?: u32;
        fallback?: (error: AppError) => T;
    }): Promise<void>;
    clone(): ArcMutex<T>;
    isLocked(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare function createMutex<T>(initialValue: T): Mutex<T>;
export declare function createRwLock<T>(initialValue: T): RwLock<T>;
export declare function createArcMutex<T>(initialValue: T): ArcMutex<T>;
