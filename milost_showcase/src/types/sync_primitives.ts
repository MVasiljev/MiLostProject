import { u32 } from "milost";

export type SyncPrimitiveCreateOperation =
  | "createMutex"
  | "createRwLock"
  | "createArcMutex";

export type MutexOperation = "lock" | "get" | "isLocked" | "toString";

export type RwLockOperation =
  | "read"
  | "releaseRead"
  | "write"
  | "getReaders"
  | "isWriteLocked"
  | "toString";

export type ArcMutexOperation =
  | "get"
  | "set"
  | "setAsync"
  | "clone"
  | "isLocked"
  | "toString";

export type SyncPrimitiveOperation =
  | SyncPrimitiveCreateOperation
  | MutexOperation
  | RwLockOperation
  | ArcMutexOperation;

export interface SyncPrimitiveOperationRequest {
  operation: SyncPrimitiveOperation;
  value?: any;
  initialValue?: any;
  updater?: (prev: any) => any;
  asyncUpdater?: (prev: any) => Promise<any>;
  options?: {
    retries?: u32;
    fallback?: (error: any) => any;
  };
}

export interface SyncPrimitiveOperationResponse {
  data: {
    original: any;
    operation: SyncPrimitiveOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
