export type AsyncUtilsOperation =
  | "all"
  | "allSettled"
  | "mapSeries"
  | "retry"
  | "debounce"
  | "withTimeout"
  | "cancellable";

export interface AllRequest {
  promises: Promise<any>[];
}

export interface AllSettledRequest {
  promises: Promise<any>[];
}

export interface MapSeriesRequest {
  items: any[];
  fn: (item: any, index: number) => Promise<any>;
}

export interface RetryRequest {
  operation: () => Promise<any>;
  options?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: any, attempt: number) => boolean;
  };
}

export interface DebounceRequest {
  fn: (...args: any[]) => Promise<any>;
  wait: number;
  args?: any[];
  executeNow?: boolean;
}

export interface WithTimeoutRequest {
  promise: Promise<any>;
  timeoutMs: number;
  timeoutError?: any;
}

export interface CancellableRequest {
  fn: (signal: AbortSignal) => Promise<any>;
  execute?: boolean;
  cancelAfterMs?: number;
}

export interface AsyncUtilsResponse {
  data: {
    operation: AsyncUtilsOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface AsyncUtilsOperationRequest {
  operation: AsyncUtilsOperation;
  promises?: Promise<any>[];
  items?: any[];
  fn?: (item: any, index?: number) => Promise<any>;
  args?: any[];
  options?: RetryRequest["options"];
  wait?: number;
  timeoutMs?: number;
  timeoutError?: any;
  promise?: Promise<any>;
  execute?: boolean;
  cancelAfterMs?: number;
  executeNow?: boolean;
}
