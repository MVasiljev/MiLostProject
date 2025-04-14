import { Request, Response } from "express";
import { Str } from "milost";
import logger from "../utils/logger.js";
import {
  CreateStringRequest,
  StringOperationRequest,
  StringOperation,
} from "../types/index.js";

/**
 * Create a new string
 */
export function createString(req: Request, res: Response): Response {
  try {
    const { value } = req.body as CreateStringRequest;

    if (!value) {
      return res.status(400).json({
        error: "String value is required",
      });
    }

    const str = Str.fromRaw(value);

    return res.status(200).json({
      data: {
        original: value,
        length: str.len(),
        isEmpty: str.isEmpty(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createString controller");
    return res.status(500).json({
      error: "Failed to create string",
    });
  }
}

/**
 * Perform operations on a string
 */
export function stringOperations(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as StringOperationRequest;

    if (!value || !operation) {
      return res.status(400).json({
        error: "String value and operation are required",
      });
    }

    const str = Str.fromRaw(value);
    let result: string;

    switch (operation) {
      case StringOperation.UPPERCASE:
        result = str.toUpperCase().unwrap();
        break;
      case StringOperation.LOWERCASE:
        result = str.toLowerCase().unwrap();
        break;
      case StringOperation.TRIM:
        result = str.trim().unwrap();
        break;
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in stringOperations controller");
    return res.status(500).json({
      error: "Failed to perform string operation",
    });
  }
}
