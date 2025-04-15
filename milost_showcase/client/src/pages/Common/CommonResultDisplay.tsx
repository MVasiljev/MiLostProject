import {
  CommonOperationResult,
  isTypeCheckResult,
  isConversionResult,
  isLoadingStateResult,
  isBrandTypeResult,
  isOptionResult,
  isResultResult,
} from "./types";
import { Pre, Table, Badge } from "./Common.styles";

interface CommonResultDisplayProps {
  result: CommonOperationResult;
}

function CommonResultDisplay({ result }: CommonResultDisplayProps) {
  if (isTypeCheckResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            value: result.value,
            checkType: result.checkType,
            result: result.result,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isConversionResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            original: result.original,
            converted: result.converted,
            length: result.length,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isLoadingStateResult(result)) {
    return (
      <>
        <p>All available loading states:</p>
        <Table>
          <thead>
            <tr>
              <th>State</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result.states).map(([state, value]) => (
              <tr key={state}>
                <td>{state}</td>
                <td>
                  <code>{value}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {result.requestedState && (
          <p>
            Requested state:{" "}
            <Badge status="info">{result.requestedState}</Badge>
          </p>
        )}
      </>
    );
  }

  if (isBrandTypeResult(result)) {
    return (
      <>
        <p>All available brand types:</p>
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result.types).map(([type, value]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>
                  <code>{value}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {result.requestedType && (
          <p>
            Requested type: <Badge status="info">{result.requestedType}</Badge>
          </p>
        )}
      </>
    );
  }

  if (isOptionResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            value: result.value,
            operation: result.operation,
            result: result.result,
            success: result.success,
            error: result.error,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  if (isResultResult(result)) {
    return (
      <Pre>
        {JSON.stringify(
          {
            value: result.value,
            errorValue: result.errorValue,
            operation: result.operation,
            result: result.result,
            success: result.success,
            error: result.error,
          },
          null,
          2
        )}
      </Pre>
    );
  }

  return <Pre>{JSON.stringify(result, null, 2)}</Pre>;
}

export default CommonResultDisplay;
