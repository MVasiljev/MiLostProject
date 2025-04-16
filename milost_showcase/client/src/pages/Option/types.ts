export type OptionBasicOperation = "some" | "none" | "from";
export type OptionAccessOperation =
  | "isSome"
  | "isNone"
  | "unwrap"
  | "unwrapOr"
  | "expect";
export type OptionTransformOperation = "map" | "andThen" | "filter" | "or";
export type OptionMatchOperation = "match";
export type OptionCombinationOperation = "firstSome" | "all";

export type OptionOperationCategory =
  | "create"
  | "access"
  | "transform"
  | "match"
  | "combine";

export interface OptionCreateResult {
  value?: any;
  operation: OptionBasicOperation;
  result: any;
  isSome: boolean;
  isNone: boolean;
}

export interface OptionAccessResult {
  original: any;
  operation: OptionAccessOperation;
  defaultValue?: any;
  errorMessage?: string;
  result: any;
}

export interface OptionTransformResult {
  original: any;
  operation: OptionTransformOperation;
  transformFn?: string;
  predicate?: string;
  otherOption?: any;
  result: any;
}

export interface OptionMatchResult {
  original: any;
  operation: OptionMatchOperation;
  handlers: {
    onSome: string;
    onNone: string;
  };
  result: any;
}

export interface OptionCombineResult {
  options: any[];
  operation: OptionCombinationOperation;
  result: any;
}

export type OptionOperationResult =
  | OptionCreateResult
  | OptionAccessResult
  | OptionTransformResult
  | OptionMatchResult
  | OptionCombineResult;

export function isOptionCreateResult(
  result: unknown
): result is OptionCreateResult {
  return Boolean(
    result &&
      typeof (result as OptionCreateResult).operation === "string" &&
      (result as OptionCreateResult).isSome !== undefined
  );
}

export function isOptionAccessResult(
  result: unknown
): result is OptionAccessResult {
  return Boolean(
    result &&
      typeof (result as OptionAccessResult).operation === "string" &&
      (result as OptionAccessResult).original !== undefined
  );
}

export function isOptionTransformResult(
  result: unknown
): result is OptionTransformResult {
  return Boolean(
    result &&
      typeof (result as OptionTransformResult).operation === "string" &&
      (result as OptionTransformResult).original !== undefined
  );
}

export function isOptionMatchResult(
  result: unknown
): result is OptionMatchResult {
  return Boolean(
    result &&
      (result as OptionMatchResult).operation === "match" &&
      (result as OptionMatchResult).handlers !== undefined
  );
}

export function isOptionCombineResult(
  result: unknown
): result is OptionCombineResult {
  return Boolean(
    result &&
      (result as OptionCombineResult).operation &&
      (result as OptionCombineResult).options !== undefined
  );
}
