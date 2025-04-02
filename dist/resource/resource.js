import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class ResourceError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Resource {
    constructor(value, dispose, useWasm = true, existingWasmResource) {
        this._disposed = false;
        this._value = value;
        this._dispose = dispose;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmResource) {
            this._inner = existingWasmResource;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createManagedResource(value, this._createDisposeFn(dispose));
            }
            catch (err) {
                console.warn(`WASM Resource creation failed, falling back to JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    _createDisposeFn(disposeFn) {
        return function (value) {
            const result = disposeFn(value);
            return result instanceof Promise ? result : Promise.resolve();
        };
    }
    static async init() {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
    }
    static new(value, dispose) {
        return new Resource(value, dispose);
    }
    static fromWasmResource(value, dispose, wasmResource) {
        return new Resource(value, dispose, true, wasmResource);
    }
    use(fn) {
        if (this._useWasm) {
            try {
                return this._inner.use(fn);
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "name" in err &&
                    err.name === "ResourceError" &&
                    "message" in err) {
                    throw new ResourceError(Str.fromRaw(String(err.message)));
                }
                console.warn(`WASM use failed, using JS fallback: ${err}`);
            }
        }
        if (this._disposed || this._value === null) {
            throw new ResourceError(Str.fromRaw("Resource has been disposed"));
        }
        return fn(this._value);
    }
    async useAsync(fn) {
        if (this._useWasm) {
            try {
                const result = this._inner.use(fn);
                return await Promise.resolve(result);
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "name" in err &&
                    err.name === "ResourceError" &&
                    "message" in err) {
                    throw new ResourceError(Str.fromRaw(String(err.message)));
                }
                console.warn(`WASM useAsync failed, using JS fallback: ${err}`);
            }
        }
        if (this._disposed || this._value === null) {
            throw new ResourceError(Str.fromRaw("Resource has been disposed"));
        }
        return fn(this._value);
    }
    async dispose() {
        if (this._useWasm) {
            try {
                await this._inner.dispose();
                this._disposed = true;
                this._value = null;
                return;
            }
            catch (err) {
                console.warn(`WASM dispose failed, using JS fallback: ${err}`);
            }
        }
        if (!this._disposed && this._value !== null) {
            const disposeResult = this._dispose(this._value);
            if (disposeResult instanceof Promise) {
                await disposeResult;
            }
            this._disposed = true;
            this._value = null;
        }
    }
    get isDisposed() {
        if (this._useWasm) {
            try {
                return this._inner.isDisposed;
            }
            catch (err) {
                console.warn(`WASM isDisposed failed, using JS fallback: ${err}`);
            }
        }
        return this._disposed;
    }
    get valueOrNone() {
        if (this._useWasm) {
            try {
                const optionObj = this._inner.valueOrNone;
                if (optionObj &&
                    typeof optionObj === "object" &&
                    "isSome" in optionObj) {
                    return optionObj.isSome
                        ? Option.Some(optionObj.value)
                        : Option.None();
                }
            }
            catch (err) {
                console.warn(`WASM valueOrNone failed, using JS fallback: ${err}`);
            }
        }
        return this._disposed || this._value === null
            ? Option.None()
            : Option.Some(this._value);
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (err) {
                console.warn(`WASM toString failed, using JS fallback: ${err}`);
            }
        }
        return Str.fromRaw(`[Resource ${this._disposed ? "disposed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Resource._type);
    }
}
Resource._type = "Resource";
export async function withResource(resource, fn) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const innerResource = resource._inner;
            if (innerResource) {
                return await wasmModule.withManagedResource(innerResource, fn);
            }
        }
        catch (err) {
            console.warn(`WASM withResource failed, using JS fallback: ${err}`);
        }
    }
    try {
        const result = await Promise.resolve(resource.use(fn));
        return result;
    }
    finally {
        await resource.dispose();
    }
}
//# sourceMappingURL=resource.js.map