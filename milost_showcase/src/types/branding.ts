import { Result, ValidationError, Err, Ok, Str } from "milost";

export type RangeValidator = {
  type: "range";
  min: number;
  max: number;
};

export type RegexValidator = {
  type: "regex";
  pattern: string;
};

export type CustomValidator = {
  type: "custom";
  validate: (value: any) => boolean;
};

export type ValidatorConfig =
  | RangeValidator
  | RegexValidator
  | CustomValidator
  | string
  | ((value: any) => boolean);

export type Brand<T, B extends Str> = T & { readonly __brand: B };

export class Branded<T, B extends Str> {
  private readonly _value: T;
  private readonly _brand: B;

  private constructor(value: T, brand: B) {
    this._value = value;
    this._brand = brand;
  }

  static create<T, B extends Str>(
    value: T,
    brand: B,
    validator: (value: T) => boolean,
    errorMessage?: Str
  ): Result<Branded<T, B>, ValidationError> {
    if (!validator(value)) {
      return Err(
        new ValidationError(
          errorMessage ||
            Str.fromRaw(`Invalid ${brand.unwrap()} value: ${value}`)
        )
      );
    }

    return Ok(new Branded(value, brand));
  }

  static is<T, B extends Str>(
    value: unknown,
    brand: B
  ): value is Branded<T, B> {
    return value instanceof Branded && value._brand.unwrap() === brand.unwrap();
  }

  unwrap(): T {
    return this._value;
  }

  brand(): B {
    return this._brand;
  }

  toJSON(): T {
    return this._value;
  }

  toString(): Str {
    return Str.fromRaw(`[Branded ${this._brand.unwrap()}]`);
  }
}

export function createValidator(
  config: ValidatorConfig
): (value: any) => boolean {
  if (typeof config === "function") {
    return config;
  }

  if (typeof config === "string") {
    switch (config.toLowerCase()) {
      case "positive":
        return (value) => typeof value === "number" && value > 0;
      case "negative":
        return (value) => typeof value === "number" && value < 0;
      case "non_negative":
        return (value) => typeof value === "number" && value >= 0;
      default:
        return () => true;
    }
  }

  if (typeof config === "object") {
    switch (config.type) {
      case "range":
        return (value) => {
          const numVal = Number(value);
          return !isNaN(numVal) && numVal >= config.min && numVal <= config.max;
        };
      case "regex":
        const regex = new RegExp(config.pattern);
        return (value) => typeof value === "string" && regex.test(value);
      case "custom":
        return config.validate;
      default:
        return () => true;
    }
  }

  return () => true;
}

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
    result: any | null;
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
    result: any | null;
    error: string | null;
  };
}

export interface BrandedOperationRequest
  extends CreateBrandedRequest,
    ConvertBrandedRequest {
  operation: BrandedOperation;
}

export type BrandedOperation = "create" | "validate" | "unwrap" | "convert";
