export type ResourceType = "Resource" | "DisposableGroup";

export type ResourceOperation =
  | "use"
  | "useAsync"
  | "dispose"
  | "isDisposed"
  | "valueOrNone";
export type DisposableGroupOperation =
  | "add"
  | "dispose"
  | "isDisposed"
  | "size";

export interface CreateResourceRequest {
  value: any;
  disposeFn: (value: any) => Promise<void> | void;
}

export interface ResourceResponse {
  data: {
    value: any;
    resource: any;
    success: boolean;
    error: string | null;
  };
}

export interface ResourceUseRequest {
  resource: any;
  fn: (value: any) => any;
}

export interface ResourceUseAsyncRequest {
  resource: any;
  fn: (value: any) => Promise<any>;
}

export interface ResourceDisposeRequest {
  resource: any;
}

export interface ResourceOperationResponse {
  data: {
    operation: ResourceOperation;
    result: any;
    isDisposed?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface WithResourceRequest {
  resource: any;
  fn: (value: any) => Promise<any> | any;
}

export interface WithResourceResponse {
  data: {
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface CreateDisposableGroupRequest {
  empty?: boolean;
}

export interface DisposableGroupResponse {
  data: {
    group: any;
    size: number;
    isDisposed: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface DisposableGroupAddRequest {
  group: any;
  disposable: any;
}

export interface DisposableGroupDisposeRequest {
  group: any;
}

export interface DisposableGroupOperationResponse {
  data: {
    operation: DisposableGroupOperation;
    result: any;
    size?: number;
    isDisposed?: boolean;
    success: boolean;
    error: string | null;
  };
}

export interface UseDisposableResourceRequest {
  disposable: any;
}

export interface ResourceOperationRequest {
  type: ResourceType;
  operation: ResourceOperation | DisposableGroupOperation;
  resource?: any;
  group?: any;
  value?: any;
  disposeFn?: (value: any) => Promise<void> | void;
  fn?: (value: any) => any;
  disposable?: any;
}

export interface ResourceOperationResponseGeneric {
  data: {
    type: ResourceType;
    operation: ResourceOperation | DisposableGroupOperation;
    result: any;
    isDisposed?: boolean;
    size?: number;
    success: boolean;
    error: string | null;
  };
}
