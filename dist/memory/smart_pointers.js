import { u32, Str } from "../types";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class Rc {
    constructor(initialValue, useWasm = true, existingWasmRc) {
        this._value = initialValue;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmRc) {
            this._inner = existingWasmRc;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.JsRc(initialValue);
            }
            catch (error) {
                console.warn(`WASM Rc creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new Rc(initialValue);
    }
    borrow() {
        if (this._useWasm) {
            try {
                return this._inner.borrow();
            }
            catch (error) {
                console.warn(`WASM borrow failed, using JS fallback: ${error}`);
            }
        }
        return this._value;
    }
    borrow_mut(updater) {
        if (this._useWasm) {
            try {
                const updatedValue = updater(this._inner.borrow());
                const clonedWasmRc = this._inner.clone();
                return new Rc(updatedValue, true, clonedWasmRc);
            }
            catch (error) {
                console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
            }
        }
        return new Rc(updater(this._value));
    }
    clone() {
        if (this._useWasm) {
            try {
                const clonedWasmRc = this._inner.clone();
                return new Rc(this._value, true, clonedWasmRc);
            }
            catch (error) {
                console.warn(`WASM clone failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    drop() {
        if (this._useWasm) {
            try {
                this._inner.drop();
                return this;
            }
            catch (error) {
                console.warn(`WASM drop failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    refCount() {
        if (this._useWasm) {
            try {
                return u32(this._inner.refCount());
            }
            catch (error) {
                console.warn(`WASM refCount failed, using JS fallback: ${error}`);
            }
        }
        return u32(1);
    }
    toString() {
        return Str.fromRaw(`[Rc refCount=${this.refCount()}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Rc");
    }
}
export class Weak {
    constructor(initialValue, useWasm = true, existingWasmWeak) {
        this._value = initialValue;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmWeak) {
            this._inner = existingWasmWeak;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.JsWeak(initialValue);
            }
            catch (error) {
                console.warn(`WASM Weak creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new Weak(initialValue);
    }
    getOrDefault(defaultValue) {
        if (this._useWasm) {
            try {
                return this._inner.getOrDefault(defaultValue);
            }
            catch (error) {
                console.warn(`WASM getOrDefault failed, using JS fallback: ${error}`);
            }
        }
        return defaultValue;
    }
    drop() {
        if (this._useWasm) {
            try {
                this._inner.drop();
                return this;
            }
            catch (error) {
                console.warn(`WASM drop failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    toString() {
        return Str.fromRaw(`[Weak]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Weak");
    }
}
export class RefCell {
    constructor(initialValue, useWasm = true, existingWasmRefCell) {
        this._value = initialValue;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmRefCell) {
            this._inner = existingWasmRefCell;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.JsRefCell(initialValue);
            }
            catch (error) {
                console.warn(`WASM RefCell creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new RefCell(initialValue);
    }
    borrow() {
        if (this._useWasm) {
            try {
                return this._inner.borrow();
            }
            catch (error) {
                console.warn(`WASM borrow failed, using JS fallback: ${error}`);
            }
        }
        return this._value;
    }
    borrow_mut(updater) {
        if (this._useWasm) {
            try {
                const updatedValue = updater(this._inner.borrow());
                return new RefCell(updatedValue, true, this._inner);
            }
            catch (error) {
                console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
            }
        }
        return new RefCell(updater(this._value));
    }
    toString() {
        return Str.fromRaw(`[RefCell]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("RefCell");
    }
}
export class RcRefCell {
    constructor(initialValue, useWasm = true, existingWasmRcRefCell) {
        this._value = initialValue;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmRcRefCell) {
            this._inner = existingWasmRcRefCell;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.JsRcRefCell(initialValue);
            }
            catch (error) {
                console.warn(`WASM RcRefCell creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new RcRefCell(initialValue);
    }
    borrow() {
        if (this._useWasm) {
            try {
                return this._inner.borrow();
            }
            catch (error) {
                console.warn(`WASM borrow failed, using JS fallback: ${error}`);
            }
        }
        return this._value;
    }
    borrow_mut(updater) {
        if (this._useWasm) {
            try {
                const updatedValue = updater(this._inner.borrow());
                const clonedWasmRcRefCell = this._inner.clone();
                return new RcRefCell(updatedValue, true, clonedWasmRcRefCell);
            }
            catch (error) {
                console.warn(`WASM borrow_mut failed, using JS fallback: ${error}`);
            }
        }
        return new RcRefCell(updater(this._value));
    }
    clone() {
        if (this._useWasm) {
            try {
                const clonedWasmRcRefCell = this._inner.clone();
                return new RcRefCell(this._value, true, clonedWasmRcRefCell);
            }
            catch (error) {
                console.warn(`WASM clone failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    drop() {
        if (this._useWasm) {
            try {
                this._inner.drop();
                return this;
            }
            catch (error) {
                console.warn(`WASM drop failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    refCount() {
        if (this._useWasm) {
            try {
                return u32(this._inner.refCount());
            }
            catch (error) {
                console.warn(`WASM refCount failed, using JS fallback: ${error}`);
            }
        }
        return u32(1);
    }
    toString() {
        return Str.fromRaw(`[RcRefCell refCount=${this.refCount()}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("RcRefCell");
    }
}
export class Arc {
    constructor(initialValue, useWasm = true, existingWasmArc) {
        this._value = initialValue;
        this._useWasm = useWasm && isWasmInitialized();
        if (existingWasmArc) {
            this._inner = existingWasmArc;
        }
        else if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = new wasmModule.JsArc(initialValue);
            }
            catch (error) {
                console.warn(`WASM Arc creation failed, falling back to JS implementation: ${error}`);
                this._useWasm = false;
            }
        }
    }
    static new(initialValue) {
        return new Arc(initialValue);
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
        return this._value;
    }
    set(updater) {
        if (this._useWasm) {
            try {
                const updatedValue = updater(this._inner.get());
                this._inner.set(() => updatedValue);
                return new Arc(updatedValue, true, this._inner);
            }
            catch (error) {
                console.warn(`WASM set failed, using JS fallback: ${error}`);
            }
        }
        return new Arc(updater(this._value));
    }
    clone() {
        if (this._useWasm) {
            try {
                const clonedWasmArc = this._inner.clone();
                return new Arc(this._value, true, clonedWasmArc);
            }
            catch (error) {
                console.warn(`WASM clone failed, using JS fallback: ${error}`);
            }
        }
        return this;
    }
    toString() {
        return Str.fromRaw(`[Arc]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw("Arc");
    }
}
export async function createRc(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return Rc.new(initialValue);
}
export async function createWeak(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return Weak.new(initialValue);
}
export async function createRefCell(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return RefCell.new(initialValue);
}
export async function createRcRefCell(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return RcRefCell.new(initialValue);
}
export async function createArc(initialValue) {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
    return Arc.new(initialValue);
}
//# sourceMappingURL=smart_pointers.js.map