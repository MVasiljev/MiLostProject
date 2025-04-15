import { Result as MilostResult, AppError } from "milost";

export type ResultCreateOperation = "ok" | "err";
export type ResultCheckOperation = "isOk" | "isErr" | "isError";
export type ResultUnwrapOperation =
  | "expect"
  | "unwrap"
  | "unwrapOr"
  | "unwrapOrElse";
export type ResultTransformOperation =
  | "map"
  | "mapErr"
  | "andThen"
  | "and"
  | "or";
export type ResultMatchOperation = "match" | "ok" | "err" | "getError";
export type ResultUtilityOperation =
  | "tryCatch"
  | "tryCatchAsync"
  | "fromValidation"
  | "all";

export type ResultOperation =
  | ResultCreateOperation
  | ResultCheckOperation
  | ResultUnwrapOperation
  | ResultTransformOperation
  | ResultMatchOperation
  | ResultUtilityOperation;

export interface CreateResultRequest {
  value: any;
  errorValue?: any;
}

export interface ResultResponse {
  data: {
    original: any;
    result: any;
    isOk: boolean;
    isErr: boolean;
  };
}

export interface ResultOperationRequest {
  value?: any;
  errorValue?: any;
  operation: ResultOperation;
  defaultValue?: any;
  errorMessage?: string;
  validator?: (val: any) => boolean;
  mapFn?: (val: any) => any;
  errorMapFn?: (err: any) => any;
  onSome?: (val: any) => any;
  onNone?: () => any;
  results?: any[];
}

export interface ResultOperationResponse {
  data: {
    original: any;
    operation: ResultOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
