export type TupleOperation = "get" | "first" | "second" | "replace" | "map" | "length";
export interface CreateTupleRequest {
    values: any[];
}
export interface TupleResponse {
    data: {
        original: any[];
        length: number;
        types: string[];
    };
}
export interface TupleGetRequest {
    values: any[];
    index: number;
}
export interface TupleGetResponse {
    data: {
        original: any[];
        index: number;
        result: any;
    };
}
export interface TupleFirstRequest {
    values: any[];
}
export interface TupleFirstResponse {
    data: {
        original: any[];
        result: any;
    };
}
export interface TupleSecondRequest {
    values: any[];
}
export interface TupleSecondResponse {
    data: {
        original: any[];
        result: any;
    };
}
export interface TupleReplaceRequest {
    values: any[];
    index: number;
    value: any;
}
export interface TupleReplaceResponse {
    data: {
        original: any[];
        index: number;
        value: any;
        result: any[];
    };
}
export interface TupleMapRequest {
    values: any[];
    operation: "double" | "square" | "toString" | "increment" | "decrement";
}
export interface TupleMapResponse {
    data: {
        original: any[];
        operation: string;
        result: any[];
    };
}
export interface TupleLengthRequest {
    values: any[];
}
export interface TupleLengthResponse {
    data: {
        original: any[];
        length: number;
    };
}
export interface TupleOperationRequest {
    values: any[];
    operation: TupleOperation;
    index?: number;
    value?: any;
    mapOperation?: string;
}
export interface TupleAnalyzeRequest {
    value: string;
}
export interface TupleAnalyzeResponse {
    data: {
        original: string;
        parsed: any[];
        length: number;
        types: string[];
    };
}
