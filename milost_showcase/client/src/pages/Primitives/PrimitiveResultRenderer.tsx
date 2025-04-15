import {
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
  ErrorMessage,
} from "./Primitives.styles";

import {
  PrimitiveOperationResult,
  isPrimitiveAnalysisResult,
  isArithmeticOperationResult,
  isBitwiseOperationResult,
  isFormatOperationResult,
  isBitManipulationResult,
  isValidateResult,
  isConversionResult,
} from "./types";

interface PrimitiveResultRendererProps {
  loading: boolean;
  error: string | null;
  result: PrimitiveOperationResult | null;
}

function PrimitiveResultRenderer({
  loading,
  error,
  result,
}: PrimitiveResultRendererProps) {
  if (loading) {
    return (
      <ResultContainer>
        <ResultTitle>Processing...</ResultTitle>
        <ResultContent>
          <Pre>Executing primitive type operation...</Pre>
        </ResultContent>
      </ResultContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!result) return null;

  const renderResultContent = () => {
    // Safely convert result to a string representation
    const safeStringify = (obj: any) => {
      try {
        // If it's a primitive or array, return as is
        if (typeof obj !== "object" || obj === null) return String(obj);

        // If it's an object, stringify with fallback
        return JSON.stringify(obj, null, 2);
      } catch {
        return "Unable to parse result";
      }
    };

    // Check if result is an API response with a data property
    if (result && typeof result === "object" && "data" in result) {
      return <Pre>{safeStringify(result.data)}</Pre>;
    }

    // Handle specific result types
    if (isPrimitiveAnalysisResult(result)) {
      return (
        <Pre>
          {safeStringify({
            original: result.original,
            type: result.type,
            result: result.result,
            range: result.range,
          })}
        </Pre>
      );
    }

    if (isArithmeticOperationResult(result)) {
      return (
        <Pre>
          {safeStringify({
            a: result.a,
            b: result.b,
            operation: result.operation,
            type: result.type,
            result: result.result,
            success: result.success,
            error: result.error,
          })}
        </Pre>
      );
    }

    if (isBitwiseOperationResult(result)) {
      return (
        <Pre>
          {safeStringify({
            a: result.a,
            b: result.b,
            operation: result.operation,
            result: result.result,
          })}
        </Pre>
      );
    }

    if (isFormatOperationResult(result)) {
      return (
        <Pre>
          {safeStringify({
            value: result.value,
            format: result.format,
            precision: result.precision,
            result: result.result,
          })}
        </Pre>
      );
    }

    if (isBitManipulationResult(result)) {
      return (
        <Pre>
          {safeStringify({
            value: result.value,
            operation: result.operation,
            result: result.result,
          })}
        </Pre>
      );
    }

    if (isValidateResult(result)) {
      return (
        <Pre>
          {safeStringify({
            value: result.value,
            type: result.type,
            isValid: result.isValid,
            range: result.range,
          })}
        </Pre>
      );
    }

    if (isConversionResult(result)) {
      return (
        <Pre>
          {safeStringify({
            value: result.value,
            fromType: result.fromType,
            toType: result.toType,
            result: result.result,
            success: result.success,
            error: result.error,
          })}
        </Pre>
      );
    }

    // Fallback for any other result type
    return <Pre>{safeStringify(result)}</Pre>;
  };

  return (
    <ResultContainer>
      <ResultTitle>Operation Result</ResultTitle>
      <ResultContent>{renderResultContent()}</ResultContent>
    </ResultContainer>
  );
}

export default PrimitiveResultRenderer;
