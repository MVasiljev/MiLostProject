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
