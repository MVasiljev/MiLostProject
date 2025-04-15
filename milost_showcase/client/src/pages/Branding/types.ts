export type BrandingOperation = "create" | "validate" | "unwrap" | "convert";

export type ValidatorType = "range" | "regex" | "custom" | "predefined";

export interface BrandingOperationRequest {
  value: string | number;
  brand: string;
  operation: BrandingOperation;
  validator?: {
    type: ValidatorType;
    config?: {
      min?: number;
      max?: number;
      pattern?: string;
      predefinedType?: "positive" | "negative" | "non_negative";
    };
  };
  errorMessage?: string;
  fromBrand?: string;
  toBrand?: string;
}

export interface BrandingOperationResponse {
  data: {
    value: string | number;
    brand: string;
    success: boolean;
    result: string | number | object | null;
    error: string | null;
    fromBrand?: string;
    toBrand?: string;
  };
}
