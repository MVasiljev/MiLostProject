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

interface BaseOperationResult {
  original: any;
  operation: FunctionalOperation;
  result: any;
  success: boolean;
  error: string | null;
}

export interface MapOperationResult extends BaseOperationResult {
  operation: FunctionalMapOperation;
  params?: {
    fn?: string;
    keyFn?: string;
  };
}

export interface TransformOperationResult extends BaseOperationResult {
  operation: FunctionalTransformOperation;
  params?: {
    functions?: string[];
    arity?: number;
  };
}

export interface ExecutionOperationResult extends BaseOperationResult {
  operation: FunctionalExecutionOperation;
  params?: {
    wait?: number;
    value?: any;
  };
}

export interface PredicateOperationResult extends BaseOperationResult {
  operation: FunctionalPredicateOperation;
  params?: {
    predicates?: string[];
    key?: string;
    value?: any;
  };
}

export interface UtilityOperationResult extends BaseOperationResult {
  operation: FunctionalUtilityOperation;
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
