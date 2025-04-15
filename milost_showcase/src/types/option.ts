export type OptionOperation =
  | "some"
  | "none"
  | "from"
  | "isSome"
  | "isNone"
  | "expect"
  | "unwrap"
  | "unwrapOr"
  | "unwrapOrElse"
  | "map"
  | "andThen"
  | "or"
  | "match"
  | "filter"
  | "exists"
  | "firstSome"
  | "all";

export interface OptionOperationRequest {
  operation: OptionOperation;
  value?: any;
  defaultValue?: any;
  predicate?: (value: any) => boolean;
  onSome?: (value: any) => any;
  onNone?: () => any;
  options?: any[];
}

export interface OptionOperationResponse {
  data: {
    operation: OptionOperation;
    value?: any;
    defaultValue?: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}
