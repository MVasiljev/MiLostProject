import { useState, ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  OperationGrid,
  OperationButton,
  PrimaryButton,
  SmallText,
} from "./Result.styles";
import { ResultUnwrapResult, ResultUnwrapOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultUnwrapProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultUnwrapResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultUnwrap: React.FC<ResultUnwrapProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [resultValue, setResultValue] = useState<string>("Ok(42)");
  const [operation, setOperation] = useState<ResultUnwrapOperation>("unwrap");
  const [defaultValue, setDefaultValue] = useState<string>("0");
  const [errorMessage, setErrorMessage] = useState<string>("Failed to unwrap");

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let value: Record<string, any> = { isOk: true, value: 42 };

      try {
        if (resultValue.startsWith("Ok(") && resultValue.endsWith(")")) {
          const innerValue = resultValue.slice(3, -1);
          value = { isOk: true, value: JSON.parse(innerValue) };
        } else if (
          resultValue.startsWith("Err(") &&
          resultValue.endsWith(")")
        ) {
          const innerValue = resultValue.slice(4, -1);
          value = { isOk: false, error: innerValue };
        } else {
          value = JSON.parse(resultValue);
        }
      } catch (e) {}

      let parsedDefaultValue;
      try {
        parsedDefaultValue = JSON.parse(defaultValue);
      } catch (e) {
        parsedDefaultValue = defaultValue;
      }

      const requestBody: Record<string, any> = {
        operation,
        value,
      };

      if (operation === "unwrapOr") {
        requestBody.defaultValue = parsedDefaultValue;
      } else if (operation === "expect") {
        requestBody.errorMessage = errorMessage;
      }

      const response = await fetch(`${apiBaseUrl}/result/unwrap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultUnwrapResult> = await response.json();
      handleApiResponse(response, data);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <FormGroup>
        <Label htmlFor="result-input">Result Value</Label>
        <Input
          id="result-input"
          type="text"
          value={resultValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setResultValue(e.target.value)
          }
          placeholder="Ok(42) or Err('error')"
        />
        <SmallText>
          Enter a Result value. You can use Ok(value) or Err(error) syntax, or a
          JSON object.
        </SmallText>
      </FormGroup>

      <FormGroup>
        <Label>Unwrap Operation</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "unwrap"}
            onClick={() => setOperation("unwrap")}
          >
            unwrap
          </OperationButton>
          <OperationButton
            active={operation === "unwrapErr"}
            onClick={() => setOperation("unwrapErr")}
          >
            unwrapErr
          </OperationButton>
          <OperationButton
            active={operation === "unwrapOr"}
            onClick={() => setOperation("unwrapOr")}
          >
            unwrapOr
          </OperationButton>
          <OperationButton
            active={operation === "expect"}
            onClick={() => setOperation("expect")}
          >
            expect
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      {operation === "unwrapOr" && (
        <FormGroup>
          <Label htmlFor="default-value-input">Default Value</Label>
          <Input
            id="default-value-input"
            type="text"
            value={defaultValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDefaultValue(e.target.value)
            }
            placeholder="0"
          />
          <SmallText>Default value to return if Result is Err.</SmallText>
        </FormGroup>
      )}

      {operation === "expect" && (
        <FormGroup>
          <Label htmlFor="error-message-input">Error Message</Label>
          <Input
            id="error-message-input"
            type="text"
            value={errorMessage}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setErrorMessage(e.target.value)
            }
            placeholder="Custom error message"
          />
          <SmallText>
            Custom error message to use if expectation fails.
          </SmallText>
        </FormGroup>
      )}

      <PrimaryButton onClick={handleSubmit}>Unwrap Result</PrimaryButton>
    </>
  );
};

export default ResultUnwrap;
