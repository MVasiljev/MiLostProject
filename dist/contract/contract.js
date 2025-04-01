import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class ContractError extends AppError {
    constructor(message) {
        super(message);
    }
}
export async function initContracts() {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
}
export function requires(condition, errorMessage = Str.fromRaw("Precondition failed")) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            wasmModule.requires(condition, errorMessage.toString());
            return;
        }
        catch (err) {
            if (err &&
                typeof err === "object" &&
                "name" in err &&
                err.name === "ContractError" &&
                "message" in err) {
                throw new ContractError(Str.fromRaw(String(err.message)));
            }
            console.warn(`WASM requires failed, using JS fallback: ${err}`);
        }
    }
    // JS fallback
    if (!condition) {
        throw new ContractError(errorMessage);
    }
}
export function ensures(condition, errorMessage = Str.fromRaw("Postcondition failed")) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            wasmModule.ensures(condition, errorMessage.toString());
            return;
        }
        catch (err) {
            if (err &&
                typeof err === "object" &&
                "name" in err &&
                err.name === "ContractError" &&
                "message" in err) {
                throw new ContractError(Str.fromRaw(String(err.message)));
            }
            console.warn(`WASM ensures failed, using JS fallback: ${err}`);
        }
    }
    // JS fallback
    if (!condition) {
        throw new ContractError(errorMessage);
    }
}
export function contract(fn, precondition, postcondition, preErrorMsg, postErrorMsg) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const contractFn = wasmModule.contract(fn, precondition, postcondition, preErrorMsg?.toString(), postErrorMsg?.toString());
            return contractFn;
        }
        catch (err) {
            console.warn(`WASM contract failed, using JS fallback: ${err}`);
        }
    }
    // JS fallback
    return (arg) => {
        if (precondition && !precondition(arg)) {
            throw new ContractError(preErrorMsg || Str.fromRaw("Precondition failed"));
        }
        const result = fn(arg);
        if (postcondition && !postcondition(arg, result)) {
            throw new ContractError(postErrorMsg || Str.fromRaw("Postcondition failed"));
        }
        return result;
    };
}
//# sourceMappingURL=contract.js.map