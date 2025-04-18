export type HashSetOperation =
  | "contains"
  | "insert"
  | "remove"
  | "map"
  | "filter"
  | "values"
  | "size"
  | "isEmpty";

export type HashSetMapOperation =
  | "double"
  | "square"
  | "toString"
  | "increment"
  | "uppercase"
  | "lowercase";

export type HashSetFilterOperation =
  | "greaterThan"
  | "lessThan"
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith";

export type HashSetSetOperation =
  | "union"
  | "intersection"
  | "difference"
  | "symmetricDifference"
  | "isSubset"
  | "isSuperset";

export type HashSetOperationCategory =
  | "analyze"
  | "contains"
  | "insert"
  | "remove"
  | "map"
  | "filter"
  | "setOperation";

export interface HashSetAnalysisResult {
  original: string;
  parsed: any[];
  size: number;
  isEmpty: boolean;
  values: any[];
}

export interface HashSetContainsResult {
  original: any[];
  value: any;
  contains: boolean;
}

export interface HashSetInsertResult {
  original: any[];
  value: any;
  result: any[];
  size: number;
  valueWasNew: boolean;
}

export interface HashSetRemoveResult {
  original: any[];
  value: any;
  result: any[];
  size: number;
  valueExisted: boolean;
}

export interface HashSetMapResult {
  original: any[];
  operation: HashSetMapOperation;
  result: any[];
}

export interface HashSetFilterResult {
  original: any[];
  operation: HashSetFilterOperation;
  parameter?: any;
  result: any[];
}

export interface HashSetSetOperationResult {
  firstSet: any[];
  secondSet: any[];
  operation: HashSetSetOperation;
  result: any[] | boolean;
}

export type HashSetOperationResult =
  | HashSetAnalysisResult
  | HashSetContainsResult
  | HashSetInsertResult
  | HashSetRemoveResult
  | HashSetMapResult
  | HashSetFilterResult
  | HashSetSetOperationResult;

export function isHashSetAnalysisResult(
  result: unknown
): result is HashSetAnalysisResult {
  return Boolean(
    result &&
      typeof (result as HashSetAnalysisResult).original === "string" &&
      Array.isArray((result as HashSetAnalysisResult).parsed) &&
      typeof (result as HashSetAnalysisResult).size === "number" &&
      Array.isArray((result as HashSetAnalysisResult).values)
  );
}

export function isHashSetContainsResult(
  result: unknown
): result is HashSetContainsResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetContainsResult).original) &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as HashSetContainsResult).contains === "boolean"
  );
}

export function isHashSetInsertResult(
  result: unknown
): result is HashSetInsertResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetInsertResult).original) &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      Array.isArray((result as HashSetInsertResult).result) &&
      typeof (result as HashSetInsertResult).valueWasNew === "boolean"
  );
}

export function isHashSetRemoveResult(
  result: unknown
): result is HashSetRemoveResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetRemoveResult).original) &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      Array.isArray((result as HashSetRemoveResult).result) &&
      typeof (result as HashSetRemoveResult).valueExisted === "boolean"
  );
}

export function isHashSetMapResult(
  result: unknown
): result is HashSetMapResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetMapResult).original) &&
      typeof (result as HashSetMapResult).operation === "string" &&
      Array.isArray((result as HashSetMapResult).result)
  );
}

export function isHashSetFilterResult(
  result: unknown
): result is HashSetFilterResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetFilterResult).original) &&
      typeof (result as HashSetFilterResult).operation === "string" &&
      Array.isArray((result as HashSetFilterResult).result) &&
      Object.prototype.hasOwnProperty.call(result, "parameter")
  );
}

export function isHashSetSetOperationResult(
  result: unknown
): result is HashSetSetOperationResult {
  return Boolean(
    result &&
      Array.isArray((result as HashSetSetOperationResult).firstSet) &&
      Array.isArray((result as HashSetSetOperationResult).secondSet) &&
      typeof (result as HashSetSetOperationResult).operation === "string" &&
      Object.prototype.hasOwnProperty.call(result, "result")
  );
}
