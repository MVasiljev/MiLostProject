import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
import { Str } from "../types/string";
import { u32 } from "../types/primitives";
import { ValidationError } from "../core/error";
export class Mutex {
    constructor(initialValue, useWasm = true, existingWasmMutex) {
        this._state = { value: initialValue };
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmMutex) {
            this._inner = existingWasmMutex;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                // Determine appropriate WASM constructor based on type
                this._inner =
                    typeof initialValue === "number"
                        ? new wasmModule.JsMutexNum(initialValue)
                        : new wasmModule.JsMutexStr(String(initialValue));
            }
            catch (error) {
                console.warn(`WASM Mutex creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new Mutex(initialValue);
    }
    async lock(updater) {
        if (this._useWasm) {
            try {
                const isLocked = this._inner.isLocked();
                if (isLocked)
                    return;
                return new Promise((resolve, reject) => {
                    try {
                        const wrappedUpdater = (prev) => {
                            const updated = updater(prev);
                            return updated instanceof Promise
                                ? Promise.resolve(updated).then((val) => val)
                                : updated;
                        };
                        this._inner.lock(wrappedUpdater);
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }
            catch (error) {
                console.warn(`WASM lock failed, using JS fallback: ${error}`);
            }
        }
        // Fallback JS implementation
        if (this._inner?.locked)
            return;
        this._inner.locked = true;
        try {
            this._state.value = await updater(this._state.value);
        }
        finally {
            this._inner.locked = false;
        }
    }
    get() {
        if (this._useWasm) {
            try {
                return this._inner.get();
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return this._state.value;
    }
    isLocked() {
        if (this._useWasm) {
            try {
                return this._inner.isLocked();
            }
            catch (error) {
                console.warn(`WASM isLocked failed, using JS fallback: ${error}`);
            }
        }
        return this._inner?.locked || false;
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (error) {
                console.warn(`WASM toString failed, using JS fallback: ${error}`);
            }
        }
        return Str.fromRaw(`[Mutex locked=${this.isLocked()}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Mutex");
    }
}
export class RwLock {
    constructor(initialValue, useWasm = true, existingWasmRwLock) {
        this._state = { value: initialValue };
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmRwLock) {
            this._inner = existingWasmRwLock;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                // Determine appropriate WASM constructor based on type
                this._inner =
                    typeof initialValue === "number"
                        ? new wasmModule.JsRwLockNum(initialValue)
                        : new wasmModule.JsRwLockStr(String(initialValue));
            }
            catch (error) {
                console.warn(`WASM RwLock creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new RwLock(initialValue);
    }
    read() {
        if (this._useWasm) {
            try {
                return this._inner.read();
            }
            catch (error) {
                console.warn(`WASM read failed, using JS fallback: ${error}`);
            }
        }
        if (this._inner?.locked) {
            throw new ValidationError(Str.fromRaw("RwLock is locked for writing"));
        }
        this._inner.readers = u32(this._inner.readers + 1);
        return this._state.value;
    }
    releaseRead() {
        if (this._useWasm) {
            try {
                this._inner.releaseRead();
                return;
            }
            catch (error) {
                console.warn(`WASM releaseRead failed, using JS fallback: ${error}`);
            }
        }
        if (this._inner.readers > 0) {
            this._inner.readers = u32(this._inner.readers - 1);
        }
    }
    write(updater) {
        if (this._useWasm) {
            try {
                this._inner.write(updater);
                return;
            }
            catch (error) {
                console.warn(`WASM write failed, using JS fallback: ${error}`);
            }
        }
        if (this._inner.locked || this._inner.readers > 0) {
            throw new ValidationError(Str.fromRaw("RwLock is in use"));
        }
        this._inner.locked = true;
        this._state.value = updater(this._state.value);
        this._inner.locked = false;
    }
    getReaders() {
        if (this._useWasm) {
            try {
                return u32(this._inner.getReaders());
            }
            catch (error) {
                console.warn(`WASM getReaders failed, using JS fallback: ${error}`);
            }
        }
        return this._inner.readers;
    }
    isWriteLocked() {
        if (this._useWasm) {
            try {
                return this._inner.isWriteLocked();
            }
            catch (error) {
                console.warn(`WASM isWriteLocked failed, using JS fallback: ${error}`);
            }
        }
        return this._inner.locked;
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (error) {
                console.warn(`WASM toString failed, using JS fallback: ${error}`);
            }
        }
        return Str.fromRaw(`[RwLock readers=${this._inner.readers} writeLocked=${this._inner.locked}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("RwLock");
    }
}
export class ArcMutex {
    constructor(initialValue, useWasm = true, existingWasmArcMutex) {
        this._state = { value: initialValue };
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmArcMutex) {
            this._inner = existingWasmArcMutex;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                // Determine appropriate WASM constructor based on type
                this._inner =
                    typeof initialValue === "number"
                        ? new wasmModule.JsArcMutexNum(initialValue)
                        : new wasmModule.JsArcMutexStr(String(initialValue));
            }
            catch (error) {
                console.warn(`WASM ArcMutex creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new ArcMutex(initialValue);
    }
    get() {
        if (this._useWasm) {
            try {
                return this._inner.get();
            }
            catch (error) {
                console.warn(`WASM get failed, using JS fallback: ${error}`);
            }
        }
        return this._state.value;
    }
    set(updater) {
        if (this._useWasm) {
            try {
                this._inner.set(updater);
                return;
            }
            catch (error) {
                console.warn(`WASM set failed, using JS fallback: ${error}`);
            }
        }
        if (this._inner?.locked)
            return;
        this._inner.locked = true;
        this._state.value = updater(this._state.value);
        this._inner.locked = false;
    }
    async setAsync(updater, options) {
        if (this._useWasm) {
            try {
                const retries = options?.retries
                    ? options.retries
                    : 3;
                const wrappedUpdater = async (prev) => {
                    const updated = await updater(prev);
                    return updated;
                };
                await this._inner.setAsync(wrappedUpdater, retries, options?.fallback
                    ? (error) => options.fallback(error)
                    : undefined);
                return;
            }
            catch (error) {
                console.warn(`WASM setAsync failed, using JS fallback: ${error}`);
            }
        }
        // Fallback JS implementation
        if (this._inner?.locked)
            return;
        this._inner.locked = true;
        let retries = options?.retries ? options.retries : 3;
        while (retries > 0) {
            try {
                this._state.value = await updater(this._state.value);
                this._inner.locked = false;
                return;
            }
            catch (error) {
                retries--;
                if (retries === 0 && options?.fallback) {
                    this._state.value = options.fallback(error);
                }
            }
        }
        this._inner.locked = false;
    }
    clone() {
        if (this._useWasm) {
            try {
                // This assumes the WASM implementation supports clone
                // You might need to adjust based on your exact WASM implementation
                const clonedWasmArcMutex = this._inner.clone();
                return new ArcMutex(this._state.value, true, clonedWasmArcMutex);
            }
            catch (error) {
                console.warn(`WASM clone failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    isLocked() {
        if (this._useWasm) {
            try {
                return this._inner.isLocked();
            }
            catch (error) {
                console.warn(`WASM isLocked failed, using JS fallback: ${error}`);
            }
        }
        return this._inner?.locked || false;
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (error) {
                console.warn(`WASM toString failed, using JS fallback: ${error}`);
            }
        }
        return Str.fromRaw(`[ArcMutex locked=${this.isLocked()}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("ArcMutex");
    }
}
export async function createMutex(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return Mutex.new(initialValue);
}
export async function createRwLock(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return RwLock.new(initialValue);
}
export async function createArcMutex(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return ArcMutex.new(initialValue);
}
//# sourceMappingURL=sync_primitives.js.map