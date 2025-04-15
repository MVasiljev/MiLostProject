export type ReferenceType = "Ref" | "RefMut";

export type RefOperation = "get" | "drop" | "isActive";
export type RefMutOperation = "get" | "set" | "drop" | "isActive";

export type ReferenceOperation = RefOperation | RefMutOperation;

export interface CreateReferenceRequest {
  type: ReferenceType;
  value: any;
}

export interface ReferenceResponse {
  data: {
    type: ReferenceType;
    value: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface RefOperationRequest {
  value: any;
  operation: RefOperation;
}

export interface RefOperationResponse {
  data: {
    operation: RefOperation;
    result: any;
    isActive?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface RefMutOperationRequest {
  value: any;
  operation: RefMutOperation;
  updater?: (value: any) => any;
}

export interface RefMutOperationResponse {
  data: {
    operation: RefMutOperation;
    result: any;
    isActive?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface ReferenceOperationRequest {
  type: ReferenceType;
  value: any;
  operation: ReferenceOperation;
  updater?: (value: any) => any;
}

export interface ReferenceOperationResponse {
  data: {
    type: ReferenceType;
    operation: ReferenceOperation;
    result: any;
    isActive?: boolean;
    success: boolean;
    error: string | null;
  };
}
