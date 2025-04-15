import { Request, Response } from "express";
import { Branded, Str } from "milost";
import logger from "../utils/logger.js";
import {
  CreateBrandedRequest,
  CreateBrandedResponse,
  ValidateBrandedRequest,
  ValidateBrandedResponse,
  UnwrapBrandedRequest,
  UnwrapBrandedResponse,
  ConvertBrandedRequest,
  ConvertBrandedResponse,
  BrandedOperationRequest,
} from "../types/branding.js";

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

    // Create a validator function based on the provided validator configuration
    let validatorFn: (val: any) => boolean;
    try {
      if (typeof validator === "string") {
        // Parse the validator as a function string
        validatorFn = new Function("value", `return ${validator}`) as (
          val: any
        ) => boolean;
      } else if (typeof validator === "object" && validator !== null) {
        // Create a validator based on the provided configuration
        if (validator.type === "range") {
          const { min, max } = validator;
          validatorFn = (val: any) => {
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= min && numVal <= max;
          };
        } else if (validator.type === "regex") {
          const regex = new RegExp(validator.pattern);
          validatorFn = (val: any) =>
            typeof val === "string" && regex.test(val);
        } else if (validator.type === "custom" && validator.code) {
          validatorFn = new Function("value", validator.code) as (
            val: any
          ) => boolean;
        } else {
          return res.status(400).json({
            error: "Invalid validator configuration",
          });
        }
      } else {
        // Default validator that always passes
        validatorFn = () => true;
      }
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator function: ${error instanceof Error ? error : String(error)}`,
      });
    }

    // Create the branded value
    const brandStr = Str.fromRaw(brand);
    const errorMsg = errorMessage
      ? Str.fromRaw(errorMessage).unwrap()
      : undefined;

    const result = Branded.create(
      value,
      brandStr.unwrap(),
      validatorFn,
      errorMsg
    );

    const response: CreateBrandedResponse = {
      data: {
        value,
        brand,
        success: result.isOk().unwrap(),
        result: result.isOk() ? result.unwrap() : null,
        error: result.isErr() ? result.unwrap() : null,
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

    // Create a validator function based on the provided validator configuration
    let validatorFn: (val: any) => boolean;
    try {
      if (typeof validator === "string") {
        // Parse the validator as a function string
        validatorFn = new Function("value", `return ${validator}`) as (
          val: any
        ) => boolean;
      } else if (typeof validator === "object" && validator !== null) {
        // Create a validator based on the provided configuration
        if (validator.type === "range") {
          const { min, max } = validator;
          validatorFn = (val: any) => {
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= min && numVal <= max;
          };
        } else if (validator.type === "regex") {
          const regex = new RegExp(validator.pattern);
          validatorFn = (val: any) =>
            typeof val === "string" && regex.test(val);
        } else if (validator.type === "custom" && validator.code) {
          validatorFn = new Function("value", validator.code) as (
            val: any
          ) => boolean;
        } else {
          return res.status(400).json({
            error: "Invalid validator configuration",
          });
        }
      } else {
        // Default validator that always passes
        validatorFn = () => true;
      }
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator function: ${error instanceof Error ? error : String(error)}`,
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

    // Create a validator function
    let validatorFn: (val: any) => boolean;
    try {
      if (typeof validator === "string") {
        validatorFn = new Function("value", `return ${validator}`) as (
          val: any
        ) => boolean;
      } else if (typeof validator === "object" && validator !== null) {
        if (validator.type === "range") {
          const { min, max } = validator;
          validatorFn = (val: any) => {
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= min && numVal <= max;
          };
        } else if (validator.type === "regex") {
          const regex = new RegExp(validator.pattern);
          validatorFn = (val: any) =>
            typeof val === "string" && regex.test(val);
        } else if (validator.type === "custom" && validator.code) {
          validatorFn = new Function("value", validator.code) as (
            val: any
          ) => boolean;
        } else {
          return res.status(400).json({
            error: "Invalid validator configuration",
          });
        }
      } else {
        validatorFn = () => true;
      }
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator function: ${error instanceof Error ? error : String(error)}`,
      });
    }

    // Create the branded value to unwrap
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
        error: `Failed to create branded value: ${brandedResult.unwrap()}`,
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

    // Create a validator function for the target brand
    let validatorFn: (val: any) => boolean;
    try {
      if (typeof validator === "string") {
        validatorFn = new Function("value", `return ${validator}`) as (
          val: any
        ) => boolean;
      } else if (typeof validator === "object" && validator !== null) {
        if (validator.type === "range") {
          const { min, max } = validator;
          validatorFn = (val: any) => {
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= min && numVal <= max;
          };
        } else if (validator.type === "regex") {
          const regex = new RegExp(validator.pattern);
          validatorFn = (val: any) =>
            typeof val === "string" && regex.test(val);
        } else if (validator.type === "custom" && validator.code) {
          validatorFn = new Function("value", validator.code) as (
            val: any
          ) => boolean;
        } else {
          return res.status(400).json({
            error: "Invalid validator configuration",
          });
        }
      } else {
        validatorFn = () => true;
      }
    } catch (error) {
      return res.status(400).json({
        error: `Failed to create validator function: ${error instanceof Error ? error : String(error)}`,
      });
    }

    // Create and validate the source branded value
    const sourceBrandStr = Str.fromRaw(fromBrand);
    const sourceValidator = () => true; // Always valid for source
    const sourceResult = Branded.create(value, sourceBrandStr, sourceValidator);

    if (sourceResult.isErr()) {
      return res.status(400).json({
        error: `Failed to create source branded value: ${sourceResult.unwrap()}`,
      });
    }

    // Get the raw value from the source branded value
    const sourceBranded = sourceResult.unwrap();
    const rawValue = sourceBranded.unwrap();

    // Create the target branded value
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
        result: targetResult.isOk() ? targetResult.unwrap() : null,
        error: targetResult.isErr() ? targetResult.unwrap() : null,
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
