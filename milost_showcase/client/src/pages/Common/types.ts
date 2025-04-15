export type CommonOperationType =
  | "typeCheck"
  | "convertToVec"
  | "loadingStates"
  | "brandTypes"
  | "option"
  | "result";

export type TypeCheckType =
  | "defined"
  | "object"
  | "vec"
  | "str"
  | "numeric"
  | "boolean"
  | "function";

export type OptionOperation =
  | "some"
  | "none"
  | "isSome"
  | "isNone"
  | "unwrap"
  | "unwrapOr"
  | "unwrapOrElse";

export type ResultOperation =
  | "ok"
  | "err"
  | "isOk"
  | "isErr"
  | "unwrap"
  | "unwrapErr"
  | "unwrapOr"
  | "unwrapOrElse";

export type LoadingState = "IDLE" | "LOADING" | "SUCCEEDED" | "FAILED";
export type BrandType =
  | "JSON"
  | "POSITIVE"
  | "NEGATIVE"
  | "NON_NEGATIVE"
  | "PERCENTAGE";

export type CommonOperationCategory =
  | "typeCheck"
  | "convertToVec"
  | "loadingStates"
  | "brandTypes"
  | "option"
  | "result";

export interface TypeCheckResult {
  value: any;
  checkType: TypeCheckType;
  result: boolean;
}

export interface ConversionResult {
  original: any[];
  converted: any[];
  length: number;
}

export interface LoadingStateResult {
  states: {
    IDLE: string;
    LOADING: string;
    SUCCEEDED: string;
    FAILED: string;
  };
  requestedState: string | null;
}

export interface BrandTypeResult {
  types: {
    JSON: string;
    POSITIVE: string;
    NEGATIVE: string;
    NON_NEGATIVE: string;
    PERCENTAGE: string;
  };
  requestedType: string | null;
}

export interface OptionResult {
  value: any;
  operation: OptionOperation;
  result: any;
  success: boolean;
  error: string | null;
}

export interface ResultResult {
  value: any;
  errorValue?: any;
  operation: ResultOperation;
  result: any;
  success: boolean;
  error: string | null;
}

export type CommonOperationResult =
  | TypeCheckResult
  | ConversionResult
  | LoadingStateResult
  | BrandTypeResult
  | OptionResult
  | ResultResult;

export function isTypeCheckResult(result: unknown): result is TypeCheckResult {
  return Boolean(
    result &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as TypeCheckResult).checkType === "string" &&
      typeof (result as TypeCheckResult).result === "boolean"
  );
}

export function isConversionResult(
  result: unknown
): result is ConversionResult {
  return Boolean(
    result &&
      Array.isArray((result as ConversionResult).original) &&
      Array.isArray((result as ConversionResult).converted) &&
      typeof (result as ConversionResult).length === "number"
  );
}

export function isLoadingStateResult(
  result: unknown
): result is LoadingStateResult {
  return Boolean(
    result &&
      typeof (result as LoadingStateResult).states === "object" &&
      Object.prototype.hasOwnProperty.call(result, "requestedState")
  );
}

export function isBrandTypeResult(result: unknown): result is BrandTypeResult {
  return Boolean(
    result &&
      typeof (result as BrandTypeResult).types === "object" &&
      Object.prototype.hasOwnProperty.call(result, "requestedType")
  );
}

export function isOptionResult(result: unknown): result is OptionResult {
  return Boolean(
    result &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as OptionResult).operation === "string" &&
      typeof (result as OptionResult).success === "boolean" &&
      Object.prototype.hasOwnProperty.call(result, "error")
  );
}

export function isResultResult(result: unknown): result is ResultResult {
  return Boolean(
    result &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as ResultResult).operation === "string" &&
      typeof (result as ResultResult).success === "boolean" &&
      Object.prototype.hasOwnProperty.call(result, "error")
  );
}
