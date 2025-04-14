export type VectorBasicOperation = "reverse";
export type VectorMapOperation = "double" | "square" | "add1" | "negate" | "toString";
export type VectorFilterOperation = "greaterThan" | "lessThan" | "equals" | "even" | "odd";
export type VectorReduceOperation = "sum" | "product" | "min" | "max" | "average";
export type VectorTakeDropOperation = "take" | "drop";
export type VectorCheckOperation = "all" | "any";
export declare enum VectorOperation {
    REVERSE = "reverse"
}
export interface CreateVectorRequest {
    values: any[];
}
export interface VectorResponse {
    data: {
        original: any[];
        length: number;
        isEmpty: boolean;
    };
}
export interface VectorOperationRequest {
    values: any[];
    operation: VectorBasicOperation;
}
export interface VectorOperationResponse {
    data: {
        original: any[];
        operation: VectorBasicOperation;
        result: any[];
    };
}
export interface ArrayMapOperationRequest {
    values: any[];
    operation: VectorMapOperation;
}
export interface ArrayMapOperationResponse {
    data: {
        original: any[];
        operation: VectorMapOperation;
        result: any[];
    };
}
export interface ArrayFilterOperationRequest {
    values: any[];
    operation: VectorFilterOperation;
    parameter?: number;
}
export interface ArrayFilterOperationResponse {
    data: {
        original: any[];
        operation: VectorFilterOperation;
        parameter?: number;
        result: any[];
    };
}
export interface ArrayReduceOperationRequest {
    values: any[];
    operation: VectorReduceOperation;
    initialValue?: number;
}
export interface ArrayReduceOperationResponse {
    data: {
        original: any[];
        operation: VectorReduceOperation;
        initialValue?: number;
        result: any;
    };
}
export interface TakeDropOperationRequest {
    values: any[];
    operation: VectorTakeDropOperation;
    count: number;
}
export interface TakeDropOperationResponse {
    data: {
        original: any[];
        operation: VectorTakeDropOperation;
        count: number;
        result: any[];
    };
}
export interface VectorCheckOperationRequest {
    values: any[];
    operation: VectorCheckOperation;
    parameter: number;
}
export interface VectorCheckOperationResponse {
    data: {
        original: any[];
        operation: VectorCheckOperation;
        parameter: number;
        result: boolean;
    };
}
