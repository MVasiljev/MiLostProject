import { Request, Response } from "express";
import { Option, Str } from "milost";
import logger from "../utils/logger.js";
import {
  OptionOperationRequest,
  OptionOperationResponse,
} from "../types/option.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function optionOperations(req: Request, res: Response): Response {
  try {
    const {
      operation,
      value,
      defaultValue,
      predicate,
      onSome,
      onNone,
      options,
    } = req.body as OptionOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    let result: any = null;
    let success = true;
    let errorMessage: string | null = null;

    try {
      switch (operation) {
        case "some":
          if (value === undefined || value === null) {
            success = false;
            errorMessage =
              "Value cannot be null or undefined for 'some' operation";
            break;
          }
          result = Option.Some(value);
          break;
        case "none":
          result = Option.None();
          break;
        case "from":
          result = Option.from(value);
          break;
        case "isSome":
          if (!(value instanceof Option)) {
            success = false;
            errorMessage = "Value must be an Option for 'isSome' operation";
            break;
          }
          result = value.isSome();
          break;
        case "isNone":
          if (!(value instanceof Option)) {
            success = false;
            errorMessage = "Value must be an Option for 'isNone' operation";
            break;
          }
          result = value.isNone();
          break;
        case "expect":
          if (!(value instanceof Option) || defaultValue === undefined) {
            success = false;
            errorMessage =
              "Value must be an Option and expect message is required";
            break;
          }
          try {
            result = value.expect(Str.fromRaw(defaultValue));
          } catch (err) {
            success = false;
            errorMessage = extractErrorMessage(err);
          }
          break;
        case "unwrap":
          if (!(value instanceof Option)) {
            success = false;
            errorMessage = "Value must be an Option for 'unwrap' operation";
            break;
          }
          try {
            result = value.unwrap();
          } catch (err) {
            success = false;
            errorMessage = extractErrorMessage(err);
          }
          break;
        case "unwrapOr":
          if (!(value instanceof Option) || defaultValue === undefined) {
            success = false;
            errorMessage =
              "Value must be an Option and default value is required";
            break;
          }
          result = value.unwrapOr(defaultValue);
          break;
        case "unwrapOrElse":
          if (!(value instanceof Option) || !onNone) {
            success = false;
            errorMessage =
              "Value must be an Option and onNone function is required";
            break;
          }
          result = value.unwrapOrElse(onNone);
          break;
        case "map":
          if (!(value instanceof Option) || !onSome) {
            success = false;
            errorMessage =
              "Value must be an Option and map function is required";
            break;
          }
          result = value.map(onSome);
          break;
        case "andThen":
          if (!(value instanceof Option) || !onSome) {
            success = false;
            errorMessage =
              "Value must be an Option and andThen function is required";
            break;
          }
          result = value.andThen(onSome);
          break;
        case "or":
          if (!(value instanceof Option) || !(defaultValue instanceof Option)) {
            success = false;
            errorMessage = "Both values must be Options";
            break;
          }
          result = value.or(defaultValue);
          break;
        case "match":
          if (!(value instanceof Option) || !onSome || !onNone) {
            success = false;
            errorMessage =
              "Value must be an Option and both onSome and onNone functions are required";
            break;
          }
          result = value.match(onSome, onNone);
          break;
        case "filter":
          if (!(value instanceof Option) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Option and predicate function is required";
            break;
          }
          result = value.filter(predicate);
          break;
        case "exists":
          if (!(value instanceof Option) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Option and predicate function is required";
            break;
          }
          result = value.exists(predicate);
          break;
        case "firstSome":
          if (!options || !Array.isArray(options)) {
            success = false;
            errorMessage = "Options array is required";
            break;
          }
          const mappedOptions = options.map((opt) =>
            opt instanceof Option ? opt : Option.from(opt)
          );
          result = Option.firstSome(...mappedOptions);
          break;
        case "all":
          if (!options || !Array.isArray(options)) {
            success = false;
            errorMessage = "Options array is required";
            break;
          }
          const allMappedOptions = options.map((opt) =>
            opt instanceof Option ? opt : Option.from(opt)
          );
          result = Option.all(allMappedOptions);
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      errorMessage = extractErrorMessage(err);
    }

    const response: OptionOperationResponse = {
      data: {
        operation,
        value,
        defaultValue,
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
