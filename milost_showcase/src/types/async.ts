import { AppError } from "milost";

export type ChannelOperation =
  | "send"
  | "trySend"
  | "receive"
  | "tryReceive"
  | "close"
  | "isClosed";
export type TaskOperation =
  | "map"
  | "flatMap"
  | "catch"
  | "run"
  | "cancel"
  | "isCancelled";
export type AsyncType = "Channel" | "Task";

export interface CreateChannelRequest {
  capacity?: number;
}

export interface ChannelResponse {
  data: {
    capacity?: number;
    sender: any;
    receiver: any;
    success: boolean;
    error: string | null;
  };
}

export interface ChannelSenderOperationRequest {
  sender: any;
  operation: "send" | "trySend" | "close";
  value?: any;
}

export interface ChannelReceiverOperationRequest {
  receiver: any;
  operation: "receive" | "tryReceive";
}

export interface ChannelSenderOperationResponse {
  data: {
    operation: "send" | "trySend" | "close";
    result: any;
    isClosed?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface ChannelReceiverOperationResponse {
  data: {
    operation: "receive" | "tryReceive";
    result: any;
    isClosed?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface CreateTaskRequest {
  executor?: (signal: AbortSignal) => Promise<any>;
  directValue?: any;
  error?: any;
  isResolve?: boolean;
  isReject?: boolean;
}

export interface TaskResponse {
  data: {
    task: any;
    success: boolean;
    error: string | null;
  };
}

export interface TaskMapRequest {
  task: any;
  mapFn: (value: any) => any;
}

export interface TaskFlatMapRequest {
  task: any;
  flatMapFn: (value: any) => any;
}

export interface TaskCatchRequest {
  task: any;
  catchFn: (error: any) => any;
}

export interface TaskRunRequest {
  task: any;
}

export interface TaskOperationResponse {
  data: {
    operation: TaskOperation;
    result: any;
    isCancelled?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface AsyncOperationRequest {
  type: AsyncType;
  operation: ChannelOperation | TaskOperation;
  sender?: any;
  receiver?: any;
  task?: any;
  value?: any;
  mapFn?: (value: any) => any;
  flatMapFn?: (value: any) => any;
  catchFn?: (error: any) => any;
}

export interface AsyncOperationResponse {
  data: {
    type: AsyncType;
    operation: ChannelOperation | TaskOperation;
    result: any;
    isClosed?: boolean;
    isCancelled?: boolean;
    success: boolean;
    error: string | null;
  };
}
