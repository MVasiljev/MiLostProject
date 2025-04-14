export type HashMapOperation = "get" | "set" | "keys" | "values" | "entries" | "contains" | "remove" | "map" | "filter";
export type HashMapMapOperation = "double" | "square" | "toString" | "increment" | "uppercase" | "lowercase";
export type HashMapFilterOperation = "greaterThan" | "lessThan" | "equals" | "contains" | "startsWith" | "endsWith";
export interface CreateHashMapRequest {
    entries: Array<[string, any]>;
}
export interface HashMapResponse {
    data: {
        original: Array<[string, any]>;
        keys: string[];
        size: number;
        isEmpty: boolean;
    };
}
export interface HashMapGetRequest {
    entries: Array<[string, any]>;
    key: string;
}
export interface HashMapGetResponse {
    data: {
        original: Array<[string, any]>;
        key: string;
        value: any;
        exists: boolean;
    };
}
export interface HashMapContainsRequest {
    entries: Array<[string, any]>;
    key: string;
}
export interface HashMapContainsResponse {
    data: {
        original: Array<[string, any]>;
        key: string;
        exists: boolean;
    };
}
export interface HashMapSetRequest {
    entries: Array<[string, any]>;
    key: string;
    value: any;
}
export interface HashMapSetResponse {
    data: {
        original: Array<[string, any]>;
        key: string;
        value: any;
        result: Array<[string, any]>;
    };
}
export interface HashMapRemoveRequest {
    entries: Array<[string, any]>;
    key: string;
}
export interface HashMapRemoveResponse {
    data: {
        original: Array<[string, any]>;
        key: string;
        result: Array<[string, any]>;
    };
}
export interface HashMapKeysRequest {
    entries: Array<[string, any]>;
}
export interface HashMapKeysResponse {
    data: {
        original: Array<[string, any]>;
        keys: string[];
    };
}
export interface HashMapValuesRequest {
    entries: Array<[string, any]>;
}
export interface HashMapValuesResponse {
    data: {
        original: Array<[string, any]>;
        values: any[];
    };
}
export interface HashMapEntriesRequest {
    entries: Array<[string, any]>;
}
export interface HashMapEntriesResponse {
    data: {
        original: Array<[string, any]>;
        entries: Array<[string, any]>;
    };
}
export interface HashMapMapRequest {
    entries: Array<[string, any]>;
    operation: HashMapMapOperation;
}
export interface HashMapMapResponse {
    data: {
        original: Array<[string, any]>;
        operation: string;
        result: Array<[string, any]>;
    };
}
export interface HashMapFilterRequest {
    entries: Array<[string, any]>;
    operation: HashMapFilterOperation;
    parameter?: any;
}
export interface HashMapFilterResponse {
    data: {
        original: Array<[string, any]>;
        operation: string;
        parameter?: any;
        result: Array<[string, any]>;
    };
}
export interface HashMapOperationRequest {
    entries: Array<[string, any]>;
    operation: HashMapOperation;
    key?: string;
    value?: any;
    mapOperation?: string;
    filterOperation?: string;
    parameter?: any;
}
export interface HashMapAnalyzeRequest {
    value: string;
}
export interface HashMapAnalyzeResponse {
    data: {
        original: string;
        parsed: Array<[string, any]>;
        keys: string[];
        size: number;
        isEmpty: boolean;
    };
}
