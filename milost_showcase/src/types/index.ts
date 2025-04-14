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

export type ErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
