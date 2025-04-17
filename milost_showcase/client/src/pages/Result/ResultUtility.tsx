import { useState, ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  OperationGrid,
  OperationButton,
  PrimaryButton,
  SmallText,
  TextArea,
} from "./Result.styles";
import { ResultUtilityResult, ResultUtilityOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultUtilityProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultUtilityResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultUtility: React.FC<ResultUtilityProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [operation, setOperation] =
    useState<ResultUtilityOperation>("tryCatch");
  const [argumentValue, setArgumentValue] = useState<string>("42");
  const [validator, setValidator] = useState<string>("value => value > 0");
  const [errorMessage, setErrorMessage] = useState<string>(
    "Value must be positive"
  );
  const [functionCode, setFunctionCode] = useState<string>("(x) => x * 2");
  const [resultsInput, setResultsInput] = useState<string>(
    '[Ok(1), Ok(2), Err("error")]'
  );

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let argument;
      try {
        argument = JSON.parse(argumentValue);
      } catch (e) {
        argument = argumentValue;
      }

      let results: any[] = [];
      if (operation === "all") {
        results = resultsInput.split(",").map((item) => {
          item = item.trim();
          if (item.startsWith("Ok(") && item.endsWith(")")) {
            const innerValue = item.slice(3, -1);
            try {
              return { isOk: true, value: JSON.parse(innerValue) };
            } catch {
              return {
                isOk: true,
                value: innerValue.replace(/^["']|["']$/g, ""),
              };
            }
          } else if (item.startsWith("Err(") && item.endsWith(")")) {
            const innerValue = item.slice(4, -1);
            try {
              return { isOk: false, error: JSON.parse(innerValue) };
            } catch {
              return {
                isOk: false,
                error: innerValue.replace(/^["']|["']$/g, ""),
              };
            }
          }
          try {
            return JSON.parse(item);
          } catch {
            return { isOk: true, value: item };
          }
        });
      }

      // Prepare request body
      const requestBody: Record<string, any> = {
        operation,
      };

      // Add operation-specific parameters
      if (operation === "tryCatch" || operation === "tryCatchAsync") {
        requestBody.mapFn = functionCode;
        requestBody.argument = argument;
      } else if (operation === "fromValidation") {
        requestBody.value = argument;
        requestBody.validator = validator;
        requestBody.errorMessage = errorMessage;
      } else if (operation === "all") {
        requestBody.results = results;
      }

      // Make API request
      const response = await fetch(`${apiBaseUrl}/result/utility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultUtilityResult> = await response.json();
      handleApiResponse(response, data);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <FormGroup>
        <Label>Utility Operation</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "tryCatch"}
            onClick={() => setOperation("tryCatch")}
          >
            tryCatch
          </OperationButton>
          <OperationButton
            active={operation === "tryCatchAsync"}
            onClick={() => setOperation("tryCatchAsync")}
          >
            tryCatchAsync
          </OperationButton>
          <OperationButton
            active={operation === "fromValidation"}
            onClick={() => setOperation("fromValidation")}
          >
            fromValidation
          </OperationButton>
          <OperationButton
            active={operation === "all"}
            onClick={() => setOperation("all")}
          >
            all
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      {(operation === "tryCatch" || operation === "tryCatchAsync") && (
        <>
          <FormGroup>
            <Label htmlFor="function-input">Function</Label>
            <TextArea
              id="function-input"
              value={functionCode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFunctionCode(e.target.value)
              }
              placeholder="(x) => x * 2"
            />
            <SmallText>Function to wrap in a try-catch block</SmallText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="argument-input">Argument</Label>
            <Input
              id="argument-input"
              type="text"
              value={argumentValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setArgumentValue(e.target.value)
              }
              placeholder="42"
            />
            <SmallText>Argument to pass to the function</SmallText>
          </FormGroup>
        </>
      )}

      {operation === "fromValidation" && (
        <>
          <FormGroup>
            <Label htmlFor="value-input">Value to Validate</Label>
            <Input
              id="value-input"
              type="text"
              value={argumentValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setArgumentValue(e.target.value)
              }
              placeholder="42"
            />
            <SmallText>Value to validate</SmallText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="validator-input">Validator Function</Label>
            <TextArea
              id="validator-input"
              value={validator}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setValidator(e.target.value)
              }
              placeholder="value => value > 0"
            />
            <SmallText>Function that returns true if value is valid</SmallText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="error-message-input">Error Message</Label>
            <Input
              id="error-message-input"
              type="text"
              value={errorMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setErrorMessage(e.target.value)
              }
              placeholder="Value must be positive"
            />
            <SmallText>Error message to use if validation fails</SmallText>
          </FormGroup>
        </>
      )}

      {operation === "all" && (
        <FormGroup>
          <Label htmlFor="results-input">Result Values</Label>
          <TextArea
            id="results-input"
            value={resultsInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setResultsInput(e.target.value)
            }
            placeholder="Ok(1), Ok(2), Err('error')"
          />
          <SmallText>
            Comma-separated list of Result values. You can use Ok(value) or
            Err(error) syntax.
          </SmallText>
        </FormGroup>
      )}

      <PrimaryButton onClick={handleSubmit}>
        {operation === "tryCatch"
          ? "Try Catch"
          : operation === "tryCatchAsync"
            ? "Try Catch Async"
            : operation === "fromValidation"
              ? "Validate Value"
              : "Combine Results"}
      </PrimaryButton>
    </>
  );
};

export default ResultUtility;
