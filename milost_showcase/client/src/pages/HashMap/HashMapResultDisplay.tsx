import { Pre } from "./HashMap.styles";
import {
  HashMapOperationResult,
  isHashMapAnalysisResult,
  isHashMapGetResult,
  isHashMapContainsResult,
  isHashMapSetResult,
  isHashMapRemoveResult,
  isHashMapKeysResult,
  isHashMapValuesResult,
  isHashMapEntriesResult,
  isHashMapMapResult,
  isHashMapFilterResult,
} from "./types";

interface HashMapResultDisplayProps {
  result: HashMapOperationResult;
}

const HashMapResultDisplay: React.FC<HashMapResultDisplayProps> = ({
  result,
}) => {
  if (isHashMapAnalysisResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            parsed: result.parsed,
            keys: result.keys,
            size: result.size,
            isEmpty: result.isEmpty,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapGetResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            key: result.key,
            value: result.value,
            exists: result.exists,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapContainsResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            key: result.key,
            exists: result.exists,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapSetResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            key: result.key,
            value: result.value,
            result: result.result,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapRemoveResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            key: result.key,
            result: result.result,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapKeysResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            keys: result.keys,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapValuesResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            values: result.values,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapEntriesResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            entries: result.entries,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isHashMapMapResult(result)) {
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

  if (isHashMapFilterResult(result)) {
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

  return <Pre>{JSON.stringify(result, null, 2)}</Pre>;
};

export default HashMapResultDisplay;
