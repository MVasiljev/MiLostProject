export type PrimitiveType =
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "f32"
  | "f64";

export type ArithmeticOperation = "add" | "subtract" | "multiply" | "divide";
export type BitwiseOperation =
  | "and"
  | "or"
  | "xor"
  | "not"
  | "shift_left"
  | "shift_right";
export type FormatOperation = "bin" | "hex" | "oct" | "float";
export type BitManipulationOperation =
  | "isPowerOfTwo"
  | "nextPowerOfTwo"
  | "leadingZeros"
  | "trailingZeros"
  | "countOnes";

export type PrimitiveOperationCategory =
  | "create"
  | "arithmetic"
  | "bitwise"
  | "format"
  | "bitManipulation"
  | "validate"
  | "convert";

export interface PrimitiveAnalysisResult {
  original: number;
  type: PrimitiveType;
  result: any;
  range: {
    min: number;
    max: number;
  };
}

export interface ArithmeticOperationResult {
  a: number;
  b: number;
  operation: ArithmeticOperation;
  type: string;
  result: any;
  success: boolean;
  error: string | null;
}

export interface BitwiseOperationResult {
  a: number;
  b?: number;
  operation: BitwiseOperation;
  result: any;
}

export interface FormatOperationResult {
  value: number;
  format: FormatOperation;
  precision: number | null;
  result: string;
}

export interface BitManipulationResult {
  value: number;
  operation: BitManipulationOperation;
  result: any;
}

export interface ValidateResult {
  value: number;
  type: PrimitiveType;
  isValid: boolean;
  range: {
    min: number;
    max: number;
  };
}

export interface ConversionResult {
  value: number;
  fromType: PrimitiveType;
  toType: PrimitiveType;
  result: any;
  success: boolean;
  error: string | null;
}

export type PrimitiveOperationResult =
  | PrimitiveAnalysisResult
  | ArithmeticOperationResult
  | BitwiseOperationResult
  | FormatOperationResult
  | BitManipulationResult
  | ValidateResult
  | ConversionResult;

export function isPrimitiveAnalysisResult(
  result: unknown
): result is PrimitiveAnalysisResult {
  return Boolean(
    result &&
      typeof (result as PrimitiveAnalysisResult).original === "number" &&
      typeof (result as PrimitiveAnalysisResult).type === "string" &&
      typeof (result as PrimitiveAnalysisResult).range === "object"
  );
}

export function isArithmeticOperationResult(
  result: unknown
): result is ArithmeticOperationResult {
  return Boolean(
    result &&
      typeof (result as ArithmeticOperationResult).a === "number" &&
      typeof (result as ArithmeticOperationResult).b === "number" &&
      typeof (result as ArithmeticOperationResult).operation === "string" &&
      typeof (result as ArithmeticOperationResult).success === "boolean"
  );
}

export function isBitwiseOperationResult(
  result: unknown
): result is BitwiseOperationResult {
  return Boolean(
    result &&
      typeof (result as BitwiseOperationResult).a === "number" &&
      typeof (result as BitwiseOperationResult).operation === "string" &&
      Object.prototype.hasOwnProperty.call(result, "result")
  );
}

export function isFormatOperationResult(
  result: unknown
): result is FormatOperationResult {
  return Boolean(
    result &&
      typeof (result as FormatOperationResult).value === "number" &&
      typeof (result as FormatOperationResult).format === "string" &&
      typeof (result as FormatOperationResult).result === "string"
  );
}

export function isBitManipulationResult(
  result: unknown
): result is BitManipulationResult {
  return Boolean(
    result &&
      typeof (result as BitManipulationResult).value === "number" &&
      typeof (result as BitManipulationResult).operation === "string" &&
      Object.prototype.hasOwnProperty.call(result, "result")
  );
}

export function isValidateResult(result: unknown): result is ValidateResult {
  return Boolean(
    result &&
      typeof (result as ValidateResult).value === "number" &&
      typeof (result as ValidateResult).type === "string" &&
      typeof (result as ValidateResult).isValid === "boolean" &&
      typeof (result as ValidateResult).range === "object"
  );
}

export function isConversionResult(
  result: unknown
): result is ConversionResult {
  return Boolean(
    result &&
      typeof (result as ConversionResult).value === "number" &&
      typeof (result as ConversionResult).fromType === "string" &&
      typeof (result as ConversionResult).toType === "string" &&
      typeof (result as ConversionResult).success === "boolean"
  );
}
