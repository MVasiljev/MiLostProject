import { Request, Response } from "express";
import { ValidationError, Str, Branded } from "milost";
import {
  CreateBrandedRequest,
  createValidator,
  CreateBrandedResponse,
  ValidateBrandedRequest,
  ValidateBrandedResponse,
  UnwrapBrandedRequest,
  UnwrapBrandedResponse,
  ConvertBrandedRequest,
  ConvertBrandedResponse,
  BrandedOperationRequest,
} from "../types/branding.js";
import logger from "../utils/logger.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new branded value
 */
export function createBranded(req: Request, res: Response): Response {
  try {
    const { value, brand, validator, errorMessage } =
      req.body as CreateBrandedRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!brand) {
      return res.status(400).json({
        error: "Brand name is required",
      });
    }

    let validatorFn;
    try {
      validatorFn = createValidator(validator || (() => true));
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator: ${extractErrorMessage(error)}`,
      });
    }

    const brandStr = Str.fromRaw(brand);
    const errorMsg = errorMessage ? Str.fromRaw(errorMessage) : undefined;

    const result = Branded.create(value, brandStr, validatorFn, errorMsg);

    const response: CreateBrandedResponse = {
      data: {
        value,
        brand,
        success: result.isOk(),
        result: result.isOk() ? result.unwrap().unwrap() : null,
        error: result.isErr() ? extractErrorMessage(result.unwrap()) : null,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createBranded controller");
    return res.status(500).json({
      error: "Failed to create branded value",
    });
  }
}

/**
 * Validate a branded value
 */
export function validateBranded(req: Request, res: Response): Response {
  try {
    const { value, brand, validator } = req.body as ValidateBrandedRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!brand) {
      return res.status(400).json({
        error: "Brand name is required",
      });
    }

    let validatorFn;
    try {
      validatorFn = createValidator(validator || (() => true));
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator: ${extractErrorMessage(error)}`,
      });
    }

    const isValid = validatorFn(value);

    const response: ValidateBrandedResponse = {
      data: {
        value,
        brand,
        isValid,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in validateBranded controller");
    return res.status(500).json({
      error: "Failed to validate branded value",
    });
  }
}

/**
 * Unwrap a branded value
 */
export function unwrapBranded(req: Request, res: Response): Response {
  try {
    const { value, brand, validator, errorMessage } =
      req.body as UnwrapBrandedRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!brand) {
      return res.status(400).json({
        error: "Brand name is required",
      });
    }

    let validatorFn;
    try {
      validatorFn = createValidator(validator || (() => true));
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator: ${extractErrorMessage(error)}`,
      });
    }

    const brandStr = Str.fromRaw(brand);
    const errorMsg = errorMessage ? Str.fromRaw(errorMessage) : undefined;

    const brandedResult = Branded.create(
      value,
      brandStr,
      validatorFn,
      errorMsg
    );

    if (brandedResult.isErr()) {
      return res.status(400).json({
        error: `Failed to create branded value: ${extractErrorMessage(brandedResult.unwrap())}`,
      });
    }

    const branded = brandedResult.unwrap();
    const unwrapped = branded.unwrap();

    const response: UnwrapBrandedResponse = {
      data: {
        value,
        brand,
        unwrapped,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in unwrapBranded controller");
    return res.status(500).json({
      error: "Failed to unwrap branded value",
    });
  }
}

/**
 * Convert a value to a different brand
 */
export function convertBranded(req: Request, res: Response): Response {
  try {
    const { value, fromBrand, toBrand, validator, errorMessage } =
      req.body as ConvertBrandedRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!fromBrand || !toBrand) {
      return res.status(400).json({
        error: "Both fromBrand and toBrand are required",
      });
    }

    let validatorFn;
    try {
      validatorFn = createValidator(validator || (() => true));
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator: ${extractErrorMessage(error)}`,
      });
    }

    const sourceBrandStr = Str.fromRaw(fromBrand);
    const sourceResult = Branded.create(value, sourceBrandStr, () => true);

    if (sourceResult.isErr()) {
      return res.status(400).json({
        error: `Failed to create source branded value: ${extractErrorMessage(sourceResult.unwrap())}`,
      });
    }

    const sourceBranded = sourceResult.unwrap();
    const rawValue = sourceBranded.unwrap();

    const targetBrandStr = Str.fromRaw(toBrand);
    const errorMsg = errorMessage ? Str.fromRaw(errorMessage) : undefined;

    const targetResult = Branded.create(
      rawValue,
      targetBrandStr,
      validatorFn,
      errorMsg
    );

    const response: ConvertBrandedResponse = {
      data: {
        value,
        fromBrand,
        toBrand,
        success: targetResult.isOk(),
        result: targetResult.isOk() ? targetResult.unwrap().unwrap() : null,
        error: targetResult.isErr()
          ? extractErrorMessage(targetResult.unwrap())
          : null,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in convertBranded controller");
    return res.status(500).json({
      error: "Failed to convert branded value",
    });
  }
}

/**
 * Generic operation router for branded values
 */
export function brandedOperations(req: Request, res: Response): Response {
  try {
    const { operation } = req.body as BrandedOperationRequest;

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (operation) {
      case "create":
        return createBranded(req, res);
      case "validate":
        return validateBranded(req, res);
      case "unwrap":
        return unwrapBranded(req, res);
      case "convert":
        return convertBranded(req, res);
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in brandedOperations controller");
    return res.status(500).json({
      error: "Failed to perform branded operation",
    });
  }
}
