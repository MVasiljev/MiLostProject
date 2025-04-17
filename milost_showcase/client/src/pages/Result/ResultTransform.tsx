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
import { ResultTransformResult, ResultTransformOperation } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ResultTransformProps {
  apiBaseUrl: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  handleApiResponse: (
    response: Response,
    data: ApiResponse<ResultTransformResult>
  ) => void;
  handleApiError: (error: unknown) => void;
}

const ResultTransform: React.FC<ResultTransformProps> = ({
  apiBaseUrl,
  setLoading,
  setError,
  handleApiResponse,
  handleApiError,
}) => {
  const [resultValue, setResultValue] = useState<string>("Ok(42)");
  const [operation, setOperation] = useState<ResultTransformOperation>("map");
  const [mapFn, setMapFn] = useState<string>("value => value * 2");
  const [errorMapFn, setErrorMapFn] = useState<string>(
    "error => new Error('Mapped: ' + error.message)"
  );
  const [alternativeResult, setAlternativeResult] = useState<string>("Ok(100)");

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

      let altResult: Record<string, any> | undefined;

      if (operation === "and" || operation === "or") {
        try {
          if (
            alternativeResult.startsWith("Ok(") &&
            alternativeResult.endsWith(")")
          ) {
            const innerValue = alternativeResult.slice(3, -1);
            altResult = { isOk: true, value: JSON.parse(innerValue) };
          } else if (
            alternativeResult.startsWith("Err(") &&
            alternativeResult.endsWith(")")
          ) {
            const innerValue = alternativeResult.slice(4, -1);
            altResult = { isOk: false, error: innerValue };
          } else {
            altResult = JSON.parse(alternativeResult);
          }
        } catch (e) {
          altResult = { isOk: true, value: 100 };
        }
      }

      const requestBody: Record<string, any> = {
        operation,
        value,
      };

      if (operation === "map") {
        requestBody.mapFn = mapFn;
      } else if (operation === "mapErr") {
        requestBody.errorMapFn = errorMapFn;
      } else if (operation === "andThen") {
        requestBody.mapFn = mapFn;
      } else if (operation === "and" || operation === "or") {
        requestBody.alternativeResult = altResult;
      }

      const response = await fetch(`${apiBaseUrl}/result/transform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<ResultTransformResult> = await response.json();
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
        <Label>Transform Operation</Label>
        <OperationGrid>
          <OperationButton
            active={operation === "map"}
            onClick={() => setOperation("map")}
          >
            map
          </OperationButton>
          <OperationButton
            active={operation === "mapErr"}
            onClick={() => setOperation("mapErr")}
          >
            mapErr
          </OperationButton>
          <OperationButton
            active={operation === "andThen"}
            onClick={() => setOperation("andThen")}
          >
            andThen
          </OperationButton>
          <OperationButton
            active={operation === "and"}
            onClick={() => setOperation("and")}
          >
            and
          </OperationButton>
          <OperationButton
            active={operation === "or"}
            onClick={() => setOperation("or")}
          >
            or
          </OperationButton>
        </OperationGrid>
      </FormGroup>

      {(operation === "map" || operation === "andThen") && (
        <FormGroup>
          <Label htmlFor="map-fn-input">Mapping Function</Label>
          <TextArea
            id="map-fn-input"
            value={mapFn}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setMapFn(e.target.value)
            }
            placeholder="value => value * 2"
          />
          <SmallText>
            {operation === "map"
              ? "Function to transform the Ok value"
              : "Function that returns a new Result"}
          </SmallText>
        </FormGroup>
      )}

      {operation === "mapErr" && (
        <FormGroup>
          <Label htmlFor="error-map-fn-input">Error Mapping Function</Label>
          <TextArea
            id="error-map-fn-input"
            value={errorMapFn}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setErrorMapFn(e.target.value)
            }
            placeholder="error => new Error('Mapped: ' + error.message)"
          />
          <SmallText>Function to transform the error value</SmallText>
        </FormGroup>
      )}

      {(operation === "and" || operation === "or") && (
        <FormGroup>
          <Label htmlFor="alt-result-input">Alternative Result</Label>
          <Input
            id="alt-result-input"
            type="text"
            value={alternativeResult}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAlternativeResult(e.target.value)
            }
            placeholder="Ok(100) or Err('alternative error')"
          />
          <SmallText>
            {operation === "and"
              ? "Returns this Result if the original is Ok, otherwise returns the original Err"
              : "Returns the original Result if it's Ok, otherwise returns this Result"}
          </SmallText>
        </FormGroup>
      )}

      <PrimaryButton onClick={handleSubmit}>Transform Result</PrimaryButton>
    </>
  );
};

export default ResultTransform;
