import { Request, Response } from "express";
import { Owned } from "milost";
import logger from "../utils/logger.js";
import {
  CreateOwnedRequest,
  OwnedResponse,
  OwnedOperationRequest,
  OwnedOperationResponse,
} from "../types/ownership.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new Owned value
 */
export function createOwned(req: Request, res: Response): Response {
  try {
    const { value } = req.body as CreateOwnedRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = Owned.create(value);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedResponse = {
      data: {
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createOwned controller");
    return res.status(500).json({
      error: "Failed to create Owned value",
    });
  }
}

/**
 * Consume an Owned value
 */
export function consumeOwned(req: Request, res: Response): Response {
  try {
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Owned value is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      result = value.consume();
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedOperationResponse = {
      data: {
        operation: "consume",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in consumeOwned controller");
    return res.status(500).json({
      error: "Failed to consume Owned value",
    });
  }
}

/**
 * Borrow an Owned value
 */
export function borrowOwned(req: Request, res: Response): Response {
  try {
    const { value, fn } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Owned value is required",
      });
    }

    if (!fn) {
      return res.status(400).json({
        error: "Borrow function is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      result = value.borrow(fn);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedOperationResponse = {
      data: {
        operation: "borrow",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in borrowOwned controller");
    return res.status(500).json({
      error: "Failed to borrow Owned value",
    });
  }
}

/**
 * Mutably borrow an Owned value
 */
export function borrowMutOwned(req: Request, res: Response): Response {
  try {
    const { value, fn } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Owned value is required",
      });
    }

    if (!fn) {
      return res.status(400).json({
        error: "Borrow mutable function is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      result = value.borrowMut(fn);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedOperationResponse = {
      data: {
        operation: "borrowMut",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in borrowMutOwned controller");
    return res.status(500).json({
      error: "Failed to mutably borrow Owned value",
    });
  }
}

/**
 * Check status of an Owned value (consumed/alive)
 */
export function checkOwnedStatus(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Owned value is required",
      });
    }

    if (!operation || !["isConsumed", "isAlive"].includes(operation)) {
      return res.status(400).json({
        error: "Valid operation ('isConsumed' or 'isAlive') is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;
    let isConsumed: boolean | undefined;
    let isAlive: boolean | undefined;

    try {
      if (operation === "isConsumed") {
        result = value.isConsumed();
        isConsumed = result;
      } else if (operation === "isAlive") {
        result = value.isAlive();
        isAlive = result;
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedOperationResponse = {
      data: {
        operation: operation,
        result,
        isConsumed,
        isAlive,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in checkOwnedStatus controller");
    return res.status(500).json({
      error: "Failed to check Owned value status",
    });
  }
}

/**
 * Generic Owned value operations router
 */
export function ownedOperations(req: Request, res: Response): Response {
  try {
    const { operation, value, fn } = req.body as OwnedOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Owned value is required",
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
    let isConsumed: boolean | undefined;
    let isAlive: boolean | undefined;

    try {
      switch (operation) {
        case "consume":
          result = value.consume();
          break;
        case "borrow":
          if (!fn) {
            return res.status(400).json({
              error: "Borrow function is required for 'borrow' operation",
            });
          }
          result = value.borrow(fn);
          break;
        case "borrowMut":
          if (!fn) {
            return res.status(400).json({
              error:
                "Borrow mutable function is required for 'borrowMut' operation",
            });
          }
          result = value.borrowMut(fn);
          break;
        case "isConsumed":
          result = value.isConsumed();
          isConsumed = result;
          break;
        case "isAlive":
          result = value.isAlive();
          isAlive = result;
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: OwnedOperationResponse = {
      data: {
        operation,
        result,
        isConsumed,
        isAlive,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in ownedOperations controller");
    return res.status(500).json({
      error: "Failed to perform Owned operation",
    });
  }
}
