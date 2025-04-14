export type StringTransformOperation = "uppercase" | "lowercase" | "trim" | "reverse";
export type SubstringOperation = "substring" | "charAt" | "startsWith" | "endsWith";
export type SearchOperation = "contains" | "indexOf" | "lastIndexOf" | "replace" | "split";
export declare enum StringOperation {
    UPPERCASE = "uppercase",
    LOWERCASE = "lowercase",
    TRIM = "trim"
}
export interface CreateStringRequest {
    value: string;
}
export interface StringResponse {
    data: {
        original: string;
        length: number;
        isEmpty: boolean;
    };
}
export interface StringOperationRequest {
    value: string;
    operation: StringTransformOperation;
}
export interface StringOperationResponse {
    data: {
        original: string;
        operation: StringTransformOperation;
        result: string;
    };
}
export interface SubstringOperationRequest {
    value: string;
    operation: SubstringOperation;
    start?: number;
    end?: number;
    searchStr?: string;
}
export interface SubstringOperationResponse {
    data: {
        original: string;
        operation: SubstringOperation;
        result: string | boolean | number;
        params: {
            start?: number;
            end?: number;
            searchStr?: string;
        };
    };
}
export interface SearchOperationRequest {
    value: string;
    operation: SearchOperation;
    searchStr: string;
    position?: number;
    replaceStr?: string;
}
export interface SearchOperationResponse {
    data: {
        original: string;
        operation: SearchOperation;
        result: string | boolean | number | string[];
        params: {
            searchStr: string;
            position?: number;
            replaceStr?: string;
        };
    };
}
export interface CompareStringsRequest {
    firstString: string;
    secondString: string;
}
export interface CompareStringsResponse {
    data: {
        firstString: string;
        secondString: string;
        equal: boolean;
    };
}
export interface ConcatenateStringsRequest {
    firstString: string;
    secondString: string;
}
export interface ConcatenateStringsResponse {
    data: {
        firstString: string;
        secondString: string;
        result: string;
    };
}
