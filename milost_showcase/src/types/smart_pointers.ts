export type SmartPointerType = "Rc" | "Weak" | "RefCell" | "RcRefCell" | "Arc";

export type RcOperation =
  | "borrow"
  | "borrow_mut"
  | "clone"
  | "drop"
  | "refCount";
export type WeakOperation = "getOrDefault" | "drop";
export type RefCellOperation = "borrow" | "borrow_mut";
export type RcRefCellOperation =
  | "borrow"
  | "borrow_mut"
  | "clone"
  | "drop"
  | "refCount";
export type ArcOperation = "get" | "set" | "clone";

export type SmartPointerOperation =
  | RcOperation
  | WeakOperation
  | RefCellOperation
  | RcRefCellOperation
  | ArcOperation;

export interface CreateSmartPointerRequest {
  type: SmartPointerType;
  initialValue: any;
}

export interface SmartPointerResponse {
  data: {
    type: SmartPointerType;
    initialValue: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface RcOperationRequest {
  value: any;
  operation: RcOperation;
  updater?: (value: any) => any;
}

export interface RcOperationResponse {
  data: {
    operation: RcOperation;
    result: any;
    refCount?: number;
    success: boolean;
    error: string | null;
  };
}

export interface WeakOperationRequest {
  value: any;
  operation: WeakOperation;
  defaultValue?: any;
}

export interface WeakOperationResponse {
  data: {
    operation: WeakOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface RefCellOperationRequest {
  value: any;
  operation: RefCellOperation;
  updater?: (value: any) => any;
}

export interface RefCellOperationResponse {
  data: {
    operation: RefCellOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface RcRefCellOperationRequest {
  value: any;
  operation: RcRefCellOperation;
  updater?: (value: any) => any;
}

export interface RcRefCellOperationResponse {
  data: {
    operation: RcRefCellOperation;
    result: any;
    refCount?: number;
    success: boolean;
    error: string | null;
  };
}

export interface ArcOperationRequest {
  value: any;
  operation: ArcOperation;
  updater?: (prev: any) => any;
}

export interface ArcOperationResponse {
  data: {
    operation: ArcOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface SmartPointerOperationRequest {
  type: SmartPointerType;
  value: any;
  operation: SmartPointerOperation;
  updater?: (value: any) => any;
  defaultValue?: any;
}

export interface SmartPointerOperationResponse {
  data: {
    type: SmartPointerType;
    operation: SmartPointerOperation;
    result: any;
    refCount?: number;
    success: boolean;
    error: string | null;
  };
}
