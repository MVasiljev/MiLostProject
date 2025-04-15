export type HashSetOperation =
  | "contains"
  | "insert"
  | "remove"
  | "map"
  | "filter"
  | "values"
  | "size"
  | "isEmpty";

export type HashSetMapOperation =
  | "double"
  | "square"
  | "toString"
  | "increment"
  | "uppercase"
  | "lowercase";

export type HashSetFilterOperation =
  | "greaterThan"
  | "lessThan"
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith";

export type HashSetSetOperation =
  | "union"
  | "intersection"
  | "difference"
  | "symmetricDifference"
  | "isSubset"
  | "isSuperset";

export interface CreateHashSetRequest {
  values: any[];
}

export interface HashSetResponse {
  data: {
    original: any[];
    size: number;
    isEmpty: boolean;
    values: any[];
  };
}

export interface HashSetContainsRequest {
  values: any[];
  value: any;
}

export interface HashSetContainsResponse {
  data: {
    original: any[];
    value: any;
    contains: boolean;
  };
}

export interface HashSetInsertRequest {
  values: any[];
  value: any;
}

export interface HashSetInsertResponse {
  data: {
    original: any[];
    value: any;
    result: any[];
    size: number;
    valueWasNew: boolean;
  };
}

export interface HashSetRemoveRequest {
  values: any[];
  value: any;
}

export interface HashSetRemoveResponse {
  data: {
    original: any[];
    value: any;
    result: any[];
    size: number;
    valueExisted: boolean;
  };
}

export interface HashSetMapRequest {
  values: any[];
  operation: HashSetMapOperation;
}

export interface HashSetMapResponse {
  data: {
    original: any[];
    operation: HashSetMapOperation;
    result: any[];
  };
}

export interface HashSetFilterRequest {
  values: any[];
  operation: HashSetFilterOperation;
  parameter?: any;
}

export interface HashSetFilterResponse {
  data: {
    original: any[];
    operation: HashSetFilterOperation;
    parameter?: any;
    result: any[];
  };
}

export interface HashSetSetOperationRequest {
  firstSet: any[];
  secondSet: any[];
  operation: HashSetSetOperation;
}

export interface HashSetSetOperationResponse {
  data: {
    firstSet: any[];
    secondSet: any[];
    operation: HashSetSetOperation;
    result: any[] | boolean;
  };
}

export interface HashSetOperationRequest {
  values: any[];
  operation: HashSetOperation;
  value?: any;
  mapOperation?: HashSetMapOperation;
  filterOperation?: HashSetFilterOperation;
  parameter?: any;
  firstSet?: any[];
  secondSet?: any[];
  setOperation?: HashSetSetOperation;
}

export interface HashSetAnalyzeRequest {
  value: string;
}

export interface HashSetAnalyzeResponse {
  data: {
    original: string;
    parsed: any[];
    size: number;
    isEmpty: boolean;
    values: any[];
  };
}
