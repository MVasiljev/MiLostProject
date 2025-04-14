export type StringTransformOperation =
  | "uppercase"
  | "lowercase"
  | "trim"
  | "reverse";
export type SubstringOperation =
  | "substring"
  | "charAt"
  | "startsWith"
  | "endsWith";
export type SearchOperation =
  | "contains"
  | "indexOf"
  | "lastIndexOf"
  | "replace"
  | "split";

export type StringOperationCategory =
  | "analyze"
  | "transform"
  | "substring"
  | "search"
  | "compare"
  | "concat";

export interface StringAnalysisResult {
  original: string;
  length: number;
  isEmpty: boolean;
}

export interface StringTransformationResult {
  original: string;
  operation: StringTransformOperation;
  result: string;
}

export interface SubstringOperationResult {
  original: string;
  operation: SubstringOperation;
  result: string | boolean | number;
  params: {
    start?: number;
    end?: number;
    searchStr?: string;
  };
}

export interface SearchOperationResult {
  original: string;
  operation: SearchOperation;
  result: string | boolean | number | string[];
  params: {
    searchStr: string;
    position?: number;
    replaceStr?: string;
  };
}

export interface CompareStringsResult {
  firstString: string;
  secondString: string;
  equal: boolean;
}

export interface ConcatenateStringsResult {
  firstString: string;
  secondString: string;
  result: string;
}

export type StringOperationResult =
  | StringAnalysisResult
  | StringTransformationResult
  | SubstringOperationResult
  | SearchOperationResult
  | CompareStringsResult
  | ConcatenateStringsResult;

export function isStringAnalysisResult(
  result: unknown
): result is StringAnalysisResult {
  return Boolean(
    result &&
      typeof (result as StringAnalysisResult).length === "number" &&
      typeof (result as StringAnalysisResult).isEmpty === "boolean"
  );
}

export function isStringTransformationResult(
  result: unknown
): result is StringTransformationResult {
  return Boolean(
    result &&
      typeof (result as StringTransformationResult).operation === "string" &&
      typeof (result as StringTransformationResult).result === "string"
  );
}

export function isSubstringOperationResult(
  result: unknown
): result is SubstringOperationResult {
  const asSubstring = result as SubstringOperationResult;
  return Boolean(
    result &&
      typeof asSubstring.operation === "string" &&
      asSubstring.params &&
      (typeof asSubstring.params.start === "number" ||
        typeof asSubstring.params.searchStr === "string")
  );
}

export function isSearchOperationResult(
  result: unknown
): result is SearchOperationResult {
  const asSearch = result as SearchOperationResult;
  return Boolean(
    result &&
      typeof asSearch.operation === "string" &&
      asSearch.params &&
      typeof asSearch.params.searchStr === "string"
  );
}

export function isCompareStringsResult(
  result: unknown
): result is CompareStringsResult {
  const asCompare = result as CompareStringsResult;
  return Boolean(
    result &&
      typeof asCompare.firstString === "string" &&
      typeof asCompare.secondString === "string" &&
      typeof asCompare.equal === "boolean"
  );
}

export function isConcatenateStringsResult(
  result: unknown
): result is ConcatenateStringsResult {
  const asConcat = result as ConcatenateStringsResult;
  return Boolean(
    result &&
      typeof asConcat.firstString === "string" &&
      typeof asConcat.secondString === "string" &&
      typeof asConcat.result === "string"
  );
}

export interface SubstringOperationRequest {
  value: string;
  operation: SubstringOperation;
  start?: number;
  end?: number;
  searchStr?: string;
}

export interface SearchOperationRequest {
  value: string;
  operation: SearchOperation;
  searchStr: string;
  position?: number;
  replaceStr?: string;
}
