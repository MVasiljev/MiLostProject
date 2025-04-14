import { Request, Response, NextFunction } from "express";

export interface WasmStatus {
  initialized: boolean;
  exports: string[];
}

export interface ApiError extends Error {
  status?: number;
}

export interface ErrorResponse {
  error: {
    message: string;
    status: number;
  };
}

export interface StringResponse {
  data: {
    original: string;
    length: number;
    isEmpty: boolean;
  };
}

export interface StringOperationResponse {
  data: {
    original: string;
    operation: string;
    result: string;
  };
}

export interface CreateStringRequest {
  value: string;
}

export interface StringOperationRequest {
  value: string;
  operation: "uppercase" | "lowercase" | "trim";
}

export type ErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export enum StringOperation {
  UPPERCASE = "uppercase",
  LOWERCASE = "lowercase",
  TRIM = "trim",
}

export interface CreateVectorRequest {
  values: any[];
}

export interface VectorOperationRequest {
  values: any[];
  operation: VectorOperation;
}

export interface ArrayMapOperationRequest {
  values: any[];
  operation: string;
}

export interface ArrayFilterOperationRequest {
  values: any[];
  operation: string;
  parameter?: number;
}

export interface ArrayReduceOperationRequest {
  values: any[];
  operation: string;
  initialValue?: number;
}

export interface TakeDropOperationRequest {
  values: any[];
  operation: string;
  count: number;
}

export interface VectorResponse {
  data: {
    original: any[];
    length: number;
    isEmpty: boolean;
  };
}

export interface VectorOperationResponse {
  data: {
    original: any[];
    operation: string;
    result: any[];
  };
}

export interface VectorFilterResponse {
  data: {
    original: any[];
    operation: string;
    parameter?: number;
    result: any[];
  };
}

export interface VectorReduceResponse {
  data: {
    original: any[];
    operation: string;
    initialValue?: number;
    result: any;
  };
}

export interface VectorTakeDropResponse {
  data: {
    original: any[];
    operation: string;
    count: number;
    result: any[];
  };
}

export interface VectorCheckResponse {
  data: {
    original: any[];
    operation: string;
    parameter: number;
    result: boolean;
  };
}

export enum VectorOperation {
  REVERSE = "reverse",
}
