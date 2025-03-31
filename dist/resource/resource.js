import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
export class ResourceError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Resource {
    constructor(value, dispose) {
        this._disposed = false;
        this._value = value;
        this._dispose = dispose;
    }
    static new(value, dispose) {
        return new Resource(value, dispose);
    }
    use(fn) {
        if (this._disposed || this._value === null) {
            throw new ResourceError(Str.fromRaw("Resource has been disposed"));
        }
        return fn(this._value);
    }
    async useAsync(fn) {
        if (this._disposed || this._value === null) {
            throw new ResourceError(Str.fromRaw("Resource has been disposed"));
        }
        return fn(this._value);
    }
    async dispose() {
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
        return this._disposed;
    }
    get valueOrNone() {
        return this._disposed || this._value === null
            ? Option.None()
            : Option.Some(this._value);
    }
    toString() {
        return Str.fromRaw(`[Resource ${this._disposed ? "disposed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Resource._type);
    }
}
Resource._type = "Resource";
export async function withResource(resource, fn) {
    try {
        const result = await Promise.resolve(resource.use(fn));
        return result;
    }
    finally {
        await resource.dispose();
    }
}
//# sourceMappingURL=resource.js.map