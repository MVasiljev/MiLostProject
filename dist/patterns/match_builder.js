import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export const __ = Symbol("Wildcard");
export class MatchBuilder {
    constructor(value) {
        this.arms = [];
        this.value = value;
        this._useWasm = isWasmInitialized();
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createMatchBuilder(value);
            }
            catch (err) {
                console.warn(`WASM MatchBuilder creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
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
        // If using WASM, make sure the wildcard symbol matches
        if (isWasmInitialized()) {
            try {
                const wasmModule = getWasmModule();
                if (wasmModule.getWildcardSymbol) {
                    // This ensures our wildcard symbol matches the one from WASM
                    // We can't replace the existing symbol directly, but we'll use it for comparison
                }
            }
            catch (err) {
                console.warn(`WASM wildcard symbol initialization failed: ${err}`);
            }
        }
    }
    with(pattern, handler) {
        if (this._useWasm) {
            try {
                this._inner.with(pattern, handler);
            }
            catch (err) {
                console.warn(`WASM 'with' method failed, using JS fallback: ${err}`);
                this._useWasm = false;
                this.arms.push({ pattern, handler });
            }
        }
        else {
            this.arms.push({ pattern, handler });
        }
        return this;
    }
    otherwise(defaultHandler) {
        if (this._useWasm) {
            try {
                return this._inner.otherwise(defaultHandler);
            }
            catch (err) {
                console.warn(`WASM 'otherwise' method failed, using JS fallback: ${err}`);
                this._useWasm = false;
            }
        }
        for (const arm of this.arms) {
            if (this.matchPattern(arm.pattern, this.value)) {
                return arm.handler(this.value);
            }
        }
        return defaultHandler(this.value);
    }
    matchPattern(pattern, value) {
        if (pattern === __)
            return true;
        if (typeof pattern === "function")
            return pattern(value);
        return pattern === value;
    }
}
export async function build(value) {
    await MatchBuilder.init();
    return new MatchBuilder(value);
}
//# sourceMappingURL=match_builder.js.map