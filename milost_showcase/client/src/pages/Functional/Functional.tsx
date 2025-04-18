// src/pages/Functional/Functional.tsx
import { useState, ChangeEvent, useEffect } from "react";
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
} from "./Functional.styles";

import {
  FunctionalCategory,
  FunctionalMapOperation,
  FunctionalTransformOperation,
  FunctionalExecutionOperation,
  FunctionalPredicateOperation,
  FunctionalUtilityOperation,
  FunctionalOperationResult,
  ApiResponse,
} from "./types";
import CodeExample from "./CodeExample";
import ExecutionOperations from "./ExecutionOperations";
import MapOperations from "./MapOperations";
import {
  parseArrayInput,
  parseObjectInput,
  parseFunctionArray,
  safeStringify,
} from "./parseHelpers";
import PredicateOperations from "./PredicateOperations";
import ResultDisplay from "./ResultDisplay";
import TransformOperations from "./TransformOperations";
import UtilityOperations from "./UtilityOperations";

function FunctionalPage() {
  // Form state
  const [inputValues, setInputValues] = useState<string>("1, 2, 3, 4, 5");
  const [parsedValues, setParsedValues] = useState<any[]>([]);
  const [functionCode, setFunctionCode] = useState<string>("(x) => x * 2");
  const [objectInput, setObjectInput] = useState<string>(
    '{ "a": 1, "b": 2, "c": 3 }'
  );
  const [parsedObject, setParsedObject] = useState<Record<string, any>>({});

  // Map operation specific state
  const [keyFunction, setKeyFunction] = useState<string>("(x) => x");
  const [mapFunction, setMapFunction] = useState<string>(
    "([key, value]) => [key, value * 2]"
  );
  const [filterPredicate, setFilterPredicate] = useState<string>(
    "([key, value]) => value > 1"
  );

  // Transform operation specific state
  const [pipeFunctions, setPipeFunctions] = useState<string>(
    "[(x) => x * 2, (x) => x + 1]"
  );
  const [parsedPipeFunctions, setParsedPipeFunctions] = useState<string[]>([]);
  const [arity, setArity] = useState<number>(2);

  // Execution operation specific state
  const [waitTime, setWaitTime] = useState<number>(300);

  // Predicate operation specific state
  const [predicates, setPredicates] = useState<string>(
    "[(x) => x > 2, (x) => x < 10]"
  );
  const [parsedPredicates, setParsedPredicates] = useState<string[]>([]);
  const [propKey, setPropKey] = useState<string>("name");
  const [propValue, setPropValue] = useState<string>("John");

  // Utility operation specific state
  const [partialArgs, setPartialArgs] = useState<string>("1, 2");
  const [parsedPartialArgs, setParsedPartialArgs] = useState<any[]>([]);
  const [juxtFunctions, setJuxtFunctions] = useState<string>(
    "[(x) => x * 2, (x) => x + 1]"
  );
  const [parsedJuxtFunctions, setParsedJuxtFunctions] = useState<string[]>([]);
  const [firstArray, setFirstArray] = useState<string>("1, 2, 3");
  const [parsedFirstArray, setParsedFirstArray] = useState<any[]>([]);
  const [secondArray, setSecondArray] = useState<string>("4, 5, 6");
  const [parsedSecondArray, setParsedSecondArray] = useState<any[]>([]);
  const [convergeAfter, setConvergeAfter] = useState<string>(
    "(x, y, z) => x + y + z"
  );
  const [transformers, setTransformers] = useState<string>(
    "[(x) => x * 2, (x) => x + 1, (x) => x - 1]"
  );
  const [parsedTransformers, setParsedTransformers] = useState<string[]>([]);

  // UI state
  const [activeCategory, setActiveCategory] =
    useState<FunctionalCategory>("map");
  const [mapOperation, setMapOperation] =
    useState<FunctionalMapOperation>("toHashMap");
  const [transformOperation, setTransformOperation] =
    useState<FunctionalTransformOperation>("mergeDeep");
  const [executionOperation, setExecutionOperation] =
    useState<FunctionalExecutionOperation>("throttle");
  const [predicateOperation, setPredicateOperation] =
    useState<FunctionalPredicateOperation>("not");
  const [utilityOperation, setUtilityOperation] =
    useState<FunctionalUtilityOperation>("partial");

  const [result, setResult] = useState<FunctionalOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  // Parse inputs when they change
  useEffect(() => {
    try {
      const parsed = parseArrayInput(inputValues);
      setParsedValues(parsed);
    } catch (err) {
      console.error("Error parsing input values:", err);
    }
  }, [inputValues]);

  useEffect(() => {
    try {
      const parsed = parseObjectInput(objectInput);
      setParsedObject(parsed);
    } catch (err) {
      console.error("Error parsing object input:", err);
    }
  }, [objectInput]);

  useEffect(() => {
    try {
      const parsed = parseFunctionArray(pipeFunctions);
      setParsedPipeFunctions(parsed);
    } catch (err) {
      console.error("Error parsing pipe functions:", err);
    }
  }, [pipeFunctions]);

  useEffect(() => {
    try {
      const parsed = parseFunctionArray(predicates);
      setParsedPredicates(parsed);
    } catch (err) {
      console.error("Error parsing predicates:", err);
    }
  }, [predicates]);

  useEffect(() => {
    try {
      const parsed = parseArrayInput(partialArgs);
      setParsedPartialArgs(parsed);
    } catch (err) {
      console.error("Error parsing partial args:", err);
    }
  }, [partialArgs]);

  useEffect(() => {
    try {
      const parsed = parseFunctionArray(juxtFunctions);
      setParsedJuxtFunctions(parsed);
    } catch (err) {
      console.error("Error parsing juxt functions:", err);
    }
  }, [juxtFunctions]);

  useEffect(() => {
    try {
      const parsed = parseArrayInput(firstArray);
      setParsedFirstArray(parsed);
    } catch (err) {
      console.error("Error parsing first array:", err);
    }
  }, [firstArray]);

  useEffect(() => {
    try {
      const parsed = parseArrayInput(secondArray);
      setParsedSecondArray(parsed);
    } catch (err) {
      console.error("Error parsing second array:", err);
    }
  }, [secondArray]);

  useEffect(() => {
    try {
      const parsed = parseFunctionArray(transformers);
      setParsedTransformers(parsed);
    } catch (err) {
      console.error("Error parsing transformers:", err);
    }
  }, [transformers]);

  const handleInputValuesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValues(value);
    setError(null);
  };

  const handleObjectInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setObjectInput(value);
    setError(null);
  };

  const handlePipeFunctionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPipeFunctions(value);
    setError(null);
  };

  const handlePredicatesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPredicates(value);
    setError(null);
  };

  const handlePartialArgsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPartialArgs(value);
    setError(null);
  };

  const handleJuxtFunctionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJuxtFunctions(value);
    setError(null);
  };

  const handleFirstArrayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFirstArray(value);
    setError(null);
  };

  const handleSecondArrayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSecondArray(value);
    setError(null);
  };

  const handleTransformersChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTransformers(value);
    setError(null);
  };

  const handleMapOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/functional/map`;
      let body: any = {
        operation: mapOperation,
      };

      switch (mapOperation) {
        case "toHashMap":
          if (parsedValues.length === 0) {
            setError("Please enter valid array values");
            setLoading(false);
            return;
          }
          body.values = parsedValues;
          body.fn = keyFunction; // Send as string, server will evaluate
          break;
        case "toHashSet":
        case "toVec":
          if (parsedValues.length === 0) {
            setError("Please enter valid array values");
            setLoading(false);
            return;
          }
          body.values = parsedValues;
          break;
        case "mapObject":
          if (Object.keys(parsedObject).length === 0) {
            setError("Please enter a valid object");
            setLoading(false);
            return;
          }
          body.value = parsedObject;
          body.fn = mapFunction; // Send as string, server will evaluate
          break;
        case "filterObject":
          if (Object.keys(parsedObject).length === 0) {
            setError("Please enter a valid object");
            setLoading(false);
            return;
          }
          body.value = parsedObject;
          body.fn = filterPredicate; // Send as string, server will evaluate
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<FunctionalOperationResult> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error in map operation:", err);
      setError(
        `API request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransformOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/functional/transform`;
      let body: any = {
        operation: transformOperation,
      };

      switch (transformOperation) {
        case "mergeDeep":
          if (Object.keys(parsedObject).length === 0) {
            setError("Please enter a valid object");
            setLoading(false);
            return;
          }
          // Create two slightly different objects to demonstrate merge
          const obj1 = { ...parsedObject };
          const obj2 = { ...parsedObject, extraKey: "extraValue" };
          body.values = [obj1, obj2];
          break;
        case "pipe":
        case "compose":
          if (parsedPipeFunctions.length === 0) {
            setError("Please enter valid functions for pipe/compose");
            setLoading(false);
            return;
          }
          body.values = parsedPipeFunctions; // Array of function strings
          break;
        case "curry":
          if (!functionCode.trim()) {
            setError("Please enter a valid function to curry");
            setLoading(false);
            return;
          }
          body.fn = functionCode;
          if (arity > 0) {
            body.arity = arity;
          }
          break;
        case "memoize":
        case "once":
          if (!functionCode.trim()) {
            setError("Please enter a valid function");
            setLoading(false);
            return;
          }
          body.fn = functionCode;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<FunctionalOperationResult> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error in transform operation:", err);
      setError(
        `API request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExecutionOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/functional/execution`;
      let body: any = {
        operation: executionOperation,
      };

      switch (executionOperation) {
        case "throttle":
        case "debounce":
          if (!functionCode.trim()) {
            setError("Please enter a valid function");
            setLoading(false);
            return;
          }
          body.fn = functionCode;
          body.wait = waitTime > 0 ? waitTime : 300;
          break;
        case "noop":
          // No additional params needed
          break;
        case "identity":
          // For identity, we need a value to demonstrate
          if (!inputValues.trim()) {
            setError("Please enter a value");
            setLoading(false);
            return;
          }

          try {
            // Use the first parsed value for identity demonstration
            body.value =
              parsedValues.length > 0 ? parsedValues[0] : inputValues.trim();
          } catch (e) {
            body.value = inputValues.trim();
          }
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<FunctionalOperationResult> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error in execution operation:", err);
      setError(
        `API request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePredicateOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/functional/predicate`;
      let body: any = {
        operation: predicateOperation,
      };

      switch (predicateOperation) {
        case "not":
          if (!functionCode.trim()) {
            setError("Please enter a valid predicate function");
            setLoading(false);
            return;
          }
          body.value = functionCode; // Send as string, server will evaluate
          break;
        case "allOf":
        case "anyOf":
          if (parsedPredicates.length === 0) {
            setError("Please enter valid predicate functions");
            setLoading(false);
            return;
          }
          body.predicates = parsedPredicates; // Array of predicate function strings
          break;
        case "prop":
        case "hasProp":
          if (!propKey.trim()) {
            setError("Please enter a valid property key");
            setLoading(false);
            return;
          }
          body.key = propKey;
          break;
        case "propEq":
          if (!propKey.trim()) {
            setError("Please enter a valid property key");
            setLoading(false);
            return;
          }
          body.key = propKey;
          body.value = propValue;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<FunctionalOperationResult> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error in predicate operation:", err);
      setError(
        `API request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUtilityOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/functional/utility`;
      let body: any = {
        operation: utilityOperation,
      };

      switch (utilityOperation) {
        case "partial":
          if (!functionCode.trim()) {
            setError("Please enter a valid function");
            setLoading(false);
            return;
          }
          if (parsedPartialArgs.length === 0) {
            setError("Please enter valid partial arguments");
            setLoading(false);
            return;
          }
          body.fn = functionCode;
          body.partialArgs = parsedPartialArgs;
          break;
        case "flip":
          if (!functionCode.trim()) {
            setError("Please enter a valid function");
            setLoading(false);
            return;
          }
          body.fn = functionCode;
          break;
        case "juxt":
          if (parsedJuxtFunctions.length === 0) {
            setError("Please enter valid functions");
            setLoading(false);
            return;
          }
          body.values = parsedJuxtFunctions; // Array of function strings
          break;
        case "zipWith":
          if (!functionCode.trim()) {
            setError("Please enter a valid function");
            setLoading(false);
            return;
          }
          if (parsedFirstArray.length === 0 || parsedSecondArray.length === 0) {
            setError("Please enter valid arrays");
            setLoading(false);
            return;
          }
          body.values = [functionCode, parsedFirstArray, parsedSecondArray];
          break;
        case "converge":
          if (!convergeAfter.trim()) {
            setError("Please enter a valid after function");
            setLoading(false);
            return;
          }
          if (parsedTransformers.length === 0) {
            setError("Please enter valid transformer functions");
            setLoading(false);
            return;
          }
          body.values = [convergeAfter, ...parsedTransformers];
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<FunctionalOperationResult> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error in utility operation:", err);
      setError(
        `API request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "map":
        handleMapOperation();
        break;
      case "transform":
        handleTransformOperation();
        break;
      case "execution":
        handleExecutionOperation();
        break;
      case "predicate":
        handlePredicateOperation();
        break;
      case "utility":
        handleUtilityOperation();
        break;
    }
  };

  const renderCategoryForm = () => {
    switch (activeCategory) {
      case "map":
        return (
          <MapOperations
            operation={mapOperation}
            setOperation={setMapOperation}
            inputValues={inputValues}
            setInputValues={setInputValues}
            parsedValues={parsedValues}
            objectInput={objectInput}
            setObjectInput={setObjectInput}
            parsedObject={parsedObject}
            keyFunction={keyFunction}
            setKeyFunction={setKeyFunction}
            mapFunction={mapFunction}
            setMapFunction={setMapFunction}
            filterPredicate={filterPredicate}
            setFilterPredicate={setFilterPredicate}
            handleInputValuesChange={handleInputValuesChange}
            handleObjectInputChange={handleObjectInputChange}
          />
        );
      case "transform":
        return (
          <TransformOperations
            operation={transformOperation}
            setOperation={setTransformOperation}
            objectInput={objectInput}
            parsedObject={parsedObject}
            pipeFunctions={pipeFunctions}
            functionCode={functionCode}
            setFunctionCode={setFunctionCode}
            arity={arity}
            setArity={setArity}
            handleObjectInputChange={handleObjectInputChange}
            handlePipeFunctionsChange={handlePipeFunctionsChange}
          />
        );
      case "execution":
        return (
          <ExecutionOperations
            operation={executionOperation}
            setOperation={setExecutionOperation}
            functionCode={functionCode}
            setFunctionCode={setFunctionCode}
            waitTime={waitTime}
            setWaitTime={setWaitTime}
            inputValues={inputValues}
            handleInputValuesChange={handleInputValuesChange}
          />
        );
      case "predicate":
        return (
          <PredicateOperations
            operation={predicateOperation}
            setOperation={setPredicateOperation}
            functionCode={functionCode}
            setFunctionCode={setFunctionCode}
            predicates={predicates}
            propKey={propKey}
            setPropKey={setPropKey}
            propValue={propValue}
            setPropValue={setPropValue}
            handlePredicatesChange={handlePredicatesChange}
          />
        );
      case "utility":
        return (
          <UtilityOperations
            operation={utilityOperation}
            setOperation={setUtilityOperation}
            functionCode={functionCode}
            setFunctionCode={setFunctionCode}
            partialArgs={partialArgs}
            juxtFunctions={juxtFunctions}
            firstArray={firstArray}
            secondArray={secondArray}
            convergeAfter={convergeAfter}
            setConvergeAfter={setConvergeAfter}
            transformers={transformers}
            handlePartialArgsChange={handlePartialArgsChange}
            handleJuxtFunctionsChange={handleJuxtFunctionsChange}
            handleFirstArrayChange={handleFirstArrayChange}
            handleSecondArrayChange={handleSecondArrayChange}
            handleTransformersChange={handleTransformersChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Functional Programming Utilities</Title>
        <Subtitle>
          MiLost provides powerful functional programming utilities inspired by
          libraries like Ramda and Lodash/fp.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Functional Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "map"}
            onClick={() => setActiveCategory("map")}
          >
            Map
          </Tab>
          <Tab
            active={activeCategory === "transform"}
            onClick={() => setActiveCategory("transform")}
          >
            Transform
          </Tab>
          <Tab
            active={activeCategory === "execution"}
            onClick={() => setActiveCategory("execution")}
          >
            Execution
          </Tab>
          <Tab
            active={activeCategory === "predicate"}
            onClick={() => setActiveCategory("predicate")}
          >
            Predicate
          </Tab>
          <Tab
            active={activeCategory === "utility"}
            onClick={() => setActiveCategory("utility")}
          >
            Utility
          </Tab>
        </TabsContainer>

        {renderCategoryForm()}

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && <ResultDisplay result={result} />}
      </Card>

      <CodeExample />
    </Container>
  );
}

export default FunctionalPage;
