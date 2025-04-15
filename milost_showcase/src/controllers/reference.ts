import { Request, Response } from "express";
import { Ref, RefMut, OwnershipError } from "milost";
import logger from "../utils/logger.js";
import {
  CreateReferenceRequest,
  ReferenceResponse,
  RefOperationRequest,
  RefOperationResponse,
  RefMutOperationRequest,
  RefMutOperationResponse,
  ReferenceOperationRequest,
  ReferenceOperationResponse,
} from "../types/reference.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new reference (Ref or RefMut)
 */
export function createReference(req: Request, res: Response): Response {
  try {
    const { type, value } = req.body as CreateReferenceRequest;

    if (!type) {
      return res.status(400).json({
        error: "Reference type is required ('Ref' or 'RefMut')",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      switch (type) {
        case "Ref":
          result = Ref.create(value);
          break;
        case "RefMut":
          result = RefMut.create(value);
          break;
        default:
          return res.status(400).json({
            error: `Unknown reference type: ${type}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceResponse = {
      data: {
        type,
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createReference controller");
    return res.status(500).json({
      error: "Failed to create reference",
    });
  }
}

/**
 * Create a new immutable reference (Ref)
 */
export function createRef(req: Request, res: Response): Response {
  try {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = Ref.create(value);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceResponse = {
      data: {
        type: "Ref",
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createRef controller");
    return res.status(500).json({
      error: "Failed to create immutable reference",
    });
  }
}

/**
 * Create a new mutable reference (RefMut)
 */
export function createRefMut(req: Request, res: Response): Response {
  try {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = RefMut.create(value);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceResponse = {
      data: {
        type: "RefMut",
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createRefMut controller");
    return res.status(500).json({
      error: "Failed to create mutable reference",
    });
  }
}

/**
 * Perform operations on a Ref
 */
export function refOperations(req: Request, res: Response): Response {
  try {
    const { value, operation } = req.body as RefOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Ref value is required",
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
    let isActive: boolean | undefined;

    try {
      switch (operation) {
        case "get":
          result = value.get();
          break;
        case "drop":
          value.drop();
          break;
        case "isActive":
          result = value.isActive();
          isActive = result;
          break;
        default:
          return res.status(400).json({
            error: `Unknown Ref operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RefOperationResponse = {
      data: {
        operation,
        result,
        isActive,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in refOperations controller");
    return res.status(500).json({
      error: "Failed to perform Ref operation",
    });
  }
}

/**
 * Perform operations on a RefMut
 */
export function refMutOperations(req: Request, res: Response): Response {
  try {
    const { value, operation, updater } = req.body as RefMutOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "RefMut value is required",
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
    let isActive: boolean | undefined;

    try {
      switch (operation) {
        case "get":
          result = value.get();
          break;
        case "set":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for 'set' operation",
            });
          }
          value.set(updater);
          result = value.get();
          break;
        case "drop":
          value.drop();
          break;
        case "isActive":
          result = value.isActive();
          isActive = result;
          break;
        default:
          return res.status(400).json({
            error: `Unknown RefMut operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RefMutOperationResponse = {
      data: {
        operation,
        result,
        isActive,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in refMutOperations controller");
    return res.status(500).json({
      error: "Failed to perform RefMut operation",
    });
  }
}

/**
 * Get the value from a reference
 */
export function getValue(req: Request, res: Response): Response {
  try {
    const { value, type } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Reference value is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      result = value.get();
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceOperationResponse = {
      data: {
        type: type || "Reference",
        operation: "get",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in getValue controller");
    return res.status(500).json({
      error: "Failed to get value from reference",
    });
  }
}

/**
 * Set the value of a mutable reference
 */
export function setValue(req: Request, res: Response): Response {
  try {
    const { value, updater } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "RefMut value is required",
      });
    }

    if (!updater) {
      return res.status(400).json({
        error: "Updater function is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      value.set(updater);
      result = value.get();
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RefMutOperationResponse = {
      data: {
        operation: "set",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in setValue controller");
    return res.status(500).json({
      error: "Failed to set value of mutable reference",
    });
  }
}

/**
 * Drop a reference
 */
export function dropReference(req: Request, res: Response): Response {
  try {
    const { value, type } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Reference value is required",
      });
    }

    let success = true;
    let error: string | null = null;

    try {
      value.drop();
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceOperationResponse = {
      data: {
        type: type || "Reference",
        operation: "drop",
        result: null,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in dropReference controller");
    return res.status(500).json({
      error: "Failed to drop reference",
    });
  }
}

/**
 * Check if a reference is active
 */
export function checkReferenceStatus(req: Request, res: Response): Response {
  try {
    const { value, type } = req.body;

    if (!value) {
      return res.status(400).json({
        error: "Reference value is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;
    let isActive: boolean | undefined;

    try {
      result = value.isActive();
      isActive = result;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ReferenceOperationResponse = {
      data: {
        type: type || "Reference",
        operation: "isActive",
        result,
        isActive,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in checkReferenceStatus controller");
    return res.status(500).json({
      error: "Failed to check reference status",
    });
  }
}

/**
 * Generic reference operations router
 */
export function referenceOperations(req: Request, res: Response): Response {
  try {
    const { type, operation, value, updater } =
      req.body as ReferenceOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Reference type is required ('Ref' or 'RefMut')",
      });
    }

    if (!value) {
      return res.status(400).json({
        error: "Reference value is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Ref":
        if (operation === "set") {
          return res.status(400).json({
            error: "Cannot perform 'set' operation on immutable Ref",
          });
        }
        return refOperations(req, res);
      case "RefMut":
        return refMutOperations(req, res);
      default:
        return res.status(400).json({
          error: `Unknown reference type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in referenceOperations controller");
    return res.status(500).json({
      error: "Failed to perform reference operation",
    });
  }
}
