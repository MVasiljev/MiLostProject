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
} from "./Strings.styles";

import {
  StringOperationCategory,
  StringTransformOperation,
  SubstringOperation,
  SearchOperation,
  StringOperationResult,
  isStringAnalysisResult,
  isStringTransformationResult,
  isSubstringOperationResult,
  isSearchOperationResult,
  isCompareStringsResult,
  isConcatenateStringsResult,
  SubstringOperationRequest,
  SearchOperationRequest,
} from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function StringsPage() {
  // Basic input states
  const [inputValue, setInputValue] = useState("");
  const [firstString, setFirstString] = useState("");
  const [secondString, setSecondString] = useState("");

  // Operation parameters
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [searchString, setSearchString] = useState("");
  const [replaceString, setReplaceString] = useState("");
  const [position, setPosition] = useState<number>(0);

  // UI states
  const [activeCategory, setActiveCategory] =
    useState<StringOperationCategory>("analyze");
  const [transformOperation, setTransformOperation] =
    useState<StringTransformOperation>("uppercase");
  const [substringOperation, setSubstringOperation] =
    useState<SubstringOperation>("substring");
  const [searchOperation, setSearchOperation] =
    useState<SearchOperation>("contains");

  // Result states
  const [result, setResult] = useState<StringOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleAnalyzeString = async (): Promise<void> => {
    if (!inputValue) {
      setError("Please enter a string value");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/string`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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

  const handleTransformString = async (): Promise<void> => {
    if (!inputValue) {
      setError("Please enter a string value");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/string/transformation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: inputValue,
          operation: transformOperation,
        }),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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

  const handleSubstringOperation = async (): Promise<void> => {
    if (!inputValue) {
      setError("Please enter a string value");
      return;
    }

    setLoading(true);
    setError(null);

    const requestBody: SubstringOperationRequest = {
      value: inputValue,
      operation: substringOperation,
    };

    // Add parameters based on the operation
    if (substringOperation === "substring") {
      requestBody.start = startIndex;
      requestBody.end = endIndex;
    } else if (substringOperation === "charAt") {
      requestBody.start = startIndex;
    } else if (
      substringOperation === "startsWith" ||
      substringOperation === "endsWith"
    ) {
      requestBody.searchStr = searchString;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/string/substring`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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

  const handleSearchOperation = async (): Promise<void> => {
    if (!inputValue) {
      setError("Please enter a string value");
      return;
    }

    if (!searchString) {
      setError("Please enter a search string");
      return;
    }

    setLoading(true);
    setError(null);

    const requestBody: SearchOperationRequest = {
      value: inputValue,
      operation: searchOperation,
      searchStr: searchString,
    };

    // Add parameters based on the operation
    if (searchOperation === "indexOf") {
      requestBody.position = position;
    } else if (searchOperation === "replace") {
      requestBody.replaceStr = replaceString;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/string/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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

  const handleCompareStrings = async (): Promise<void> => {
    if (!firstString || !secondString) {
      setError("Please enter both strings for comparison");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/string/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstString,
          secondString,
        }),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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

  const handleConcatenateStrings = async (): Promise<void> => {
    if (!firstString || !secondString) {
      setError("Please enter both strings for concatenation");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/string/concatenate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstString,
          secondString,
        }),
      });

      const data: ApiResponse<StringOperationResult> = await response.json();

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
      case "analyze":
        handleAnalyzeString();
        break;
      case "transform":
        handleTransformString();
        break;
      case "substring":
        handleSubstringOperation();
        break;
      case "search":
        handleSearchOperation();
        break;
      case "compare":
        handleCompareStrings();
        break;
      case "concat":
        handleConcatenateStrings();
        break;
    }
  };

  const renderInputForm = (): JSX.Element | null => {
    switch (activeCategory) {
      case "analyze":
        return (
          <>
            <FormGroup>
              <Label htmlFor="string-input">Enter a string to analyze</Label>
              <Input
                id="string-input"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter text here..."
              />
            </FormGroup>
          </>
        );

      case "transform":
        return (
          <>
            <FormGroup>
              <Label htmlFor="string-input">Enter a string to transform</Label>
              <Input
                id="string-input"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter text here..."
              />
            </FormGroup>
            <OperationGrid>
              <OperationButton
                active={transformOperation === "uppercase"}
                onClick={() => setTransformOperation("uppercase")}
              >
                Uppercase
              </OperationButton>
              <OperationButton
                active={transformOperation === "lowercase"}
                onClick={() => setTransformOperation("lowercase")}
              >
                Lowercase
              </OperationButton>
              <OperationButton
                active={transformOperation === "trim"}
                onClick={() => setTransformOperation("trim")}
              >
                Trim
              </OperationButton>
              <OperationButton
                active={transformOperation === "reverse"}
                onClick={() => setTransformOperation("reverse")}
              >
                Reverse
              </OperationButton>
            </OperationGrid>
          </>
        );

      case "substring":
        return (
          <>
            <FormGroup>
              <Label htmlFor="string-input">Enter a string</Label>
              <Input
                id="string-input"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter text here..."
              />
            </FormGroup>
            <OperationGrid>
              <OperationButton
                active={substringOperation === "substring"}
                onClick={() => setSubstringOperation("substring")}
              >
                Substring
              </OperationButton>
              <OperationButton
                active={substringOperation === "charAt"}
                onClick={() => setSubstringOperation("charAt")}
              >
                CharAt
              </OperationButton>
              <OperationButton
                active={substringOperation === "startsWith"}
                onClick={() => setSubstringOperation("startsWith")}
              >
                StartsWith
              </OperationButton>
              <OperationButton
                active={substringOperation === "endsWith"}
                onClick={() => setSubstringOperation("endsWith")}
              >
                EndsWith
              </OperationButton>
            </OperationGrid>

            {substringOperation === "substring" && (
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
              </InputRow>
            )}

            {substringOperation === "charAt" && (
              <FormGroup>
                <Label htmlFor="char-index">Character Index</Label>
                <NumberInput
                  id="char-index"
                  type="number"
                  value={startIndex}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setStartIndex(parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </FormGroup>
            )}

            {(substringOperation === "startsWith" ||
              substringOperation === "endsWith") && (
              <FormGroup>
                <Label htmlFor="search-string">Search String</Label>
                <Input
                  id="search-string"
                  type="text"
                  value={searchString}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchString(e.target.value)
                  }
                  placeholder="Text to search for..."
                />
              </FormGroup>
            )}
          </>
        );

      case "search":
        return (
          <>
            <FormGroup>
              <Label htmlFor="string-input">Enter a string</Label>
              <Input
                id="string-input"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter text here..."
              />
            </FormGroup>
            <OperationGrid>
              <OperationButton
                active={searchOperation === "contains"}
                onClick={() => setSearchOperation("contains")}
              >
                Contains
              </OperationButton>
              <OperationButton
                active={searchOperation === "indexOf"}
                onClick={() => setSearchOperation("indexOf")}
              >
                IndexOf
              </OperationButton>
              <OperationButton
                active={searchOperation === "lastIndexOf"}
                onClick={() => setSearchOperation("lastIndexOf")}
              >
                LastIndexOf
              </OperationButton>
              <OperationButton
                active={searchOperation === "replace"}
                onClick={() => setSearchOperation("replace")}
              >
                Replace
              </OperationButton>
              <OperationButton
                active={searchOperation === "split"}
                onClick={() => setSearchOperation("split")}
              >
                Split
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="search-string">Search String</Label>
              <Input
                id="search-string"
                type="text"
                value={searchString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchString(e.target.value)
                }
                placeholder="Text to search for..."
              />
            </FormGroup>

            {searchOperation === "indexOf" && (
              <FormGroup>
                <Label htmlFor="position">Starting Position</Label>
                <NumberInput
                  id="position"
                  type="number"
                  value={position}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPosition(parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </FormGroup>
            )}

            {searchOperation === "replace" && (
              <FormGroup>
                <Label htmlFor="replace-string">Replace With</Label>
                <Input
                  id="replace-string"
                  type="text"
                  value={replaceString}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setReplaceString(e.target.value)
                  }
                  placeholder="Replacement text..."
                />
              </FormGroup>
            )}
          </>
        );

      case "compare":
        return (
          <>
            <FormGroup>
              <Label htmlFor="first-string">First String</Label>
              <Input
                id="first-string"
                type="text"
                value={firstString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFirstString(e.target.value)
                }
                placeholder="Enter first string..."
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="second-string">Second String</Label>
              <Input
                id="second-string"
                type="text"
                value={secondString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecondString(e.target.value)
                }
                placeholder="Enter second string..."
              />
            </FormGroup>
          </>
        );

      case "concat":
        return (
          <>
            <FormGroup>
              <Label htmlFor="first-string">First String</Label>
              <Input
                id="first-string"
                type="text"
                value={firstString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFirstString(e.target.value)
                }
                placeholder="Enter first string..."
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="second-string">Second String</Label>
              <Input
                id="second-string"
                type="text"
                value={secondString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecondString(e.target.value)
                }
                placeholder="Enter second string..."
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

    if (isStringAnalysisResult(result)) {
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

    if (isStringTransformationResult(result)) {
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

    if (isSubstringOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              result: result.result,
              params: result.params,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isSearchOperationResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              original: result.original,
              operation: result.operation,
              result: result.result,
              params: result.params,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isCompareStringsResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              firstString: result.firstString,
              secondString: result.secondString,
              equal: result.equal,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isConcatenateStringsResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              firstString: result.firstString,
              secondString: result.secondString,
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
        <Title>String Operations</Title>
        <Subtitle>
          MiLost provides high-performance string operations powered by Rust and
          WASM.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>String Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "analyze"}
            onClick={() => setActiveCategory("analyze")}
          >
            Analyze
          </Tab>
          <Tab
            active={activeCategory === "transform"}
            onClick={() => setActiveCategory("transform")}
          >
            Transform
          </Tab>
          <Tab
            active={activeCategory === "substring"}
            onClick={() => setActiveCategory("substring")}
          >
            Substring
          </Tab>
          <Tab
            active={activeCategory === "search"}
            onClick={() => setActiveCategory("search")}
          >
            Search
          </Tab>
          <Tab
            active={activeCategory === "compare"}
            onClick={() => setActiveCategory("compare")}
          >
            Compare
          </Tab>
          <Tab
            active={activeCategory === "concat"}
            onClick={() => setActiveCategory("concat")}
          >
            Concatenate
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
        <CardTitle>String API Examples</CardTitle>

        <CodeBlock>
          <Pre>
            {`import { Str } from "milost";

// Create a string
const hello = Str.fromRaw("Hello, World!");

// Basic properties
console.log(hello.len());        // 13
console.log(hello.isEmpty());    // false

// Transformations
const upper = hello.toUpperCase();
console.log(upper.unwrap());     // "HELLO, WORLD!"

const lower = hello.toLowerCase();
console.log(lower.unwrap());     // "hello, world!"

const trimmed = Str.fromRaw("  trim me  ").trim();
console.log(trimmed.unwrap());   // "trim me"

// Substrings
const sub = hello.substring(0, 5);
console.log(sub.unwrap());       // "Hello"

const char = hello.charAt(0);    // "H"

// String searches
console.log(hello.contains("World"));        // true
console.log(hello.indexOf("o"));             // 4
console.log(hello.lastIndexOf("o"));         // 8
console.log(hello.startsWith("Hello"));      // true
console.log(hello.endsWith("!"));            // true

// String manipulation
const parts = hello.split(",");              // ["Hello", " World!"]
const replaced = hello.replace("World", "MiLost");
console.log(replaced.unwrap());              // "Hello, MiLost!"

// String comparison
const str1 = Str.fromRaw("Hello");
const str2 = Str.fromRaw("Hello");
console.log(str1.equals(str2));              // true

// Concatenation
const combined = str1.concat(Str.fromRaw(", MiLost!"));
console.log(combined.unwrap());              // "Hello, MiLost!"`}
          </Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Str class provides a Rust-like immutable string
          implementation with WASM acceleration when available. All operations
          return new string instances instead of modifying the original.
        </SmallText>
      </Card>
    </Container>
  );
}

export default StringsPage;
