import { Request, Response } from "express";
import { Tuple } from "milost";
import logger from "../utils/logger.js";
import {
  CreateTupleRequest,
  TupleGetRequest,
  TupleFirstRequest,
  TupleSecondRequest,
  TupleReplaceRequest,
  TupleMapRequest,
  TupleOperationRequest,
  TupleLengthRequest,
  TupleAnalyzeRequest,
} from "../types/tuple.js";

/**
 * Create a new tuple and analyze it
 */
export function createTuple(req: Request, res: Response): Response {
  try {
    const { values } = req.body as CreateTupleRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Tuple values array is required",
      });
    }

    const tuple = Tuple.from(...values);

    const types = values.map((val) => typeof val);

    return res.status(200).json({
      data: {
        original: values,
        length: tuple.len(),
        types,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createTuple controller");
    return res.status(500).json({
      error: "Failed to create tuple",
    });
  }
}

/**
 * Get item from tuple by index
 */
export function getTupleItem(req: Request, res: Response): Response {
  try {
    const { values, index } = req.body as TupleGetRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Tuple values array is required",
      });
    }

    if (index === undefined || index < 0 || index >= values.length) {
      return res.status(400).json({
        error: `Invalid index: ${index}. Must be between 0 and ${values.length - 1}`,
      });
    }

    const tuple = Tuple.from(...values);
    const result = tuple.get(index);

    return res.status(200).json({
      data: {
        original: values,
        index,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in getTupleItem controller");
    return res.status(500).json({
      error: "Failed to get tuple item",
    });
  }
}

/**
 * Get first item from tuple
 */
export function getFirstItem(req: Request, res: Response): Response {
  try {
    const { values } = req.body as TupleFirstRequest;

    if (!values || !Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        error: "Non-empty tuple values array is required",
      });
    }

    const tuple = Tuple.from(...values);
    const result = tuple.first();

    return res.status(200).json({
      data: {
        original: values,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in getFirstItem controller");
    return res.status(500).json({
      error: "Failed to get first tuple item",
    });
  }
}

/**
 * Get second item from tuple
 */
export function getSecondItem(req: Request, res: Response): Response {
  try {
    const { values } = req.body as TupleSecondRequest;

    if (!values || !Array.isArray(values) || values.length < 2) {
      return res.status(400).json({
        error: "Tuple values array with at least 2 items is required",
      });
    }

    const tuple = Tuple.from(...values);
    const result = tuple.second();

    return res.status(200).json({
      data: {
        original: values,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in getSecondItem controller");
    return res.status(500).json({
      error: "Failed to get second tuple item",
    });
  }
}

/**
 * Replace an item in a tuple
 */
export function replaceTupleItem(req: Request, res: Response): Response {
  try {
    const { values, index, value } = req.body as TupleReplaceRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Tuple values array is required",
      });
    }

    if (index === undefined || index < 0 || index >= values.length) {
      return res.status(400).json({
        error: `Invalid index: ${index}. Must be between 0 and ${values.length - 1}`,
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Replacement value is required",
      });
    }

    const tuple = Tuple.from(...values);
    const newTuple = tuple.replace(index, value);
    const result = newTuple.toArray();

    return res.status(200).json({
      data: {
        original: values,
        index,
        value,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in replaceTupleItem controller");
    return res.status(500).json({
      error: "Failed to replace tuple item",
    });
  }
}

/**
 * Map a tuple
 */
export function mapTuple(req: Request, res: Response): Response {
  try {
    const { values, operation } = req.body as TupleMapRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Tuple values array is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Map operation is required",
      });
    }

    const tuple = Tuple.from(...values);
    let result: any[];

    switch (operation) {
      case "double":
        result = tuple
          .map((value) => (typeof value === "number" ? value * 2 : value))
          .toArray();
        break;
      case "square":
        result = tuple
          .map((value) => (typeof value === "number" ? value * value : value))
          .toArray();
        break;
      case "toString":
        result = tuple.map((value) => String(value)).toArray();
        break;
      case "increment":
        result = tuple
          .map((value) => (typeof value === "number" ? value + 1 : value))
          .toArray();
        break;
      case "decrement":
        result = tuple
          .map((value) => (typeof value === "number" ? value - 1 : value))
          .toArray();
        break;
      default:
        return res.status(400).json({
          error: `Unknown map operation: ${operation}`,
        });
    }

    return res.status(200).json({
      data: {
        original: values,
        operation,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in mapTuple controller");
    return res.status(500).json({
      error: "Failed to map tuple",
    });
  }
}

/**
 * Get tuple length
 */
export function getTupleLength(req: Request, res: Response): Response {
  try {
    const { values } = req.body as TupleLengthRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "Tuple values array is required",
      });
    }

    const tuple = Tuple.from(...values);
    const length = tuple.len();

    return res.status(200).json({
      data: {
        original: values,
        length,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in getTupleLength controller");
    return res.status(500).json({
      error: "Failed to get tuple length",
    });
  }
}

/**
 * Perform a tuple operation
 */
export function tupleOperations(req: Request, res: Response): Response {
  try {
    const { values, operation, index, value, mapOperation } =
      req.body as TupleOperationRequest;

    if (!values || !Array.isArray(values) || !operation) {
      return res.status(400).json({
        error: "Tuple values and operation are required",
      });
    }

    switch (operation) {
      case "get":
        if (index === undefined) {
          return res.status(400).json({
            error: "Index is required for 'get' operation",
          });
        }
        return getTupleItem(
          { ...req, body: { values, index } } as Request,
          res
        );
      case "first":
        return getFirstItem({ ...req, body: { values } } as Request, res);
      case "second":
        return getSecondItem({ ...req, body: { values } } as Request, res);
      case "replace":
        if (index === undefined || value === undefined) {
          return res.status(400).json({
            error: "Index and value are required for 'replace' operation",
          });
        }
        return replaceTupleItem(
          { ...req, body: { values, index, value } } as Request,
          res
        );
      case "map":
        if (!mapOperation) {
          return res.status(400).json({
            error: "Map operation is required for 'map' operation",
          });
        }
        return mapTuple(
          { ...req, body: { values, operation: mapOperation } } as Request,
          res
        );
      case "length":
        return getTupleLength({ ...req, body: { values } } as Request, res);
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in tupleOperations controller");
    return res.status(500).json({
      error: "Failed to perform tuple operation",
    });
  }
}

/**
 * Parse and analyze a tuple from a string input
 */
export function analyzeTuple(req: Request, res: Response): Response {
  try {
    const { value } = req.body as TupleAnalyzeRequest;

    if (!value) {
      return res.status(400).json({
        error: "Tuple value string is required",
      });
    }

    let parsed: any[] = [];
    try {
      if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
        parsed = JSON.parse(value);
      } else {
        parsed = value.split(",").map((item) => {
          const trimmed = item.trim();

          if (
            (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
            (trimmed.startsWith('"') && trimmed.endsWith('"'))
          ) {
            return trimmed.slice(1, -1);
          }

          if (trimmed.toLowerCase() === "true") return true;
          if (trimmed.toLowerCase() === "false") return false;

          if (trimmed.toLowerCase() === "null") return null;

          const num = Number(trimmed);
          if (!isNaN(num)) return num;

          return trimmed;
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Failed to parse tuple: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const tuple = Tuple.from(...parsed);

    const types = parsed.map((item) => typeof item);

    return res.status(200).json({
      data: {
        original: value,
        parsed,
        length: tuple.len(),
        types,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in analyzeTuple controller");
    return res.status(500).json({
      error: `Failed to analyze tuple: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
