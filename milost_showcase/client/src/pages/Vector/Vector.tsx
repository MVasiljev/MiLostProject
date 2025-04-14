import { useState, ChangeEvent, JSX } from "react";

import {
  VectorOperationCategory,
  VectorBasicOperation,
  VectorMapOperation,
  VectorFilterOperation,
  VectorReduceOperation,
  VectorTakeDropOperation,
  VectorCheckOperation,
  VectorOperationResult,
  isVectorAnalysisResult,
  isVectorBasicOperationResult,
  isVectorMapOperationResult,
  isVectorFilterOperationResult,
  isVectorReduceOperationResult,
  isVectorTakeDropOperationResult,
  isVectorCheckOperationResult,
} from "./types";
import {
  FormGroup,
  Label,
  Input,
  OperationGrid,
  OperationButton,
  NumberInput,
  Pre,
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
  CodeBlock,
  SmallText,
} from "./Vector.styles";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function Vectors() {
  const [inputValues, setInputValues] = useState<string>("");

  const [parameter, setParameter] = useState<number>(0);
  const [initialValue, setInitialValue] = useState<number>(0);
  const [count, setCount] = useState<number>(1);

  const [activeCategory, setActiveCategory] =
    useState<VectorOperationCategory>("analyze");
  const [basicOperation, setBasicOperation] =
    useState<VectorBasicOperation>("reverse");
  const [mapOperation, setMapOperation] =
    useState<VectorMapOperation>("double");
  const [filterOperation, setFilterOperation] =
    useState<VectorFilterOperation>("greaterThan");
  const [reduceOperation, setReduceOperation] =
    useState<VectorReduceOperation>("sum");
  const [takeDropOperation, setTakeDropOperation] =
    useState<VectorTakeDropOperation>("take");
  const [checkOperation, setCheckOperation] =
    useState<VectorCheckOperation>("all");

  const [result, setResult] = useState<VectorOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const parseVectorInput = (input: string): number[] => {
    if (!input.trim()) return [];

    try {
      if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
        return JSON.parse(input);
      }

      return input
        .split(",")
        .map((val) => val.trim())
        .filter((val) => val !== "")
        .map((val) => {
          const num = Number(val);
          if (isNaN(num)) throw new Error(`Not a number: ${val}`);
          return num;
        });
    } catch (err) {
      throw new Error(
        `Invalid input format. Please enter numbers separated by commas or a valid JSON array. Error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleAnalyzeVector = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse input values"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBasicOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: basicOperation,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMapOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: mapOperation,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process map operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: filterOperation,
          parameter,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process filter operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReduceOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/reduce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: reduceOperation,
          initialValue,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process reduce operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTakeDropOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/takedrop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: takeDropOperation,
          count,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process take/drop operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOperation = async (): Promise<void> => {
    try {
      const values = parseVectorInput(inputValues);

      if (values.length === 0) {
        setError("Please enter vector values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/vector/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: checkOperation,
          parameter,
        }),
      });

      const data: ApiResponse<VectorOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process check operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "analyze":
        handleAnalyzeVector();
        break;
      case "basic":
        handleBasicOperation();
        break;
      case "map":
        handleMapOperation();
        break;
      case "filter":
        handleFilterOperation();
        break;
      case "reduce":
        handleReduceOperation();
        break;
      case "takeAndDrop":
        handleTakeDropOperation();
        break;
      case "check":
        handleCheckOperation();
        break;
    }
  };

  const renderInputForm = (): JSX.Element | null => {
    const vectorInput = (
      <FormGroup>
        <Label htmlFor="vector-input">
          Enter vector values (comma-separated numbers)
        </Label>
        <Input
          id="vector-input"
          type="text"
          value={inputValues}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValues(e.target.value)
          }
          placeholder="1, 2, 3, 4, 5"
        />
      </FormGroup>
    );

    switch (activeCategory) {
      case "analyze":
        return vectorInput;

      case "basic":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={basicOperation === "reverse"}
                onClick={() => setBasicOperation("reverse")}
              >
                Reverse
              </OperationButton>
            </OperationGrid>
          </>
        );

      case "map":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={mapOperation === "double"}
                onClick={() => setMapOperation("double")}
              >
                Double
              </OperationButton>
              <OperationButton
                active={mapOperation === "square"}
                onClick={() => setMapOperation("square")}
              >
                Square
              </OperationButton>
              <OperationButton
                active={mapOperation === "add1"}
                onClick={() => setMapOperation("add1")}
              >
                Add 1
              </OperationButton>
              <OperationButton
                active={mapOperation === "negate"}
                onClick={() => setMapOperation("negate")}
              >
                Negate
              </OperationButton>
              <OperationButton
                active={mapOperation === "toString"}
                onClick={() => setMapOperation("toString")}
              >
                To String
              </OperationButton>
            </OperationGrid>
          </>
        );

      case "filter":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={filterOperation === "greaterThan"}
                onClick={() => setFilterOperation("greaterThan")}
              >
                Greater Than
              </OperationButton>
              <OperationButton
                active={filterOperation === "lessThan"}
                onClick={() => setFilterOperation("lessThan")}
              >
                Less Than
              </OperationButton>
              <OperationButton
                active={filterOperation === "equals"}
                onClick={() => setFilterOperation("equals")}
              >
                Equals
              </OperationButton>
              <OperationButton
                active={filterOperation === "even"}
                onClick={() => setFilterOperation("even")}
              >
                Even Numbers
              </OperationButton>
              <OperationButton
                active={filterOperation === "odd"}
                onClick={() => setFilterOperation("odd")}
              >
                Odd Numbers
              </OperationButton>
            </OperationGrid>

            {(filterOperation === "greaterThan" ||
              filterOperation === "lessThan" ||
              filterOperation === "equals") && (
              <FormGroup>
                <Label htmlFor="param-input">Parameter Value</Label>
                <NumberInput
                  id="param-input"
                  type="number"
                  value={parameter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setParameter(Number(e.target.value))
                  }
                />
              </FormGroup>
            )}
          </>
        );

      case "reduce":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={reduceOperation === "sum"}
                onClick={() => setReduceOperation("sum")}
              >
                Sum
              </OperationButton>
              <OperationButton
                active={reduceOperation === "product"}
                onClick={() => setReduceOperation("product")}
              >
                Product
              </OperationButton>
              <OperationButton
                active={reduceOperation === "min"}
                onClick={() => setReduceOperation("min")}
              >
                Minimum
              </OperationButton>
              <OperationButton
                active={reduceOperation === "max"}
                onClick={() => setReduceOperation("max")}
              >
                Maximum
              </OperationButton>
              <OperationButton
                active={reduceOperation === "average"}
                onClick={() => setReduceOperation("average")}
              >
                Average
              </OperationButton>
            </OperationGrid>

            {(reduceOperation === "sum" || reduceOperation === "product") && (
              <FormGroup>
                <Label htmlFor="initial-input">Initial Value</Label>
                <NumberInput
                  id="initial-input"
                  type="number"
                  value={initialValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInitialValue(Number(e.target.value))
                  }
                />
              </FormGroup>
            )}
          </>
        );

      case "takeAndDrop":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={takeDropOperation === "take"}
                onClick={() => setTakeDropOperation("take")}
              >
                Take
              </OperationButton>
              <OperationButton
                active={takeDropOperation === "drop"}
                onClick={() => setTakeDropOperation("drop")}
              >
                Drop
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="count-input">Count</Label>
              <NumberInput
                id="count-input"
                type="number"
                min="0"
                value={count}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCount(Math.max(0, Number(e.target.value)))
                }
              />
            </FormGroup>
          </>
        );

      case "check":
        return (
          <>
            {vectorInput}
            <OperationGrid>
              <OperationButton
                active={checkOperation === "all"}
                onClick={() => setCheckOperation("all")}
              >
                All Elements
              </OperationButton>
              <OperationButton
                active={checkOperation === "any"}
                onClick={() => setCheckOperation("any")}
              >
                Any Element
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="param-input">
                Check if {checkOperation === "all" ? "all" : "any"} values are
                greater than:
              </Label>
              <NumberInput
                id="param-input"
                type="number"
                value={parameter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setParameter(Number(e.target.value))
                }
              />
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  const renderResult = (): JSX.Element | null => {
    if (!result) return null;

    if (isVectorAnalysisResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              length: result.length,
              isEmpty: result.isEmpty,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isVectorBasicOperationResult(result)) {
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

    if (isVectorMapOperationResult(result)) {
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

    if (isVectorFilterOperationResult(result)) {
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

    if (isVectorReduceOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              initialValue: result.initialValue,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isVectorTakeDropOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              count: result.count,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isVectorCheckOperationResult(result)) {
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

  return (
    <Container>
      <Header>
        <Title>Vector Operations</Title>
        <Subtitle>
          MiLost provides high-performance vector operations powered by Rust and
          WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Vector Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "analyze"}
            onClick={() => setActiveCategory("analyze")}
          >
            Analyze
          </Tab>
          <Tab
            active={activeCategory === "basic"}
            onClick={() => setActiveCategory("basic")}
          >
            Basic
          </Tab>
          <Tab
            active={activeCategory === "map"}
            onClick={() => setActiveCategory("map")}
          >
            Map
          </Tab>
          <Tab
            active={activeCategory === "filter"}
            onClick={() => setActiveCategory("filter")}
          >
            Filter
          </Tab>
          <Tab
            active={activeCategory === "reduce"}
            onClick={() => setActiveCategory("reduce")}
          >
            Reduce
          </Tab>
          <Tab
            active={activeCategory === "takeAndDrop"}
            onClick={() => setActiveCategory("takeAndDrop")}
          >
            Take/Drop
          </Tab>
          <Tab
            active={activeCategory === "check"}
            onClick={() => setActiveCategory("check")}
          >
            Check All/Any
          </Tab>
        </TabsContainer>

        {renderInputForm()}

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>{renderResult()}</ResultContent>
          </ResultContainer>
        )}
      </Card>

      <Card>
        <CardTitle>Vector API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Vec } from "milost";

// Create a vector
const numbers = Vec.from([1, 2, 3, 4, 5]);

// Basic properties
console.log(numbers.len());        // 5
console.log(numbers.isEmpty());    // false

// Basic operations
const reversed = numbers.reverse();
console.log(reversed.toArray());   // [5, 4, 3, 2, 1]

// Map operations
const doubled = numbers.map((n) => n * 2);
console.log(doubled.toArray());    // [2, 4, 6, 8, 10]

// Filter operations
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens.toArray());      // [2, 4]

// Fold/reduce operations
const sum = numbers.fold(0, (acc, n) => acc + n);
console.log(sum);                  // 15

// Take and drop
const firstThree = numbers.take(3);
console.log(firstThree.toArray()); // [1, 2, 3]

const withoutFirstTwo = numbers.drop(2);
console.log(withoutFirstTwo.toArray()); // [3, 4, 5]

// Check operations
const allPositive = numbers.all((n) => n > 0);
console.log(allPositive);          // true

const anyGreaterThanFour = numbers.any((n) => n > 4);
console.log(anyGreaterThanFour);   // true

// Create new vector with additional element
const withSix = numbers.push(6);
console.log(withSix.toArray());    // [1, 2, 3, 4, 5, 6]

// Concatenate vectors
const moreNumbers = Vec.from([6, 7, 8]);
const combined = numbers.concat(moreNumbers);
console.log(combined.toArray());   // [1, 2, 3, 4, 5, 6, 7, 8]

// Find item
const found = numbers.find((n) => n > 3);
console.log(found.unwrap());       // 4

// Get item by index
const third = numbers.get(2);
console.log(third.unwrap());       // 3`}
          </Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Vec class provides a Rust-like immutable vector
          implementation with WASM acceleration when available. All operations
          return new vector instances instead of modifying the original.
        </SmallText>
      </Card>
    </Container>
  );
}

export default Vectors;
