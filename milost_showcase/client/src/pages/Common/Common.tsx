import { useState, ChangeEvent } from "react";
import {
  CommonOperationCategory,
  TypeCheckType,
  OptionOperation,
  ResultOperation,
  LoadingState,
  BrandType,
  CommonOperationResult,
  isTypeCheckResult,
  isConversionResult,
  isLoadingStateResult,
  isBrandTypeResult,
  isOptionResult,
  isResultResult,
} from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Textarea,
  PrimaryButton,
  ErrorMessage,
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
  CodeBlock,
  SmallText,
  TabsContainer,
  Tab,
  Select,
  InfoBox,
  Table,
  Badge,
} from "./Common.styles";
import CommonExamples from "./CommonExamples";
import CommonInputForm from "./CommonInputForm";
import CommonResultDisplay from "./CommonResultDisplay";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function CommonPage() {
  // Basic input states
  const [inputValue, setInputValue] = useState<string>("");
  const [secondValue, setSecondValue] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [arrayValues, setArrayValues] = useState<string>(
    "{[1, 2, 3, 'hello', true]}"
  );

  // Operation states
  const [activeCategory, setActiveCategory] =
    useState<CommonOperationCategory>("typeCheck");
  const [typeCheckType, setTypeCheckType] = useState<TypeCheckType>("defined");
  const [optionOperation, setOptionOperation] =
    useState<OptionOperation>("some");
  const [resultOperation, setResultOperation] = useState<ResultOperation>("ok");
  const [loadingState, setLoadingState] = useState<LoadingState>("IDLE");
  const [brandType, setBrandType] = useState<BrandType>("JSON");

  // Result states
  const [result, setResult] = useState<CommonOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const parseValue = (value: string): any => {
    try {
      if (
        (value.trim().startsWith("{") && value.trim().endsWith("}")) ||
        (value.trim().startsWith("[") && value.trim().endsWith("]"))
      ) {
        return JSON.parse(value);
      } else if (value.toLowerCase() === "true") {
        return true;
      } else if (value.toLowerCase() === "false") {
        return false;
      } else if (value.toLowerCase() === "null") {
        return null;
      } else if (value.toLowerCase() === "undefined") {
        return undefined;
      } else if (!isNaN(Number(value)) && value.trim() !== "") {
        return Number(value);
      }
      return value;
    } catch (err) {
      return value;
    }
  };

  const handleTypeCheck = async (): Promise<void> => {
    try {
      if (inputValue.trim() === "") {
        setError("Please enter a value to check");
        return;
      }

      setLoading(true);
      setError(null);

      const parsedValue = parseValue(inputValue);

      const response = await fetch(`${apiBaseUrl}/common/type-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: parsedValue,
          checkType: typeCheckType,
        }),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to perform type check"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToVec = async (): Promise<void> => {
    try {
      if (arrayValues.trim() === "") {
        setError("Please enter array values to convert");
        return;
      }

      setLoading(true);
      setError(null);

      // Parse the array values
      let values: any[] = [];
      try {
        if (
          arrayValues.trim().startsWith("[") &&
          arrayValues.trim().endsWith("]")
        ) {
          values = JSON.parse(arrayValues);
        } else {
          values = arrayValues.split(",").map((val) => parseValue(val.trim()));
        }
      } catch (err) {
        setError(
          `Invalid array format: ${err instanceof Error ? err.message : String(err)}`
        );
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/common/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert to Vec");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadingStates = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/common/loading-states`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: loadingState,
        }),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get loading states"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBrandTypes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/common/brand-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: brandType,
        }),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get brand types"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptionOperation = async (): Promise<void> => {
    try {
      if (optionOperation !== "none" && inputValue.trim() === "") {
        setError("Please enter a value for the option");
        return;
      }

      setLoading(true);
      setError(null);

      const parsedValue = parseValue(inputValue);

      const requestBody: any = {
        value: parsedValue,
        operation: optionOperation,
      };

      if (optionOperation === "unwrapOr") {
        requestBody.defaultValue = parseValue(defaultValue);
      }

      const response = await fetch(`${apiBaseUrl}/common/option`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to perform option operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResultOperation = async (): Promise<void> => {
    try {
      if (
        (resultOperation === "ok" ||
          resultOperation === "unwrap" ||
          resultOperation === "unwrapOr" ||
          resultOperation === "isOk" ||
          resultOperation === "isErr") &&
        inputValue.trim() === ""
      ) {
        setError("Please enter a value for the result");
        return;
      }

      if (
        (resultOperation === "err" || resultOperation === "unwrapErr") &&
        secondValue.trim() === ""
      ) {
        setError("Please enter an error value for the result");
        return;
      }

      setLoading(true);
      setError(null);

      const parsedValue = parseValue(inputValue);
      const parsedErrorValue = parseValue(secondValue);

      const requestBody: any = {
        value: parsedValue,
        errorValue: parsedErrorValue,
        operation: resultOperation,
      };

      if (resultOperation === "unwrapOr") {
        requestBody.defaultValue = parseValue(defaultValue);
      }

      const response = await fetch(`${apiBaseUrl}/common/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<CommonOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to perform result operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "typeCheck":
        handleTypeCheck();
        break;
      case "convertToVec":
        handleConvertToVec();
        break;
      case "loadingStates":
        handleLoadingStates();
        break;
      case "brandTypes":
        handleBrandTypes();
        break;
      case "option":
        handleOptionOperation();
        break;
      case "result":
        handleResultOperation();
        break;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Common Utilities</Title>
        <Subtitle>
          MiLost provides common utilities for type checking, option/result
          types, and more.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Common Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "typeCheck"}
            onClick={() => setActiveCategory("typeCheck")}
          >
            Type Check
          </Tab>
          <Tab
            active={activeCategory === "convertToVec"}
            onClick={() => setActiveCategory("convertToVec")}
          >
            Convert to Vec
          </Tab>
          <Tab
            active={activeCategory === "loadingStates"}
            onClick={() => setActiveCategory("loadingStates")}
          >
            Loading States
          </Tab>
          <Tab
            active={activeCategory === "brandTypes"}
            onClick={() => setActiveCategory("brandTypes")}
          >
            Brand Types
          </Tab>
          <Tab
            active={activeCategory === "option"}
            onClick={() => setActiveCategory("option")}
          >
            Option
          </Tab>
          <Tab
            active={activeCategory === "result"}
            onClick={() => setActiveCategory("result")}
          >
            Result
          </Tab>
        </TabsContainer>

        <CommonInputForm
          activeCategory={activeCategory}
          inputValue={inputValue}
          setInputValue={setInputValue}
          secondValue={secondValue}
          setSecondValue={setSecondValue}
          defaultValue={defaultValue}
          setDefaultValue={setDefaultValue}
          arrayValues={arrayValues}
          setArrayValues={setArrayValues}
          typeCheckType={typeCheckType}
          setTypeCheckType={setTypeCheckType}
          optionOperation={optionOperation}
          setOptionOperation={setOptionOperation}
          resultOperation={resultOperation}
          setResultOperation={setResultOperation}
          loadingState={loadingState}
          setLoadingState={setLoadingState}
          brandType={brandType}
          setBrandType={setBrandType}
        />

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>
              <CommonResultDisplay result={result} />
            </ResultContent>
          </ResultContainer>
        )}
      </Card>

      <CommonExamples />
    </Container>
  );
}

export default CommonPage;
