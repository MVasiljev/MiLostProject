export type IterOperation =
  | "from"
  | "fromVec"
  | "empty"
  | "range"
  | "next"
  | "map"
  | "filter"
  | "take"
  | "skip"
  | "enumerate"
  | "zip"
  | "chain"
  | "flatMap"
  | "chunks"
  | "collect"
  | "find"
  | "first"
  | "last"
  | "nth"
  | "forEach"
  | "all"
  | "any"
  | "count"
  | "fold"
  | "dedup"
  | "dedupBy"
  | "intersperse";

export interface IterOperationRequest {
  operation: IterOperation;
  values?: any[];
  value?: any;
  vec?: any[];
  start?: number;
  end?: number;
  step?: number;
  size?: number;
  size_or_index?: number;
  index?: number;
  predicate?: (item: any) => boolean;
  keyFn?: (item: any) => any;
  f?: (item: any, index?: number) => any;
  separator?: any;
  initial?: any;
  other?: any[];
}

export interface IterOperationResponse {
  data: {
    operation: IterOperation;
    values?: any[];
    start?: number;
    end?: number;
    step?: number;
    result: any;
    success: boolean;
    error: string | null;
  };
}
