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
import { ResultCreateResult, ResultBasicOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultCreateProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultCreateResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultCreate: React.FC<ResultCreateProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [value, setValue] = useState<string>("");
  const [errorValue, setErrorValue] = useState<string>("");
  const [operation, setOperation] = useState<ResultBasicOperation>("ok");

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let parsedValue;
      try {
        parsedValue = value ? JSON.parse(value) : undefined;
      } catch (e) {
        parsedValue = value;
      }

      let parsedErrorValue;
      try {
        parsedErrorValue = errorValue ? JSON.parse(errorValue) : undefined;
      } catch (e) {
        parsedErrorValue = errorValue;
      }

      const requestBody: Record<string, any> = {
        operation,
      };

      if (operation === "ok") {
        requestBody.value = parsedValue;
      } else if (operation === "err") {
        requestBody.errorValue = parsedErrorValue;
      }

      const response = await fetch(`${apiBaseUrl}/result/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultCreateResult> = await response.json();
      handleApiResponse(response, data);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <FormGroup>
        <Label htmlFor="value-input">Value (for Ok result)</Label>
        <Input
          id="value-input"
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          placeholder="42"
          disabled={operation === "err"}
        />
        <SmallText>
          Enter a value to wrap in Ok. Can be a primitive or JSON string.
        </SmallText>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="error-input">Error value (for Err result)</Label>
        <Input
          id="error-input"
          type="text"
          value={errorValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setErrorValue(e.target.value)
          }
          placeholder="Something went wrong"
          disabled={operation === "ok"}
        />
        <SmallText>Enter an error message or value to wrap in Err.</SmallText>
      </FormGroup>

      <FormGroup>
        <Label>Result Type</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "ok"}
            onClick={() => setOperation("ok")}
          >
            Ok
          </OperationButton>
          <OperationButton
            active={operation === "err"}
            onClick={() => setOperation("err")}
          >
            Err
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      <PrimaryButton onClick={handleSubmit}>Create Result</PrimaryButton>
    </>
  );
};

export default ResultCreate;
