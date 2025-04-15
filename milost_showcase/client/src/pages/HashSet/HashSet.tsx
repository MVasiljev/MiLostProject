import { useState } from "react";
import {
  HashSetOperationCategory,
  HashSetMapOperation,
  HashSetOperationResult,
  HashSetFilterOperation,
  HashSetSetOperation,
} from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  PrimaryButton,
  ErrorMessage,
  TabsContainer,
  Tab,
} from "./HashSet.styles";
import HashSetAnalyze from "./HashSetAnalyze";
import HashSetContains from "./HashSetContains";
import HashSetExamples from "./HashSetExamples";
import HashSetFilter from "./HashSetFilter";
import HashSetInsert from "./HashSetInsert";
import HashSetMap from "./HashSetMap";
import HashSetRemove from "./HashSetRemove";
import HashSetResultRenderer from "./HashSetResultRenderer";
import HashSetSetOperationForm from "./HashSetSetOperation";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function HashSetPage() {
  const [inputValue, setInputValue] = useState<string>(
    "1, 2, 3, 'hello', true"
  );
  const [setArrValue, setSetArrValue] = useState<any[]>([]);

  const [valueInput, setValueInput] = useState<string>("");
  const [mapOperation, setMapOperation] =
    useState<HashSetMapOperation>("double");
  const [filterOperation, setFilterOperation] =
    useState<HashSetFilterOperation>("greaterThan");
  const [filterParameter, setFilterParameter] = useState<string>("5");

  const [secondSetInput, setSecondSetInput] =
    useState<string>("3, 4, 5, 'world'");
  const [setOperation, setSetOperation] =
    useState<HashSetSetOperation>("union");

  const [activeCategory, setActiveCategory] =
    useState<HashSetOperationCategory>("analyze");
  const [result, setResult] = useState<HashSetOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashSetOperation, setHashSetOperation] =
    useState<HashSetSetOperation>("union");

  const apiBaseUrl = "/api";

  const parseHashSetInput = (input: string): any[] => {
    if (!input.trim()) return [];

    try {
      if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
        return JSON.parse(input);
      }

      return input.split(",").map((item) => {
        const trimmed = item.trim();

        if (
          (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
          (trimmed.startsWith('"') && trimmed.endsWith('"'))
        ) {
          return trimmed.slice(1, -1);
        }

        if (trimmed.toLowerCase() === "true") return true;
        if (trimmed.toLowerCase() === "false") return false;
        if (trimmed.toLowerCase() === "null") return null;

        const num = Number(trimmed);
        if (!isNaN(num)) return num;

        return trimmed;
      });
    } catch (err) {
      throw new Error(
        `Invalid input format. Please enter values separated by commas or a valid JSON array. Error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleAnalyzeHashSet = async (): Promise<void> => {
    try {
      if (!inputValue) {
        setError("Please enter values for the HashSet");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashset/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("values" in data.data && Array.isArray(data.data.values)) {
          setSetArrValue(data.data.values);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze HashSet"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContainsCheck = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze a HashSet first");
        return;
      }

      if (valueInput === "") {
        setError("Please enter a value to check");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedValue: any = valueInput;

      if (valueInput.toLowerCase() === "true") {
        parsedValue = true;
      } else if (valueInput.toLowerCase() === "false") {
        parsedValue = false;
      } else if (valueInput.toLowerCase() === "null") {
        parsedValue = null;
      } else if (!isNaN(Number(valueInput)) && valueInput.trim() !== "") {
        parsedValue = Number(valueInput);
      } else {
        if (
          (valueInput.startsWith("'") && valueInput.endsWith("'")) ||
          (valueInput.startsWith('"') && valueInput.endsWith('"'))
        ) {
          parsedValue = valueInput.substring(1, valueInput.length - 1);
        }
      }

      const response = await fetch(`${apiBaseUrl}/hashset/contains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: setArrValue,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check HashSet");
    } finally {
      setLoading(false);
    }
  };

  const handleInsertValue = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze a HashSet first");
        return;
      }

      if (valueInput === "") {
        setError("Please enter a value to insert");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedValue: any = valueInput;

      if (valueInput.toLowerCase() === "true") {
        parsedValue = true;
      } else if (valueInput.toLowerCase() === "false") {
        parsedValue = false;
      } else if (valueInput.toLowerCase() === "null") {
        parsedValue = null;
      } else if (!isNaN(Number(valueInput)) && valueInput.trim() !== "") {
        parsedValue = Number(valueInput);
      } else {
        if (
          (valueInput.startsWith("'") && valueInput.endsWith("'")) ||
          (valueInput.startsWith('"') && valueInput.endsWith('"'))
        ) {
          parsedValue = valueInput.substring(1, valueInput.length - 1);
        }
      }

      const response = await fetch(`${apiBaseUrl}/hashset/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: setArrValue,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setSetArrValue(data.data.result);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to insert value");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveValue = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze a HashSet first");
        return;
      }

      if (valueInput === "") {
        setError("Please enter a value to remove");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedValue: any = valueInput;

      if (valueInput.toLowerCase() === "true") {
        parsedValue = true;
      } else if (valueInput.toLowerCase() === "false") {
        parsedValue = false;
      } else if (valueInput.toLowerCase() === "null") {
        parsedValue = null;
      } else if (!isNaN(Number(valueInput)) && valueInput.trim() !== "") {
        parsedValue = Number(valueInput);
      } else {
        if (
          (valueInput.startsWith("'") && valueInput.endsWith("'")) ||
          (valueInput.startsWith('"') && valueInput.endsWith('"'))
        ) {
          parsedValue = valueInput.substring(1, valueInput.length - 1);
        }
      }

      const response = await fetch(`${apiBaseUrl}/hashset/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: setArrValue,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setSetArrValue(data.data.result);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove value");
    } finally {
      setLoading(false);
    }
  };

  const handleMapOperation = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze a HashSet first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashset/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: setArrValue,
          operation: mapOperation,
        }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setSetArrValue(data.data.result);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to map HashSet");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterOperation = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze a HashSet first");
        return;
      }

      if (
        (filterOperation === "greaterThan" ||
          filterOperation === "lessThan" ||
          filterOperation === "equals" ||
          filterOperation === "contains" ||
          filterOperation === "startsWith" ||
          filterOperation === "endsWith") &&
        filterParameter === ""
      ) {
        setError("Please enter a parameter for the filter operation");
        return;
      }

      setLoading(true);
      setError(null);

      let parsedParameter: any = filterParameter;
      try {
        if (
          filterOperation === "greaterThan" ||
          filterOperation === "lessThan"
        ) {
          parsedParameter = Number(filterParameter);
          if (isNaN(parsedParameter)) {
            setError("Parameter must be a number for this operation");
            setLoading(false);
            return;
          }
        } else if (filterOperation === "equals") {
          if (filterParameter.toLowerCase() === "true") parsedParameter = true;
          else if (filterParameter.toLowerCase() === "false")
            parsedParameter = false;
          else if (filterParameter.toLowerCase() === "null")
            parsedParameter = null;
          else if (
            !isNaN(Number(filterParameter)) &&
            filterParameter.trim() !== ""
          )
            parsedParameter = Number(filterParameter);
        }
      } catch (err) {
        console.error("Failed to parse parameter", err);
      }

      const response = await fetch(`${apiBaseUrl}/hashset/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: setArrValue,
          operation: filterOperation,
          parameter: parsedParameter,
        }),
      });

      const data: ApiResponse<HashSetOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setSetArrValue(data.data.result);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter HashSet");
    } finally {
      setLoading(false);
    }
  };

  const handleSetOperation = async (): Promise<void> => {
    try {
      if (setArrValue.length === 0) {
        setError("Please analyze the first HashSet");
        return;
      }

      if (secondSetInput === "") {
        setError("Please enter values for the second HashSet");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const parsedSecondSet = parseHashSetInput(secondSetInput);

        const response = await fetch(`${apiBaseUrl}/hashset/set-operation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstSet: setArrValue,
            secondSet: parsedSecondSet,
            operation: setOperation,
          }),
        });

        const data: ApiResponse<HashSetOperationResult> = await response.json();

        if (response.ok && data.data) {
          setResult(data.data);
          if ("result" in data.data && Array.isArray(data.data.result)) {
            setSetArrValue(data.data.result);
          }
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to parse second HashSet values"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to perform set operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "analyze":
        handleAnalyzeHashSet();
        break;
      case "contains":
        handleContainsCheck();
        break;
      case "insert":
        handleInsertValue();
        break;
      case "remove":
        handleRemoveValue();
        break;
      case "map":
        handleMapOperation();
        break;
      case "filter":
        handleFilterOperation();
        break;
      case "setOperation":
        handleSetOperation();
        break;
    }
  };

  const renderActiveComponent = () => {
    switch (activeCategory) {
      case "analyze":
        break;
      case "contains":
        return (
          <HashSetContains
            setValue={setArrValue}
            valueInput={valueInput}
            setValueInput={setValueInput}
          />
        );
      case "insert":
        return (
          <HashSetInsert
            setValue={setArrValue}
            valueInput={valueInput}
            setValueInput={setValueInput}
          />
        );
      case "remove":
        return (
          <HashSetRemove
            setValue={setArrValue}
            valueInput={valueInput}
            setValueInput={setValueInput}
          />
        );
      case "map":
        return (
          <HashSetMap
            setValue={setArrValue}
            mapOperation={mapOperation}
            setMapOperation={setMapOperation}
          />
        );
      case "filter":
        return (
          <HashSetFilter
            setValue={setArrValue}
            filterOperation={filterOperation}
            setFilterOperation={setFilterOperation}
            filterParameter={filterParameter}
            setFilterParameter={setFilterParameter}
          />
        );
      case "setOperation":
        return (
          <HashSetSetOperationForm
            setValue={setArrValue}
            secondSetInput={secondSetInput}
            setSecondSetInput={setSecondSetInput}
            setOperation={setOperation}
            setSetOperation={setSetOperation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>HashSet Operations</Title>
        <Subtitle>
          MiLost provides high-performance HashSet implementation powered by
          Rust and WASM
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>HashSet Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "analyze"}
            onClick={() => setActiveCategory("analyze")}
          >
            Analyze
          </Tab>
          <Tab
            active={activeCategory === "contains"}
            onClick={() => setActiveCategory("contains")}
          >
            Contains
          </Tab>
          <Tab
            active={activeCategory === "insert"}
            onClick={() => setActiveCategory("insert")}
          >
            Insert
          </Tab>
          <Tab
            active={activeCategory === "remove"}
            onClick={() => setActiveCategory("remove")}
          >
            Remove
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
            active={activeCategory === "setOperation"}
            onClick={() => setActiveCategory("setOperation")}
          >
            Set Operations
          </Tab>
        </TabsContainer>

        {renderActiveComponent()}

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <HashSetResultRenderer result={result} />
      </Card>

      <HashSetExamples />
    </Container>
  );
}

export default HashSetPage;
