export type MatchBuilderOperation = "with" | "otherwise";
export type PatternMatcherOperation =
  | "matchesPattern"
  | "extractValue"
  | "matchValue";

export type SpecialPattern = "Some" | "None" | "Ok" | "Err" | "_";

export interface CreateMatchBuilderRequest {
  value: any;
}

export interface MatchBuilderResponse {
  data: {
    value: any;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface MatchBuilderWithRequest {
  matchBuilder: any;
  pattern: any;
  handler: (value: any) => any;
}

export interface MatchBuilderOtherwiseRequest {
  matchBuilder: any;
  defaultHandler: (value: any) => any;
}

export interface MatchBuilderOperationResponse {
  data: {
    operation: MatchBuilderOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface PatternMatcherMatchesPatternRequest {
  value: any;
  pattern: any;
}

export interface PatternMatcherExtractValueRequest {
  value: any;
  pattern: any;
}

export interface PatternMatcherMatchValueRequest {
  value: any;
  patterns: any;
}

export interface PatternMatcherOperationResponse {
  data: {
    operation: PatternMatcherOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}

export interface MatchingOperationRequest {
  type: "MatchBuilder" | "PatternMatcher";
  operation: MatchBuilderOperation | PatternMatcherOperation;
  value?: any;
  pattern?: any;
  handler?: (value: any) => any;
  defaultHandler?: (value: any) => any;
  matchBuilder?: any;
  patterns?: any;
}

export interface MatchingOperationResponse {
  data: {
    type: "MatchBuilder" | "PatternMatcher";
    operation: MatchBuilderOperation | PatternMatcherOperation;
    result: any;
    success: boolean;
    error: string | null;
  };
}
