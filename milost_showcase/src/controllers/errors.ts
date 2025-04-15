export function createValidationError(req: Request, res: Response): Response {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    const errorMsg = Str.fromRaw(message);
    const result = new ValidationError(errorMsg);

    return res.status(200).json({
      data: {
        message,
        type: "ValidationError",
        result: {
          message: result.message,
          name: result.name,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createValidationError controller");
    return res.status(500).json({
      error: "Failed to create validation error",
    });
  }
}

export function createAuthenticationError(
  req: Request,
  res: Response
): Response {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    const errorMsg = Str.fromRaw(message);
    const result = new AuthenticationError(errorMsg);

    return res.status(200).json({
      data: {
        message,
        type: "AuthenticationError",
        result: {
          message: result.message,
          name: result.name,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createAuthenticationError controller");
    return res.status(500).json({
      error: "Failed to create authentication error",
    });
  }
}

export function createNotFoundError(req: Request, res: Response): Response {
  try {
    const { message, resourceType } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    const errorMsg = Str.fromRaw(message);
    const result = new NotFoundError(
      errorMsg,
      resourceType ? Str.fromRaw(resourceType) : undefined
    );

    return res.status(200).json({
      data: {
        message,
        resourceType,
        type: "NotFoundError",
        result: {
          message: result.message,
          name: result.name,
          resourceType: result.resourceType?.unwrap(),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createNotFoundError controller");
    return res.status(500).json({
      error: "Failed to create not found error",
    });
  }
}

export function createServerError(req: Request, res: Response): Response {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    const errorMsg = Str.fromRaw(message);
    const result = new ServerError(errorMsg);

    return res.status(200).json({
      data: {
        message,
        type: "ServerError",
        result: {
          message: result.message,
          name: result.name,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createServerError controller");
    return res.status(500).json({
      error: "Failed to create server error",
    });
  }
}
import { Request, Response } from "express";
import {
  AppError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  ServerError,
  DomainErrors,
  createErrorFactory,
  u32,
} from "milost";
import { Str } from "milost";
import logger from "../utils/logger.js";
import {
  CreateErrorRequest,
  CreateErrorResponse,
  ErrorOperationRequest,
} from "../types/errors.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a specific type of error
 */
export function createError(req: Request, res: Response): Response {
  try {
    const { message, operation, errorType, resourceType, retryAfterSeconds } =
      req.body as ErrorOperationRequest;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Error operation is required",
      });
    }

    const errorMsg = Str.fromRaw(message);
    let result = null;
    let success = true;
    let errorStr = null;

    try {
      const actualErrorType =
        operation === "create" ? errorType || "appError" : errorType;

      switch (actualErrorType) {
        case "appError":
          result = new AppError(errorMsg);
          break;
        case "validationError":
          result = new ValidationError(errorMsg);
          break;
        case "networkError":
          result = new NetworkError(errorMsg);
          break;
        case "authenticationError":
          result = new AuthenticationError(errorMsg);
          break;
        case "notFoundError":
          result = new NotFoundError(
            errorMsg,
            resourceType ? Str.fromRaw(resourceType) : undefined
          );
          break;
        case "unauthorizedError":
          result = new UnauthorizedError(errorMsg);
          break;
        case "forbiddenError":
          result = new ForbiddenError(errorMsg);
          break;
        case "databaseError":
          result = new DatabaseError(errorMsg);
          break;
        case "serverError":
          result = new ServerError(errorMsg);
          break;
        case "businessLogicError":
          result = new DomainErrors.BusinessLogicError(errorMsg);
          break;
        case "resourceConflictError":
          result = new DomainErrors.ResourceConflictError(errorMsg);
          break;
        case "configurationError":
          result = new DomainErrors.ConfigurationError(errorMsg);
          break;
        case "rateLimitError":
          result = new DomainErrors.RateLimitError(
            errorMsg,
            retryAfterSeconds
              ? (retryAfterSeconds as unknown as u32)
              : undefined
          );
          break;
        default:
          return res.status(400).json({
            error: `Unknown error type: ${actualErrorType}`,
          });
      }

      const responseResult = {
        message: result.message,
        name: result.name,
        ...(result instanceof NotFoundError && result.resourceType
          ? { resourceType: result.resourceType.unwrap() }
          : {}),
        ...(result instanceof DomainErrors.RateLimitError &&
        result.retryAfterSeconds
          ? { retryAfterSeconds: result.retryAfterSeconds }
          : {}),
      };

      const response: CreateErrorResponse = {
        data: {
          message,
          operation,
          success,
          error: null,
          result: {
            ...responseResult,
            type: actualErrorType,
          },
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      success = false;
      errorStr = extractErrorMessage(error);

      const response: CreateErrorResponse = {
        data: {
          message,
          operation,
          success: false,
          error: errorStr,
          result: null,
        },
      };

      return res.status(400).json(response);
    }
  } catch (error) {
    logger.error({ error }, "Error in createError controller");
    return res.status(500).json({
      error: "Failed to create error",
    });
  }
}

/**
 * Create an error factory
 */
export function createErrorFactoryOperation(
  req: Request,
  res: Response
): Response {
  try {
    const { message, operation } = req.body as ErrorOperationRequest;

    if (!message) {
      return res.status(400).json({
        error: "Error message is required",
      });
    }

    try {
      const errorMsg = Str.fromRaw(message);
      let factory;

      switch (operation) {
        case "factory":
          factory = createErrorFactory(AppError, errorMsg);

          const sampleError = factory();
          const responseResult = {
            message: sampleError.message,
            name: sampleError.name,
          };

          return res.status(200).json({
            data: {
              message,
              operation,
              success: true,
              error: null,
              result: responseResult,
            },
          });
        default:
          return res.status(400).json({
            error: `Unknown error operation: ${operation}`,
          });
      }
    } catch (error) {
      const errorStr = extractErrorMessage(error);

      return res.status(400).json({
        data: {
          message,
          operation,
          success: false,
          error: errorStr,
          result: null,
        },
      });
    }
  } catch (error) {
    logger.error({ error }, "Error in createErrorFactoryOperation controller");
    return res.status(500).json({
      error: "Failed to create error factory",
    });
  }
}

/**
 * Generic operation router for errors
 */
export function errorOperations(req: Request, res: Response): Response {
  try {
    const { operation } = req.body as ErrorOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (operation) {
      case "create":
        return createError(req, res);
      case "factory":
        return createErrorFactoryOperation(req, res);
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in errorOperations controller");
    return res.status(500).json({
      error: "Failed to perform error operation",
    });
  }
}
