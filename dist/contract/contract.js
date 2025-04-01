import { Str } from "../types/string";
import { AppError } from "../core/error";
export class ContractError extends AppError {
    constructor(message) {
        super(message);
    }
}
export function requires(condition, errorMessage = Str.fromRaw("Precondition failed")) {
    if (!condition) {
        throw new ContractError(errorMessage);
    }
}
export function ensures(condition, errorMessage = Str.fromRaw("Postcondition failed")) {
    if (!condition) {
        throw new ContractError(errorMessage);
    }
}
export function contract(fn, precondition, postcondition, preErrorMsg, postErrorMsg) {
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