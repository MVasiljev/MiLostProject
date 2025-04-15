import { Request, Response } from "express";
import { requires, ensures, contract, ContractError, Invariant } from "milost";
import { Str } from "milost";
import logger from "../utils/logger.js";
import {
  RequiresRequest,
  EnsuresRequest,
  ContractRequest,
  ContractOperationResponse,
  CreateInvariantRequest,
  InvariantResponse,
  InvariantGetRequest,
  InvariantMapRequest,
  InvariantOperationResponse,
  ContractInvariantOperationRequest,
  ContractInvariantOperationResponse,
} from "../types/contract.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Check a precondition
 */
export function checkRequires(req: Request, res: Response): Response {
  try {
    const { condition, errorMessage } = req.body as RequiresRequest;

    if (condition === undefined) {
      return res.status(400).json({
        error: "Condition is required",
      });
    }

    let success = true;
    let error: string | null = null;

    try {
      requires(condition, errorMessage ? Str.fromRaw(errorMessage) : undefined);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ContractOperationResponse = {
      data: {
        operation: "requires",
        result: success,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in checkRequires controller");
    return res.status(500).json({
      error: "Failed to check precondition",
    });
  }
}

/**
 * Check a postcondition
 */
export function checkEnsures(req: Request, res: Response): Response {
  try {
    const { condition, errorMessage } = req.body as EnsuresRequest;

    if (condition === undefined) {
      return res.status(400).json({
        error: "Condition is required",
      });
    }

    let success = true;
    let error: string | null = null;

    try {
      ensures(condition, errorMessage ? Str.fromRaw(errorMessage) : undefined);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ContractOperationResponse = {
      data: {
        operation: "ensures",
        result: success,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in checkEnsures controller");
    return res.status(500).json({
      error: "Failed to check postcondition",
    });
  }
}

/**
 * Create a contracted function
 */
export function createContractFunction(req: Request, res: Response): Response {
  try {
    const {
      fn,
      precondition,
      postcondition,
      preErrorMsg,
      postErrorMsg,
      testArg,
    } = req.body as ContractRequest;

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      const contractFn = contract(
        fn,
        precondition,
        postcondition,
        preErrorMsg ? Str.fromRaw(preErrorMsg) : undefined,
        postErrorMsg ? Str.fromRaw(postErrorMsg) : undefined
      );

      if (testArg !== undefined) {
        result = contractFn(testArg);
      } else {
        result = contractFn;
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ContractOperationResponse = {
      data: {
        operation: "contract",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createContractFunction controller");
    return res.status(500).json({
      error: "Failed to create contracted function",
    });
  }
}

/**
 * Create a new invariant
 */
export function createInvariant(req: Request, res: Response): Response {
  try {
    const { value, invariant, errorMessage } =
      req.body as CreateInvariantRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!invariant || typeof invariant !== "function") {
      return res.status(400).json({
        error: "Invariant function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = Invariant.new(
        value,
        invariant,
        errorMessage ? Str.fromRaw(errorMessage) : undefined
      );
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: InvariantResponse = {
      data: {
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createInvariant controller");
    return res.status(500).json({
      error: "Failed to create invariant",
    });
  }
}

/**
 * Get the value from an invariant
 */
export function getInvariantValue(req: Request, res: Response): Response {
  try {
    const { invariant } = req.body as InvariantGetRequest;

    if (!invariant) {
      return res.status(400).json({
        error: "Invariant is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = invariant.get();
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: InvariantOperationResponse = {
      data: {
        operation: "get",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in getInvariantValue controller");
    return res.status(500).json({
      error: "Failed to get invariant value",
    });
  }
}

/**
 * Map an invariant to a new one
 */
export function mapInvariant(req: Request, res: Response): Response {
  try {
    const { invariant, fn, newInvariant, errorMessage } =
      req.body as InvariantMapRequest;

    if (!invariant) {
      return res.status(400).json({
        error: "Invariant is required",
      });
    }

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Mapping function is required",
      });
    }

    if (!newInvariant || typeof newInvariant !== "function") {
      return res.status(400).json({
        error: "New invariant function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = invariant.map(
        fn,
        newInvariant,
        errorMessage ? Str.fromRaw(errorMessage) : undefined
      );
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: InvariantOperationResponse = {
      data: {
        operation: "map",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in mapInvariant controller");
    return res.status(500).json({
      error: "Failed to map invariant",
    });
  }
}

/**
 * Generic contract operations router
 */
export function contractOperations(req: Request, res: Response): Response {
  try {
    const { type, operation } = req.body as ContractInvariantOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Type is required ('Contract' or 'Invariant')",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Contract":
        switch (operation) {
          case "requires":
            return checkRequires(req, res);
          case "ensures":
            return checkEnsures(req, res);
          case "contract":
            return createContractFunction(req, res);
          default:
            return res.status(400).json({
              error: `Unknown Contract operation: ${operation}`,
            });
        }
      case "Invariant":
        switch (operation) {
          case "new":
            return createInvariant(req, res);
          case "get":
            return getInvariantValue(req, res);
          case "map":
            return mapInvariant(req, res);
          default:
            return res.status(400).json({
              error: `Unknown Invariant operation: ${operation}`,
            });
        }
      default:
        return res.status(400).json({
          error: `Unknown type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in contractOperations controller");
    return res.status(500).json({
      error: "Failed to perform contract operation",
    });
  }
}
