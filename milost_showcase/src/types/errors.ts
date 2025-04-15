import { Result } from "milost";

export type ErrorCreateOperation =
  | "appError"
  | "validationError"
  | "networkError"
  | "authenticationError"
  | "notFoundError"
  | "unauthorizedError"
  | "forbiddenError"
  | "databaseError"
  | "serverError"
  | "businessLogicError"
  | "resourceConflictError"
  | "configurationError"
  | "rateLimitError";

export interface CreateErrorRequest {
  message: string;
  operation: ErrorCreateOperation;
  resourceType?: string;
  retryAfterSeconds?: number;
}

export interface CreateErrorResponse {
  data: {
    message: string;
    operation: "create" | "factory";
    success: boolean;
    error: string | null;
    result: {
      message: string;
      name: string;
      type?: ErrorCreateOperation;
      resourceType?: string;
      retryAfterSeconds?: number;
    } | null;
  };
}

export interface ErrorOperationRequest {
  message: string;
  operation: "create" | "factory";
  errorType?: ErrorCreateOperation;
  resourceType?: string;
  retryAfterSeconds?: number;
}
