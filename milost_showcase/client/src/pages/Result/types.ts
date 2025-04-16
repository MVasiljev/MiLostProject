export type ResultBasicOperation = "ok" | "err";
export type ResultCheckOperation = "isOk" | "isErr" | "isError";
export type ResultUnwrapOperation =
  | "unwrap"
  | "unwrapErr"
  | "unwrapOr"
  | "expect";
export type ResultTransformOperation =
  | "map"
  | "mapErr"
  | "andThen"
  | "and"
  | "or";
export type ResultMatchOperation = "match" | "ok" | "err" | "getError";
export type ResultUtilityOperation =
  | "tryCatch"
  | "tryCatchAsync"
  | "fromValidation"
  | "all";

export type ResultOperationCategory =
  | "create"
  | "check"
  | "unwrap"
  | "transform"
  | "match"
  | "utility";

export interface ResultCreateResult {
  value?: any;
  errorValue?: any;
  operation: ResultBasicOperation;
  result: any;
  isOk: boolean;
  isErr: boolean;
}

export interface ResultCheckResult {
  original: any;
  operation: ResultCheckOperation;
  errorType?: string;
  result: boolean;
}

export interface ResultUnwrapResult {
  original: any;
  operation: ResultUnwrapOperation;
  defaultValue?: any;
  errorMessage?: string;
  result: any;
}

export interface ResultTransformResult {
  original: any;
  operation: ResultTransformOperation;
  mapFn?: string;
  errorMapFn?: string;
  alternativeResult?: any;
  result: any;
}

export interface ResultMatchResult {
  original: any;
  operation: ResultMatchOperation;
  handlers?: {
    onOk?: string;
    onErr?: string;
  };
  result: any;
}

export interface ResultUtilityResult {
  operation: ResultUtilityOperation;
  argument?: any;
  validator?: string;
  errorMessage?: string;
  results?: any[];
  result: any;
}

export type ResultOperationResult =
  | ResultCreateResult
  | ResultCheckResult
  | ResultUnwrapResult
  | ResultTransformResult
  | ResultMatchResult
  | ResultUtilityResult;

export function isResultCreateResult(
  result: unknown
): result is ResultCreateResult {
  return Boolean(
    result &&
      typeof (result as ResultCreateResult).operation === "string" &&
      ["ok", "err"].includes((result as ResultCreateResult).operation) &&
      (result as ResultCreateResult).isOk !== undefined
  );
}

export function isResultCheckResult(
  result: unknown
): result is ResultCheckResult {
  return Boolean(
    result &&
      typeof (result as ResultCheckResult).operation === "string" &&
      ["isOk", "isErr", "isError"].includes(
        (result as ResultCheckResult).operation
      ) &&
      typeof (result as ResultCheckResult).result === "boolean"
  );
}

export function isResultUnwrapResult(
  result: unknown
): result is ResultUnwrapResult {
  return Boolean(
    result &&
      typeof (result as ResultUnwrapResult).operation === "string" &&
      ["unwrap", "unwrapErr", "unwrapOr", "expect"].includes(
        (result as ResultUnwrapResult).operation
      ) &&
      (result as ResultUnwrapResult).original !== undefined
  );
}

export function isResultTransformResult(
  result: unknown
): result is ResultTransformResult {
  return Boolean(
    result &&
      typeof (result as ResultTransformResult).operation === "string" &&
      ["map", "mapErr", "andThen", "and", "or"].includes(
        (result as ResultTransformResult).operation
      ) &&
      (result as ResultTransformResult).original !== undefined
  );
}

export function isResultMatchResult(
  result: unknown
): result is ResultMatchResult {
  return Boolean(
    result &&
      typeof (result as ResultMatchResult).operation === "string" &&
      ["match", "ok", "err", "getError"].includes(
        (result as ResultMatchResult).operation
      ) &&
      (result as ResultMatchResult).original !== undefined
  );
}

export function isResultUtilityResult(
  result: unknown
): result is ResultUtilityResult {
  return Boolean(
    result &&
      typeof (result as ResultUtilityResult).operation === "string" &&
      ["tryCatch", "tryCatchAsync", "fromValidation", "all"].includes(
        (result as ResultUtilityResult).operation
      )
  );
}
