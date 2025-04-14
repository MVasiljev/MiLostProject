export type HashMapOperation =
  | "get"
  | "set"
  | "keys"
  | "values"
  | "entries"
  | "contains"
  | "remove"
  | "map"
  | "filter";

export type HashMapMapOperation =
  | "double"
  | "square"
  | "toString"
  | "increment"
  | "uppercase"
  | "lowercase";

export type HashMapFilterOperation =
  | "greaterThan"
  | "lessThan"
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith";

export type HashMapOperationCategory =
  | "analyze"
  | "get"
  | "contains"
  | "set"
  | "remove"
  | "keys"
  | "values"
  | "entries"
  | "map"
  | "filter";

export interface HashMapAnalysisResult {
  original: string;
  parsed: Array<[string, any]>;
  keys: string[];
  size: number;
  isEmpty: boolean;
}

export interface HashMapGetResult {
  original: Array<[string, any]>;
  key: string;
  value: any;
  exists: boolean;
}

export interface HashMapContainsResult {
  original: Array<[string, any]>;
  key: string;
  exists: boolean;
}

export interface HashMapSetResult {
  original: Array<[string, any]>;
  key: string;
  value: any;
  result: Array<[string, any]>;
}

export interface HashMapRemoveResult {
  original: Array<[string, any]>;
  key: string;
  result: Array<[string, any]>;
}

export interface HashMapKeysResult {
  original: Array<[string, any]>;
  keys: string[];
}

export interface HashMapValuesResult {
  original: Array<[string, any]>;
  values: any[];
}

export interface HashMapEntriesResult {
  original: Array<[string, any]>;
  entries: Array<[string, any]>;
}

export interface HashMapMapResult {
  original: Array<[string, any]>;
  operation: string;
  result: Array<[string, any]>;
}

export interface HashMapFilterResult {
  original: Array<[string, any]>;
  operation: string;
  parameter?: any;
  result: Array<[string, any]>;
}

export type HashMapOperationResult =
  | HashMapAnalysisResult
  | HashMapGetResult
  | HashMapContainsResult
  | HashMapSetResult
  | HashMapRemoveResult
  | HashMapKeysResult
  | HashMapValuesResult
  | HashMapEntriesResult
  | HashMapMapResult
  | HashMapFilterResult;

export function isHashMapAnalysisResult(
  result: unknown
): result is HashMapAnalysisResult {
  return Boolean(
    result &&
      typeof (result as HashMapAnalysisResult).original === "string" &&
      Array.isArray((result as HashMapAnalysisResult).parsed) &&
      Array.isArray((result as HashMapAnalysisResult).keys)
  );
}

export function isHashMapGetResult(
  result: unknown
): result is HashMapGetResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapGetResult).original) &&
      typeof (result as HashMapGetResult).key === "string" &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as HashMapGetResult).exists === "boolean"
  );
}

export function isHashMapContainsResult(
  result: unknown
): result is HashMapContainsResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapContainsResult).original) &&
      typeof (result as HashMapContainsResult).key === "string" &&
      typeof (result as HashMapContainsResult).exists === "boolean" &&
      !Object.prototype.hasOwnProperty.call(result, "value")
  );
}

export function isHashMapSetResult(
  result: unknown
): result is HashMapSetResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapSetResult).original) &&
      typeof (result as HashMapSetResult).key === "string" &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      Array.isArray((result as HashMapSetResult).result)
  );
}

export function isHashMapRemoveResult(
  result: unknown
): result is HashMapRemoveResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapRemoveResult).original) &&
      typeof (result as HashMapRemoveResult).key === "string" &&
      Array.isArray((result as HashMapRemoveResult).result) &&
      !Object.prototype.hasOwnProperty.call(result, "value")
  );
}

export function isHashMapKeysResult(
  result: unknown
): result is HashMapKeysResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapKeysResult).original) &&
      Array.isArray((result as HashMapKeysResult).keys) &&
      !Object.prototype.hasOwnProperty.call(result, "values") &&
      !Object.prototype.hasOwnProperty.call(result, "entries")
  );
}

export function isHashMapValuesResult(
  result: unknown
): result is HashMapValuesResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapValuesResult).original) &&
      Array.isArray((result as HashMapValuesResult).values) &&
      !Object.prototype.hasOwnProperty.call(result, "keys") &&
      !Object.prototype.hasOwnProperty.call(result, "entries")
  );
}

export function isHashMapEntriesResult(
  result: unknown
): result is HashMapEntriesResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapEntriesResult).original) &&
      Array.isArray((result as HashMapEntriesResult).entries) &&
      !Object.prototype.hasOwnProperty.call(result, "keys") &&
      !Object.prototype.hasOwnProperty.call(result, "values")
  );
}

export function isHashMapMapResult(
  result: unknown
): result is HashMapMapResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapMapResult).original) &&
      typeof (result as HashMapMapResult).operation === "string" &&
      Array.isArray((result as HashMapMapResult).result) &&
      !Object.prototype.hasOwnProperty.call(result, "parameter")
  );
}

export function isHashMapFilterResult(
  result: unknown
): result is HashMapFilterResult {
  return Boolean(
    result &&
      Array.isArray((result as HashMapFilterResult).original) &&
      typeof (result as HashMapFilterResult).operation === "string" &&
      Array.isArray((result as HashMapFilterResult).result) &&
      Object.prototype.hasOwnProperty.call(result, "parameter")
  );
}
