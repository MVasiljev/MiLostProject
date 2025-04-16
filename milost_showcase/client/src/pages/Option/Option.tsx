import { useState, ChangeEvent, JSX } from "react";

import {
  OptionOperationCategory,
  OptionBasicOperation,
  OptionAccessOperation,
  OptionTransformOperation,
  OptionMatchOperation,
  OptionCombinationOperation,
  OptionOperationResult,
  isOptionCreateResult,
  isOptionAccessResult,
  isOptionTransformResult,
  isOptionMatchResult,
  isOptionCombineResult,
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
  TabsContainer,
  Tab,
  OperationGrid,
  OperationButton,
  TextArea,
  CodeBlock,
  Pre,
  SmallText,
  PrimaryButton,
  ResultContainer,
  ResultTitle,
  ResultContent,
  ErrorMessage,
  SelectInput,
  InputRow,
} from "./Option.styles";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function OptionPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transformFn, setTransformFn] = useState<string>(
    "(value) => value * 2"
  );
  const [predicateFn, setPredicateFn] = useState<string>(
    "(value) => value > 5"
  );
  const [onSomeFn, setOnSomeFn] = useState<string>(
    "(value) => `Some: ${value}`"
  );
  const [onNoneFn, setOnNoneFn] = useState<string>("() => 'None'");
  const [optionsInput, setOptionsInput] = useState<string>("1, 2, null, 3");

  const [activeCategory, setActiveCategory] =
    useState<OptionOperationCategory>("create");
  const [basicOperation, setBasicOperation] =
    useState<OptionBasicOperation>("some");
  const [accessOperation, setAccessOperation] =
    useState<OptionAccessOperation>("unwrap");
  const [transformOperation, setTransformOperation] =
    useState<OptionTransformOperation>("map");
  const [matchOperation, setMatchOperation] =
    useState<OptionMatchOperation>("match");
  const [combineOperation, setCombineOperation] =
    useState<OptionCombinationOperation>("firstSome");

  const [result, setResult] = useState<OptionOperationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const parseInputValue = (input: string): any => {
    if (!input.trim()) return undefined;

    // Handle special values
    if (input.trim().toLowerCase() === "null") return null;
    if (input.trim().toLowerCase() === "undefined") return undefined;
    if (input.trim().toLowerCase() === "true") return true;
    if (input.trim().toLowerCase() === "false") return false;

    // Try to parse as number
    const numValue = Number(input);
    if (!isNaN(numValue)) return numValue;

    // Try to parse as JSON
    try {
      return JSON.parse(input);
    } catch (e) {
      // If it's not valid JSON, return as string
      return input;
    }
  };

  const parseOptionsInput = (input: string): any[] => {
    if (!input.trim()) return [];

    return input.split(",").map((item) => {
      const trimmedItem = item.trim();
      return parseInputValue(trimmedItem);
    });
  };

  const handleCreateOption = async (): Promise<void> => {
    try {
      const value = parseInputValue(inputValue);

      setLoading(true);
      setError(null);

      const requestBody = {
        operation: basicOperation,
        value: basicOperation === "none" ? undefined : value,
      };

      const response = await fetch(`${apiBaseUrl}/option/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<OptionOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAccessOption = async (): Promise<void> => {
    try {
      const value = parseInputValue(inputValue);
      const defaultVal = parseInputValue(defaultValue);

      setLoading(true);
      setError(null);

      const requestBody = {
        operation: accessOperation,
        value: value,
        defaultValue: accessOperation === "unwrapOr" ? defaultVal : undefined,
        errorMessage: accessOperation === "expect" ? errorMessage : undefined,
      };

      const response = await fetch(`${apiBaseUrl}/option/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<OptionOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTransformOption = async (): Promise<void> => {
    try {
      const value = parseInputValue(inputValue);
      const otherOptionValue = parseInputValue(defaultValue);

      setLoading(true);
      setError(null);

      const requestBody = {
        operation: transformOperation,
        value: value,
        onSome:
          transformOperation === "map" || transformOperation === "andThen"
            ? transformFn
            : undefined,
        predicate: transformOperation === "filter" ? predicateFn : undefined,
        defaultValue:
          transformOperation === "or" ? otherOptionValue : undefined,
      };

      const response = await fetch(`${apiBaseUrl}/option/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<OptionOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMatchOption = async (): Promise<void> => {
    try {
      const value = parseInputValue(inputValue);

      setLoading(true);
      setError(null);

      const requestBody = {
        operation: matchOperation,
        value: value,
        onSome: onSomeFn,
        onNone: onNoneFn,
      };

      const response = await fetch(`${apiBaseUrl}/option/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<OptionOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCombineOptions = async (): Promise<void> => {
    try {
      const options = parseOptionsInput(optionsInput);

      setLoading(true);
      setError(null);

      const requestBody = {
        operation: combineOperation,
        options: options,
      };

      const response = await fetch(`${apiBaseUrl}/option/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<OptionOperationResult> = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (): void => {
    switch (activeCategory) {
      case "create":
        handleCreateOption();
        break;
      case "access":
        handleAccessOption();
        break;
      case "transform":
        handleTransformOption();
        break;
      case "match":
        handleMatchOption();
        break;
      case "combine":
        handleCombineOptions();
        break;
    }
  };

  const renderInputForm = (): JSX.Element | null => {
    switch (activeCategory) {
      case "create":
        return (
          <>
            <OperationGrid>
              <OperationButton
                active={basicOperation === "some"}
                onClick={() => setBasicOperation("some")}
              >
                Some
              </OperationButton>
              <OperationButton
                active={basicOperation === "none"}
                onClick={() => setBasicOperation("none")}
              >
                None
              </OperationButton>
              <OperationButton
                active={basicOperation === "from"}
                onClick={() => setBasicOperation("from")}
              >
                From
              </OperationButton>
            </OperationGrid>

            {basicOperation !== "none" && (
              <FormGroup>
                <Label htmlFor="input-value">Value</Label>
                <Input
                  id="input-value"
                  type="text"
                  value={inputValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInputValue(e.target.value)
                  }
                  placeholder="Enter a value (number, string, boolean, null)"
                />
                <SmallText>
                  For "Some" operation, the value will be wrapped in an Option.
                  For "From" operation, null or undefined will result in None.
                </SmallText>
              </FormGroup>
            )}
          </>
        );

      case "access":
        return (
          <>
            <OperationGrid>
              <OperationButton
                active={accessOperation === "isSome"}
                onClick={() => setAccessOperation("isSome")}
              >
                isSome
              </OperationButton>
              <OperationButton
                active={accessOperation === "isNone"}
                onClick={() => setAccessOperation("isNone")}
              >
                isNone
              </OperationButton>
              <OperationButton
                active={accessOperation === "unwrap"}
                onClick={() => setAccessOperation("unwrap")}
              >
                unwrap
              </OperationButton>
              <OperationButton
                active={accessOperation === "unwrapOr"}
                onClick={() => setAccessOperation("unwrapOr")}
              >
                unwrapOr
              </OperationButton>
              <OperationButton
                active={accessOperation === "expect"}
                onClick={() => setAccessOperation("expect")}
              >
                expect
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="option-value">Option Value</Label>
              <Input
                id="option-value"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter a value to create an Option"
              />
              <SmallText>
                Enter null for None, any other value for Some.
              </SmallText>
            </FormGroup>

            {accessOperation === "unwrapOr" && (
              <FormGroup>
                <Label htmlFor="default-value">Default Value</Label>
                <Input
                  id="default-value"
                  type="text"
                  value={defaultValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDefaultValue(e.target.value)
                  }
                  placeholder="Default value if Option is None"
                />
              </FormGroup>
            )}

            {accessOperation === "expect" && (
              <FormGroup>
                <Label htmlFor="error-message">Error Message</Label>
                <Input
                  id="error-message"
                  type="text"
                  value={errorMessage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setErrorMessage(e.target.value)
                  }
                  placeholder="Error message if Option is None"
                />
              </FormGroup>
            )}
          </>
        );

      case "transform":
        return (
          <>
            <OperationGrid>
              <OperationButton
                active={transformOperation === "map"}
                onClick={() => setTransformOperation("map")}
              >
                map
              </OperationButton>
              <OperationButton
                active={transformOperation === "andThen"}
                onClick={() => setTransformOperation("andThen")}
              >
                andThen
              </OperationButton>
              <OperationButton
                active={transformOperation === "filter"}
                onClick={() => setTransformOperation("filter")}
              >
                filter
              </OperationButton>
              <OperationButton
                active={transformOperation === "or"}
                onClick={() => setTransformOperation("or")}
              >
                or
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="option-value">Option Value</Label>
              <Input
                id="option-value"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter a value to create an Option"
              />
              <SmallText>
                Enter null for None, any other value for Some.
              </SmallText>
            </FormGroup>

            {(transformOperation === "map" ||
              transformOperation === "andThen") && (
              <FormGroup>
                <Label htmlFor="transform-fn">
                  {transformOperation === "map"
                    ? "Map Function"
                    : "AndThen Function"}
                </Label>
                <TextArea
                  id="transform-fn"
                  value={transformFn}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setTransformFn(e.target.value)
                  }
                  placeholder="(value) => transformed_value"
                />
                <SmallText>
                  {transformOperation === "map"
                    ? "Transform the value inside Option. Returns Option<transformedValue>."
                    : "Returns an Option. Used for chaining Option operations."}
                </SmallText>
              </FormGroup>
            )}

            {transformOperation === "filter" && (
              <FormGroup>
                <Label htmlFor="predicate-fn">Predicate Function</Label>
                <TextArea
                  id="predicate-fn"
                  value={predicateFn}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setPredicateFn(e.target.value)
                  }
                  placeholder="(value) => boolean"
                />
                <SmallText>
                  Filter the Option based on a condition. Returns None if the
                  predicate returns false.
                </SmallText>
              </FormGroup>
            )}

            {transformOperation === "or" && (
              <FormGroup>
                <Label htmlFor="other-option">Other Option</Label>
                <Input
                  id="other-option"
                  type="text"
                  value={defaultValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDefaultValue(e.target.value)
                  }
                  placeholder="Default Option if the first is None"
                />
                <SmallText>
                  Returns this Option if it's Some, otherwise returns the other
                  Option.
                </SmallText>
              </FormGroup>
            )}
          </>
        );

      case "match":
        return (
          <>
            <FormGroup>
              <Label htmlFor="option-value">Option Value</Label>
              <Input
                id="option-value"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter a value to create an Option"
              />
              <SmallText>
                Enter null for None, any other value for Some.
              </SmallText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="on-some-fn">On Some Handler</Label>
              <TextArea
                id="on-some-fn"
                value={onSomeFn}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setOnSomeFn(e.target.value)
                }
                placeholder="(value) => result"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="on-none-fn">On None Handler</Label>
              <TextArea
                id="on-none-fn"
                value={onNoneFn}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setOnNoneFn(e.target.value)
                }
                placeholder="() => defaultResult"
              />
            </FormGroup>
          </>
        );

      case "combine":
        return (
          <>
            <OperationGrid>
              <OperationButton
                active={combineOperation === "firstSome"}
                onClick={() => setCombineOperation("firstSome")}
              >
                firstSome
              </OperationButton>
              <OperationButton
                active={combineOperation === "all"}
                onClick={() => setCombineOperation("all")}
              >
                all
              </OperationButton>
            </OperationGrid>

            <FormGroup>
              <Label htmlFor="options-input">Options (comma-separated)</Label>
              <TextArea
                id="options-input"
                value={optionsInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setOptionsInput(e.target.value)
                }
                placeholder="1, null, 'test', null"
              />
              <SmallText>
                Enter comma-separated values. Use null for None options.
                {combineOperation === "firstSome"
                  ? " Returns the first Some option, or None if all are None."
                  : " Returns Some([values]) if all options are Some, or None if any is None."}
              </SmallText>
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  const renderResult = (): JSX.Element | null => {
    if (!result) return null;

    if (isOptionCreateResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              value: result.value,
              result: result.result,
              isSome: result.isSome,
              isNone: result.isNone,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isOptionAccessResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
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

    if (isOptionTransformResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              transformFn: result.transformFn,
              predicate: result.predicate,
              otherOption: result.otherOption,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isOptionMatchResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              original: result.original,
              handlers: result.handlers,
              result: result.result,
            },
            null,
            2
          )}
        </Pre>
      );
    }

    if (isOptionCombineResult(result)) {
      return (
        <Pre>
          {JSON.stringify(
            {
              operation: result.operation,
              options: result.options,
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
        <Title>Option Type</Title>
        <Subtitle>
          MiLost provides a Rust-like Option type for representing optional
          values.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Option Operations</CardTitle>
        <TabsContainer>
          <Tab
            active={activeCategory === "create"}
            onClick={() => setActiveCategory("create")}
          >
            Create
          </Tab>
          <Tab
            active={activeCategory === "access"}
            onClick={() => setActiveCategory("access")}
          >
            Access
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
            active={activeCategory === "combine"}
            onClick={() => setActiveCategory("combine")}
          >
            Combine
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
        <CardTitle>Option API Examples</CardTitle>

        <CodeBlock>
          <Pre>{`import { Option } from "milost";

// Create an Option
const someValue = Option.Some(42);
const noneValue = Option.None();
const fromValue = Option.from(someValue);  // Some(42)
const fromNullable = Option.from(null);    // None

// Check if Some or None
console.log(someValue.isSome());   // true
console.log(noneValue.isNone());   // true

// Unwrap values
console.log(someValue.unwrap());         // 42
console.log(someValue.unwrapOr(0));      // 42
console.log(noneValue.unwrapOr(0));      // 0
console.log(someValue.expect("Error"));  // 42
// noneValue.unwrap() would throw an error
// noneValue.expect("Error") would throw an error with message "Error"

// Transform values
const doubled = someValue.map(x => x * 2);  // Some(84)
const filtered = someValue.filter(x => x > 50);  // None
const chained = someValue.andThen(x => Option.Some(x.toString()));  // Some("42")
const withFallback = noneValue.or(Option.Some("default"));  // Some("default")

// Pattern matching
const result = someValue.match(
  value => \`Got value: \${value}\`,
  () => "Got nothing"
);  // "Got value: 42"

// Working with multiple Options
const options = [Option.Some(1), Option.Some(2), Option.None(), Option.Some(3)];
const firstSome = Option.firstSome(...options);  // Some(1)
const allValues = Option.all(options);  // None (because one is None)
const validOptions = [Option.Some(1), Option.Some(2), Option.Some(3)];
const allValidValues = Option.all(validOptions);  // Some([1, 2, 3])`}</Pre>
        </CodeBlock>

        <SmallText>
          The Option type represents an optional value: every Option is either
          Some and contains a value, or None, and does not. Option types are
          very common in Rust code, as they have a number of uses:
          <ul>
            <li>Initial values</li>
            <li>
              Return values for functions that are not defined over their entire
              input range
            </li>
            <li>
              Return values for otherwise reporting simple errors, where None is
              returned on error
            </li>
            <li>Optional struct fields</li>
            <li>Optional function arguments</li>
            <li>Nullable pointers</li>
          </ul>
        </SmallText>
      </Card>
    </Container>
  );
}

export default OptionPage;
