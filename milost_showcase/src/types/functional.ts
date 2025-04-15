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

export interface FunctionalOperationRequest {
  operation: FunctionalOperation;
  value?: any;
  values?: any[];
  fn?: (...args: any[]) => any;
  predicates?: Array<(value: any) => boolean>;
  key?: string;
  wait?: number;
  keyFn?: (...args: any[]) => any;
  partialArgs?: any[];
}

export interface FunctionalOperationResponse {
  data: {
    original: any;
    operation: FunctionalOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
