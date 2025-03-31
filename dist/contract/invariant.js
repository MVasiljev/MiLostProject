import { Str } from '../types/string.js';
import { ContractError } from './contract.js';
export class Invariant {
    constructor(value, invariant, errorMessage = Str.fromRaw("Invariant violated")) {
        this._value = value;
        this._invariantFn = invariant;
        this._errorMsg = errorMessage;
        if (!invariant(value)) {
            throw new ContractError(errorMessage);
        }
    }
    static new(value, invariant, errorMessage) {
        return new Invariant(value, invariant, errorMessage);
    }
    get() {
        return this._value;
    }
    map(fn, newInvariant, errorMessage) {
        const newValue = fn(this._value);
        return Invariant.new(newValue, newInvariant, errorMessage);
    }
    toString() {
        return Str.fromRaw(`[Invariant]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Invariant._type);
    }
}
Invariant._type = "Invariant";
//# sourceMappingURL=invariant.js.map