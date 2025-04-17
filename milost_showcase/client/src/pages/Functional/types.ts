export type FunctionalCategory =
  | "map"
  | "transform"
  | "execution"
  | "predicate"
  | "utility";

export type FunctionalMapOperation =
  | "toHashMap"
  | "toHashSet"
  | "toVec"
  | "mapObject"
  | "filterObject";

export type FunctionalTransformOperation =
  | "mergeDeep"
  | "pipe"
  | "compose"
  | "curry"
  | "memoize"
  | "once";

export type FunctionalExecutionOperation =
  | "throttle"
  | "debounce"
  | "noop"
  | "identity";

export type FunctionalPredicateOperation =
  | "not"
  | "allOf"
  | "anyOf"
  | "prop"
  | "hasProp"
  | "propEq";

export type FunctionalUtilityOperation =
  | "partial"
  | "flip"
  | "juxt"
  | "zipWith"
  | "converge";

export type FunctionalOperation =
  | FunctionalMapOperation
  | FunctionalTransformOperation
  | FunctionalExecutionOperation
  | FunctionalPredicateOperation
  | FunctionalUtilityOperation;

export interface MapOperationResult {
  original: any;
  operation: FunctionalMapOperation;
  result: any;
  params?: {
    fn?: string;
    keyFn?: string;
  };
}

export interface TransformOperationResult {
  original: any;
  operation: FunctionalTransformOperation;
  result: any;
  params?: {
    functions?: string[];
    arity?: number;
  };
}

export interface ExecutionOperationResult {
  original: any;
  operation: FunctionalExecutionOperation;
  result: any;
  params?: {
    wait?: number;
    value?: any;
  };
}

export interface PredicateOperationResult {
  original: any;
  operation: FunctionalPredicateOperation;
  result: any;
  params?: {
    predicates?: string[];
    key?: string;
    value?: any;
  };
}

export interface UtilityOperationResult {
  original: any;
  operation: FunctionalUtilityOperation;
  result: any;
  params?: {
    fn?: string;
    partialArgs?: any[];
    functions?: string[];
  };
}

export type FunctionalOperationResult =
  | MapOperationResult
  | TransformOperationResult
  | ExecutionOperationResult
  | PredicateOperationResult
  | UtilityOperationResult;

export function isMapOperationResult(
  result: unknown
): result is MapOperationResult {
  return Boolean(
    result &&
      typeof (result as MapOperationResult).operation === "string" &&
      ["toHashMap", "toHashSet", "toVec", "mapObject", "filterObject"].includes(
        (result as MapOperationResult).operation
      )
  );
}

export function isTransformOperationResult(
  result: unknown
): result is TransformOperationResult {
  return Boolean(
    result &&
      typeof (result as TransformOperationResult).operation === "string" &&
      ["mergeDeep", "pipe", "compose", "curry", "memoize", "once"].includes(
        (result as TransformOperationResult).operation
      )
  );
}

export function isExecutionOperationResult(
  result: unknown
): result is ExecutionOperationResult {
  return Boolean(
    result &&
      typeof (result as ExecutionOperationResult).operation === "string" &&
      ["throttle", "debounce", "noop", "identity"].includes(
        (result as ExecutionOperationResult).operation
      )
  );
}

export function isPredicateOperationResult(
  result: unknown
): result is PredicateOperationResult {
  return Boolean(
    result &&
      typeof (result as PredicateOperationResult).operation === "string" &&
      ["not", "allOf", "anyOf", "prop", "hasProp", "propEq"].includes(
        (result as PredicateOperationResult).operation
      )
  );
}

export function isUtilityOperationResult(
  result: unknown
): result is UtilityOperationResult {
  return Boolean(
    result &&
      typeof (result as UtilityOperationResult).operation === "string" &&
      ["partial", "flip", "juxt", "zipWith", "converge"].includes(
        (result as UtilityOperationResult).operation
      )
  );
}

export interface ToHashMapRequest {
  values: any[];
  keyFn: string;
}

export interface MapObjectRequest {
  object: Record<string, any>;
  fn: string;
}

export interface FilterObjectRequest {
  object: Record<string, any>;
  predicate: string;
}

export interface MergeDeepRequest {
  objects: Record<string, any>[];
}

export interface PipeComposeRequest {
  functions: string[];
}

export interface CurryRequest {
  fn: string;
  arity?: number;
}

export interface ThrottleDebounceRequest {
  fn: string;
  wait: number;
}

export interface NotRequest {
  predicate: string;
}

export interface AllOfAnyOfRequest {
  predicates: string[];
}

export interface PropRequest {
  key: string;
}

export interface PropEqRequest {
  key: string;
  value: any;
}

export interface PartialRequest {
  fn: string;
  partialArgs: any[];
}

export interface JuxtRequest {
  functions: string[];
}

export interface ZipWithRequest {
  fn: string;
  first: any[];
  second: any[];
}

export interface ConvergeRequest {
  after: string;
  transformers: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
