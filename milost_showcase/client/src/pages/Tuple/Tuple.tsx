// src/pages/Tuple/Tuple.tsx
import { useState, ChangeEvent } from "react";
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

function TuplePage() {
  const [input, setInput] = useState("1, true, 'hello'");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) {
      setError("Please enter a tuple value");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tuple/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: input }),
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setResult(JSON.stringify(data.data, null, 2));
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Tuple Operations</Title>
        <Subtitle>
          Analyze and manipulate tuple data structures with MiLost's Rust/WASM
          backend.
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Tuple Analyzer</CardTitle>

        <FormGroup>
          <Label htmlFor="tuple-input">Enter a tuple</Label>
          <Input
            id="tuple-input"
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="e.g. 1, true, 'hello'"
          />
        </FormGroup>

        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Tuple"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>
              <Pre>
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </Pre>
            </ResultContent>
          </ResultContainer>
        )}
      </Card>

      <Card>
        <CardTitle>Tuple API Examples</CardTitle>
        <CodeBlock>
          <Pre>
            {`import { Tuple } from "milost";

// Construct a tuple
const tup = Tuple.from([1, true, "hello"]);

// Access elements
console.log(tup.get(0)); // 1
console.log(tup.get(2)); // "hello"

// Size
console.log(tup.len()); // 3

// Conversion
console.log(tup.toArray()); // [1, true, "hello"]`}
          </Pre>
        </CodeBlock>
        <SmallText>
          The Tuple type in MiLost gives you type-safe, index-based access and
          transformation utilities for heterogeneous data.
        </SmallText>
      </Card>
    </Container>
  );
}

export default TuplePage;
