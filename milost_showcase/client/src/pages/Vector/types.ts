export type VectorBasicOperation = "reverse";
export type VectorMapOperation =
  | "double"
  | "square"
  | "add1"
  | "negate"
  | "toString";
export type VectorFilterOperation =
  | "greaterThan"
  | "lessThan"
  | "equals"
  | "even"
  | "odd";
export type VectorReduceOperation =
  | "sum"
  | "product"
  | "min"
  | "max"
  | "average";
export type VectorTakeDropOperation = "take" | "drop";
export type VectorCheckOperation = "all" | "any";

export type VectorOperationCategory =
  | "analyze"
  | "basic"
  | "map"
  | "filter"
  | "reduce"
  | "takeAndDrop"
  | "check";

export interface VectorAnalysisResult {
  original: number[];
  length: number;
  isEmpty: boolean;
}

export interface VectorBasicOperationResult {
  original: number[];
  operation: VectorBasicOperation;
  result: number[];
}

export interface VectorMapOperationResult {
  original: number[];
  operation: VectorMapOperation;
  result: any[];
}

export interface VectorFilterOperationResult {
  original: number[];
  operation: VectorFilterOperation;
  parameter?: number;
  result: number[];
}

export interface VectorReduceOperationResult {
  original: number[];
  operation: VectorReduceOperation;
  initialValue?: number;
  result: number;
}

export interface VectorTakeDropOperationResult {
  original: number[];
  operation: VectorTakeDropOperation;
  count: number;
  result: number[];
}

export interface VectorCheckOperationResult {
  original: number[];
  operation: VectorCheckOperation;
  parameter: number;
  result: boolean;
}

export type VectorOperationResult =
  | VectorAnalysisResult
  | VectorBasicOperationResult
  | VectorMapOperationResult
  | VectorFilterOperationResult
  | VectorReduceOperationResult
  | VectorTakeDropOperationResult
  | VectorCheckOperationResult;

export function isVectorAnalysisResult(
  result: unknown
): result is VectorAnalysisResult {
  return Boolean(
    result &&
      typeof (result as VectorAnalysisResult).length === "number" &&
      typeof (result as VectorAnalysisResult).isEmpty === "boolean"
  );
}

export function isVectorBasicOperationResult(
  result: unknown
): result is VectorBasicOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorBasicOperationResult).operation === "string" &&
      Array.isArray((result as VectorBasicOperationResult).result)
  );
}

export function isVectorMapOperationResult(
  result: unknown
): result is VectorMapOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorMapOperationResult).operation === "string" &&
      Array.isArray((result as VectorMapOperationResult).result)
  );
}

export function isVectorFilterOperationResult(
  result: unknown
): result is VectorFilterOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorFilterOperationResult).operation === "string" &&
      Array.isArray((result as VectorFilterOperationResult).result)
  );
}

export function isVectorReduceOperationResult(
  result: unknown
): result is VectorReduceOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorReduceOperationResult).operation === "string" &&
      typeof (result as VectorReduceOperationResult).result === "number"
  );
}

export function isVectorTakeDropOperationResult(
  result: unknown
): result is VectorTakeDropOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorTakeDropOperationResult).operation === "string" &&
      typeof (result as VectorTakeDropOperationResult).count === "number" &&
      Array.isArray((result as VectorTakeDropOperationResult).result)
  );
}

export function isVectorCheckOperationResult(
  result: unknown
): result is VectorCheckOperationResult {
  return Boolean(
    result &&
      typeof (result as VectorCheckOperationResult).operation === "string" &&
      typeof (result as VectorCheckOperationResult).result === "boolean"
  );
}
