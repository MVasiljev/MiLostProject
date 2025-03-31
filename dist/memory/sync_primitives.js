import { Str } from "../types/string.js";
import { u32 } from "../types/primitives.js";
import { ValidationError } from "../core/error.js";
export class Mutex {
    constructor(initialValue) {
        this.state = initialValue;
        this.locked = false;
    }
    static new(initialValue) {
        return new Mutex(initialValue);
    }
    async lock(updater) {
        if (this.locked)
            return;
        this.locked = true;
        try {
            this.state = await updater(this.state);
        }
        finally {
            this.locked = false;
        }
    }
    get() {
        return this.state;
    }
    isLocked() {
        return this.locked;
    }
    toString() {
        return Str.fromRaw(`[Mutex locked=${this.locked}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Mutex._type);
    }
}
Mutex._type = "Mutex";
export class RwLock {
    constructor(initialValue) {
        this.state = initialValue;
        this.readers = u32(0);
        this.locked = false;
    }
    static new(initialValue) {
        return new RwLock(initialValue);
    }
    read() {
        if (this.locked) {
            throw new ValidationError(Str.fromRaw("RwLock is locked for writing"));
        }
        this.readers = u32(this.readers + 1);
        return this.state;
    }
    releaseRead() {
        if (this.readers > 0) {
            this.readers = u32(this.readers - 1);
        }
    }
    write(updater) {
        if (this.locked || this.readers > 0) {
            throw new ValidationError(Str.fromRaw("RwLock is in use"));
        }
        this.locked = true;
        this.state = updater(this.state);
        this.locked = false;
    }
    getReaders() {
        return this.readers;
    }
    isWriteLocked() {
        return this.locked;
    }
    toString() {
        return Str.fromRaw(`[RwLock readers=${this.readers} writeLocked=${this.locked}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(RwLock._type);
    }
}
RwLock._type = "RwLock";
export class ArcMutex {
    constructor(initialValue) {
        this.sharedState = { value: initialValue };
        this.locked = false;
    }
    static new(initialValue) {
        return new ArcMutex(initialValue);
    }
    get() {
        return this.sharedState.value;
    }
    set(updater) {
        if (this.locked)
            return;
        this.locked = true;
        this.sharedState.value = updater(this.sharedState.value);
        this.locked = false;
    }
    async setAsync(updater, options) {
        if (this.locked)
            return;
        this.locked = true;
        let retries = options?.retries ? options.retries : 3;
        while (retries > 0) {
            try {
                this.sharedState.value = await updater(this.sharedState.value);
                this.locked = false;
                return;
            }
            catch (error) {
                retries--;
                if (retries === 0 && options?.fallback) {
                    this.sharedState.value = options.fallback(error);
                }
            }
        }
        this.locked = false;
    }
    clone() {
        return this;
    }
    isLocked() {
        return this.locked;
    }
    toString() {
        return Str.fromRaw(`[ArcMutex locked=${this.locked}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(ArcMutex._type);
    }
}
ArcMutex._type = "ArcMutex";
export function createMutex(initialValue) {
    return Mutex.new(initialValue);
}
export function createRwLock(initialValue) {
    return RwLock.new(initialValue);
}
export function createArcMutex(initialValue) {
    return ArcMutex.new(initialValue);
}
//# sourceMappingURL=sync_primitives.js.map