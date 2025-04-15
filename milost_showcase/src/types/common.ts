export type TypeCheckType =
  | "defined"
  | "object"
  | "vec"
  | "str"
  | "numeric"
  | "boolean"
  | "function";

export type OptionOperation =
  | "some"
  | "none"
  | "isSome"
  | "isNone"
  | "unwrap"
  | "unwrapOr"
  | "unwrapOrElse";

export type ResultOperation =
  | "ok"
  | "err"
  | "isOk"
  | "isErr"
  | "unwrap"
  | "unwrapErr"
  | "unwrapOr"
  | "unwrapOrElse";

export type CommonOperation =
  | "typeCheck"
  | "convertToVec"
  | "loadingStates"
  | "brandTypes"
  | "option"
  | "result";

export type LoadingState = "IDLE" | "LOADING" | "SUCCEEDED" | "FAILED";
export type BrandType =
  | "JSON"
  | "POSITIVE"
  | "NEGATIVE"
  | "NON_NEGATIVE"
  | "PERCENTAGE";

export interface TypeCheckRequest {
  value: any;
  checkType: TypeCheckType;
}

export interface TypeCheckResponse {
  data: {
    value: any;
    checkType: TypeCheckType;
    result: boolean;
  };
}

export interface ConversionRequest {
  values: any[];
}

export interface ConversionResponse {
  data: {
    original: any[];
    converted: any[];
    length: number;
  };
}

export interface LoadingStateRequest {
  state?: LoadingState;
}

export interface LoadingStateResponse {
  data: {
    states: {
      IDLE: string;
      LOADING: string;
      SUCCEEDED: string;
      FAILED: string;
    };
    requestedState: string | null;
  };
}

export interface BrandTypeRequest {
  type?: BrandType;
}

export interface BrandTypeResponse {
  data: {
    types: {
      JSON: string;
      POSITIVE: string;
      NEGATIVE: string;
      NON_NEGATIVE: string;
      PERCENTAGE: string;
    };
    requestedType: string | null;
  };
}

export interface OptionOperationRequest {
  value: any;
  operation: OptionOperation;
  defaultValue?: any;
}

export interface OptionOperationResponse {
  data: {
    value: any;
    operation: OptionOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface ResultOperationRequest {
  value: any;
  error?: any;
  operation: ResultOperation;
  defaultValue?: any;
}

export interface ResultOperationResponse {
  data: {
    value: any;
    errorValue?: any;
    operation: ResultOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface CommonOperationRequest {
  operation: CommonOperation;
  value?: any;
  values?: any[];
  checkType?: TypeCheckType;
  state?: LoadingState;
  type?: BrandType;
  error?: any;
  defaultValue?: any;
}
