import { useState } from "react";
import {
  HashMapOperationCategory,
  HashMapMapOperation,
  HashMapFilterOperation,
  HashMapOperationResult,
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
  ResultContainer,
  ResultTitle,
  ResultContent,
} from "./HashMap.styles";
import HashMapApiExamples from "./HashMapApiExamples";
import HashMapInputForm from "./HashMapInputForm";
import HashMapResultDisplay from "./HashMapResultDisplay";
import HashMapTabs from "./HashMapTabs";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function HashMapPage() {
  const [inputValue, setInputValue] = useState(
    '{\n  "name": "John",\n  "age": 30,\n  "city": "New York",\n  "isActive": true\n}'
  );
  const [hashMapEntries, setHashMapEntries] = useState<Array<[string, any]>>(
    []
  );
  const [key, setKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [parameterValue, setParameterValue] = useState<string>("");

  const [activeCategory, setActiveCategory] =
    useState<HashMapOperationCategory>("analyze");
  const [mapOperation, setMapOperation] =
    useState<HashMapMapOperation>("double");
  const [filterOperation, setFilterOperation] =
    useState<HashMapFilterOperation>("greaterThan");

  const [result, setResult] = useState<HashMapOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleAnalyzeHashMap = async (): Promise<void> => {
    try {
      if (!inputValue) {
        setError("Please enter a hash map value");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("parsed" in data.data && Array.isArray(data.data.parsed)) {
          setHashMapEntries(data.data.parsed);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze hash map"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetValue = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      if (!key) {
        setError("Please enter a key");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          key,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

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

  const handleContainsKey = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      if (!key) {
        setError("Please enter a key");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/contains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          key,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check key");
    } finally {
      setLoading(false);
    }
  };

  const handleSetValue = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
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

      const response = await fetch(`${apiBaseUrl}/hashmap/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          key,
          value: parsedValue,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setHashMapEntries(data.data.result);
          setInputValue(
            JSON.stringify(Object.fromEntries(data.data.result), null, 2)
          );
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

  const handleRemoveKey = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      if (!key) {
        setError("Please enter a key");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          key,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setHashMapEntries(data.data.result);
          setInputValue(
            JSON.stringify(Object.fromEntries(data.data.result), null, 2)
          );
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove key");
    } finally {
      setLoading(false);
    }
  };

  const handleGetKeys = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

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

  const handleGetValues = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/values`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get values");
    } finally {
      setLoading(false);
    }
  };

  const handleGetEntries = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

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

  const handleMapHashMap = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/hashmap/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          operation: mapOperation,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setHashMapEntries(data.data.result);
          setInputValue(
            JSON.stringify(Object.fromEntries(data.data.result), null, 2)
          );
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to map hash map");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterHashMap = async (): Promise<void> => {
    try {
      if (hashMapEntries.length === 0) {
        setError("Please analyze a hash map first");
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

      const response = await fetch(`${apiBaseUrl}/hashmap/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: hashMapEntries,
          operation: filterOperation,
          parameter: parsedParameter,
        }),
      });

      const data: ApiResponse<HashMapOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
        if ("result" in data.data && Array.isArray(data.data.result)) {
          setHashMapEntries(data.data.result);
          setInputValue(
            JSON.stringify(Object.fromEntries(data.data.result), null, 2)
          );
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter hash map"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "analyze":
        handleAnalyzeHashMap();
        break;
      case "get":
        handleGetValue();
        break;
      case "contains":
        handleContainsKey();
        break;
      case "set":
        handleSetValue();
        break;
      case "remove":
        handleRemoveKey();
        break;
      case "keys":
        handleGetKeys();
        break;
      case "values":
        handleGetValues();
        break;
      case "entries":
        handleGetEntries();
        break;
      case "map":
        handleMapHashMap();
        break;
      case "filter":
        handleFilterHashMap();
        break;
    }
  };

  return (
    <Container>
      <Header>
        <Title>HashMap Operations</Title>
        <Subtitle>
          MiLost provides high-performance hash map operations powered by Rust
          and WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>HashMap Operations</CardTitle>

        <HashMapTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <HashMapInputForm
          activeCategory={activeCategory}
          hashMapEntries={hashMapEntries}
          inputValue={inputValue}
          setInputValue={setInputValue}
          key={key}
          setKey={setKey}
          newValue={newValue}
          setNewValue={setNewValue}
          parameterValue={parameterValue}
          setParameterValue={setParameterValue}
          mapOperation={mapOperation}
          setMapOperation={setMapOperation}
          filterOperation={filterOperation}
          setFilterOperation={setFilterOperation}
        />

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>
              <HashMapResultDisplay result={result} />
            </ResultContent>
          </ResultContainer>
        )}
      </Card>

      <Card>
        <CardTitle>HashMap API Examples</CardTitle>
        <HashMapApiExamples />
      </Card>
    </Container>
  );
}

export default HashMapPage;
