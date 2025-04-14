export type TupleOperation = "get" | "first" | "second" | "replace" | "map";
export type TupleMapOperation =
  | "double"
  | "square"
  | "toString"
  | "increment"
  | "decrement";

export interface TupleAnalysisResult {
  original: string;
  parsed: any[];
  length: number;
  types: string[];
}

export interface TupleGetResult {
  original: any[];
  index: number;
  result: any;
}

export interface TupleFirstResult {
  original: any[];
  result: any;
}

export interface TupleSecondResult {
  original: any[];
  result: any;
}

export interface TupleReplaceResult {
  original: any[];
  index: number;
  value: any;
  result: any[];
}

export interface TupleMapResult {
  original: any[];
  operation: string;
  result: any[];
}

export type TupleOperationResult =
  | TupleAnalysisResult
  | TupleGetResult
  | TupleFirstResult
  | TupleSecondResult
  | TupleReplaceResult
  | TupleMapResult;

export function isTupleAnalysisResult(
  result: unknown
): result is TupleAnalysisResult {
  return Boolean(
    result &&
      typeof (result as TupleAnalysisResult).original === "string" &&
      Array.isArray((result as TupleAnalysisResult).parsed) &&
      Array.isArray((result as TupleAnalysisResult).types)
  );
}

export function isTupleGetResult(result: unknown): result is TupleGetResult {
  return Boolean(
    result &&
      Array.isArray((result as TupleGetResult).original) &&
      typeof (result as TupleGetResult).index === "number" &&
      Object.prototype.hasOwnProperty.call(result, "result")
  );
}

export function isTupleFirstResult(
  result: unknown
): result is TupleFirstResult {
  return Boolean(
    result &&
      Array.isArray((result as TupleFirstResult).original) &&
      Object.prototype.hasOwnProperty.call(result, "result") &&
      !Object.prototype.hasOwnProperty.call(result, "index")
  );
}

export function isTupleSecondResult(
  result: unknown
): result is TupleSecondResult {
  return Boolean(
    result &&
      Array.isArray((result as TupleSecondResult).original) &&
      Object.prototype.hasOwnProperty.call(result, "result") &&
      !Object.prototype.hasOwnProperty.call(result, "index")
  );
}

export function isTupleReplaceResult(
  result: unknown
): result is TupleReplaceResult {
  return Boolean(
    result &&
      Array.isArray((result as TupleReplaceResult).original) &&
      typeof (result as TupleReplaceResult).index === "number" &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      Array.isArray((result as TupleReplaceResult).result)
  );
}

export function isTupleMapResult(result: unknown): result is TupleMapResult {
  return Boolean(
    result &&
      Array.isArray((result as TupleMapResult).original) &&
      typeof (result as TupleMapResult).operation === "string" &&
      Array.isArray((result as TupleMapResult).result)
  );
}
