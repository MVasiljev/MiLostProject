import { Request, Response } from "express";
import { Result, Ok, Err, AppError, Str } from "milost";
import logger from "../utils/logger.js";
import {
  CreateResultRequest,
  ResultOperationRequest,
  ResultResponse,
  ResultOperationResponse,
} from "../types/result.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new Result
 */
export function createResult(req: Request, res: Response): Response {
  try {
    const { value, errorValue } = req.body as CreateResultRequest;

    if (errorValue) {
      const result = Result.Err(
        errorValue instanceof AppError
          ? errorValue
          : new AppError(Str.fromRaw(String(errorValue)))
      );
      return res.status(200).json({
        data: {
          original: errorValue,
          result,
          isOk: false,
          isErr: true,
        },
      });
    }

    const result = Result.Ok(value);
    return res.status(200).json({
      data: {
        original: value,
        result,
        isOk: true,
        isErr: false,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createResult controller");
    return res.status(500).json({
      error: "Failed to create Result",
    });
  }
}

/**
 * Perform Result checking operations
 */
export function checkResult(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as ResultOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Value is required for Result check operations",
      });
    }

    let result: any;
    let success = true;
    let errorMessage: string | null = null;

    try {
      switch (operation) {
        case "isOk":
          result = value.isOk();
          break;
        case "isErr":
          result = value.isErr();
          break;
        case "isError":
          const errorType = req.body.errorType;
          if (!errorType) {
            return res.status(400).json({
              error: "Error type is required for isError operation",
            });
          }
          result = value.isError(errorType);
          break;
        default:
          return res.status(400).json({
            error: `Unknown check operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      errorMessage = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error: errorMessage,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in checkResult controller");
    return res.status(500).json({
      error: "Failed to perform Result check operation",
    });
  }
}

/**
 * Perform Result unwrapping operations
 */
export function unwrapResult(req: Request, res: Response): Response {
  try {
    const { value, operation, defaultValue, errorMessage } =
      req.body as ResultOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Value is required for Result unwrap operations",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "expect":
          result = value.expect(
            Str.fromRaw(errorMessage || "Unexpected error")
          );
          break;
        case "unwrap":
          result = value.unwrap();
          break;
        case "unwrapOr":
          if (defaultValue === undefined) {
            return res.status(400).json({
              error: "Default value is required for unwrapOr operation",
            });
          }
          result = value.unwrapOr(defaultValue);
          break;
        case "unwrapOrElse":
          if (!req.body.onNone) {
            return res.status(400).json({
              error: "Fallback function is required for unwrapOrElse operation",
            });
          }
          result = value.unwrapOrElse(req.body.onNone);
          break;
        default:
          return res.status(400).json({
            error: `Unknown unwrap operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in unwrapResult controller");
    return res.status(500).json({
      error: "Failed to perform Result unwrap operation",
    });
  }
}

/**
 * Perform Result transformation operations
 */
export function transformResult(req: Request, res: Response): Response {
  try {
    const { value, operation, mapFn, errorMapFn } =
      req.body as ResultOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Value is required for Result transformation operations",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "map":
          if (!mapFn) {
            return res.status(400).json({
              error: "Mapping function is required for map operation",
            });
          }
          result = value.map(mapFn);
          break;
        case "mapErr":
          if (!errorMapFn) {
            return res.status(400).json({
              error: "Error mapping function is required for mapErr operation",
            });
          }
          result = value.mapErr(errorMapFn);
          break;
        case "andThen":
          if (!mapFn) {
            return res.status(400).json({
              error:
                "Transformation function is required for andThen operation",
            });
          }
          result = value.andThen(mapFn);
          break;
        case "and":
          const otherResult = req.body.otherResult;
          if (!otherResult) {
            return res.status(400).json({
              error: "Another Result is required for and operation",
            });
          }
          result = value.and(otherResult);
          break;
        case "or":
          const alternativeResult = req.body.alternativeResult;
          if (!alternativeResult) {
            return res.status(400).json({
              error: "Alternative Result is required for or operation",
            });
          }
          result = value.or(alternativeResult);
          break;
        default:
          return res.status(400).json({
            error: `Unknown transformation operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in transformResult controller");
    return res.status(500).json({
      error: "Failed to perform Result transformation operation",
    });
  }
}

/**
 * Perform Result matching operations
 */
export function matchResult(req: Request, res: Response): Response {
  try {
    const { value, operation, onSome, onNone } =
      req.body as ResultOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Value is required for Result matching operations",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "match":
          if (!onSome || !onNone) {
            return res.status(400).json({
              error:
                "Both onSome and onNone functions are required for match operation",
            });
          }
          result = value.match(onSome, onNone);
          break;
        case "ok":
          result = value.ok();
          break;
        case "err":
          result = value.err();
          break;
        case "getError":
          result = value.getError();
          break;
        default:
          return res.status(400).json({
            error: `Unknown match operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in matchResult controller");
    return res.status(500).json({
      error: "Failed to perform Result matching operation",
    });
  }
}

/**
 * Perform Result utility operations
 */
export function utilityResult(req: Request, res: Response): Response {
  try {
    const { operation, mapFn, results } = req.body as ResultOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "tryCatch":
          if (!mapFn) {
            return res.status(400).json({
              error: "Function is required for tryCatch operation",
            });
          }
          result = Result.tryCatch(() => mapFn(req.body.argument));
          break;
        case "tryCatchAsync":
          if (!mapFn) {
            return res.status(400).json({
              error: "Async function is required for tryCatchAsync operation",
            });
          }

          const asyncFn = async () => {
            if (typeof mapFn !== "function") {
              throw new Error("Provided function is not callable");
            }

            if (mapFn.constructor.name !== "AsyncFunction") {
              return await Promise.resolve(mapFn(req.body.argument));
            }

            return await mapFn(req.body.argument);
          };

          return res.status(200).json({
            data: {
              original: mapFn,
              operation,
              result: Result.tryCatchAsync(asyncFn),
              success: true,
              error: null,
            },
          });
        case "fromValidation":
          const { value, validator, errorMessage } = req.body;
          if (!value || !validator) {
            return res.status(400).json({
              error:
                "Value and validator are required for fromValidation operation",
            });
          }
          result = Result.fromValidation(
            value,
            validator,
            Str.fromRaw(errorMessage || "Validation failed")
          );
          break;
        case "all":
          if (!results || !Array.isArray(results)) {
            return res.status(400).json({
              error: "Results array is required for all operation",
            });
          }
          result = Result.all(results);
          break;
        default:
          return res.status(400).json({
            error: `Unknown utility operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: results || mapFn,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in utilityResult controller");
    return res.status(500).json({
      error: "Failed to perform Result utility operation",
    });
  }
}

/**
 * Generic Result operations router
 */
export function resultOperations(req: Request, res: Response): Response {
  try {
    const { operation } = req.body as ResultOperationRequest;

    switch (operation) {
      case "ok":
      case "err":
        return createResult(req, res);
      case "isOk":
      case "isErr":
      case "isError":
        return checkResult(req, res);
      case "expect":
      case "unwrap":
      case "unwrapOr":
      case "unwrapOrElse":
        return unwrapResult(req, res);
      case "map":
      case "mapErr":
      case "andThen":
      case "and":
      case "or":
        return transformResult(req, res);
      case "match":
      case "ok":
      case "err":
      case "getError":
        return matchResult(req, res);
      case "tryCatch":
      case "tryCatchAsync":
      case "fromValidation":
      case "all":
        return utilityResult(req, res);
      default:
        return res.status(400).json({
          error: `Unknown Result operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in resultOperations controller");
    return res.status(500).json({
      error: "Failed to perform Result operation",
    });
  }
}
