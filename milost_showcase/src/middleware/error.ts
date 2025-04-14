import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import { ApiError, ErrorHandler } from "../types/index.js";

/**
 * Error handling middleware
 */
export const errorHandler: ErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(
    {
      err,
      method: req.method,
      url: req.url,
    },
    "Error processing request"
  );

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
};
