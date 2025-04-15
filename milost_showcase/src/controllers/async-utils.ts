import { Request, Response } from "express";
import { async, Vec, Result, AppError, Str, u32 } from "milost";
import logger from "../utils/logger.js";
import {
  AllRequest,
  AllSettledRequest,
  MapSeriesRequest,
  RetryRequest,
  DebounceRequest,
  WithTimeoutRequest,
  CancellableRequest,
  AsyncUtilsResponse,
  AsyncUtilsOperationRequest,
} from "../types/async-utils.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Helper to convert Result objects to plain JSON
 */
function resultToPlainObject(result: any): any {
  if (result instanceof Result) {
    return {
      isOk: result.isOk(),
      value: result.isOk()
        ? result.unwrap() instanceof Vec
          ? result.unwrap().toArray()
          : result.unwrap()
        : null,
      error: result.isErr() ? extractErrorMessage(result.getError()) : null,
    };
  }

  if (result instanceof Vec) {
    return result.toArray();
  }

  return result;
}

/**
 * Execute multiple promises in parallel and wait for all
 */
export async function all(req: Request, res: Response): Promise<Response> {
  try {
    const { promises } = req.body as AllRequest;

    if (!promises || !Array.isArray(promises)) {
      return res.status(400).json({
        error: "Array of promises is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const simulatedPromises = promises.map((p) => {
        const simulateError =
          p && typeof p === "object" && "simulateError" in p;
        const message =
          simulateError && typeof p === "object" && "message" in p
            ? String(p.message)
            : "Simulated error";
        const value =
          !simulateError && typeof p === "object" && "value" in p ? p.value : p;

        if (simulateError) {
          return Promise.resolve(
            Result.Err(new AppError(Str.fromRaw(message)))
          );
        } else {
          return Promise.resolve(Result.Ok(value));
        }
      });

      result = await async.all(Vec.from(simulatedPromises));
      result = resultToPlainObject(result);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "all",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in all controller");
    return res.status(500).json({
      error: "Failed to execute all operation",
    });
  }
}

/**
 * Execute multiple promises in parallel and collect results
 */
export async function allSettled(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { promises } = req.body as AllSettledRequest;

    if (!promises || !Array.isArray(promises)) {
      return res.status(400).json({
        error: "Array of promises is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const simulatedPromises = promises.map((p) => {
        const simulateError =
          p && typeof p === "object" && "simulateError" in p;
        const message =
          simulateError && typeof p === "object" && "message" in p
            ? String(p.message)
            : "Simulated error";
        const value =
          !simulateError && typeof p === "object" && "value" in p ? p.value : p;

        if (simulateError) {
          return Promise.resolve(
            Result.Err(new AppError(Str.fromRaw(message)))
          );
        } else {
          return Promise.resolve(Result.Ok(value));
        }
      });

      result = await async.allSettled(Vec.from(simulatedPromises));
      result = resultToPlainObject(result);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "allSettled",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in allSettled controller");
    return res.status(500).json({
      error: "Failed to execute allSettled operation",
    });
  }
}

/**
 * Execute async operations on items in series
 */
export async function mapSeries(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { items, fn } = req.body as MapSeriesRequest;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: "Array of items is required",
      });
    }

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Mapping function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const simulatedFn = (item: any, index: number) => {
        const simulateError =
          item && typeof item === "object" && "simulateError" in item;
        const message =
          simulateError && typeof item === "object" && "message" in item
            ? String(item.message)
            : "Simulated error";

        if (simulateError) {
          return Promise.resolve(
            Result.Err(new AppError(Str.fromRaw(message)))
          );
        } else {
          return Promise.resolve(Result.Ok(item));
        }
      };

      result = await async.mapSeries(Vec.from(items), (item, index) =>
        simulatedFn(item, Number(index))
      );
      result = resultToPlainObject(result);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "mapSeries",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in mapSeries controller");
    return res.status(500).json({
      error: "Failed to execute mapSeries operation",
    });
  }
}

/**
 * Retry an async operation with backoff
 */
export async function retry(req: Request, res: Response): Promise<Response> {
  try {
    const { operation, options } = req.body as RetryRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      let attemptCount = 0;
      const simulatedOperation = async () => {
        attemptCount++;

        const shouldFailCount = req.body.failAttempts || 2;
        if (attemptCount <= shouldFailCount) {
          return Result.Err(
            new AppError(Str.fromRaw(`Attempt ${attemptCount} failed`))
          );
        }

        return Result.Ok(`Success on attempt ${attemptCount}`);
      };

      const processedOptions = options
        ? {
            maxRetries:
              options.maxRetries !== undefined
                ? u32(options.maxRetries)
                : undefined,
            baseDelay:
              options.baseDelay !== undefined
                ? u32(options.baseDelay)
                : undefined,
            maxDelay:
              options.maxDelay !== undefined
                ? u32(options.maxDelay)
                : undefined,
            shouldRetry: options.shouldRetry,
          }
        : undefined;

      result = await async.retry(simulatedOperation, processedOptions);
      result = resultToPlainObject(result);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "retry",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in retry controller");
    return res.status(500).json({
      error: "Failed to execute retry operation",
    });
  }
}

/**
 * Create a debounced version of an async function
 */
export async function debounce(req: Request, res: Response): Promise<Response> {
  try {
    const { fn, wait, args, executeNow } = req.body as DebounceRequest;

    if (!fn) {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    if (wait === undefined) {
      return res.status(400).json({
        error: "Wait time is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const simulatedFn = async (...args: any[]) => {
        return Result.Ok(`Executed with args: ${JSON.stringify(args)}`);
      };

      const debouncedFn = async.debounce(simulatedFn, u32(wait));

      if (executeNow && args) {
        result = await debouncedFn(...args);
        result = resultToPlainObject(result);
      } else {
        result = "Debounced function created (not executed)";
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "debounce",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in debounce controller");
    return res.status(500).json({
      error: "Failed to create debounced function",
    });
  }
}

/**
 * Execute an async operation with a timeout
 */
export async function withTimeout(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { promise, timeoutMs, timeoutError } = req.body as WithTimeoutRequest;

    if (!promise) {
      return res.status(400).json({
        error: "Promise is required",
      });
    }

    if (timeoutMs === undefined) {
      return res.status(400).json({
        error: "Timeout in milliseconds is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const delayMs = req.body.delayMs || 1000;
      const simulatedPromise = new Promise<Result<any, AppError>>((resolve) => {
        setTimeout(() => {
          resolve(Result.Ok("Operation completed"));
        }, delayMs);
      });

      const timeoutErrorInstance = new AppError(
        Str.fromRaw(timeoutError || "Operation timed out")
      );

      result = await async.withTimeout(
        simulatedPromise,
        u32(timeoutMs),
        timeoutErrorInstance
      );
      result = resultToPlainObject(result);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "withTimeout",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in withTimeout controller");
    return res.status(500).json({
      error: "Failed to execute operation with timeout",
    });
  }
}

/**
 * Create a cancellable async operation
 */
export async function cancellable(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { fn, execute, cancelAfterMs } = req.body as CancellableRequest;

    if (!fn) {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const simulatedFn = (signal: AbortSignal) => {
        return new Promise<Result<any, AppError>>((resolve) => {
          const timeoutId = setTimeout(() => {
            resolve(Result.Ok("Operation completed"));
          }, 2000);

          signal.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            resolve(
              Result.Err(new AppError(Str.fromRaw("Operation cancelled")))
            );
          });
        });
      };

      const cancellableOperation = async.cancellable(simulatedFn);

      if (execute) {
        if (cancelAfterMs) {
          setTimeout(() => {
            cancellableOperation.cancel();
          }, cancelAfterMs);
        }

        result = await cancellableOperation.promise;
        result = resultToPlainObject(result);
      } else {
        result = "Cancellable operation created (not executed)";
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncUtilsResponse = {
      data: {
        operation: "cancellable",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in cancellable controller");
    return res.status(500).json({
      error: "Failed to create cancellable operation",
    });
  }
}

/**
 * Generic async utils operations router
 */
export async function asyncUtilsOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation } = req.body as AsyncUtilsOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (operation) {
      case "all":
        return all(req, res);
      case "allSettled":
        return allSettled(req, res);
      case "mapSeries":
        return mapSeries(req, res);
      case "retry":
        return retry(req, res);
      case "debounce":
        return debounce(req, res);
      case "withTimeout":
        return withTimeout(req, res);
      case "cancellable":
        return cancellable(req, res);
      default:
        return res.status(400).json({
          error: `Unknown AsyncUtils operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in asyncUtilsOperations controller");
    return res.status(500).json({
      error: "Failed to perform async utils operation",
    });
  }
}
