import { Vec } from ".";
import { identity } from "../core";
import { limits } from "./primitives";
import { Str } from "./string";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export const LoadingStates = (() => {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const loadingStates = new wasmModule.LoadingStates();
            return {
                IDLE: loadingStates.idle,
                LOADING: loadingStates.loading,
                SUCCEEDED: loadingStates.succeeded,
                FAILED: loadingStates.failed,
            };
        }
        catch (error) {
            console.warn(`WASM LoadingStates initialization failed, using JS implementation: ${error}`);
        }
    }
    return {
        IDLE: Str.fromRaw("idle"),
        LOADING: Str.fromRaw("loading"),
        SUCCEEDED: Str.fromRaw("succeeded"),
        FAILED: Str.fromRaw("failed"),
    };
})();
export function isDefined(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isDefined(value);
        }
        catch (error) {
            console.warn(`WASM isDefined failed, using JS fallback: ${error}`);
        }
    }
    return value !== null && value !== undefined;
}
export function isObject(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isObject(value);
        }
        catch (error) {
            console.warn(`WASM isObject failed, using JS fallback: ${error}`);
        }
    }
    return typeof value === "object" && value !== null && !isVec(value);
}
export function isVec(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isVec(value);
        }
        catch (error) {
            console.warn(`WASM isVec failed, using JS fallback: ${error}`);
        }
    }
    return value instanceof Vec;
}
export function isStr(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isStr(value);
        }
        catch (error) {
            console.warn(`WASM isStr failed, using JS fallback: ${error}`);
        }
    }
    return value instanceof Str;
}
export function isNumeric(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isNumeric(value);
        }
        catch (error) {
            console.warn(`WASM isNumeric failed, using JS fallback: ${error}`);
        }
    }
    if (typeof value !== "number" || Number.isNaN(value))
        return false;
    const numValue = value;
    if (Number.isInteger(numValue)) {
        if (numValue >= limits.u32[0] && numValue <= limits.u32[1])
            return true;
        if (numValue >= limits.i32[0] && numValue <= limits.i32[1])
            return true;
    }
    if (Number.isFinite(numValue)) {
        if (numValue >= limits.f64[0] && numValue <= limits.f64[1])
            return true;
    }
    return false;
}
export function isBoolean(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isBoolean(value);
        }
        catch (error) {
            console.warn(`WASM isBoolean failed, using JS fallback: ${error}`);
        }
    }
    return typeof value === "boolean";
}
export function isFunction(value) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.isFunction(value);
        }
        catch (error) {
            console.warn(`WASM isFunction failed, using JS fallback: ${error}`);
        }
    }
    return typeof value === "function";
}
export const BrandTypes = (() => {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const brandTypes = new wasmModule.BrandTypes();
            return {
                JSON: brandTypes.JSON,
                POSITIVE: brandTypes.POSITIVE,
                NEGATIVE: brandTypes.NEGATIVE,
                NON_NEGATIVE: brandTypes.NON_NEGATIVE,
                PERCENTAGE: brandTypes.PERCENTAGE,
            };
        }
        catch (error) {
            console.warn(`WASM BrandTypes initialization failed, using JS implementation: ${error}`);
        }
    }
    return {
        JSON: Str.fromRaw("Json"),
        POSITIVE: Str.fromRaw("Positive"),
        NEGATIVE: Str.fromRaw("Negative"),
        NON_NEGATIVE: Str.fromRaw("NonNegative"),
        PERCENTAGE: Str.fromRaw("Percentage"),
    };
})();
export function iterableToVec(iterable) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            return wasmModule.iterableToVec(iterable);
        }
        catch (error) {
            console.warn(`WASM iterableToVec failed, using JS fallback: ${error}`);
        }
    }
    return Vec.from(iterable);
}
let typesInstance = null;
export const Types = (() => {
    const jsFallback = {
        isDefined,
        isObject,
        isVec,
        isStr,
        isNumeric,
        isBoolean,
        isFunction,
        identity,
        iterableToVec,
    };
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const wasmTypes = wasmModule.createTypes();
            wasmTypes.wasmInstance = wasmModule;
            typesInstance = wasmTypes;
            return wasmTypes;
        }
        catch (error) {
            console.warn(`WASM Types initialization failed, using JS implementation: ${error}`);
            return jsFallback;
        }
    }
    return jsFallback;
})();
export async function initCommon() {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module initialization failed: ${error}`);
        }
    }
}
//# sourceMappingURL=common.js.map