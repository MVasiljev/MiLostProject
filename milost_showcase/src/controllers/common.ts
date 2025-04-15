import { Request, Response } from "express";
import {
  Types,
  Str,
  Vec,
  Option,
  Result,
  BrandTypes,
  LoadingStates,
  isDefined,
  isObject,
  isVec,
  isStr,
  isNumeric,
  isBoolean,
  isFunction,
  iterableToVec,
} from "milost";
import logger from "../utils/logger.js";
import {
  TypeCheckRequest,
  TypeCheckResponse,
  ConversionRequest,
  ConversionResponse,
  LoadingStateRequest,
  LoadingStateResponse,
  BrandTypeRequest,
  BrandTypeResponse,
  OptionOperationRequest,
  OptionOperationResponse,
  ResultOperationRequest,
  ResultOperationResponse,
  CommonOperationRequest,
} from "../types/common.js";

/**
 * Perform type checking operations
 */
export function typeCheck(req: Request, res: Response): Response {
  try {
    const { value, checkType } = req.body as TypeCheckRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!checkType) {
      return res.status(400).json({
        error:
          "Check type is required (defined, object, vec, str, numeric, boolean, function)",
      });
    }

    let result = false;

    switch (checkType) {
      case "defined":
        result = isDefined(value);
        break;
      case "object":
        result = isObject(value);
        break;
      case "vec":
        result = isVec(value);
        break;
      case "str":
        result = isStr(value);
        break;
      case "numeric":
        result = isNumeric(value);
        break;
      case "boolean":
        result = isBoolean(value);
        break;
      case "function":
        result = isFunction(value);
        break;
      default:
        return res.status(400).json({
          error: `Unknown check type: ${checkType}`,
        });
    }

    const response: TypeCheckResponse = {
      data: {
        value,
        checkType,
        result,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in typeCheck controller");
    return res.status(500).json({
      error: "Failed to perform type check",
    });
  }
}

/**
 * Convert an iterable to a Vec
 */
export function convertToVec(req: Request, res: Response): Response {
  try {
    const { values } = req.body as ConversionRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Values array is required",
      });
    }

    const vec = iterableToVec(values);

    const response: ConversionResponse = {
      data: {
        original: values,
        converted: vec.toArray(),
        length: vec.len(),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in convertToVec controller");
    return res.status(500).json({
      error: "Failed to convert to Vec",
    });
  }
}

/**
 * Get loading states
 */
export function getLoadingStates(req: Request, res: Response): Response {
  try {
    const { state } = req.body as LoadingStateRequest;

    const states = {
      IDLE: LoadingStates.IDLE.unwrap(),
      LOADING: LoadingStates.LOADING.unwrap(),
      SUCCEEDED: LoadingStates.SUCCEEDED.unwrap(),
      FAILED: LoadingStates.FAILED.unwrap(),
    };

    const response: LoadingStateResponse = {
      data: {
        states,
        requestedState: state ? states[state] || null : null,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in getLoadingStates controller");
    return res.status(500).json({
      error: "Failed to get loading states",
    });
  }
}

/**
 * Get brand types
 */
export function getBrandTypes(req: Request, res: Response): Response {
  try {
    const { type } = req.body as BrandTypeRequest;

    const types = {
      JSON: BrandTypes.JSON.unwrap(),
      POSITIVE: BrandTypes.POSITIVE.unwrap(),
      NEGATIVE: BrandTypes.NEGATIVE.unwrap(),
      NON_NEGATIVE: BrandTypes.NON_NEGATIVE.unwrap(),
      PERCENTAGE: BrandTypes.PERCENTAGE.unwrap(),
    };

    const response: BrandTypeResponse = {
      data: {
        types,
        requestedType: type ? types[type] || null : null,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in getBrandTypes controller");
    return res.status(500).json({
      error: "Failed to get brand types",
    });
  }
}

/**
 * Perform Option operations
 */
export function optionOperations(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as OptionOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error:
          "Operation is required (some, none, isSome, isNone, unwrap, unwrapOr, unwrapOrElse)",
      });
    }

    let result;
    let success = true;
    let errorMessage: string | null = null;

    try {
      switch (operation) {
        case "some":
          result = Option.Some(value);
          break;
        case "none":
          result = Option.None();
          break;
        case "isSome":
          if (
            value &&
            typeof value === "object" &&
            "isSome" in value &&
            typeof value.isSome === "function"
          ) {
            result = value.isSome();
          } else {
            success = false;
            errorMessage = "Value is not an Option";
          }
          break;
        case "isNone":
          if (
            value &&
            typeof value === "object" &&
            "isNone" in value &&
            typeof value.isNone === "function"
          ) {
            result = value.isNone();
          } else {
            success = false;
            errorMessage = "Value is not an Option";
          }
          break;
        case "unwrap":
          if (
            value &&
            typeof value === "object" &&
            "unwrap" in value &&
            typeof value.unwrap === "function"
          ) {
            try {
              result = value.unwrap();
            } catch (error) {
              success = false;
              errorMessage =
                error instanceof Error ? error.message : String(error);
            }
          } else {
            success = false;
            errorMessage = "Value is not an Option";
          }
          break;
        case "unwrapOr":
          const { defaultValue } = req.body;
          if (defaultValue === undefined) {
            return res.status(400).json({
              error: "Default value is required for unwrapOr operation",
            });
          }

          if (
            value &&
            typeof value === "object" &&
            "unwrapOr" in value &&
            typeof value.unwrapOr === "function"
          ) {
            result = value.unwrapOr(defaultValue);
          } else {
            success = false;
            errorMessage = "Value is not an Option";
          }
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    const response: OptionOperationResponse = {
      data: {
        value,
        operation,
        result,
        success,
        error: errorMessage,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in optionOperations controller");
    return res.status(500).json({
      error: "Failed to perform Option operation",
    });
  }
}

/**
 * Perform Result operations
 */
export function resultOperations(req: Request, res: Response): Response {
  try {
    const {
      value,
      error: errorValue,
      operation,
    } = req.body as ResultOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error:
          "Operation is required (ok, err, isOk, isErr, unwrap, unwrapErr, unwrapOr)",
      });
    }

    let result;
    let success = true;
    let errorMessage: string | null = null;

    try {
      switch (operation) {
        case "ok":
          result = Result.Ok(value);
          break;
        case "err":
          result = Result.Err(errorValue);
          break;
        case "isOk":
          if (
            value &&
            typeof value === "object" &&
            "isOk" in value &&
            typeof value.isOk === "function"
          ) {
            result = value.isOk();
          } else {
            success = false;
            errorMessage = "Value is not a Result";
          }
          break;
        case "isErr":
          if (
            value &&
            typeof value === "object" &&
            "isErr" in value &&
            typeof value.isErr === "function"
          ) {
            result = value.isErr();
          } else {
            success = false;
            errorMessage = "Value is not a Result";
          }
          break;
        case "unwrap":
          if (
            value &&
            typeof value === "object" &&
            "unwrap" in value &&
            typeof value.unwrap === "function"
          ) {
            try {
              result = value.unwrap();
            } catch (error) {
              success = false;
              errorMessage =
                error instanceof Error ? error.message : String(error);
            }
          } else {
            success = false;
            errorMessage = "Value is not a Result";
          }
          break;
        case "unwrapErr":
          if (
            value &&
            typeof value === "object" &&
            "unwrapErr" in value &&
            typeof value.unwrapErr === "function"
          ) {
            try {
              result = value.unwrapErr();
            } catch (error) {
              success = false;
              errorMessage =
                error instanceof Error ? error.message : String(error);
            }
          } else {
            success = false;
            errorMessage = "Value is not a Result";
          }
          break;
        case "unwrapOr":
          const { defaultValue } = req.body;
          if (defaultValue === undefined) {
            return res.status(400).json({
              error: "Default value is required for unwrapOr operation",
            });
          }

          if (
            value &&
            typeof value === "object" &&
            "unwrapOr" in value &&
            typeof value.unwrapOr === "function"
          ) {
            result = value.unwrapOr(defaultValue);
          } else {
            success = false;
            errorMessage = "Value is not a Result";
          }
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    const response: ResultOperationResponse = {
      data: {
        value,
        errorValue,
        operation,
        result,
        success,
        error: errorMessage,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in resultOperations controller");
    return res.status(500).json({
      error: "Failed to perform Result operation",
    });
  }
}

/**
 * Generic operation router for common operations
 */
export function commonOperations(req: Request, res: Response): Response {
  try {
    const { operation } = req.body as CommonOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (operation) {
      case "typeCheck":
        return typeCheck(req, res);
      case "convertToVec":
        return convertToVec(req, res);
      case "loadingStates":
        return getLoadingStates(req, res);
      case "brandTypes":
        return getBrandTypes(req, res);
      case "option":
        return optionOperations(req, res);
      case "result":
        return resultOperations(req, res);
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in commonOperations controller");
    return res.status(500).json({
      error: "Failed to perform common operation",
    });
  }
}
