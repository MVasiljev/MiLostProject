import { Request, Response } from "express";
import {
  Mutex,
  RwLock,
  ArcMutex,
  createMutex,
  createRwLock,
  createArcMutex,
} from "milost";
import { u32, Str, AppError } from "milost";
import logger from "../utils/logger.js";
import { SyncPrimitiveOperationRequest } from "../types/sync_primitives.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a sync primitive
 */
export async function createSyncPrimitive(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation, initialValue } =
      req.body as SyncPrimitiveOperationRequest;

    if (!initialValue) {
      return res.status(400).json({
        error: "Initial value is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "createMutex":
          result = await createMutex(initialValue);
          break;
        case "createRwLock":
          result = await createRwLock(initialValue);
          break;
        case "createArcMutex":
          result = await createArcMutex(initialValue);
          break;
        default:
          return res.status(400).json({
            error: `Unknown create operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: initialValue,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in createSyncPrimitive controller");
    return res.status(500).json({
      error: "Failed to create sync primitive",
    });
  }
}

/**
 * Perform Mutex operations
 */
export async function mutexOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation, value, updater } =
      req.body as SyncPrimitiveOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "Mutex is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "lock":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for lock operation",
            });
          }
          await value.lock(updater);
          result = value;
          break;
        case "get":
          result = value.get();
          break;
        case "isLocked":
          result = value.isLocked();
          break;
        case "toString":
          result = value.toString();
          break;
        default:
          return res.status(400).json({
            error: `Unknown Mutex operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in mutexOperations controller");
    return res.status(500).json({
      error: "Failed to perform Mutex operation",
    });
  }
}

/**
 * Perform RwLock operations
 */
export async function rwLockOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation, value, updater } =
      req.body as SyncPrimitiveOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "RwLock is required",
      });
    }

    let result: any;
    let success = true;
    let error: string | null = null;

    try {
      switch (operation) {
        case "read":
          result = value.read();
          break;
        case "releaseRead":
          value.releaseRead();
          result = value;
          break;
        case "write":
          if (!updater) {
            return res.status(400).json({
              error: "Updater function is required for write operation",
            });
          }
          value.write(updater);
          result = value;
          break;
        case "getReaders":
          result = value.getReaders();
          break;
        case "isWriteLocked":
          result = value.isWriteLocked();
          break;
        case "toString":
          result = value.toString();
          break;
        default:
          return res.status(400).json({
            error: `Unknown RwLock operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in rwLockOperations controller");
    return res.status(500).json({
      error: "Failed to perform RwLock operation",
    });
  }
}

/**
 * Perform ArcMutex operations
 */
export async function arcMutexOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation, value, updater, asyncUpdater, options } =
      req.body as SyncPrimitiveOperationRequest;

    if (!value) {
      return res.status(400).json({
        error: "ArcMutex is required",
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
          value.set(updater);
          result = value;
          break;
        case "setAsync":
          if (!asyncUpdater) {
            return res.status(400).json({
              error:
                "Async updater function is required for setAsync operation",
            });
          }
          await value.setAsync(asyncUpdater, options);
          result = value;
          break;
        case "clone":
          result = value.clone();
          break;
        case "isLocked":
          result = value.isLocked();
          break;
        case "toString":
          result = value.toString();
          break;
        default:
          return res.status(400).json({
            error: `Unknown ArcMutex operation: ${operation}`,
          });
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    return res.status(200).json({
      data: {
        original: value,
        operation,
        result,
        success,
        error,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error in arcMutexOperations controller");
    return res.status(500).json({
      error: "Failed to perform ArcMutex operation",
    });
  }
}

/**
 * Generic sync primitive operations router
 */
export async function syncPrimitiveOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { operation } = req.body as SyncPrimitiveOperationRequest;

    switch (true) {
      case ["createMutex", "createRwLock", "createArcMutex"].includes(
        operation
      ):
        return createSyncPrimitive(req, res);
      case ["lock", "get", "isLocked", "toString"].includes(operation):
        return mutexOperations(req, res);
      case [
        "read",
        "releaseRead",
        "write",
        "getReaders",
        "isWriteLocked",
      ].includes(operation):
        return rwLockOperations(req, res);
      case ["get", "set", "setAsync", "clone", "isLocked"].includes(operation):
        return arcMutexOperations(req, res);
      default:
        return res.status(400).json({
          error: `Unknown sync primitive operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in syncPrimitiveOperations controller");
    return res.status(500).json({
      error: "Failed to perform sync primitive operation",
    });
  }
}
