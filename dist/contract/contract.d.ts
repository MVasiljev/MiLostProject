import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
export declare class ContractError extends AppError {
    constructor(message: Str);
}
export declare function initContracts(): Promise<void>;
export declare function requires<_T>(condition: boolean, errorMessage?: Str): void;
export declare function ensures<_T>(condition: boolean, errorMessage?: Str): void;
export declare function contract<T, R>(fn: (arg: T) => R, precondition?: (arg: T) => boolean, postcondition?: (arg: T, result: R) => boolean, preErrorMsg?: Str, postErrorMsg?: Str): (arg: T) => R;
