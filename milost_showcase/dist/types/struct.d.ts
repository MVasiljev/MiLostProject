export type StructOperation = "get" | "set" | "keys" | "entries" | "map" | "filter";
export interface CreateStructRequest {
    fields: Record<string, any>;
}
export interface StructResponse {
    data: {
        original: Record<string, any>;
        keys: string[];
        isEmpty: boolean;
    };
}
export interface StructGetRequest {
    fields: Record<string, any>;
    key: string;
}
export interface StructGetResponse {
    data: {
        original: Record<string, any>;
        key: string;
        value: any;
    };
}
export interface StructSetRequest {
    fields: Record<string, any>;
    key: string;
    value: any;
}
export interface StructSetResponse {
    data: {
        original: Record<string, any>;
        key: string;
        value: any;
        result: Record<string, any>;
    };
}
export interface StructKeysRequest {
    fields: Record<string, any>;
}
export interface StructKeysResponse {
    data: {
        original: Record<string, any>;
        keys: string[];
    };
}
export interface StructEntriesRequest {
    fields: Record<string, any>;
}
export interface StructEntriesResponse {
    data: {
        original: Record<string, any>;
        entries: Array<[string, any]>;
    };
}
export interface StructMapRequest {
    fields: Record<string, any>;
    operation: "double" | "square" | "toString" | "increment" | "uppercase" | "lowercase";
}
export interface StructMapResponse {
    data: {
        original: Record<string, any>;
        operation: string;
        result: Record<string, any>;
    };
}
export interface StructFilterRequest {
    fields: Record<string, any>;
    operation: "greaterThan" | "lessThan" | "equals" | "contains" | "startsWith" | "endsWith";
    parameter?: any;
}
export interface StructFilterResponse {
    data: {
        original: Record<string, any>;
        operation: string;
        parameter?: any;
        result: Record<string, any>;
    };
}
export interface StructOperationRequest {
    fields: Record<string, any>;
    operation: StructOperation;
    key?: string;
    value?: any;
    mapOperation?: string;
    filterOperation?: string;
    parameter?: any;
}
export interface StructAnalyzeRequest {
    value: string;
}
export interface StructAnalyzeResponse {
    data: {
        original: string;
        parsed: Record<string, any>;
        keys: string[];
        isEmpty: boolean;
    };
}
