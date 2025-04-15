export type BrandedOperation = "create" | "validate" | "unwrap" | "convert";

export type ValidatorConfig =
  | string
  | {
      type: "range";
      min: number;
      max: number;
    }
  | {
      type: "regex";
      pattern: string;
    }
  | {
      type: "custom";
      code: string;
    };

export interface CreateBrandedRequest {
  value: any;
  brand: string;
  validator?: ValidatorConfig;
  errorMessage?: string;
}

export interface CreateBrandedResponse {
  data: {
    value: any;
    brand: string;
    success: boolean;
    result: any;
    error: string | null;
  };
}

export interface ValidateBrandedRequest {
  value: any;
  brand: string;
  validator?: ValidatorConfig;
}

export interface ValidateBrandedResponse {
  data: {
    value: any;
    brand: string;
    isValid: boolean;
  };
}

export interface UnwrapBrandedRequest {
  value: any;
  brand: string;
  validator?: ValidatorConfig;
  errorMessage?: string;
}

export interface UnwrapBrandedResponse {
  data: {
    value: any;
    brand: string;
    unwrapped: any;
  };
}

export interface ConvertBrandedRequest {
  value: any;
  fromBrand: string;
  toBrand: string;
  validator?: ValidatorConfig;
  errorMessage?: string;
}

export interface ConvertBrandedResponse {
  data: {
    value: any;
    fromBrand: string;
    toBrand: string;
    success: boolean;
    result: any;
    error: string | null;
  };
}

export interface BrandedOperationRequest
  extends CreateBrandedRequest,
    ConvertBrandedRequest {
  operation: BrandedOperation;
}
