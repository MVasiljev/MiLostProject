import React from "react";
import {
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
} from "./Functional.styles";
import {
  FunctionalOperationResult,
  isMapOperationResult,
  isTransformOperationResult,
  isExecutionOperationResult,
  isPredicateOperationResult,
  isUtilityOperationResult,
} from "./types";

interface ResultDisplayProps {
  result: FunctionalOperationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const renderResult = () => {
    if (isMapOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTransformOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isExecutionOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isPredicateOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isUtilityOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    return <Pre>{JSON.stringify(result, null, 2)}</Pre>;
  };

  return (
    <ResultContainer>
      <ResultTitle>Result</ResultTitle>
      <ResultContent>{renderResult()}</ResultContent>
    </ResultContainer>
  );
};

export default ResultDisplay;
