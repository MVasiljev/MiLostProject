export type IterOperationCategory =
  | "create"
  | "transform"
  | "filter"
  | "collect"
  | "find"
  | "utility"
  | "advanced";

export type CreateIterOperation = "from" | "fromVec" | "empty" | "range";

export type TransformIterOperation =
  | "map"
  | "take"
  | "skip"
  | "enumerate"
  | "zip"
  | "chain"
  | "flatMap"
  | "chunks";

export type FilterIterOperation =
  | "filter"
  | "dedup"
  | "dedupBy"
  | "intersperse";

export type FindIterOperation = "find" | "first" | "last" | "nth";

export type UtilityIterOperation =
  | "next"
  | "forEach"
  | "all"
  | "any"
  | "count"
  | "fold";

export type IterOperation =
  | CreateIterOperation
  | TransformIterOperation
  | FilterIterOperation
  | FindIterOperation
  | UtilityIterOperation
  | "collect";

export interface CreateIterResult {
  original?: any[];
  operation: CreateIterOperation;
  start?: number;
  end?: number;
  step?: number;
  result: any[];
}

export interface TransformIterResult {
  original: any[];
  operation: TransformIterOperation;
  result: any[];
  params?: {
    mapFn?: string;
    size?: number;
    other?: any[];
  };
}

export interface FilterIterResult {
  original: any[];
  operation: FilterIterOperation;
  result: any[];
  params?: {
    predicate?: string;
    keyFn?: string;
    separator?: any;
  };
}

export interface FindIterResult {
  original: any[];
  operation: FindIterOperation;
  result: any;
  params?: {
    predicate?: string;
    index?: number;
  };
}

export interface UtilityIterResult {
  original: any[];
  operation: UtilityIterOperation;
  result: any;
  params?: {
    predicate?: string;
    initial?: any;
    f?: string;
  };
}

export interface CollectIterResult {
  original: any[];
  operation: "collect";
  result: any[];
}

export type IterOperationResult =
  | CreateIterResult
  | TransformIterResult
  | FilterIterResult
  | FindIterResult
  | UtilityIterResult
  | CollectIterResult;

export function isCreateIterResult(
  result: unknown
): result is CreateIterResult {
  return Boolean(
    result &&
      typeof (result as CreateIterResult).operation === "string" &&
      ["from", "fromVec", "empty", "range"].includes(
        (result as CreateIterResult).operation
      )
  );
}

export function isTransformIterResult(
  result: unknown
): result is TransformIterResult {
  return Boolean(
    result &&
      typeof (result as TransformIterResult).operation === "string" &&
      [
        "map",
        "take",
        "skip",
        "enumerate",
        "zip",
        "chain",
        "flatMap",
        "chunks",
      ].includes((result as TransformIterResult).operation)
  );
}

export function isFilterIterResult(
  result: unknown
): result is FilterIterResult {
  return Boolean(
    result &&
      typeof (result as FilterIterResult).operation === "string" &&
      ["filter", "dedup", "dedupBy", "intersperse"].includes(
        (result as FilterIterResult).operation
      )
  );
}

export function isFindIterResult(result: unknown): result is FindIterResult {
  return Boolean(
    result &&
      typeof (result as FindIterResult).operation === "string" &&
      ["find", "first", "last", "nth"].includes(
        (result as FindIterResult).operation
      )
  );
}

export function isUtilityIterResult(
  result: unknown
): result is UtilityIterResult {
  return Boolean(
    result &&
      typeof (result as UtilityIterResult).operation === "string" &&
      ["next", "forEach", "all", "any", "count", "fold"].includes(
        (result as UtilityIterResult).operation
      )
  );
}

export function isCollectIterResult(
  result: unknown
): result is CollectIterResult {
  return Boolean(
    result && (result as CollectIterResult).operation === "collect"
  );
}

export interface RangeIterRequest {
  start: number;
  end: number;
  step?: number;
}

export interface MapIterRequest {
  values: any[];
  mapFn: string;
}

export interface FilterIterRequest {
  values: any[];
  predicate: string;
}

export interface FindIterRequest {
  values: any[];
  predicate: string;
}

export interface NthIterRequest {
  values: any[];
  index: number;
}

export interface FoldIterRequest {
  values: any[];
  initial: any;
  f: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
