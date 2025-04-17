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
import { ResultMatchResult, ResultMatchOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultMatchProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultMatchResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultMatch: React.FC<ResultMatchProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [resultValue, setResultValue] = useState<string>("Ok(42)");
  const [operation, setOperation] = useState<ResultMatchOperation>("match");
  const [onOkHandler, setOnOkHandler] = useState<string>(
    "value => `Success: ${value}`"
  );
  const [onErrHandler, setOnErrHandler] = useState<string>(
    "error => `Error: ${error.message}`"
  );

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

      if (operation === "match") {
        requestBody.onSome = onOkHandler;
        requestBody.onNone = onErrHandler;
      }

      const response = await fetch(`${apiBaseUrl}/result/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultMatchResult> = await response.json();
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
        <Label>Match Operation</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "match"}
            onClick={() => setOperation("match")}
          >
            match
          </OperationButton>
          <OperationButton
            active={operation === "ok"}
            onClick={() => setOperation("ok")}
          >
            ok
          </OperationButton>
          <OperationButton
            active={operation === "err"}
            onClick={() => setOperation("err")}
          >
            err
          </OperationButton>
          <OperationButton
            active={operation === "getError"}
            onClick={() => setOperation("getError")}
          >
            getError
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      {operation === "match" && (
        <>
          <FormGroup>
            <Label htmlFor="ok-handler-input">On Success Handler</Label>
            <TextArea
              id="ok-handler-input"
              value={onOkHandler}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setOnOkHandler(e.target.value)
              }
              placeholder="value => `Success: ${value}`"
            />
            <SmallText>Function called when Result is Ok</SmallText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="err-handler-input">On Error Handler</Label>
            <TextArea
              id="err-handler-input"
              value={onErrHandler}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setOnErrHandler(e.target.value)
              }
              placeholder="error => `Error: ${error.message}`"
            />
            <SmallText>Function called when Result is Err</SmallText>
          </FormGroup>
        </>
      )}

      <PrimaryButton onClick={handleSubmit}>
        {operation === "match"
          ? "Match Result"
          : `Get ${operation === "ok" ? "Ok Value" : operation === "err" ? "Err Option" : "Error"}`}
      </PrimaryButton>
    </>
  );
};

export default ResultMatch;
