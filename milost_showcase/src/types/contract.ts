export type ContractType = "requires" | "ensures" | "contract" | "invariant";

export type ContractOperation = "requires" | "ensures" | "contract";
export type InvariantOperation = "new" | "get" | "map";

export interface RequiresRequest {
  condition: boolean;
  errorMessage?: string;
}

export interface EnsuresRequest {
  condition: boolean;
  errorMessage?: string;
}

export interface ContractRequest {
  fn: (arg: any) => any;
  precondition?: (arg: any) => boolean;
  postcondition?: (arg: any, result: any) => boolean;
  preErrorMsg?: string;
  postErrorMsg?: string;
  testArg?: any;
}

export interface ContractOperationResponse {
  data: {
    operation: ContractOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface CreateInvariantRequest {
  value: any;
  invariant: (value: any) => boolean;
  errorMessage?: string;
}

export interface InvariantResponse {
  data: {
    value: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface InvariantGetRequest {
  invariant: any;
}

export interface InvariantMapRequest {
  invariant: any;
  fn: (value: any) => any;
  newInvariant: (value: any) => boolean;
  errorMessage?: string;
}

export interface InvariantOperationResponse {
  data: {
    operation: InvariantOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface ContractInvariantOperationRequest {
  type: "Contract" | "Invariant";
  operation: ContractOperation | InvariantOperation;
  condition?: boolean;
  errorMessage?: string;
  fn?: (arg: any) => any;
  precondition?: (arg: any) => boolean;
  postcondition?: (arg: any, result: any) => boolean;
  preErrorMsg?: string;
  postErrorMsg?: string;
  testArg?: any;
  value?: any;
  invariant?: (value: any) => boolean;
  newInvariant?: (value: any) => boolean;
  invariantObj?: any;
}

export interface ContractInvariantOperationResponse {
  data: {
    type: "Contract" | "Invariant";
    operation: ContractOperation | InvariantOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
