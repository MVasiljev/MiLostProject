import {
  Pre,
  ResultContainer,
  ResultTitle,
  ResultContent,
} from "./HashSet.styles";
import {
  HashSetOperationResult,
  isHashSetAnalysisResult,
  isHashSetContainsResult,
  isHashSetInsertResult,
  isHashSetRemoveResult,
  isHashSetMapResult,
  isHashSetFilterResult,
  isHashSetSetOperationResult,
} from "./types";

interface HashSetResultRendererProps {
  result: HashSetOperationResult | null;
}

function HashSetResultRenderer({ result }: HashSetResultRendererProps) {
  if (!result) return null;

  const renderResult = () => {
    if (isHashSetAnalysisResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              parsed: result.parsed,
              size: result.size,
              isEmpty: result.isEmpty,
              values: result.values,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetContainsResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              value: result.value,
              contains: result.contains,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetInsertResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              value: result.value,
              result: result.result,
              size: result.size,
              valueWasNew: result.valueWasNew,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetRemoveResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              value: result.value,
              result: result.result,
              size: result.size,
              valueExisted: result.valueExisted,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetMapResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetFilterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              parameter: result.parameter,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isHashSetSetOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              firstSet: result.firstSet,
              secondSet: result.secondSet,
              operation: result.operation,
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
}

export default HashSetResultRenderer;
