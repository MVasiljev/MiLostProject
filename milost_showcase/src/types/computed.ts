export type ComputedType = "Computed" | "Watcher" | "AsyncEffect";

export type ComputedOperation = "get" | "update";
export type WatcherOperation = "check";
export type AsyncEffectOperation = "cancel";

export type ReactiveOperation =
  | ComputedOperation
  | WatcherOperation
  | AsyncEffectOperation;

export interface CreateComputedRequest {
  type: ComputedType;
  compute?: () => any;
  watchValues?: any[];
  callback?: (val: any) => void;
  effect?: () => Promise<void>;
}

export interface ComputedResponse {
  data: {
    type: ComputedType;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface ComputedOperationRequest {
  value: any;
  operation: ComputedOperation;
  newWatchValues?: any[];
}

export interface ComputedOperationResponse {
  data: {
    operation: ComputedOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface WatcherOperationRequest {
  value: any;
  operation: WatcherOperation;
}

export interface WatcherOperationResponse {
  data: {
    operation: WatcherOperation;
    success: boolean;
    error: string | null;
  };
}

export interface AsyncEffectOperationRequest {
  value: any;
  operation: AsyncEffectOperation;
}

export interface AsyncEffectOperationResponse {
  data: {
    operation: AsyncEffectOperation;
    success: boolean;
    error: string | null;
  };
}

export interface ReactiveOperationRequest {
  type: ComputedType;
  value: any;
  operation: ReactiveOperation;
  newWatchValues?: any[];
}

export interface ReactiveOperationResponse {
  data: {
    type: ComputedType;
    operation: ReactiveOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
