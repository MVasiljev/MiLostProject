import { Str } from "../types/string.js";
import { Resource } from "./resource.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export async function asResource(disposable) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const wasmResource = wasmModule.asResource(disposable);
            return Resource.fromWasmResource(disposable, (d) => d.dispose(), wasmResource);
        }
        catch (err) {
            console.warn(`WASM asResource failed, using JS fallback: ${err}`);
        }
    }
    return Resource.new(disposable, (d) => d.dispose());
}
export class DisposableGroup {
    constructor(useWasm = true, existingWasmGroup) {
        this._disposables = [];
        this._disposed = false;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmGroup) {
            this._inner = existingWasmGroup;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createDisposableGroup();
            }
            catch (err) {
                console.warn(`WASM DisposableGroup creation failed, falling back to JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static new() {
        return new DisposableGroup();
    }
    static empty() {
        return DisposableGroup.new();
    }
    static async create() {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
        return new DisposableGroup();
    }
    static fromWasmGroup(wasmGroup) {
        return new DisposableGroup(true, wasmGroup);
    }
    add(disposable) {
        if (this._useWasm) {
            try {
                const newWasmGroup = this._inner.add(disposable);
                const newGroup = DisposableGroup.fromWasmGroup(newWasmGroup);
                newGroup._disposables = [...this._disposables, disposable];
                newGroup._disposed = this._disposed;
                return newGroup;
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "message" in err &&
                    String(err.message).includes("Cannot add to disposed group")) {
                    throw new Error("Cannot add to disposed group");
                }
                console.warn(`WASM add failed, using JS fallback: ${err}`);
            }
        }
        if (this._disposed) {
            throw new Error("Cannot add to disposed group");
        }
        const newGroup = new DisposableGroup(false);
        newGroup._disposables = [...this._disposables, disposable];
        newGroup._disposed = this._disposed;
        return newGroup;
    }
    async dispose() {
        if (this._useWasm) {
            try {
                await this._inner.dispose();
                this._disposed = true;
                this._disposables = [];
                return;
            }
            catch (err) {
                console.warn(`WASM dispose failed, using JS fallback: ${err}`);
            }
        }
        if (!this._disposed) {
            this._disposed = true;
            for (let i = this._disposables.length - 1; i >= 0; i--) {
                try {
                    const result = this._disposables[i].dispose();
                    if (result instanceof Promise) {
                        await result;
                    }
                }
                catch (err) {
                    console.error("Error disposing resource:", err);
                }
            }
            this._disposables = [];
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
    get size() {
        if (this._useWasm) {
            try {
                return this._inner.size;
            }
            catch (err) {
                console.warn(`WASM size failed, using JS fallback: ${err}`);
            }
        }
        return this._disposables.length;
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
        return Str.fromRaw(`[DisposableGroup size=${this._disposables.length} disposed=${this._disposed}]`);
    }
    get [Symbol.toStringTag]() {
        return DisposableGroup._type;
    }
}
DisposableGroup._type = "DisposableGroup";
//# sourceMappingURL=disposable.js.map