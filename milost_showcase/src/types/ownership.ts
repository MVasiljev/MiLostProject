export type OwnershipOperation =
  | "consume"
  | "borrow"
  | "borrowMut"
  | "isConsumed"
  | "isAlive";

export interface CreateOwnedRequest {
  value: any;
}

export interface OwnedResponse {
  data: {
    value: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface OwnedOperationRequest {
  value: any;
  operation: OwnershipOperation;
  fn?: (value: any) => any;
}

export interface OwnedOperationResponse {
  data: {
    operation: OwnershipOperation;
    result: any;
    isConsumed?: boolean;
    isAlive?: boolean;
    success: boolean;
    error: string | null;
  };
}
