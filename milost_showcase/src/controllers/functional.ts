import { Request, Response } from "express";
import * as Functional from "milost";
import { Vec, Str, u32, Iter } from "milost";
import logger from "../utils/logger.js";
import {
  FunctionalOperationRequest,
  FunctionalOperationResponse,
} from "../types/functional.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a functional operation
 */
export function createFunctional(req: Request, res: Response): Response {
  try {
    const { fn } = req.body;

    if (!fn) {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    return res.status(200).json({
      data: {
        original: fn,
        result: fn,
        success: true,
        error: null,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createFunctional controller");
    return res.status(500).json({
      error: "Failed to create functional operation",
    });
  }
}

/**
 * Perform mapping operations
 */
export function mapFunctional(req: Request, res: Response): Response {
  try {
    const { operation, value, values, fn } =
      req.body as FunctionalOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "toHashMap":
          if (!values || !fn) {
            return res.status(400).json({
              error: "Values and key-value function are required for toHashMap",
            });
          }
          result = Functional.toHashMap(Iter.fromVec(Vec.from(values)), fn);
          break;
        case "toHashSet":
          if (!values) {
            return res.status(400).json({
              error: "Values are required for toHashSet",
            });
          }
          result = Functional.toHashSet(Iter.fromVec(Vec.from(values)));
          break;
        case "toVec":
          if (!values) {
            return res.status(400).json({
              error: "Values are required for toVec",
            });
          }
          result = Functional.toVec(Iter.fromVec(Vec.from(values)));
          break;
        case "mapObject":
          if (!value || !fn) {
            return res.status(400).json({
              error: "Object and mapping function are required for mapObject",
            });
          }
          result = Functional.mapObject(value, fn);
          break;
        case "filterObject":
          if (!value || !fn) {
            return res.status(400).json({
              error:
                "Object and predicate function are required for filterObject",
            });
          }
          result = Functional.filterObject(value, fn);
          break;
        default:
          return res.status(400).json({
            error: `Unknown map operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: values || value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in mapFunctional controller");
    return res.status(500).json({
      error: "Failed to perform functional map operation",
    });
  }
}

/**
 * Perform transformation operations
 */
export function transformFunctional(req: Request, res: Response): Response {
  try {
    const { operation, value, values, fn, partialArgs } =
      req.body as FunctionalOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "mergeDeep":
          if (!values || values.length < 2) {
            return res.status(400).json({
              error: "At least two objects are required for mergeDeep",
            });
          }
          result = Functional.mergeDeep(values);
          break;
        case "pipe":
          if (!values || !values.length) {
            return res.status(400).json({
              error: "Functions are required for pipe",
            });
          }
          result = Functional.pipe(...values);
          break;
        case "compose":
          if (!values || !values.length) {
            return res.status(400).json({
              error: "Functions are required for compose",
            });
          }
          result = Functional.compose(...values);
          break;
        case "curry":
          if (!fn) {
            return res.status(400).json({
              error: "Function is required for curry",
            });
          }
          result = Functional.curry(fn);
          break;
        case "memoize":
          if (!fn) {
            return res.status(400).json({
              error: "Function is required for memoize",
            });
          }
          result = Functional.memoize(fn);
          break;
        case "once":
          if (!fn) {
            return res.status(400).json({
              error: "Function is required for once",
            });
          }
          result = Functional.once(fn);
          break;
        default:
          return res.status(400).json({
            error: `Unknown transform operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: values || fn,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in transformFunctional controller");
    return res.status(500).json({
      error: "Failed to perform functional transform operation",
    });
  }
}

/**
 * Perform execution-related operations
 */
export function executionFunctional(req: Request, res: Response): Response {
  try {
    const { operation, fn, wait, value } =
      req.body as FunctionalOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "throttle":
          if (!fn || !wait) {
            return res.status(400).json({
              error: "Function and wait time are required for throttle",
            });
          }
          result = Functional.throttle(fn, u32(wait));
          break;
        case "debounce":
          if (!fn || !wait) {
            return res.status(400).json({
              error: "Function and wait time are required for debounce",
            });
          }
          result = Functional.debounce(fn, u32(wait));
          break;
        case "noop":
          result = Functional.noop();
          break;
        case "identity":
          if (value === undefined) {
            return res.status(400).json({
              error: "Value is required for identity",
            });
          }
          result = (x: any) => x;
          break;
        default:
          return res.status(400).json({
            error: `Unknown execution operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: fn || value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in executionFunctional controller");
    return res.status(500).json({
      error: "Failed to perform functional execution operation",
    });
  }
}

/**
 * Perform predicate-related operations
 */
export function predicateFunctional(req: Request, res: Response): Response {
  try {
    const { operation, value, predicates, key } =
      req.body as FunctionalOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "not":
          if (!value) {
            return res.status(400).json({
              error: "Predicate is required for not",
            });
          }
          result = Functional.not(value);
          break;
        case "allOf":
          if (!predicates || !predicates.length) {
            return res.status(400).json({
              error: "Predicates are required for allOf",
            });
          }
          result = Functional.allOf(...predicates);
          break;
        case "anyOf":
          if (!predicates || !predicates.length) {
            return res.status(400).json({
              error: "Predicates are required for anyOf",
            });
          }
          result = Functional.anyOf(...predicates);
          break;
        case "prop":
          if (!key) {
            return res.status(400).json({
              error: "Key is required for prop",
            });
          }
          result = Functional.prop(key as never);
          break;
        case "hasProp":
          if (!key) {
            return res.status(400).json({
              error: "Key is required for hasProp",
            });
          }
          result = Functional.hasProp(Str.fromRaw(key));
          break;
        case "propEq":
          if (!key || value === undefined) {
            return res.status(400).json({
              error: "Key and value are required for propEq",
            });
          }
          result = Functional.propEq(key as never, value as never);
          break;
        default:
          return res.status(400).json({
            error: `Unknown predicate operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value || predicates || key,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in predicateFunctional controller");
    return res.status(500).json({
      error: "Failed to perform functional predicate operation",
    });
  }
}

/**
 * Perform utility operations
 */
export function utilityFunctional(req: Request, res: Response): Response {
  try {
    const { operation, values, fn, partialArgs } =
      req.body as FunctionalOperationRequest;

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "partial":
          if (!fn || !partialArgs) {
            return res.status(400).json({
              error: "Function and partial arguments are required for partial",
            });
          }
          result = Functional.partial(fn, ...partialArgs);
          break;
        case "flip":
          if (!fn) {
            return res.status(400).json({
              error: "Function is required for flip",
            });
          }
          result = Functional.flip(fn);
          break;
        case "juxt":
          if (!values || !values.length) {
            return res.status(400).json({
              error: "Functions are required for juxt",
            });
          }
          result = Functional.juxt(...values);
          break;
        case "zipWith":
          if (!values || values.length !== 3) {
            return res.status(400).json({
              error:
                "Function, first Vec, and second Vec are required for zipWith",
            });
          }
          result = Functional.zipWith(values[0], values[1], values[2]);
          break;
        case "converge":
          if (!values || values.length < 2) {
            return res.status(400).json({
              error:
                "After function and transformation functions are required for converge",
            });
          }
          result = Functional.converge(values[0], values.slice(1));
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
        original: values || fn,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in utilityFunctional controller");
    return res.status(500).json({
      error: "Failed to perform functional utility operation",
    });
  }
}

/**
 * Generic functional operations router
 */
export function functionalOperations(req: Request, res: Response): Response {
  try {
    const { operation } = req.body as FunctionalOperationRequest;

    switch (true) {
      case [
        "toHashMap",
        "toHashSet",
        "toVec",
        "mapObject",
        "filterObject",
      ].includes(operation):
        return mapFunctional(req, res);
      case [
        "mergeDeep",
        "pipe",
        "compose",
        "curry",
        "memoize",
        "once",
      ].includes(operation):
        return transformFunctional(req, res);
      case ["throttle", "debounce", "noop", "identity"].includes(operation):
        return executionFunctional(req, res);
      case ["not", "allOf", "anyOf", "prop", "hasProp", "propEq"].includes(
        operation
      ):
        return predicateFunctional(req, res);
      case ["partial", "flip", "juxt", "zipWith", "converge"].includes(
        operation
      ):
        return utilityFunctional(req, res);
      default:
        return res.status(400).json({
          error: `Unknown functional operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in functionalOperations controller");
    return res.status(500).json({
      error: "Failed to perform functional operation",
    });
  }
}
