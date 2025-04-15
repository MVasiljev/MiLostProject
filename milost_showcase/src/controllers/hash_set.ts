import { Request, Response } from "express";
import { HashSet } from "milost";
import logger from "../utils/logger.js";
import {
  CreateHashSetRequest,
  HashSetContainsRequest,
  HashSetInsertRequest,
  HashSetRemoveRequest,
  HashSetMapRequest,
  HashSetFilterRequest,
  HashSetOperationRequest,
  HashSetSetOperationRequest,
  HashSetAnalyzeRequest,
} from "../types/hash_set.js";

/**
 * Create a new hash set and analyze it
 */
export function createHashSet(req: Request, res: Response): Response {
  try {
    const { values } = req.body as CreateHashSetRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    const hashSet = HashSet.from(values);
    const size = hashSet.size();

    return res.status(200).json({
      data: {
        original: values,
        size,
        isEmpty: hashSet.isEmpty(),
        values: hashSet.values().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createHashSet controller");
    return res.status(500).json({
      error: "Failed to create hash set",
    });
  }
}

/**
 * Check if a hash set contains a value
 */
export function containsHashSetValue(req: Request, res: Response): Response {
  try {
    const { values, value } = req.body as HashSetContainsRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to check is required",
      });
    }

    const hashSet = HashSet.from(values);
    const contains = hashSet.contains(value);

    return res.status(200).json({
      data: {
        original: values,
        value,
        contains,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in containsHashSetValue controller");
    return res.status(500).json({
      error: "Failed to check hash set value",
    });
  }
}

/**
 * Insert a value into a hash set
 */
export function insertHashSetValue(req: Request, res: Response): Response {
  try {
    const { values, value } = req.body as HashSetInsertRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to insert is required",
      });
    }

    const hashSet = HashSet.from(values);
    const newHashSet = hashSet.insert(value);
    const result = newHashSet.values().toArray();

    return res.status(200).json({
      data: {
        original: values,
        value,
        result,
        size: newHashSet.size(),
        valueWasNew: !hashSet.contains(value),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in insertHashSetValue controller");
    return res.status(500).json({
      error: "Failed to insert hash set value",
    });
  }
}

/**
 * Remove a value from a hash set
 */
export function removeHashSetValue(req: Request, res: Response): Response {
  try {
    const { values, value } = req.body as HashSetRemoveRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to remove is required",
      });
    }

    const hashSet = HashSet.from(values);
    const valueExists = hashSet.contains(value);
    const newHashSet = hashSet.remove(value);
    const result = newHashSet.values().toArray();

    return res.status(200).json({
      data: {
        original: values,
        value,
        result,
        size: newHashSet.size(),
        valueExisted: valueExists,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in removeHashSetValue controller");
    return res.status(500).json({
      error: "Failed to remove hash set value",
    });
  }
}

/**
 * Map values in a hash set
 */
export function mapHashSet(req: Request, res: Response): Response {
  try {
    const { values, operation } = req.body as HashSetMapRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Map operation is required",
      });
    }

    const hashSet = HashSet.from(values);
    let result: any[];

    switch (operation) {
      case "double":
        result = hashSet
          .map((value) => (typeof value === "number" ? value * 2 : value))
          .values()
          .toArray();
        break;
      case "square":
        result = hashSet
          .map((value) => (typeof value === "number" ? value * value : value))
          .values()
          .toArray();
        break;
      case "toString":
        result = hashSet
          .map((value) => String(value))
          .values()
          .toArray();
        break;
      case "increment":
        result = hashSet
          .map((value) => (typeof value === "number" ? value + 1 : value))
          .values()
          .toArray();
        break;
      case "uppercase":
        result = hashSet
          .map((value) =>
            typeof value === "string" ? value.toUpperCase() : value
          )
          .values()
          .toArray();
        break;
      case "lowercase":
        result = hashSet
          .map((value) =>
            typeof value === "string" ? value.toLowerCase() : value
          )
          .values()
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
    logger.error({ error }, "Error in mapHashSet controller");
    return res.status(500).json({
      error: "Failed to map hash set",
    });
  }
}

/**
 * Filter values in a hash set
 */
export function filterHashSet(req: Request, res: Response): Response {
  try {
    const { values, operation, parameter } = req.body as HashSetFilterRequest;

    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        error: "HashSet values array is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Filter operation is required",
      });
    }

    const hashSet = HashSet.from(values);
    let result: any[];

    switch (operation) {
      case "greaterThan":
        if (parameter === undefined) {
          return res.status(400).json({
            error: "Parameter is required for 'greaterThan' operation",
          });
        }
        result = hashSet
          .filter((value) => typeof value === "number" && value > parameter)
          .values()
          .toArray();
        break;
      case "lessThan":
        if (parameter === undefined) {
          return res.status(400).json({
            error: "Parameter is required for 'lessThan' operation",
          });
        }
        result = hashSet
          .filter((value) => typeof value === "number" && value < parameter)
          .values()
          .toArray();
        break;
      case "equals":
        if (parameter === undefined) {
          return res.status(400).json({
            error: "Parameter is required for 'equals' operation",
          });
        }
        result = hashSet
          .filter((value) => value === parameter)
          .values()
          .toArray();
        break;
      case "contains":
        if (typeof parameter !== "string") {
          return res.status(400).json({
            error: "String parameter is required for 'contains' operation",
          });
        }
        result = hashSet
          .filter(
            (value) => typeof value === "string" && value.includes(parameter)
          )
          .values()
          .toArray();
        break;
      case "startsWith":
        if (typeof parameter !== "string") {
          return res.status(400).json({
            error: "String parameter is required for 'startsWith' operation",
          });
        }
        result = hashSet
          .filter(
            (value) => typeof value === "string" && value.startsWith(parameter)
          )
          .values()
          .toArray();
        break;
      case "endsWith":
        if (typeof parameter !== "string") {
          return res.status(400).json({
            error: "String parameter is required for 'endsWith' operation",
          });
        }
        result = hashSet
          .filter(
            (value) => typeof value === "string" && value.endsWith(parameter)
          )
          .values()
          .toArray();
        break;
      default:
        return res.status(400).json({
          error: `Unknown filter operation: ${operation}`,
        });
    }

    return res.status(200).json({
      data: {
        original: values,
        operation,
        parameter,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in filterHashSet controller");
    return res.status(500).json({
      error: "Failed to filter hash set",
    });
  }
}

/**
 * Perform set operations (union, intersection, difference, etc.)
 */
export function setOperations(req: Request, res: Response): Response {
  try {
    const { firstSet, secondSet, operation } =
      req.body as HashSetSetOperationRequest;

    if (
      !firstSet ||
      !Array.isArray(firstSet) ||
      !secondSet ||
      !Array.isArray(secondSet)
    ) {
      return res.status(400).json({
        error: "Both firstSet and secondSet arrays are required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error:
          "Set operation is required (union, intersection, difference, symmetricDifference)",
      });
    }

    const set1 = HashSet.from(firstSet);
    const set2 = HashSet.from(secondSet);
    let result: any[];

    switch (operation) {
      case "union":
        result = set1.union(set2).values().toArray();
        break;
      case "intersection":
        result = set1.intersection(set2).values().toArray();
        break;
      case "difference":
        result = set1.difference(set2).values().toArray();
        break;
      case "symmetricDifference":
        result = set1.symmetricDifference(set2).values().toArray();
        break;
      case "isSubset":
        return res.status(200).json({
          data: {
            firstSet,
            secondSet,
            operation,
            result: set1.isSubset(set2),
          },
        });
      case "isSuperset":
        return res.status(200).json({
          data: {
            firstSet,
            secondSet,
            operation,
            result: set1.isSuperset(set2),
          },
        });
      default:
        return res.status(400).json({
          error: `Unknown set operation: ${operation}`,
        });
    }

    return res.status(200).json({
      data: {
        firstSet,
        secondSet,
        operation,
        result,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in setOperations controller");
    return res.status(500).json({
      error: "Failed to perform set operation",
    });
  }
}

/**
 * Perform hash set operations (general operation router)
 */
export function hashSetOperations(req: Request, res: Response): Response {
  try {
    const {
      values,
      operation,
      value,
      mapOperation,
      filterOperation,
      parameter,
      firstSet,
      secondSet,
      setOperation,
    } = req.body as HashSetOperationRequest;

    if (setOperation && firstSet && secondSet) {
      return setOperations(
        {
          ...req,
          body: {
            firstSet,
            secondSet,
            operation: setOperation,
          },
        } as Request,
        res
      );
    }

    if (!values || !Array.isArray(values) || !operation) {
      return res.status(400).json({
        error: "HashSet values and operation are required",
      });
    }

    switch (operation) {
      case "contains":
        if (value === undefined) {
          return res.status(400).json({
            error: "Value is required for 'contains' operation",
          });
        }
        return containsHashSetValue(
          { ...req, body: { values, value } } as Request,
          res
        );
      case "insert":
        if (value === undefined) {
          return res.status(400).json({
            error: "Value is required for 'insert' operation",
          });
        }
        return insertHashSetValue(
          { ...req, body: { values, value } } as Request,
          res
        );
      case "remove":
        if (value === undefined) {
          return res.status(400).json({
            error: "Value is required for 'remove' operation",
          });
        }
        return removeHashSetValue(
          { ...req, body: { values, value } } as Request,
          res
        );
      case "map":
        if (!mapOperation) {
          return res.status(400).json({
            error: "Map operation is required for 'map' operation",
          });
        }
        return mapHashSet(
          { ...req, body: { values, operation: mapOperation } } as Request,
          res
        );
      case "filter":
        if (!filterOperation) {
          return res.status(400).json({
            error: "Filter operation is required for 'filter' operation",
          });
        }
        return filterHashSet(
          {
            ...req,
            body: { values, operation: filterOperation, parameter },
          } as Request,
          res
        );
      case "values":
        const hashSet = HashSet.from(values);
        return res.status(200).json({
          data: {
            original: values,
            values: hashSet.values().toArray(),
          },
        });
      case "size":
        const sizeSet = HashSet.from(values);
        return res.status(200).json({
          data: {
            original: values,
            size: sizeSet.size(),
          },
        });
      case "isEmpty":
        const emptySet = HashSet.from(values);
        return res.status(200).json({
          data: {
            original: values,
            isEmpty: emptySet.isEmpty(),
          },
        });
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in hashSetOperations controller");
    return res.status(500).json({
      error: "Failed to perform hash set operation",
    });
  }
}

/**
 * Parse and analyze a hash set from a string input
 */
export function analyzeHashSet(req: Request, res: Response): Response {
  try {
    const { value } = req.body as HashSetAnalyzeRequest;

    if (!value) {
      return res.status(400).json({
        error: "HashSet value string is required",
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
        error: `Failed to parse hash set: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const hashSet = HashSet.from(parsed);

    return res.status(200).json({
      data: {
        original: value,
        parsed,
        size: hashSet.size(),
        isEmpty: hashSet.isEmpty(),
        values: hashSet.values().toArray(),
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in analyzeHashSet controller");
    return res.status(500).json({
      error: `Failed to analyze hash set: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
