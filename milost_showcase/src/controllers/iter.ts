export function createIter(req: Request, res: Response): Response {
  try {
    const { values } = req.body;

    if (!values) {
      return res.status(400).json({
        error: "Values array is required",
      });
    }

    const iter = Iter.from(values);

    return res.status(200).json({
      data: {
        original: values,
        type: "Iter",
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createIter controller");
    return res.status(500).json({
      error: "Failed to create Iter",
    });
  }
}

export function createIterFromVec(req: Request, res: Response): Response {
  try {
    const { vec } = req.body;

    if (!vec) {
      return res.status(400).json({
        error: "Vec array is required",
      });
    }

    const vecInstance = Vec.from(vec);
    const iter = Iter.fromVec(vecInstance);

    return res.status(200).json({
      data: {
        original: vec,
        result: iter.collect().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createIterFromVec controller");
    return res.status(500).json({
      error: "Failed to create Iter from Vec",
    });
  }
}

export function createRangeIter(req: Request, res: Response): Response {
  try {
    const { start, end, step } = req.body;

    if (start === undefined || end === undefined) {
      return res.status(400).json({
        error: "Start and end are required for range",
      });
    }

    const iter = Iter.range(
      i32(start),
      i32(end),
      step !== undefined ? i32(step) : undefined
    );

    return res.status(200).json({
      data: {
        start,
        end,
        step,
        result: iter.collect().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createRangeIter controller");
    return res.status(500).json({
      error: "Failed to create range Iter",
    });
  }
}

export function mapIter(req: Request, res: Response): Response {
  try {
    const { values, mapFn } = req.body;

    if (!values) {
      return res.status(400).json({
        error: "Values array is required",
      });
    }

    if (!mapFn) {
      return res.status(400).json({
        error: "Mapping function is required",
      });
    }

    const iter = Iter.from(values);
    const mappedIter = iter.map(mapFn);

    return res.status(200).json({
      data: {
        original: values,
        result: mappedIter.collect().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in mapIter controller");
    return res.status(500).json({
      error: "Failed to map Iter",
    });
  }
}

export function filterIter(req: Request, res: Response): Response {
  try {
    const { values, predicate } = req.body;

    if (!values) {
      return res.status(400).json({
        error: "Values array is required",
      });
    }

    if (!predicate) {
      return res.status(400).json({
        error: "Predicate function is required",
      });
    }

    const iter = Iter.from(values);
    const filteredIter = iter.filter(predicate);

    return res.status(200).json({
      data: {
        original: values,
        result: filteredIter.collect().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in filterIter controller");
    return res.status(500).json({
      error: "Failed to filter Iter",
    });
  }
}

export function collectIter(req: Request, res: Response): Response {
  try {
    const { values } = req.body;

    if (!values) {
      return res.status(400).json({
        error: "Values array is required",
      });
    }

    const iter = Iter.from(values);
    const collected = iter.collect();

    return res.status(200).json({
      data: {
        original: values,
        result: collected.toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in collectIter controller");
    return res.status(500).json({
      error: "Failed to collect Iter",
    });
  }
}
import { Request, Response } from "express";
import { Iter, Vec, i32, u32 } from "milost";
import logger from "../utils/logger.js";
import { IterOperationRequest, IterOperationResponse } from "../types/iter.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function iterOperations(req: Request, res: Response): Response {
  try {
    const {
      operation,
      values,
      value,
      vec,
      start,
      end,
      step,
      size,
      size_or_index,
      index,
      predicate,
      keyFn,
      f,
      separator,
      initial,
      other,
    } = req.body as IterOperationRequest;

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
        case "from":
          if (!values) {
            success = false;
            errorMessage = "Values array is required";
            break;
          }
          result = Iter.from(values);
          break;
        case "fromVec":
          if (!vec) {
            success = false;
            errorMessage = "Vec array is required";
            break;
          }
          result = Iter.fromVec(Vec.from(vec));
          break;
        case "empty":
          result = Iter.empty();
          break;
        case "range":
          if (start === undefined || end === undefined) {
            success = false;
            errorMessage = "Start and end are required for range";
            break;
          }
          result = Iter.range(
            i32(start),
            i32(end),
            step !== undefined ? i32(step) : undefined
          );
          break;
        case "next":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'next' operation";
            break;
          }
          result = value.next();
          break;
        case "map":
          if (!(value instanceof Iter) || !f) {
            success = false;
            errorMessage =
              "Value must be an Iter and mapping function is required";
            break;
          }
          result = value.map(f);
          break;
        case "filter":
          if (!(value instanceof Iter) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Iter and predicate function is required";
            break;
          }
          result = value.filter(predicate);
          break;
        case "take":
          if (!(value instanceof Iter) || size_or_index === undefined) {
            success = false;
            errorMessage = "Value must be an Iter and size is required";
            break;
          }
          result = value.take(u32(size_or_index));
          break;
        case "skip":
          if (!(value instanceof Iter) || size_or_index === undefined) {
            success = false;
            errorMessage = "Value must be an Iter and size is required";
            break;
          }
          result = value.skip(u32(size_or_index));
          break;
        case "enumerate":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'enumerate' operation";
            break;
          }
          result = value.enumerate();
          break;
        case "zip":
          if (!(value instanceof Iter) || !other) {
            success = false;
            errorMessage =
              "Value must be an Iter and other iterable is required";
            break;
          }
          result = value.zip(other);
          break;
        case "chain":
          if (!(value instanceof Iter) || !other) {
            success = false;
            errorMessage =
              "Value must be an Iter and other iterable is required";
            break;
          }
          result = value.chain(other);
          break;
        case "flatMap":
          if (!(value instanceof Iter) || !f) {
            success = false;
            errorMessage =
              "Value must be an Iter and mapping function is required";
            break;
          }
          result = value.flatMap(f);
          break;
        case "chunks":
          if (!(value instanceof Iter) || size === undefined) {
            success = false;
            errorMessage = "Value must be an Iter and chunk size is required";
            break;
          }
          result = value.chunks(u32(size));
          break;
        case "collect":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'collect' operation";
            break;
          }
          result = value.collect();
          break;
        case "find":
          if (!(value instanceof Iter) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Iter and predicate function is required";
            break;
          }
          result = value.find(predicate);
          break;
        case "first":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'first' operation";
            break;
          }
          result = value.first();
          break;
        case "last":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'last' operation";
            break;
          }
          result = value.last();
          break;
        case "nth":
          if (!(value instanceof Iter) || index === undefined) {
            success = false;
            errorMessage = "Value must be an Iter and index is required";
            break;
          }
          result = value.nth(u32(index));
          break;
        case "forEach":
          if (!(value instanceof Iter) || !f) {
            success = false;
            errorMessage =
              "Value must be an Iter and callback function is required";
            break;
          }
          value.forEach(f);
          result = null;
          break;
        case "all":
          if (!(value instanceof Iter) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Iter and predicate function is required";
            break;
          }
          result = value.all(predicate);
          break;
        case "any":
          if (!(value instanceof Iter) || !predicate) {
            success = false;
            errorMessage =
              "Value must be an Iter and predicate function is required";
            break;
          }
          result = value.any(predicate);
          break;
        case "count":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'count' operation";
            break;
          }
          result = value.count();
          break;
        case "fold":
          if (!(value instanceof Iter) || initial === undefined || !f) {
            success = false;
            errorMessage =
              "Value must be an Iter, initial value and fold function are required";
            break;
          }
          result = value.fold(initial, f);
          break;
        case "dedup":
          if (!(value instanceof Iter)) {
            success = false;
            errorMessage = "Value must be an Iter for 'dedup' operation";
            break;
          }
          result = value.dedup();
          break;
        case "dedupBy":
          if (!(value instanceof Iter) || !keyFn) {
            success = false;
            errorMessage = "Value must be an Iter and key function is required";
            break;
          }
          result = value.dedupBy(keyFn);
          break;
        case "intersperse":
          if (!(value instanceof Iter) || separator === undefined) {
            success = false;
            errorMessage = "Value must be an Iter and separator is required";
            break;
          }
          result = value.intersperse(separator);
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

    const response: IterOperationResponse = {
      data: {
        operation,
        values,
        start,
        end,
        step,
        result,
        success,
        error: errorMessage,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in iterOperations controller");
    return res.status(500).json({
      error: "Failed to perform Iter operation",
    });
  }
}
