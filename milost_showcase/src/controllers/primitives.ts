import { Request, Response } from "express";
import {
  u8,
  u16,
  u32,
  u64,
  i8,
  i16,
  i32,
  i64,
  f32,
  f64,
  format_bin,
  format_hex,
  format_oct,
  format_float,
  bitwise_and,
  bitwise_or,
  bitwise_xor,
  bitwise_not,
  shift_left,
  shift_right,
  is_power_of_two,
  next_power_of_two,
  leading_zeros,
  trailing_zeros,
  count_ones,
  add_u8,
  add_u16,
  add_u32,
  sub_u32,
  mul_u32,
  div_u32,
} from "milost";
import logger from "../utils/logger.js";
import {
  CreatePrimitiveRequest,
  PrimitiveResponse,
  ArithmeticOperationRequest,
  ArithmeticOperationResponse,
  BitwiseOperationRequest,
  BitwiseOperationResponse,
  FormatOperationRequest,
  FormatOperationResponse,
  BitManipulationRequest,
  BitManipulationResponse,
  ConversionRequest,
  ConversionResponse,
  ValidateRequest,
  ValidateResponse,
} from "../types/primitive.js";

/**
 * Create a new primitive value
 */
export function createPrimitive(req: Request, res: Response): Response {
  try {
    const { value, type } = req.body as CreatePrimitiveRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        error:
          "Type is required (u8, u16, u32, u64, i8, i16, i32, i64, f32, f64)",
      });
    }

    let result;
    let min = 0;
    let max = 0;

    try {
      switch (type) {
        case "u8":
          result = u8(value);
          min = 0;
          max = 255;
          break;
        case "u16":
          result = u16(value);
          min = 0;
          max = 65535;
          break;
        case "u32":
          result = u32(value);
          min = 0;
          max = 0xffffffff;
          break;
        case "u64":
          result = u64(value);
          min = 0;
          max = Number.MAX_SAFE_INTEGER;
          break;
        case "i8":
          result = i8(value);
          min = -128;
          max = 127;
          break;
        case "i16":
          result = i16(value);
          min = -32768;
          max = 32767;
          break;
        case "i32":
          result = i32(value);
          min = -2147483648;
          max = 2147483647;
          break;
        case "i64":
          result = i64(value);
          min = Number.MIN_SAFE_INTEGER;
          max = Number.MAX_SAFE_INTEGER;
          break;
        case "f32":
          result = f32(value);
          min = -3.40282347e38;
          max = 3.40282347e38;
          break;
        case "f64":
          result = f64(value);
          min = Number.MIN_VALUE;
          max = Number.MAX_VALUE;
          break;
        default:
          return res.status(400).json({
            error: `Unknown primitive type: ${type}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Invalid value for type ${type}: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: PrimitiveResponse = {
      data: {
        original: value,
        type,
        result,
        range: { min, max },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createPrimitive controller");
    return res.status(500).json({
      error: "Failed to create primitive value",
    });
  }
}

/**
 * Perform arithmetic operations on primitive values
 */
export function arithmeticOperations(req: Request, res: Response): Response {
  try {
    const { a, b, operation, type } = req.body as ArithmeticOperationRequest;

    if (a === undefined || b === undefined) {
      return res.status(400).json({
        error: "Both operands (a, b) are required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required (add, subtract, multiply, divide)",
      });
    }

    if (!type) {
      return res.status(400).json({
        error: "Type is required (u8, u16, u32)",
      });
    }

    let result;
    let success = true;
    let errorMessage = "";

    try {
      switch (operation) {
        case "add":
          switch (type) {
            case "u8":
              const addResult = add_u8(u8(a), u8(b));
              if (addResult.isOk()) {
                result = addResult.unwrap();
              } else {
                success = false;
                errorMessage = `Addition would overflow u8: ${a} + ${b}`;
              }
              break;
            case "u16":
              const addResult16 = add_u16(u16(a), u16(b));
              if (addResult16.isOk()) {
                result = addResult16.unwrap();
              } else {
                success = false;
                errorMessage = `Addition would overflow u16: ${a} + ${b}`;
              }
              break;
            case "u32":
              const addResult32 = add_u32(u32(a), u32(b));
              if (addResult32.isOk()) {
                result = addResult32.unwrap();
              } else {
                success = false;
                errorMessage = `Addition would overflow u32: ${a} + ${b}`;
              }
              break;
            default:
              return res.status(400).json({
                error: `Unsupported type for addition: ${type}`,
              });
          }
          break;
        case "subtract":
          if (type === "u32") {
            const subResult = sub_u32(u32(a), u32(b));
            if (subResult.isOk()) {
              result = subResult.unwrap();
            } else {
              success = false;
              errorMessage = `Subtraction would underflow u32: ${a} - ${b}`;
            }
          } else {
            return res.status(400).json({
              error: `Unsupported type for subtraction: ${type}`,
            });
          }
          break;
        case "multiply":
          if (type === "u32") {
            const mulResult = mul_u32(u32(a), u32(b));
            if (mulResult.isOk()) {
              result = mulResult.unwrap();
            } else {
              success = false;
              errorMessage = `Multiplication would overflow u32: ${a} * ${b}`;
            }
          } else {
            return res.status(400).json({
              error: `Unsupported type for multiplication: ${type}`,
            });
          }
          break;
        case "divide":
          if (type === "u32") {
            const divResult = div_u32(u32(a), u32(b));
            if (divResult.isOk()) {
              result = divResult.unwrap();
            } else {
              success = false;
              errorMessage = `Division error: ${a} / ${b}`;
            }
          } else {
            return res.status(400).json({
              error: `Unsupported type for division: ${type}`,
            });
          }
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Operation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: ArithmeticOperationResponse = {
      data: {
        a,
        b,
        operation,
        type,
        result: success ? result : null,
        success,
        error: success ? null : errorMessage,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in arithmeticOperations controller");
    return res.status(500).json({
      error: "Failed to perform arithmetic operation",
    });
  }
}

/**
 * Perform bitwise operations on primitive values
 */
export function bitwiseOperations(req: Request, res: Response): Response {
  try {
    const { a, b, operation } = req.body as BitwiseOperationRequest;

    if (a === undefined) {
      return res.status(400).json({
        error: "First operand (a) is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required (and, or, xor, not)",
      });
    }

    let result;

    try {
      switch (operation) {
        case "and":
          if (b === undefined) {
            return res.status(400).json({
              error: "Second operand (b) is required for AND operation",
            });
          }
          result = bitwise_and(u32(a), u32(b));
          break;
        case "or":
          if (b === undefined) {
            return res.status(400).json({
              error: "Second operand (b) is required for OR operation",
            });
          }
          result = bitwise_or(u32(a), u32(b));
          break;
        case "xor":
          if (b === undefined) {
            return res.status(400).json({
              error: "Second operand (b) is required for XOR operation",
            });
          }
          result = bitwise_xor(u32(a), u32(b));
          break;
        case "not":
          result = bitwise_not(u32(a));
          break;
        case "shift_left":
          if (b === undefined) {
            return res.status(400).json({
              error: "Second operand (b) is required for SHIFT LEFT operation",
            });
          }
          result = shift_left(u32(a), u32(b));
          break;
        case "shift_right":
          if (b === undefined) {
            return res.status(400).json({
              error: "Second operand (b) is required for SHIFT RIGHT operation",
            });
          }
          result = shift_right(u32(a), u32(b));
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Operation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: BitwiseOperationResponse = {
      data: {
        a,
        b,
        operation,
        result,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in bitwiseOperations controller");
    return res.status(500).json({
      error: "Failed to perform bitwise operation",
    });
  }
}

/**
 * Perform formatting operations on primitive values
 */
export function formatOperations(req: Request, res: Response): Response {
  try {
    const { value, format, precision } = req.body as FormatOperationRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!format) {
      return res.status(400).json({
        error: "Format is required (bin, hex, oct, float)",
      });
    }

    let result;

    try {
      switch (format) {
        case "bin":
          result = format_bin(u32(value));
          break;
        case "hex":
          result = format_hex(u32(value));
          break;
        case "oct":
          result = format_oct(u32(value));
          break;
        case "float":
          const precisionValue =
            precision !== undefined ? u8(precision) : u8(2);
          result = format_float(f32(value), precisionValue);
          break;
        default:
          return res.status(400).json({
            error: `Unknown format: ${format}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Formatting failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: FormatOperationResponse = {
      data: {
        value,
        format,
        precision: precision !== undefined ? precision : null,
        result,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in formatOperations controller");
    return res.status(500).json({
      error: "Failed to perform format operation",
    });
  }
}

/**
 * Perform bit manipulation operations on primitive values
 */
export function bitManipulationOperations(
  req: Request,
  res: Response
): Response {
  try {
    const { value, operation } = req.body as BitManipulationRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error:
          "Operation is required (isPowerOfTwo, nextPowerOfTwo, leadingZeros, trailingZeros, countOnes)",
      });
    }

    let result;

    try {
      const u32Value = u32(value);

      switch (operation) {
        case "isPowerOfTwo":
          result = is_power_of_two(u32Value);
          break;
        case "nextPowerOfTwo":
          result = next_power_of_two(u32Value);
          break;
        case "leadingZeros":
          result = leading_zeros(u32Value);
          break;
        case "trailingZeros":
          result = trailing_zeros(u32Value);
          break;
        case "countOnes":
          result = count_ones(u32Value);
          break;
        default:
          return res.status(400).json({
            error: `Unknown operation: ${operation}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Operation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: BitManipulationResponse = {
      data: {
        value,
        operation,
        result,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in bitManipulationOperations controller");
    return res.status(500).json({
      error: "Failed to perform bit manipulation operation",
    });
  }
}

/**
 * Validate primitive values
 */
export function validatePrimitive(req: Request, res: Response): Response {
  try {
    const { value, type } = req.body as ValidateRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        error:
          "Type is required (u8, u16, u32, u64, i8, i16, i32, i64, f32, f64)",
      });
    }

    let isValid = false;
    let min = 0;
    let max = 0;

    try {
      switch (type) {
        case "u8":
          isValid = value >= 0 && value <= 255 && Number.isInteger(value);
          min = 0;
          max = 255;
          break;
        case "u16":
          isValid = value >= 0 && value <= 65535 && Number.isInteger(value);
          min = 0;
          max = 65535;
          break;
        case "u32":
          isValid =
            value >= 0 && value <= 0xffffffff && Number.isInteger(value);
          min = 0;
          max = 0xffffffff;
          break;
        case "u64":
          isValid =
            value >= 0 &&
            value <= Number.MAX_SAFE_INTEGER &&
            Number.isInteger(value);
          min = 0;
          max = Number.MAX_SAFE_INTEGER;
          break;
        case "i8":
          isValid = value >= -128 && value <= 127 && Number.isInteger(value);
          min = -128;
          max = 127;
          break;
        case "i16":
          isValid =
            value >= -32768 && value <= 32767 && Number.isInteger(value);
          min = -32768;
          max = 32767;
          break;
        case "i32":
          isValid =
            value >= -2147483648 &&
            value <= 2147483647 &&
            Number.isInteger(value);
          min = -2147483648;
          max = 2147483647;
          break;
        case "i64":
          isValid =
            value >= Number.MIN_SAFE_INTEGER &&
            value <= Number.MAX_SAFE_INTEGER &&
            Number.isInteger(value);
          min = Number.MIN_SAFE_INTEGER;
          max = Number.MAX_SAFE_INTEGER;
          break;
        case "f32":
          isValid =
            value >= -3.40282347e38 &&
            value <= 3.40282347e38 &&
            Number.isFinite(value);
          min = -3.40282347e38;
          max = 3.40282347e38;
          break;
        case "f64":
          isValid = Number.isFinite(value);
          min = Number.MIN_VALUE;
          max = Number.MAX_VALUE;
          break;
        default:
          return res.status(400).json({
            error: `Unknown primitive type: ${type}`,
          });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const response: ValidateResponse = {
      data: {
        value,
        type,
        isValid,
        range: { min, max },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in validatePrimitive controller");
    return res.status(500).json({
      error: "Failed to validate primitive value",
    });
  }
}

/**
 * Perform type conversion operations
 */
export function convertPrimitive(req: Request, res: Response): Response {
  try {
    const { value, fromType, toType } = req.body as ConversionRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!fromType || !toType) {
      return res.status(400).json({
        error: "Both fromType and toType are required",
      });
    }

    let result;
    let success = true;
    let errorMessage = "";

    try {
      let sourceValue;
      switch (fromType) {
        case "u8":
          sourceValue = u8(value);
          break;
        case "u16":
          sourceValue = u16(value);
          break;
        case "u32":
          sourceValue = u32(value);
          break;
        case "u64":
          sourceValue = u64(value);
          break;
        case "i8":
          sourceValue = i8(value);
          break;
        case "i16":
          sourceValue = i16(value);
          break;
        case "i32":
          sourceValue = i32(value);
          break;
        case "i64":
          sourceValue = i64(value);
          break;
        case "f32":
          sourceValue = f32(value);
          break;
        case "f64":
          sourceValue = f64(value);
          break;
        default:
          return res.status(400).json({
            error: `Unknown source type: ${fromType}`,
          });
      }

      switch (toType) {
        case "u8":
          result = u8(sourceValue);
          break;
        case "u16":
          result = u16(sourceValue);
          break;
        case "u32":
          result = u32(sourceValue);
          break;
        case "u64":
          result = u64(sourceValue);
          break;
        case "i8":
          result = i8(sourceValue);
          break;
        case "i16":
          result = i16(sourceValue);
          break;
        case "i32":
          result = i32(sourceValue);
          break;
        case "i64":
          result = i64(sourceValue);
          break;
        case "f32":
          result = f32(sourceValue);
          break;
        case "f64":
          result = f64(sourceValue);
          break;
        default:
          return res.status(400).json({
            error: `Unknown target type: ${toType}`,
          });
      }
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    const response: ConversionResponse = {
      data: {
        value,
        fromType,
        toType,
        result: success ? result : null,
        success,
        error: success ? null : errorMessage,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in convertPrimitive controller");
    return res.status(500).json({
      error: "Failed to convert primitive value",
    });
  }
}
