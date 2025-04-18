// src/pages/Functional/ResultDisplay.tsx
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

// Helper function to safely format function representation for display
const formatFunctionForDisplay = (func: any): string => {
  if (typeof func === "function") {
    return func.toString();
  }

  if (
    typeof func === "string" &&
    (func.includes("=>") ||
      func.startsWith("function") ||
      (func.includes("(") && func.includes(")")))
  ) {
    return func;
  }

  try {
    return JSON.stringify(func, null, 2);
  } catch (e) {
    return String(func);
  }
};

// Helper function to safely format result for display
const formatResultForDisplay = (result: any): string => {
  if (result === undefined) return "undefined";
  if (result === null) return "null";

  if (typeof result === "function") {
    return result.toString();
  }

  try {
    return JSON.stringify(
      result,
      (key, value) => {
        // Handle functions in the result
        if (typeof value === "function") {
          return value.toString();
        }
        return value;
      },
      2
    );
  } catch (e) {
    return String(result);
  }
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const renderResult = () => {
    if (isMapOperationResult(result)) {
      return (
        <Pre>
          {`Operation: ${result.operation}
          
Original: ${formatFunctionForDisplay(result.original)}

${result.params ? `Parameters: ${formatFunctionForDisplay(result.params)}` : ""}

Result: ${formatResultForDisplay(result.result)}
          
Success: ${result.success ? "true" : "false"}
${result.error ? `Error: ${result.error}` : ""}`}
        </Pre>
      );
    }

    if (isTransformOperationResult(result)) {
      return (
        <Pre>
          {`Operation: ${result.operation}
          
Original: ${formatFunctionForDisplay(result.original)}

${result.params ? `Parameters: ${formatFunctionForDisplay(result.params)}` : ""}

Result: ${formatResultForDisplay(result.result)}
          
Success: ${result.success ? "true" : "false"}
${result.error ? `Error: ${result.error}` : ""}`}
        </Pre>
      );
    }

    if (isExecutionOperationResult(result)) {
      return (
        <Pre>
          {`Operation: ${result.operation}
          
Original: ${formatFunctionForDisplay(result.original)}

${result.params ? `Parameters: ${formatFunctionForDisplay(result.params)}` : ""}

Result: ${formatResultForDisplay(result.result)}
          
Success: ${result.success ? "true" : "false"}
${result.error ? `Error: ${result.error}` : ""}`}
        </Pre>
      );
    }

    if (isPredicateOperationResult(result)) {
      return (
        <Pre>
          {`Operation: ${result.operation}
          
Original: ${formatFunctionForDisplay(result.original)}

${result.params ? `Parameters: ${formatFunctionForDisplay(result.params)}` : ""}

Result: ${formatResultForDisplay(result.result)}
          
Success: ${result.success ? "true" : "false"}
${result.error ? `Error: ${result.error}` : ""}`}
        </Pre>
      );
    }

    if (isUtilityOperationResult(result)) {
      return (
        <Pre>
          {`Operation: ${result.operation}
          
Original: ${formatFunctionForDisplay(result.original)}

${result.params ? `Parameters: ${formatFunctionForDisplay(result.params)}` : ""}

Result: ${formatResultForDisplay(result.result)}
          
Success: ${result.success ? "true" : "false"}
${result.error ? `Error: ${result.error}` : ""}`}
        </Pre>
      );
    }

    // Fallback for unknown result types
    return <Pre>{formatResultForDisplay(result)}</Pre>;
  };

  return (
    <ResultContainer>
      <ResultTitle>Result</ResultTitle>
      <ResultContent>{renderResult()}</ResultContent>
    </ResultContainer>
  );
};

export default ResultDisplay;
