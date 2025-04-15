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

export interface CreatePrimitiveRequest {
  value: number;
  type: PrimitiveType;
}

export interface PrimitiveResponse {
  data: {
    original: number;
    type: PrimitiveType;
    result: any;
    range: {
      min: number;
      max: number;
    };
  };
}

export interface ArithmeticOperationRequest {
  a: number;
  b: number;
  operation: ArithmeticOperation;
  type: "u8" | "u16" | "u32";
}

export interface ArithmeticOperationResponse {
  data: {
    a: number;
    b: number;
    operation: ArithmeticOperation;
    type: string;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface BitwiseOperationRequest {
  a: number;
  b?: number;
  operation: BitwiseOperation;
}

export interface BitwiseOperationResponse {
  data: {
    a: number;
    b?: number;
    operation: BitwiseOperation;
    result: any;
  };
}

export interface FormatOperationRequest {
  value: number;
  format: FormatOperation;
  precision?: number;
}

export interface FormatOperationResponse {
  data: {
    value: number;
    format: FormatOperation;
    precision: number | null;
    result: string;
  };
}

export interface BitManipulationRequest {
  value: number;
  operation: BitManipulationOperation;
}

export interface BitManipulationResponse {
  data: {
    value: number;
    operation: BitManipulationOperation;
    result: any;
  };
}

export interface ValidateRequest {
  value: number;
  type: PrimitiveType;
}

export interface ValidateResponse {
  data: {
    value: number;
    type: PrimitiveType;
    isValid: boolean;
    range: {
      min: number;
      max: number;
    };
  };
}

export interface ConversionRequest {
  value: number;
  fromType: PrimitiveType;
  toType: PrimitiveType;
}

export interface ConversionResponse {
  data: {
    value: number;
    fromType: PrimitiveType;
    toType: PrimitiveType;
    result: any;
    success: boolean;
    error: string | null;
  };
}
