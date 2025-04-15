import { Request, Response } from "express";
import {
  createRc,
  createWeak,
  createRefCell,
  createRcRefCell,
  createArc,
} from "milost";
import { u32 } from "milost";
import logger from "../utils/logger.js";
import {
  CreateSmartPointerRequest,
  SmartPointerResponse,
  RcOperationRequest,
  RcOperationResponse,
  WeakOperationRequest,
  WeakOperationResponse,
  RefCellOperationRequest,
  RefCellOperationResponse,
  RcRefCellOperationRequest,
  RcRefCellOperationResponse,
  ArcOperationRequest,
  ArcOperationResponse,
  SmartPointerOperationRequest,
} from "../types/smart_pointers.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a smart pointer
 */
export async function createSmartPointer(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { type, initialValue } = req.body as CreateSmartPointerRequest;

    if (!type) {
      return res.status(400).json({
        error: "Smart pointer type is required",
      });
    }

    if (initialValue === undefined) {
      return res.status(400).json({
        error: "Initial value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      switch (type) {
        case "Rc":
          result = await createRc(initialValue);
          break;
        case "Weak":
          result = await createWeak(initialValue);
          break;
        case "RefCell":
          result = await createRefCell(initialValue);
          break;
        case "RcRefCell":
          result = await createRcRefCell(initialValue);
          break;
        case "Arc":
          result = await createArc(initialValue);
          break;
        default:
          return res.status(400).json({
            error: `Unknown smart pointer type: ${type}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: SmartPointerResponse = {
      data: {
        type,
        initialValue,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createSmartPointer controller");
    return res.status(500).json({
      error: "Failed to create smart pointer",
    });
  }
}

/**
 * Perform Rc operations
 */
export async function rcOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, operation, updater } = req.body as RcOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Rc value is required",
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
    let refCount: number | undefined;

    try {
      switch (operation) {
        case "borrow":
          result = value.borrow();
          break;
        case "borrow_mut":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for borrow_mut operation",
            });
          }
          result = value.borrow_mut(updater);
          break;
        case "clone":
          result = value.clone();
          break;
        case "drop":
          result = value.drop();
          break;
        case "refCount":
          result = value.refCount();
          refCount = Number(result);
          break;
        default:
          return res.status(400).json({
            error: `Unknown Rc operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RcOperationResponse = {
      data: {
        operation,
        result,
        refCount,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in rcOperations controller");
    return res.status(500).json({
      error: "Failed to perform Rc operation",
    });
  }
}

/**
 * Perform Weak operations
 */
export async function weakOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, operation, defaultValue } = req.body as WeakOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Weak value is required",
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

    try {
      switch (operation) {
        case "getOrDefault":
          if (defaultValue === undefined) {
            return res.status(400).json({
              error: "Default value is required for getOrDefault operation",
            });
          }
          result = value.getOrDefault(defaultValue);
          break;
        case "drop":
          result = value.drop();
          break;
        default:
          return res.status(400).json({
            error: `Unknown Weak operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: WeakOperationResponse = {
      data: {
        operation,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in weakOperations controller");
    return res.status(500).json({
      error: "Failed to perform Weak operation",
    });
  }
}

/**
 * Perform RefCell operations
 */
export async function refCellOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, operation, updater } = req.body as RefCellOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "RefCell value is required",
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

    try {
      switch (operation) {
        case "borrow":
          result = value.borrow();
          break;
        case "borrow_mut":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for borrow_mut operation",
            });
          }
          result = value.borrow_mut(updater);
          break;
        default:
          return res.status(400).json({
            error: `Unknown RefCell operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RefCellOperationResponse = {
      data: {
        operation,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in refCellOperations controller");
    return res.status(500).json({
      error: "Failed to perform RefCell operation",
    });
  }
}

/**
 * Perform RcRefCell operations
 */
export async function rcRefCellOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, operation, updater } = req.body as RcRefCellOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "RcRefCell value is required",
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
    let refCount: number | undefined;

    try {
      switch (operation) {
        case "borrow":
          result = value.borrow();
          break;
        case "borrow_mut":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for borrow_mut operation",
            });
          }
          result = value.borrow_mut(updater);
          break;
        case "clone":
          result = value.clone();
          break;
        case "drop":
          result = value.drop();
          break;
        case "refCount":
          result = value.refCount();
          refCount = Number(result);
          break;
        default:
          return res.status(400).json({
            error: `Unknown RcRefCell operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: RcRefCellOperationResponse = {
      data: {
        operation,
        result,
        refCount,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in rcRefCellOperations controller");
    return res.status(500).json({
      error: "Failed to perform RcRefCell operation",
    });
  }
}

/**
 * Perform Arc operations
 */
export async function arcOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, operation, updater } = req.body as ArcOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Arc value is required",
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

    try {
      switch (operation) {
        case "get":
          result = value.get();
          break;
        case "set":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for set operation",
            });
          }
          result = value.set(updater);
          break;
        case "clone":
          result = value.clone();
          break;
        default:
          return res.status(400).json({
            error: `Unknown Arc operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ArcOperationResponse = {
      data: {
        operation,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in arcOperations controller");
    return res.status(500).json({
      error: "Failed to perform Arc operation",
    });
  }
}

/**
 * Generic smart pointer operations router
 */
export async function smartPointerOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { type, operation } = req.body as SmartPointerOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Smart pointer type is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Rc":
        return rcOperations(req, res);
      case "Weak":
        return weakOperations(req, res);
      case "RefCell":
        return refCellOperations(req, res);
      case "RcRefCell":
        return rcRefCellOperations(req, res);
      case "Arc":
        return arcOperations(req, res);
      default:
        return res.status(400).json({
          error: `Unknown smart pointer type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in smartPointerOperations controller");
    return res.status(500).json({
      error: "Failed to perform smart pointer operation",
    });
  }
}
