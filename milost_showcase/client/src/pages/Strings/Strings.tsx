import { useState } from "react";
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
  Select,
  ButtonGrid,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
  ResultContainer,
  ResultTitle,
  ResultContent,
  Pre,
  CodeBlock,
  SmallText,
} from "./Strings.styles";

function Strings() {
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState<
    "uppercase" | "lowercase" | "trim"
  >("uppercase");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleCreateString = async () => {
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

      const data = await response.json();

      if (response.ok) {
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

  const handleStringOperation = async () => {
    if (!inputValue) {
      setError("Please enter a string value");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/string/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue, operation }),
      });

      const data = await response.json();

      if (response.ok) {
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
        <CardTitle>Try It Out</CardTitle>

        <FormGroup>
          <Label htmlFor="string-input">Enter a string</Label>
          <Input
            id="string-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text here..."
          />
        </FormGroup>

        <ButtonGrid>
          <div>
            <PrimaryButton onClick={handleCreateString} disabled={loading}>
              {loading ? "Processing..." : "Analyze String"}
            </PrimaryButton>
          </div>

          <div>
            <FormGroup>
              <Label htmlFor="operation">Operation</Label>
              <Select
                id="operation"
                value={operation}
                onChange={(e) => setOperation(e.target.value as any)}
              >
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="trim">Trim</option>
              </Select>
            </FormGroup>
          </div>
        </ButtonGrid>

        <SecondaryButton onClick={handleStringOperation} disabled={loading}>
          {loading ? "Processing..." : `Apply ${operation} Operation`}
        </SecondaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>
              <Pre>{JSON.stringify(result, null, 2)}</Pre>
            </ResultContent>
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

// Check properties
console.log(hello.len());        // 13
console.log(hello.isEmpty());    // false

// Transform
const upper = hello.toUpperCase();
console.log(upper.unwrap());     // "HELLO, WORLD!"

const lower = hello.toLowerCase();
console.log(lower.unwrap());     // "hello, world!"

// Trim whitespace
const padded = Str.fromRaw("  trim me  ");
console.log(padded.trim().unwrap());  // "trim me"`}
          </Pre>
        </CodeBlock>

        <SmallText>
          These examples demonstrate basic string operations. The library
          provides many more methods for advanced string manipulation, pattern
          matching, and transformation.
        </SmallText>
      </Card>
    </Container>
  );
}

export default Strings;
