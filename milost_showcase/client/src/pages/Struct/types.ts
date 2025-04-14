export type StructOperation =
  | "get"
  | "set"
  | "keys"
  | "entries"
  | "map"
  | "filter";

export type StructMapOperation =
  | "double"
  | "square"
  | "toString"
  | "increment"
  | "uppercase"
  | "lowercase";

export type StructFilterOperation =
  | "greaterThan"
  | "lessThan"
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith";

export type StructOperationCategory =
  | "analyze"
  | "get"
  | "set"
  | "keys"
  | "entries"
  | "map"
  | "filter";

export interface StructAnalysisResult {
  original: string;
  parsed: Record<string, any>;
  keys: string[];
  isEmpty: boolean;
}

export interface StructGetResult {
  original: Record<string, any>;
  key: string;
  value: any;
}

export interface StructSetResult {
  original: Record<string, any>;
  key: string;
  value: any;
  result: Record<string, any>;
}

export interface StructKeysResult {
  original: Record<string, any>;
  keys: string[];
}

export interface StructEntriesResult {
  original: Record<string, any>;
  entries: Array<[string, any]>;
}

export interface StructMapResult {
  original: Record<string, any>;
  operation: string;
  result: Record<string, any>;
}

export interface StructFilterResult {
  original: Record<string, any>;
  operation: string;
  parameter?: any;
  result: Record<string, any>;
}

export type StructOperationResult =
  | StructAnalysisResult
  | StructGetResult
  | StructSetResult
  | StructKeysResult
  | StructEntriesResult
  | StructMapResult
  | StructFilterResult;

export function isStructAnalysisResult(
  result: unknown
): result is StructAnalysisResult {
  return Boolean(
    result &&
      typeof (result as StructAnalysisResult).original === "string" &&
      typeof (result as StructAnalysisResult).parsed === "object" &&
      Array.isArray((result as StructAnalysisResult).keys)
  );
}

export function isStructGetResult(result: unknown): result is StructGetResult {
  return Boolean(
    result &&
      typeof (result as StructGetResult).original === "object" &&
      typeof (result as StructGetResult).key === "string" &&
      Object.prototype.hasOwnProperty.call(result, "value")
  );
}

export function isStructSetResult(result: unknown): result is StructSetResult {
  return Boolean(
    result &&
      typeof (result as StructSetResult).original === "object" &&
      typeof (result as StructSetResult).key === "string" &&
      Object.prototype.hasOwnProperty.call(result, "value") &&
      typeof (result as StructSetResult).result === "object"
  );
}

export function isStructKeysResult(
  result: unknown
): result is StructKeysResult {
  return Boolean(
    result &&
      typeof (result as StructKeysResult).original === "object" &&
      Array.isArray((result as StructKeysResult).keys) &&
      !Object.prototype.hasOwnProperty.call(result, "entries")
  );
}

export function isStructEntriesResult(
  result: unknown
): result is StructEntriesResult {
  return Boolean(
    result &&
      typeof (result as StructEntriesResult).original === "object" &&
      Array.isArray((result as StructEntriesResult).entries)
  );
}

export function isStructMapResult(result: unknown): result is StructMapResult {
  return Boolean(
    result &&
      typeof (result as StructMapResult).original === "object" &&
      typeof (result as StructMapResult).operation === "string" &&
      typeof (result as StructMapResult).result === "object" &&
      !Object.prototype.hasOwnProperty.call(result, "parameter")
  );
}

export function isStructFilterResult(
  result: unknown
): result is StructFilterResult {
  return Boolean(
    result &&
      typeof (result as StructFilterResult).original === "object" &&
      typeof (result as StructFilterResult).operation === "string" &&
      typeof (result as StructFilterResult).result === "object" &&
      Object.prototype.hasOwnProperty.call(result, "parameter")
  );
}
