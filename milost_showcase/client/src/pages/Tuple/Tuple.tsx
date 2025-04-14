import { useState, ChangeEvent, JSX } from "react";
import {
  TupleOperation,
  TupleMapOperation,
  TupleOperationResult,
  isTupleAnalysisResult,
  isTupleGetResult,
  isTupleFirstResult,
  isTupleSecondResult,
  isTupleReplaceResult,
  isTupleMapResult,
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
  PrimaryButton,
  ErrorMessage,
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
  CodeBlock,
  SmallText,
} from "./Tuple.styles";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function TuplePage() {
  const [inputValue, setInputValue] = useState("1, true, 'hello'");
  const [tupleInput, setTupleInput] = useState("");
  const [index, setIndex] = useState<number>(0);
  const [newValue, setNewValue] = useState<string>("");

  const [activeOperation, setActiveOperation] = useState<
    TupleOperation | "analyze"
  >("analyze");
  const [mapOperation, setMapOperation] = useState<TupleMapOperation>("double");

  const [result, setResult] = useState<TupleOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleAnalyzeTuple = async (): Promise<void> => {
    try {
      if (!inputValue) {
        setError("Please enter tuple values");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/tuple/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isTupleAnalysisResult(data.data)) {
          setTupleInput(JSON.stringify(data.data.parsed));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze tuple");
    } finally {
      setLoading(false);
    }
  };

  const handleGetItem = async (): Promise<void> => {
    try {
      const values = parseTupleInput();

      if (!values || values.length === 0) {
        setError("Please analyze a tuple first");
        return;
      }

      if (index < 0 || index >= values.length) {
        setError(`Index must be between 0 and ${values.length - 1}`);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/tuple/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          index,
        }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get tuple item");
    } finally {
      setLoading(false);
    }
  };

  const handleGetFirst = async (): Promise<void> => {
    try {
      const values = parseTupleInput();

      if (!values || values.length === 0) {
        setError("Please analyze a tuple first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/tuple/first`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get first item");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSecond = async (): Promise<void> => {
    try {
      const values = parseTupleInput();

      if (!values || values.length < 2) {
        setError("Please analyze a tuple with at least 2 items first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/tuple/second`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get second item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async (): Promise<void> => {
    try {
      const values = parseTupleInput();

      if (!values || values.length === 0) {
        setError("Please analyze a tuple first");
        return;
      }

      if (index < 0 || index >= values.length) {
        setError(`Index must be between 0 and ${values.length - 1}`);
        return;
      }

      if (!newValue && newValue !== "") {
        setError("Please enter a new value");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedValue: any = newValue;
      try {
        if (newValue.toLowerCase() === "true") parsedValue = true;
        else if (newValue.toLowerCase() === "false") parsedValue = false;
        else if (newValue.toLowerCase() === "null") parsedValue = null;
        else if (!isNaN(Number(newValue))) parsedValue = Number(newValue);
      } catch (err) {
        console.error("Failed to parse new value", err);
      }

      const response = await fetch(`${apiBaseUrl}/tuple/replace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          index,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isTupleReplaceResult(data.data)) {
          setTupleInput(JSON.stringify(data.data.result));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to replace tuple item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMapTuple = async (): Promise<void> => {
    try {
      const values = parseTupleInput();

      if (!values || values.length === 0) {
        setError("Please analyze a tuple first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/tuple/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          operation: mapOperation,
        }),
      });

      const data: ApiResponse<TupleOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isTupleMapResult(data.data)) {
          setTupleInput(JSON.stringify(data.data.result));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to map tuple");
    } finally {
      setLoading(false);
    }
  };

  const parseTupleInput = (): any[] => {
    if (!tupleInput) return [];

    try {
      return JSON.parse(tupleInput);
    } catch (err) {
      setError("Invalid tuple format. Please analyze a tuple first.");
      return [];
    }
  };

  const handleSubmit = (): void => {
    switch (activeOperation) {
      case "analyze":
        handleAnalyzeTuple();
        break;
      case "get":
        handleGetItem();
        break;
      case "first":
        handleGetFirst();
        break;
      case "second":
        handleGetSecond();
        break;
      case "replace":
        handleReplace();
        break;
      case "map":
        handleMapTuple();
        break;
    }
  };

  const renderInputForm = (): JSX.Element => {
    switch (activeOperation) {
      case "analyze":
        return (
          <FormGroup>
            <Label htmlFor="tuple-input">
              Enter tuple values (comma-separated)
            </Label>
            <Input
              id="tuple-input"
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="e.g. 1, true, 'hello'"
            />
            <SmallText>
              Supported formats: numbers, booleans (true/false), strings ('text'
              or "text"), and null.
            </SmallText>
          </FormGroup>
        );
      case "get":
        return (
          <>
            <FormGroup>
              <Label htmlFor="tuple-display">Current tuple</Label>
              <Input
                id="tuple-display"
                type="text"
                value={tupleInput}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="index-input">Index to get</Label>
              <Input
                id="index-input"
                type="number"
                min={0}
                value={index}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIndex(parseInt(e.target.value) || 0)
                }
              />
            </FormGroup>
          </>
        );
      case "first":
      case "second":
        return (
          <FormGroup>
            <Label htmlFor="tuple-display">Current tuple</Label>
            <Input id="tuple-display" type="text" value={tupleInput} readOnly />
          </FormGroup>
        );
      case "replace":
        return (
          <>
            <FormGroup>
              <Label htmlFor="tuple-display">Current tuple</Label>
              <Input
                id="tuple-display"
                type="text"
                value={tupleInput}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="index-input">Index to replace</Label>
              <Input
                id="index-input"
                type="number"
                min={0}
                value={index}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIndex(parseInt(e.target.value) || 0)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="value-input">New value</Label>
              <Input
                id="value-input"
                type="text"
                value={newValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewValue(e.target.value)
                }
                placeholder="Enter new value"
              />
              <SmallText>
                For strings, just type the text. For numbers, booleans, or null,
                type the value directly.
              </SmallText>
            </FormGroup>
          </>
        );
      case "map":
        return (
          <>
            <FormGroup>
              <Label htmlFor="tuple-display">Current tuple</Label>
              <Input
                id="tuple-display"
                type="text"
                value={tupleInput}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="map-operation">Map operation</Label>
              <select
                id="map-operation"
                value={mapOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setMapOperation(e.target.value as TupleMapOperation)
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              >
                <option value="double">Double numbers</option>
                <option value="square">Square numbers</option>
                <option value="toString">Convert all to strings</option>
                <option value="increment">Increment numbers</option>
                <option value="decrement">Decrement numbers</option>
              </select>
              <SmallText>
                Operations only affect applicable values (e.g., "double" only
                affects numbers).
              </SmallText>
            </FormGroup>
          </>
        );
      default:
        return <div>Please select an operation</div>;
    }
  };

  const renderResult = (): JSX.Element | null => {
    if (!result) return null;

    if (isTupleAnalysisResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              parsed: result.parsed,
              length: result.length,
              types: result.types,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTupleGetResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              index: result.index,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTupleFirstResult(result) || isTupleSecondResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTupleReplaceResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              index: result.index,
              value: result.value,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTupleMapResult(result)) {
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

    return <Pre>{JSON.stringify(result, null, 2)}</Pre>;
  };

  return (
    <Container>
      <Header>
        <Title>Tuple Operations</Title>
        <Subtitle>
          MiLost provides high-performance tuple operations powered by Rust and
          WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Tuple Operations</CardTitle>

        <div style={{ marginBottom: "1.5rem" }}>
          <Label>Select Operation</Label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {[
              { id: "analyze", label: "Analyze" },
              { id: "get", label: "Get Item" },
              { id: "first", label: "Get First" },
              { id: "second", label: "Get Second" },
              { id: "replace", label: "Replace" },
              { id: "map", label: "Map" },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() =>
                  setActiveOperation(op.id as TupleOperation | "analyze")
                }
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: activeOperation === op.id ? "#0066ff" : "#f0f0f0",
                  color: activeOperation === op.id ? "white" : "#333",
                  fontWeight: activeOperation === op.id ? "bold" : "normal",
                  cursor: "pointer",
                }}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {renderInputForm()}

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Processing..."
            : `Execute ${activeOperation === "analyze" ? "Analysis" : activeOperation}`}
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
        <CardTitle>Tuple API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Tuple } from "milost";

// Create a tuple from values
const tuple = Tuple.from(1, "hello", true);

// Get tuple length
console.log(tuple.len());  // 3

// Access items by index
console.log(tuple.get(0)); // 1
console.log(tuple.get(1)); // "hello"
console.log(tuple.get(2)); // true

// Convenience methods for pairs
const pair = Tuple.pair("key", "value");
console.log(pair.first());  // "key"
console.log(pair.second()); // "value"

// Replace items (immutable - returns new tuple)
const newTuple = tuple.replace(1, "world");
console.log(newTuple.get(1)); // "world"
console.log(tuple.get(1));    // "hello" (original unchanged)

// Map operations (applies to all elements)
const mapped = tuple.map(value => {
  if (typeof value === "number") return value * 2;
  if (typeof value === "string") return value.toUpperCase();
  return value;
});
console.log(mapped.toArray()); // [2, "HELLO", true]

// Convert to array
const asArray = tuple.toArray();
console.log(asArray); // [1, "hello", true]

// String representation
console.log(tuple.toString()); // [Tuple [1,"hello",true]]`}
          </Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Tuple class provides a type-safe, immutable tuple
          implementation with WASM acceleration when available. It's perfect for
          heterogeneous collections where order and fixed length are important.
        </SmallText>
      </Card>
    </Container>
  );
}

export default TuplePage;
