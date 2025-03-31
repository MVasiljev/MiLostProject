import { Str } from "../types/string";
import { AppError } from "../core/error";

export class ContractError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export function requires<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Precondition failed")
): void {
  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

export function ensures<_T>(
  condition: boolean,
  errorMessage: Str = Str.fromRaw("Postcondition failed")
): void {
  if (!condition) {
    throw new ContractError(errorMessage);
  }
}

export function contract<T, R>(
  fn: (arg: T) => R,
  precondition?: (arg: T) => boolean,
  postcondition?: (arg: T, result: R) => boolean,
  preErrorMsg?: Str,
  postErrorMsg?: Str
): (arg: T) => R {
  return (arg: T): R => {
    if (precondition && !precondition(arg)) {
      throw new ContractError(
        preErrorMsg || Str.fromRaw("Precondition failed")
      );
    }

    const result = fn(arg);

    if (postcondition && !postcondition(arg, result)) {
      throw new ContractError(
        postErrorMsg || Str.fromRaw("Postcondition failed")
      );
    }

    return result;
  };
}
