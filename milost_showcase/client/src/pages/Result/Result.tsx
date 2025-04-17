import { useState, useMemo } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  TabsContainer,
  Tab,
  PrimaryButton,
  ErrorMessage,
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
  CodeBlock,
} from "./Result.styles";

import {
  ResultOperationResult,
  ResultOperationCategory,
  isResultCreateResult,
  isResultCheckResult,
  isResultUnwrapResult,
  isResultTransformResult,
  isResultMatchResult,
  isResultUtilityResult,
} from "./types";
import ResultCheck from "./ResultCheck";
import ResultCreate from "./ResultCrate";
import ResultMatch from "./ResultMatch";
import ResultTransform from "./ResultTransform";
import ResultUnwrap from "./ResultUnwrap";
import ResultUtility from "./ResultUtility";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function ResultPage() {
  const [activeCategory, setActiveCategory] =
    useState<ResultOperationCategory>("create");

  const [result, setResult] = useState<ResultOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleApiResponse = <T extends ResultOperationResult>(
    response: Response,
    data: ApiResponse<T>
  ) => {
    if (response.ok && data.data) {
      setResult(data.data);
      setError(null);
    } else {
      setError(data.error || "Something went wrong");
      setResult(null);
    }
    setLoading(false);
  };

  const handleApiError = (err: unknown) => {
    setError(err instanceof Error ? err.message : "An unknown error occurred");
    setLoading(false);
  };

  const renderResult = useMemo(() => {
    if (!result) return null;

    if (isResultCreateResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              value: result.value,
              errorValue: result.errorValue,
              operation: result.operation,
              isOk: result.isOk,
              isErr: result.isErr,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isResultCheckResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              errorType: result.errorType,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isResultUnwrapResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              defaultValue: result.defaultValue,
              errorMessage: result.errorMessage,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isResultTransformResult(result)) {
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

    if (isResultMatchResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              handlers: result.handlers,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isResultUtilityResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              argument: result.argument,
              validator: result.validator,
              results: result.results,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    return <Pre>{JSON.stringify(result, null, 2)}</Pre>;
  }, [result]);

  return (
    <Container>
      <Header>
        <Title>Result Operations</Title>
        <Subtitle>
          MiLost provides a powerful Result type for error handling, inspired by
          Rust's Result type.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Result Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "create"}
            onClick={() => setActiveCategory("create")}
          >
            Create
          </Tab>
          <Tab
            active={activeCategory === "check"}
            onClick={() => setActiveCategory("check")}
          >
            Check
          </Tab>
          <Tab
            active={activeCategory === "unwrap"}
            onClick={() => setActiveCategory("unwrap")}
          >
            Unwrap
          </Tab>
          <Tab
            active={activeCategory === "transform"}
            onClick={() => setActiveCategory("transform")}
          >
            Transform
          </Tab>
          <Tab
            active={activeCategory === "match"}
            onClick={() => setActiveCategory("match")}
          >
            Match
          </Tab>
          <Tab
            active={activeCategory === "utility"}
            onClick={() => setActiveCategory("utility")}
          >
            Utility
          </Tab>
        </TabsContainer>

        {activeCategory === "create" && (
          <ResultCreate
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {activeCategory === "check" && (
          <ResultCheck
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {activeCategory === "unwrap" && (
          <ResultUnwrap
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {activeCategory === "transform" && (
          <ResultTransform
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {activeCategory === "match" && (
          <ResultMatch
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {activeCategory === "utility" && (
          <ResultUtility
            apiBaseUrl={apiBaseUrl}
            setLoading={setLoading}
            setError={setError}
            handleApiResponse={handleApiResponse}
            handleApiError={handleApiError}
          />
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>{renderResult}</ResultContent>
          </ResultContainer>
        )}
      </Card>

      <Card>
        <CardTitle>Result API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Result, Ok, Err, AppError } from "milost";

// Create a Result
const okResult = Result.Ok(42);
const errResult = Result.Err(new AppError("Something went wrong"));

// Check the state
console.log(okResult.isOk());  // true
console.log(errResult.isErr()); // true

// Unwrapping
try {
  const value = okResult.unwrap();  // 42
  console.log(value);
  
  const error = errResult.unwrapErr();  // AppError
  console.log(error.message);  // "Something went wrong"
  
  // This would throw an error:
  // errResult.unwrap(); 
  
  // Safe alternatives:
  const safeValue = errResult.unwrapOr(0);  // 0
  console.log(safeValue);
} catch (error) {
  console.error("Error unwrapping:", error);
}

// Transformations
const mapped = okResult.map(value => value * 2);
console.log(mapped.unwrap());  // 84

const flatMapped = okResult.andThen(value => 
  value > 0 ? Ok(value * 3) : Err(new AppError("Non-positive value"))
);
console.log(flatMapped.unwrap());  // 126

// Pattern matching
const message = okResult.match(
  value => \`Success! Value: \${value}\`,
  error => \`Error: \${error.message}\`
);
console.log(message);  // "Success! Value: 42"

// Utility functions
const validatedResult = Result.fromValidation(
  42,
  value => value > 0,
  "Value must be positive"
);
console.log(validatedResult.isOk());  // true

function divideBy(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// Try-catch wrapper
const safeResult = Result.tryCatch(() => divideBy(10, 2));
console.log(safeResult.unwrap());  // 5

// Try-catch with error
const errorResult = Result.tryCatch(() => divideBy(10, 0));
console.log(errorResult.isErr());  // true
`}
          </Pre>
        </CodeBlock>
      </Card>
    </Container>
  );
}

export default ResultPage;
