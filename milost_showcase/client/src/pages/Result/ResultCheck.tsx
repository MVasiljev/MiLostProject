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
import { ResultCheckResult, ResultCheckOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultCheckProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultCheckResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultCheck: React.FC<ResultCheckProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [resultValue, setResultValue] = useState<string>("Ok(42)");
  const [operation, setOperation] = useState<ResultCheckOperation>("isOk");
  const [errorType, setErrorType] = useState<string>("");

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

      const requestBody: Record<string, any> = {
        operation,
        value,
      };

      if (operation === "isError" && errorType) {
        requestBody.errorType = errorType;
      }

      const response = await fetch(`${apiBaseUrl}/result/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultCheckResult> = await response.json();
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
        <Label>Check Operation</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "isOk"}
            onClick={() => setOperation("isOk")}
          >
            isOk
          </OperationButton>
          <OperationButton
            active={operation === "isErr"}
            onClick={() => setOperation("isErr")}
          >
            isErr
          </OperationButton>
          <OperationButton
            active={operation === "isError"}
            onClick={() => setOperation("isError")}
          >
            isError
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      {operation === "isError" && (
        <FormGroup>
          <Label htmlFor="error-type-input">Error Type</Label>
          <Input
            id="error-type-input"
            type="text"
            value={errorType}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setErrorType(e.target.value)
            }
            placeholder="AppError"
          />
          <SmallText>Enter the error type to check against.</SmallText>
        </FormGroup>
      )}

      <PrimaryButton onClick={handleSubmit}>Check Result</PrimaryButton>
    </>
  );
};

export default ResultCheck;
