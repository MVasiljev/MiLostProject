import { useState, ChangeEvent, JSX } from "react";
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
  NumberInput,
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
  OperationGrid,
  OperationButton,
  InputRow,
  InputColumn,
  FormRow,
  Textarea,
  ArrayPreview,
} from "./Iter.styles";

import {
  IterOperationCategory,
  CreateIterOperation,
  TransformIterOperation,
  FilterIterOperation,
  FindIterOperation,
  UtilityIterOperation,
  IterOperationResult,
  isCreateIterResult,
  isTransformIterResult,
  isFilterIterResult,
  isFindIterResult,
  isUtilityIterResult,
  isCollectIterResult,
  ApiResponse,
  RangeIterRequest,
  MapIterRequest,
  FilterIterRequest,
  FindIterRequest,
  NthIterRequest,
  FoldIterRequest,
} from "./types";

function IterPage() {
  // Input states for array values
  const [inputValues, setInputValues] = useState<string>("");
  const [parsedValues, setParsedValues] = useState<any[]>([]);
  const [vecValues, setVecValues] = useState<string>("");
  const [parsedVecValues, setParsedVecValues] = useState<any[]>([]);

  // Range parameters
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(10);
  const [stepValue, setStepValue] = useState<number>(1);

  // Transform parameters
  const [mapFunction, setMapFunction] = useState<string>("(x) => x * 2");
  const [takeCount, setTakeCount] = useState<number>(5);
  const [skipCount, setSkipCount] = useState<number>(2);
  const [otherArrayStr, setOtherArrayStr] = useState<string>("");
  const [parsedOtherArray, setParsedOtherArray] = useState<any[]>([]);
  const [chunkSize, setChunkSize] = useState<number>(2);

  // Filter parameters
  const [filterPredicate, setFilterPredicate] =
    useState<string>("(x) => x > 5");
  const [keyFunction, setKeyFunction] = useState<string>("(x) => x.id");
  const [separator, setSeparator] = useState<string>(",");

  // Find parameters
  const [findPredicate, setFindPredicate] =
    useState<string>("(x) => x % 2 === 0");
  const [nthIndex, setNthIndex] = useState<number>(2);

  // Utility parameters
  const [initialValue, setInitialValue] = useState<string>("0");
  const [foldFunction, setFoldFunction] = useState<string>(
    "(acc, x) => acc + x"
  );

  // UI states
  const [activeCategory, setActiveCategory] =
    useState<IterOperationCategory>("create");
  const [createOperation, setCreateOperation] =
    useState<CreateIterOperation>("from");
  const [transformOperation, setTransformOperation] =
    useState<TransformIterOperation>("map");
  const [filterOperation, setFilterOperation] =
    useState<FilterIterOperation>("filter");
  const [findOperation, setFindOperation] = useState<FindIterOperation>("find");
  const [utilityOperation, setUtilityOperation] =
    useState<UtilityIterOperation>("next");

  // Result states
  const [result, setResult] = useState<IterOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  // Helper function to parse array input
  const parseArrayInput = (input: string): any[] => {
    try {
      if (!input.trim()) return [];
      // Adding brackets if they're missing to make it a valid array
      const formattedInput = input.trim().startsWith("[")
        ? input
        : `[${input}]`;
      return JSON.parse(formattedInput);
    } catch (err) {
      setError(
        `Invalid array format: ${err instanceof Error ? err.message : String(err)}`
      );
      return [];
    }
  };

  // Update parsed values when input changes
  const handleInputValuesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValues(value);
    try {
      const parsed = parseArrayInput(value);
      setParsedValues(parsed);
      setError(null);
    } catch (err) {
      // Don't set error here to avoid showing error while typing
    }
  };

  const handleVecValuesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setVecValues(value);
    try {
      const parsed = parseArrayInput(value);
      setParsedVecValues(parsed);
      setError(null);
    } catch (err) {
      // Don't set error here to avoid showing error while typing
    }
  };

  const handleOtherArrayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setOtherArrayStr(value);
    try {
      const parsed = parseArrayInput(value);
      setParsedOtherArray(parsed);
      setError(null);
    } catch (err) {
      // Don't set error here to avoid showing error while typing
    }
  };

  // Operation handlers
  const handleCreateIter = async (): Promise<void> => {
    if (createOperation === "from" && parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    if (createOperation === "fromVec" && parsedVecValues.length === 0) {
      setError("Please enter valid vec values");
      return;
    }

    if (createOperation === "range" && startIndex >= endIndex) {
      setError("End index must be greater than start index");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/iter`;
      let body: any = {};

      switch (createOperation) {
        case "from":
          endpoint = `${apiBaseUrl}/iter`;
          body = { values: parsedValues };
          break;
        case "fromVec":
          endpoint = `${apiBaseUrl}/iter/from-vec`;
          body = { vec: parsedVecValues };
          break;
        case "empty":
          endpoint = `${apiBaseUrl}/iter/operation`;
          body = { operation: "empty" };
          break;
        case "range":
          endpoint = `${apiBaseUrl}/iter/range`;
          body = { start: startIndex, end: endIndex, step: stepValue };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransformIter = async (): Promise<void> => {
    if (parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    if (transformOperation === "map" && !mapFunction) {
      setError("Please enter a valid mapping function");
      return;
    }

    if (
      (transformOperation === "take" || transformOperation === "skip") &&
      (takeCount <= 0 || skipCount <= 0)
    ) {
      setError("Count must be greater than 0");
      return;
    }

    if (transformOperation === "chunks" && chunkSize <= 0) {
      setError("Chunk size must be greater than 0");
      return;
    }

    if (
      (transformOperation === "zip" || transformOperation === "chain") &&
      parsedOtherArray.length === 0
    ) {
      setError("Please enter valid array values for the second array");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/iter/operation`;
      let body: any = {
        operation: transformOperation,
        values: parsedValues,
      };

      // Add parameters based on the operation
      switch (transformOperation) {
        case "map":
          body.f = mapFunction;
          break;
        case "take":
          body.size_or_index = takeCount;
          break;
        case "skip":
          body.size_or_index = skipCount;
          break;
        case "zip":
        case "chain":
          body.other = parsedOtherArray;
          break;
        case "chunks":
          body.size = chunkSize;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterIter = async (): Promise<void> => {
    if (parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    if (
      (filterOperation === "filter" || filterOperation === "dedupBy") &&
      !filterPredicate
    ) {
      setError("Please enter a valid predicate function");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/iter/operation`;
      let body: any = {
        operation: filterOperation,
        values: parsedValues,
      };

      // Add parameters based on the operation
      switch (filterOperation) {
        case "filter":
          body.predicate = filterPredicate;
          break;
        case "dedupBy":
          body.keyFn = keyFunction;
          break;
        case "intersperse":
          body.separator = separator;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindIter = async (): Promise<void> => {
    if (parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    if (findOperation === "find" && !findPredicate) {
      setError("Please enter a valid predicate function");
      return;
    }

    if (findOperation === "nth" && nthIndex < 0) {
      setError("Index must be non-negative");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/iter/operation`;
      let body: any = {
        operation: findOperation,
        values: parsedValues,
      };

      // Add parameters based on the operation
      switch (findOperation) {
        case "find":
          body.predicate = findPredicate;
          break;
        case "nth":
          body.index = nthIndex;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUtilityIter = async (): Promise<void> => {
    if (parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    if (
      (utilityOperation === "all" || utilityOperation === "any") &&
      !findPredicate
    ) {
      setError("Please enter a valid predicate function");
      return;
    }

    if (utilityOperation === "fold" && !foldFunction) {
      setError("Please enter a valid fold function");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = `${apiBaseUrl}/iter/operation`;
      let body: any = {
        operation: utilityOperation,
        values: parsedValues,
      };

      // Add parameters based on the operation
      switch (utilityOperation) {
        case "all":
        case "any":
          body.predicate = findPredicate;
          break;
        case "fold":
          body.initial = JSON.parse(initialValue);
          body.f = foldFunction;
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectIter = async (): Promise<void> => {
    if (parsedValues.length === 0) {
      setError("Please enter valid array values");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/iter/collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: parsedValues,
        }),
      });

      const data: ApiResponse<IterOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "create":
        handleCreateIter();
        break;
      case "transform":
        handleTransformIter();
        break;
      case "filter":
        handleFilterIter();
        break;
      case "find":
        handleFindIter();
        break;
      case "utility":
        handleUtilityIter();
        break;
      case "collect":
        handleCollectIter();
        break;
      default:
        break;
    }
  };

  const renderInputForm = (): JSX.Element | null => {
    switch (activeCategory) {
      case "create":
        return (
          <>
            {createOperation === "from" && (
              <FormGroup>
                <Label htmlFor="array-input">
                  Enter array values (comma-separated)
                </Label>
                <Textarea
                  id="array-input"
                  value={inputValues}
                  onChange={handleInputValuesChange}
                  placeholder="1, 2, 3, 4, 5"
                />
                {parsedValues.length > 0 && (
                  <ArrayPreview>
                    Parsed: [{parsedValues.join(", ")}]
                  </ArrayPreview>
                )}
              </FormGroup>
            )}

            {createOperation === "fromVec" && (
              <FormGroup>
                <Label htmlFor="vec-input">
                  Enter Vec values (comma-separated)
                </Label>
                <Textarea
                  id="vec-input"
                  value={vecValues}
                  onChange={handleVecValuesChange}
                  placeholder="1, 2, 3, 4, 5"
                />
                {parsedVecValues.length > 0 && (
                  <ArrayPreview>
                    Parsed: [{parsedVecValues.join(", ")}]
                  </ArrayPreview>
                )}
              </FormGroup>
            )}

            {createOperation === "range" && (
              <InputRow>
                <InputColumn>
                  <Label htmlFor="start-index">Start Index</Label>
                  <NumberInput
                    id="start-index"
                    type="number"
                    value={startIndex}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStartIndex(parseInt(e.target.value) || 0)
                    }
                    min={0}
                  />
                </InputColumn>
                <InputColumn>
                  <Label htmlFor="end-index">End Index</Label>
                  <NumberInput
                    id="end-index"
                    type="number"
                    value={endIndex}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEndIndex(parseInt(e.target.value) || 0)
                    }
                    min={0}
                  />
                </InputColumn>
                <InputColumn>
                  <Label htmlFor="step-value">Step (optional)</Label>
                  <NumberInput
                    id="step-value"
                    type="number"
                    value={stepValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStepValue(parseInt(e.target.value) || 1)
                    }
                    min={1}
                  />
                </InputColumn>
              </InputRow>
            )}

            <OperationGrid>
              <OperationButton
                active={createOperation === "from"}
                onClick={() => setCreateOperation("from")}
              >
                From Array
              </OperationButton>
              <OperationButton
                active={createOperation === "fromVec"}
                onClick={() => setCreateOperation("fromVec")}
              >
                From Vec
              </OperationButton>
              <OperationButton
                active={createOperation === "empty"}
                onClick={() => setCreateOperation("empty")}
              >
                Empty
              </OperationButton>
              <OperationButton
                active={createOperation === "range"}
                onClick={() => setCreateOperation("range")}
              >
                Range
              </OperationButton>
            </OperationGrid>
          </>
        );

      case "transform":
        return (
          <>
            <FormGroup>
              <Label htmlFor="array-input">
                Enter array values (comma-separated)
              </Label>
              <Textarea
                id="array-input"
                value={inputValues}
                onChange={handleInputValuesChange}
                placeholder="1, 2, 3, 4, 5"
              />
              {parsedValues.length > 0 && (
                <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
              )}
            </FormGroup>

            <OperationGrid>
              <OperationButton
                active={transformOperation === "map"}
                onClick={() => setTransformOperation("map")}
              >
                Map
              </OperationButton>
              <OperationButton
                active={transformOperation === "take"}
                onClick={() => setTransformOperation("take")}
              >
                Take
              </OperationButton>
              <OperationButton
                active={transformOperation === "skip"}
                onClick={() => setTransformOperation("skip")}
              >
                Skip
              </OperationButton>
              <OperationButton
                active={transformOperation === "enumerate"}
                onClick={() => setTransformOperation("enumerate")}
              >
                Enumerate
              </OperationButton>
              <OperationButton
                active={transformOperation === "zip"}
                onClick={() => setTransformOperation("zip")}
              >
                Zip
              </OperationButton>
              <OperationButton
                active={transformOperation === "chain"}
                onClick={() => setTransformOperation("chain")}
              >
                Chain
              </OperationButton>
              <OperationButton
                active={transformOperation === "flatMap"}
                onClick={() => setTransformOperation("flatMap")}
              >
                FlatMap
              </OperationButton>
              <OperationButton
                active={transformOperation === "chunks"}
                onClick={() => setTransformOperation("chunks")}
              >
                Chunks
              </OperationButton>
            </OperationGrid>

            {transformOperation === "map" && (
              <FormGroup>
                <Label htmlFor="map-function">Map Function</Label>
                <Input
                  id="map-function"
                  type="text"
                  value={mapFunction}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMapFunction(e.target.value)
                  }
                  placeholder="(x) => x * 2"
                />
              </FormGroup>
            )}

            {transformOperation === "take" && (
              <FormGroup>
                <Label htmlFor="take-count">Take Count</Label>
                <NumberInput
                  id="take-count"
                  type="number"
                  value={takeCount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTakeCount(parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </FormGroup>
            )}

            {transformOperation === "skip" && (
              <FormGroup>
                <Label htmlFor="skip-count">Skip Count</Label>
                <NumberInput
                  id="skip-count"
                  type="number"
                  value={skipCount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSkipCount(parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </FormGroup>
            )}

            {(transformOperation === "zip" ||
              transformOperation === "chain") && (
              <FormGroup>
                <Label htmlFor="other-array">
                  Other Array (comma-separated)
                </Label>
                <Textarea
                  id="other-array"
                  value={otherArrayStr}
                  onChange={handleOtherArrayChange}
                  placeholder="6, 7, 8, 9, 10"
                />
                {parsedOtherArray.length > 0 && (
                  <ArrayPreview>
                    Parsed: [{parsedOtherArray.join(", ")}]
                  </ArrayPreview>
                )}
              </FormGroup>
            )}

            {transformOperation === "flatMap" && (
              <FormGroup>
                <Label htmlFor="flat-map-function">FlatMap Function</Label>
                <Input
                  id="flat-map-function"
                  type="text"
                  value={mapFunction}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMapFunction(e.target.value)
                  }
                  placeholder="(x) => [x, x * 2]"
                />
              </FormGroup>
            )}

            {transformOperation === "chunks" && (
              <FormGroup>
                <Label htmlFor="chunk-size">Chunk Size</Label>
                <NumberInput
                  id="chunk-size"
                  type="number"
                  value={chunkSize}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setChunkSize(parseInt(e.target.value) || 1)
                  }
                  min={1}
                />
              </FormGroup>
            )}
          </>
        );

      case "filter":
        return (
          <>
            <FormGroup>
              <Label htmlFor="array-input">
                Enter array values (comma-separated)
              </Label>
              <Textarea
                id="array-input"
                value={inputValues}
                onChange={handleInputValuesChange}
                placeholder="1, 2, 3, 4, 5"
              />
              {parsedValues.length > 0 && (
                <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
              )}
            </FormGroup>

            <OperationGrid>
              <OperationButton
                active={filterOperation === "filter"}
                onClick={() => setFilterOperation("filter")}
              >
                Filter
              </OperationButton>
              <OperationButton
                active={filterOperation === "dedup"}
                onClick={() => setFilterOperation("dedup")}
              >
                Dedup
              </OperationButton>
              <OperationButton
                active={filterOperation === "dedupBy"}
                onClick={() => setFilterOperation("dedupBy")}
              >
                DedupBy
              </OperationButton>
              <OperationButton
                active={filterOperation === "intersperse"}
                onClick={() => setFilterOperation("intersperse")}
              >
                Intersperse
              </OperationButton>
            </OperationGrid>

            {filterOperation === "filter" && (
              <FormGroup>
                <Label htmlFor="filter-predicate">Filter Predicate</Label>
                <Input
                  id="filter-predicate"
                  type="text"
                  value={filterPredicate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFilterPredicate(e.target.value)
                  }
                  placeholder="(x) => x > 2"
                />
              </FormGroup>
            )}

            {filterOperation === "dedupBy" && (
              <FormGroup>
                <Label htmlFor="key-function">Key Function</Label>
                <Input
                  id="key-function"
                  type="text"
                  value={keyFunction}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKeyFunction(e.target.value)
                  }
                  placeholder="(x) => x.id"
                />
              </FormGroup>
            )}

            {filterOperation === "intersperse" && (
              <FormGroup>
                <Label htmlFor="separator">Separator</Label>
                <Input
                  id="separator"
                  type="text"
                  value={separator}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSeparator(e.target.value)
                  }
                  placeholder=","
                />
              </FormGroup>
            )}
          </>
        );

      case "find":
        return (
          <>
            <FormGroup>
              <Label htmlFor="array-input">
                Enter array values (comma-separated)
              </Label>
              <Textarea
                id="array-input"
                value={inputValues}
                onChange={handleInputValuesChange}
                placeholder="1, 2, 3, 4, 5"
              />
              {parsedValues.length > 0 && (
                <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
              )}
            </FormGroup>

            <OperationGrid>
              <OperationButton
                active={findOperation === "find"}
                onClick={() => setFindOperation("find")}
              >
                Find
              </OperationButton>
              <OperationButton
                active={findOperation === "first"}
                onClick={() => setFindOperation("first")}
              >
                First
              </OperationButton>
              <OperationButton
                active={findOperation === "last"}
                onClick={() => setFindOperation("last")}
              >
                Last
              </OperationButton>
              <OperationButton
                active={findOperation === "nth"}
                onClick={() => setFindOperation("nth")}
              >
                Nth
              </OperationButton>
            </OperationGrid>

            {findOperation === "find" && (
              <FormGroup>
                <Label htmlFor="find-predicate">Find Predicate</Label>
                <Input
                  id="find-predicate"
                  type="text"
                  value={findPredicate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFindPredicate(e.target.value)
                  }
                  placeholder="(x) => x % 2 === 0"
                />
              </FormGroup>
            )}

            {findOperation === "nth" && (
              <FormGroup>
                <Label htmlFor="nth-index">Index</Label>
                <NumberInput
                  id="nth-index"
                  type="number"
                  value={nthIndex}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNthIndex(parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </FormGroup>
            )}
          </>
        );

      case "utility":
        return (
          <>
            <FormGroup>
              <Label htmlFor="array-input">
                Enter array values (comma-separated)
              </Label>
              <Textarea
                id="array-input"
                value={inputValues}
                onChange={handleInputValuesChange}
                placeholder="1, 2, 3, 4, 5"
              />
              {parsedValues.length > 0 && (
                <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
              )}
            </FormGroup>

            <OperationGrid>
              <OperationButton
                active={utilityOperation === "next"}
                onClick={() => setUtilityOperation("next")}
              >
                Next
              </OperationButton>
              <OperationButton
                active={utilityOperation === "forEach"}
                onClick={() => setUtilityOperation("forEach")}
              >
                ForEach
              </OperationButton>
              <OperationButton
                active={utilityOperation === "all"}
                onClick={() => setUtilityOperation("all")}
              >
                All
              </OperationButton>
              <OperationButton
                active={utilityOperation === "any"}
                onClick={() => setUtilityOperation("any")}
              >
                Any
              </OperationButton>
              <OperationButton
                active={utilityOperation === "count"}
                onClick={() => setUtilityOperation("count")}
              >
                Count
              </OperationButton>
              <OperationButton
                active={utilityOperation === "fold"}
                onClick={() => setUtilityOperation("fold")}
              >
                Fold
              </OperationButton>
            </OperationGrid>

            {(utilityOperation === "all" || utilityOperation === "any") && (
              <FormGroup>
                <Label htmlFor="find-predicate">Predicate</Label>
                <Input
                  id="find-predicate"
                  type="text"
                  value={findPredicate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFindPredicate(e.target.value)
                  }
                  placeholder="(x) => x % 2 === 0"
                />
              </FormGroup>
            )}

            {utilityOperation === "fold" && (
              <>
                <FormGroup>
                  <Label htmlFor="initial-value">Initial Value</Label>
                  <Input
                    id="initial-value"
                    type="text"
                    value={initialValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setInitialValue(e.target.value)
                    }
                    placeholder="0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="fold-function">Fold Function</Label>
                  <Input
                    id="fold-function"
                    type="text"
                    value={foldFunction}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFoldFunction(e.target.value)
                    }
                    placeholder="(acc, x) => acc + x"
                  />
                </FormGroup>
              </>
            )}
          </>
        );

      case "collect":
        return (
          <>
            <FormGroup>
              <Label htmlFor="array-input">
                Enter array values (comma-separated)
              </Label>
              <Textarea
                id="array-input"
                value={inputValues}
                onChange={handleInputValuesChange}
                placeholder="1, 2, 3, 4, 5"
              />
              {parsedValues.length > 0 && (
                <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
              )}
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  const renderResult = (): JSX.Element | null => {
    if (!result) return null;

    if (isCreateIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              ...(result.original && { original: result.original }),
              ...(result.start !== undefined && { start: result.start }),
              ...(result.end !== undefined && { end: result.end }),
              ...(result.step !== undefined && { step: result.step }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isTransformIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isFilterIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isFindIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isUtilityIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              ...(result.params && { params: result.params }),
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isCollectIterResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
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
        <Title>Iterator Operations</Title>
        <Subtitle>
          MiLost provides high-performance iterator operations powered by Rust
          and WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Iterator Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "create"}
            onClick={() => setActiveCategory("create")}
          >
            Create
          </Tab>
          <Tab
            active={activeCategory === "transform"}
            onClick={() => setActiveCategory("transform")}
          >
            Transform
          </Tab>
          <Tab
            active={activeCategory === "filter"}
            onClick={() => setActiveCategory("filter")}
          >
            Filter
          </Tab>
          <Tab
            active={activeCategory === "find"}
            onClick={() => setActiveCategory("find")}
          >
            Find
          </Tab>
          <Tab
            active={activeCategory === "utility"}
            onClick={() => setActiveCategory("utility")}
          >
            Utility
          </Tab>
          <Tab
            active={activeCategory === "collect"}
            onClick={() => setActiveCategory("collect")}
          >
            Collect
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
        <CardTitle>Iterator API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Iter, Vec } from "milost";

// Create an iterator
const iter1 = Iter.from([1, 2, 3, 4, 5]);
const iter2 = Iter.fromVec(Vec.from([6, 7, 8, 9, 10]));
const emptyIter = Iter.empty();
const rangeIter = Iter.range(0, 5); // [0, 1, 2, 3, 4]

// Basic operations
const nextVal = iter1.next(); // Returns Some(1), iter1 now points to 2
const mapped = iter1.map(x => x * 2); // [4, 6, 8, 10]
const filtered = iter1.filter(x => x % 2 === 0); // [2, 4]

// Taking and skipping
const taken = iter1.take(2); // Takes first 2 elements
const skipped = iter1.skip(2); // Skips first 2 elements

// Combining iterators
const zipped = iter1.zip(iter2); // Pairs elements from both iterators
const chained = iter1.chain(iter2); // Concatenates iterators
const flatMapped = iter1.flatMap(x => [x, x * 2]); // Flattens nested arrays

// Processing chunks
const chunks = iter1.chunks(2); // Groups elements into chunks of size 2

// Collecting results
const collected = iter1.collect(); // Converts iterator to a Vec

// Finding elements
const found = iter1.find(x => x > 3); // Returns Some(4)
const first = iter1.first(); // Returns Some(1)
const last = iter1.last(); // Returns Some(5)
const nth = iter1.nth(2); // Returns Some(3)

// Utility operations
iter1.forEach(x => console.log(x)); // Performs action on each element
const allMatch = iter1.all(x => x > 0); // Returns true if all elements match predicate
const anyMatch = iter1.any(x => x > 3); // Returns true if any element matches predicate
const count = iter1.count(); // Returns the number of elements
const sum = iter1.fold(0, (acc, x) => acc + x); // Combines elements using function

// Removing duplicates
const deduplicated = iter1.dedup(); // Removes consecutive duplicates
const dedupByKey = iter1.dedupBy(x => x.id); // Deduplicates by key function

// Inserting separators
const withSeparators = iter1.intersperse(0); // Inserts 0 between elements`}
          </Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Iter class provides a Rust-like iterator implementation with
          WASM acceleration when available. Iterators are lazy and only process
          elements when needed, making them memory-efficient for large
          collections.
        </SmallText>
      </Card>
    </Container>
  );
}

export default IterPage;
