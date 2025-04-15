import { Request, Response } from "express";
import { Computed, Watcher, AsyncEffect } from "milost";
import logger from "../utils/logger.js";
import {
  CreateComputedRequest,
  ComputedResponse,
  ComputedOperationRequest,
  ComputedOperationResponse,
  WatcherOperationRequest,
  WatcherOperationResponse,
  AsyncEffectOperationRequest,
  AsyncEffectOperationResponse,
  ReactiveOperationRequest,
  ReactiveOperationResponse,
} from "../types/computed.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a reactive object (Computed, Watcher, AsyncEffect)
 */
export function createReactive(req: Request, res: Response): Response {
  try {
    const { type, compute, watchValues, callback, effect } =
      req.body as CreateComputedRequest;

    if (!type) {
      return res.status(400).json({
        error: "Reactive type is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      switch (type) {
        case "Computed":
          if (!compute || !watchValues) {
            return res.status(400).json({
              error:
                "Compute function and watch values are required for Computed",
            });
          }
          result = Computed.from(compute, watchValues);
          break;
        case "Watcher":
          if (!compute || !callback) {
            return res.status(400).json({
              error: "Watch function and callback are required for Watcher",
            });
          }
          result = new Watcher(compute, callback);
          break;
        case "AsyncEffect":
          if (!effect) {
            return res.status(400).json({
              error: "Effect function is required for AsyncEffect",
            });
          }
          result = new AsyncEffect(effect);
          break;
        default:
          return res.status(400).json({
            error: `Unknown reactive type: ${type}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ComputedResponse = {
      data: {
        type,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createReactive controller");
    return res.status(500).json({
      error: "Failed to create reactive object",
    });
  }
}

/**
 * Perform Computed operations
 */
export function computedOperations(req: Request, res: Response): Response {
  try {
    const { value, operation, newWatchValues } =
      req.body as ComputedOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Computed value is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "get":
          result = value.get();
          break;
        case "update":
          if (!newWatchValues) {
            return res.status(400).json({
              error: "New watch values are required for update operation",
            });
          }
          value.update(newWatchValues);
          result = value.get();
          break;
        default:
          return res.status(400).json({
            error: `Unknown Computed operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ComputedOperationResponse = {
      data: {
        operation,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in computedOperations controller");
    return res.status(500).json({
      error: "Failed to perform Computed operation",
    });
  }
}

/**
 * Perform Watcher operations
 */
export function watcherOperations(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as WatcherOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Watcher value is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "check":
          value.check();
          break;
        default:
          return res.status(400).json({
            error: `Unknown Watcher operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: WatcherOperationResponse = {
      data: {
        operation,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in watcherOperations controller");
    return res.status(500).json({
      error: "Failed to perform Watcher operation",
    });
  }
}

/**
 * Perform AsyncEffect operations
 */
export function asyncEffectOperations(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as AsyncEffectOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "AsyncEffect value is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "cancel":
          value.cancel();
          break;
        default:
          return res.status(400).json({
            error: `Unknown AsyncEffect operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: AsyncEffectOperationResponse = {
      data: {
        operation,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in asyncEffectOperations controller");
    return res.status(500).json({
      error: "Failed to perform AsyncEffect operation",
    });
  }
}

/**
 * Generic reactive operations router
 */
export function reactiveOperations(req: Request, res: Response): Response {
  try {
    const { type, operation } = req.body as ReactiveOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Reactive type is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Computed":
        return computedOperations(req, res);
      case "Watcher":
        return watcherOperations(req, res);
      case "AsyncEffect":
        return asyncEffectOperations(req, res);
      default:
        return res.status(400).json({
          error: `Unknown reactive type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in reactiveOperations controller");
    return res.status(500).json({
      error: "Failed to perform reactive operation",
    });
  }
}
