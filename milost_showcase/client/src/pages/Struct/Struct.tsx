import { useState, ChangeEvent } from "react";
import {
  StructOperationCategory,
  StructMapOperation,
  StructFilterOperation,
  StructOperationResult,
  isStructAnalysisResult,
  isStructGetResult,
  isStructSetResult,
  isStructKeysResult,
  isStructEntriesResult,
  isStructMapResult,
  isStructFilterResult,
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
  InputRow,
  InputColumn,
  Select,
} from "./Struct.styles";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function StructPage() {
  const [inputValue, setInputValue] = useState(
    '{\n  "name": "John",\n  "age": 30,\n  "city": "New York",\n  "isActive": true\n}'
  );
  const [structFields, setStructFields] = useState<Record<string, any>>({});
  const [key, setKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [parameterValue, setParameterValue] = useState<string>("");

  const [activeCategory, setActiveCategory] =
    useState<StructOperationCategory>("analyze");
  const [mapOperation, setMapOperation] =
    useState<StructMapOperation>("double");
  const [filterOperation, setFilterOperation] =
    useState<StructFilterOperation>("greaterThan");

  const [result, setResult] = useState<StructOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleAnalyzeStruct = async (): Promise<void> => {
    try {
      if (!inputValue) {
        setError("Please enter a struct value");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/struct/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isStructAnalysisResult(data.data)) {
          setStructFields(data.data.parsed);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze struct");
    } finally {
      setLoading(false);
    }
  };

  const handleGetValue = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      if (!key) {
        setError("Please enter a key");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/struct/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
          key,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get value");
    } finally {
      setLoading(false);
    }
  };

  const handleSetValue = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      if (!key) {
        setError("Please enter a key");
        return;
      }

      if (newValue === "") {
        setError("Please enter a value");
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

      const response = await fetch(`${apiBaseUrl}/struct/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
          key,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isStructSetResult(data.data)) {
          setStructFields(data.data.result);
          setInputValue(JSON.stringify(data.data.result, null, 2));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set value");
    } finally {
      setLoading(false);
    }
  };

  const handleGetKeys = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/struct/keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get keys");
    } finally {
      setLoading(false);
    }
  };

  const handleGetEntries = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/struct/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get entries");
    } finally {
      setLoading(false);
    }
  };

  const handleMapStruct = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/struct/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
          operation: mapOperation,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isStructMapResult(data.data)) {
          setStructFields(data.data.result);
          setInputValue(JSON.stringify(data.data.result, null, 2));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to map struct");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStruct = async (): Promise<void> => {
    try {
      if (Object.keys(structFields).length === 0) {
        setError("Please analyze a struct first");
        return;
      }

      if (
        (filterOperation === "greaterThan" ||
          filterOperation === "lessThan" ||
          filterOperation === "equals" ||
          filterOperation === "contains" ||
          filterOperation === "startsWith" ||
          filterOperation === "endsWith") &&
        parameterValue === ""
      ) {
        setError("Parameter value is required for this operation");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedParameter: any = parameterValue;
      try {
        if (
          filterOperation === "greaterThan" ||
          filterOperation === "lessThan"
        ) {
          parsedParameter = Number(parameterValue);
          if (isNaN(parsedParameter)) {
            setError("Parameter must be a number for this operation");
            setLoading(false);
            return;
          }
        } else if (filterOperation === "equals") {
          if (parameterValue.toLowerCase() === "true") parsedParameter = true;
          else if (parameterValue.toLowerCase() === "false")
            parsedParameter = false;
          else if (parameterValue.toLowerCase() === "null")
            parsedParameter = null;
          else if (!isNaN(Number(parameterValue)))
            parsedParameter = Number(parameterValue);
        }
      } catch (err) {
        console.error("Failed to parse parameter value", err);
      }

      const response = await fetch(`${apiBaseUrl}/struct/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: structFields,
          operation: filterOperation,
          parameter: parsedParameter,
        }),
      });

      const data: ApiResponse<StructOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if (isStructFilterResult(data.data)) {
          setStructFields(data.data.result);
          setInputValue(JSON.stringify(data.data.result, null, 2));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter struct");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "analyze":
        handleAnalyzeStruct();
        break;
      case "get":
        handleGetValue();
        break;
      case "set":
        handleSetValue();
        break;
      case "keys":
        handleGetKeys();
        break;
      case "entries":
        handleGetEntries();
        break;
      case "map":
        handleMapStruct();
        break;
      case "filter":
        handleFilterStruct();
        break;
    }
  };

  const renderInputForm = () => {
    switch (activeCategory) {
      case "analyze":
        return (
          <FormGroup>
            <Label htmlFor="struct-input">Enter a JSON object</Label>
            <Textarea
              id="struct-input"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInputValue(e.target.value)
              }
              placeholder='{ "key": "value" }'
            />
            <SmallText>
              Enter a valid JSON object to create a Struct. Example: {"{"}
              "name": "John", "age": 30, "active": true{"}"}
            </SmallText>
          </FormGroup>
        );
      case "get":
        return (
          <>
            <FormGroup>
              <Label htmlFor="struct-display">Current struct</Label>
              <Textarea
                id="struct-display"
                value={JSON.stringify(structFields, null, 2)}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="key-input">Key to get</Label>
              <Input
                id="key-input"
                type="text"
                value={key}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setKey(e.target.value)
                }
                placeholder="Enter key"
              />
            </FormGroup>
          </>
        );
      case "set":
        return (
          <>
            <FormGroup>
              <Label htmlFor="struct-display">Current struct</Label>
              <Textarea
                id="struct-display"
                value={JSON.stringify(structFields, null, 2)}
                readOnly
              />
            </FormGroup>
            <InputRow>
              <InputColumn>
                <Label htmlFor="key-input">Key</Label>
                <Input
                  id="key-input"
                  type="text"
                  value={key}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKey(e.target.value)
                  }
                  placeholder="Enter key"
                />
              </InputColumn>
              <InputColumn>
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
              </InputColumn>
            </InputRow>
            <SmallText>
              For strings, just type the text. For numbers, booleans, or null,
              type the value directly (e.g., true, 42, null).
            </SmallText>
          </>
        );
      case "keys":
      case "entries":
        return (
          <FormGroup>
            <Label htmlFor="struct-display">Current struct</Label>
            <Textarea
              id="struct-display"
              value={JSON.stringify(structFields, null, 2)}
              readOnly
            />
          </FormGroup>
        );
      case "map":
        return (
          <>
            <FormGroup>
              <Label htmlFor="struct-display">Current struct</Label>
              <Textarea
                id="struct-display"
                value={JSON.stringify(structFields, null, 2)}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="map-operation">Map operation</Label>
              <Select
                id="map-operation"
                value={mapOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setMapOperation(e.target.value as StructMapOperation)
                }
              >
                <option value="double">Double numbers</option>
                <option value="square">Square numbers</option>
                <option value="toString">Convert all to strings</option>
                <option value="increment">Increment numbers</option>
                <option value="uppercase">Uppercase strings</option>
                <option value="lowercase">Lowercase strings</option>
              </Select>
              <SmallText>
                Operations only affect applicable values (e.g., "double" only
                affects numbers).
              </SmallText>
            </FormGroup>
          </>
        );
      case "filter":
        return (
          <>
            <FormGroup>
              <Label htmlFor="struct-display">Current struct</Label>
              <Textarea
                id="struct-display"
                value={JSON.stringify(structFields, null, 2)}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="filter-operation">Filter operation</Label>
              <Select
                id="filter-operation"
                value={filterOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilterOperation(e.target.value as StructFilterOperation)
                }
              >
                <option value="greaterThan">Greater than (numbers)</option>
                <option value="lessThan">Less than (numbers)</option>
                <option value="equals">Equals (any type)</option>
                <option value="contains">Contains (strings)</option>
                <option value="startsWith">Starts with (strings)</option>
                <option value="endsWith">Ends with (strings)</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="parameter-input">Parameter value</Label>
              <Input
                id="parameter-input"
                type="text"
                value={parameterValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setParameterValue(e.target.value)
                }
                placeholder="Enter parameter value"
              />
              <SmallText>
                For numerical operations, enter a number. For string operations,
                enter the text to search for.
              </SmallText>
            </FormGroup>
          </>
        );
      default:
        return <div>Please select an operation</div>;
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (isStructAnalysisResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              parsed: result.parsed,
              keys: result.keys,
              isEmpty: result.isEmpty,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isStructGetResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              key: result.key,
              value: result.value,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isStructSetResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              key: result.key,
              value: result.value,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isStructKeysResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              keys: result.keys,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isStructEntriesResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              entries: result.entries,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isStructMapResult(result)) {
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

    if (isStructFilterResult(result)) {
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
        <Title>Struct Operations</Title>
        <Subtitle>
          MiLost provides high-performance struct operations powered by Rust and
          WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Struct Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "analyze"}
            onClick={() => setActiveCategory("analyze")}
          >
            Analyze
          </Tab>
          <Tab
            active={activeCategory === "get"}
            onClick={() => setActiveCategory("get")}
          >
            Get
          </Tab>
          <Tab
            active={activeCategory === "set"}
            onClick={() => setActiveCategory("set")}
          >
            Set
          </Tab>
          <Tab
            active={activeCategory === "keys"}
            onClick={() => setActiveCategory("keys")}
          >
            Keys
          </Tab>
          <Tab
            active={activeCategory === "entries"}
            onClick={() => setActiveCategory("entries")}
          >
            Entries
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
        <CardTitle>Struct API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Struct } from "milost";

// Create a struct
const person = Struct.from({
  name: "John Doe",
  age: 30,
  city: "New York",
  isActive: true
});

// Create an empty struct
const empty = Struct.empty();
console.log(empty.isEmpty());  // true

// Get a value by key
console.log(person.get("name"));        // "John Doe"
console.log(person.get("age"));         // 30

// Set a value (returns a new Struct, original is unchanged)
const updatedPerson = person.set("age", 31);
console.log(updatedPerson.get("age"));  // 31
console.log(person.get("age"));         // 30 (original unchanged)

// Get all keys
const keys = person.keys();
console.log(keys.toArray());            // ["name", "age", "city", "isActive"]

// Get all entries
const entries = person.entries();
console.log(entries.toArray());         // [["name", "John Doe"], ["age", 30], ...]

// Convert to object
const obj = person.toObject();
console.log(obj);                       // {name: "John Doe", age: 30, ...}

// Map values
const mapped = person.map((value, key) => {
  if (typeof value === "number") return value * 2;
  if (typeof value === "string") return value.toUpperCase();
  return value;
});
console.log(mapped.get("name"));        // "JOHN DOE"
console.log(mapped.get("age"));         // 60

// Filter values
const numerics = person.filter((value, key) => 
  typeof value === "number"
);
console.log(numerics.keys().toArray()); // ["age"]

// Iterate over entries
person.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});

// String representation
console.log(person.toString());         // [Struct {"name":"John Doe","age":30,...}]`}
          </Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Struct class provides a type-safe, immutable struct
          implementation with WASM acceleration when available. All operations
          return new struct instances instead of modifying the original, making
          it perfect for state management and data transformation.
        </SmallText>
      </Card>
    </Container>
  );
}

export default StructPage;
