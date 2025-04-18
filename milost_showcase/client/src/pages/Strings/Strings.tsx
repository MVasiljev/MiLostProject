import { useState } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  TabsContainer,
  Tab,
  InfoBox,
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Strings.styles";

function StringsPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "creation", label: "Creating Strings" },
    { id: "transform", label: "Transformations" },
    { id: "substring", label: "Working with Parts" },
    { id: "search", label: "Searching" },
    { id: "manipulate", label: "Manipulation" },
    { id: "comparison", label: "Comparison" },
    { id: "performance", label: "Performance" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>String Handling</Title>
        <Subtitle>
          Learn how to safely and immutably manipulate strings with MiLost's
          <code>Str</code> type powered by WebAssembly
        </Subtitle>
      </Header>

      <TabsContainer>
        {categories.map((category) => (
          <Tab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Tab>
        ))}
      </TabsContainer>

      <Card>
        <CardTitle>
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </CardTitle>

        {activeCategory === "overview" && (
          <>
            <InfoBox>
              The <code>Str</code> type in MiLost provides an immutable,
              Rust-inspired string API for JavaScript and TypeScript. It's
              designed for predictability, performance, and correctness.
            </InfoBox>

            <FormGroup>
              <Label>Why use Str over regular strings?</Label>
              <ul>
                <li>
                  <strong>Immutability</strong>: Eliminates side effects
                </li>
                <li>
                  <strong>Type-safety</strong>: Reduces reliance on
                  null/undefined
                </li>
                <li>
                  <strong>Functional API</strong>: Encourages transformation
                  pipelines
                </li>
                <li>
                  <strong>WASM-optimized</strong>: High-performance for large
                  text
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";

const message = Str.fromRaw("Hello, World!");
console.log(message.len()); // 13
console.log(message.isEmpty()); // false`}</Pre>
            </CodeBlock>

            <SmallText>
              Unlike native strings in JavaScript, <code>Str</code> enforces
              immutability and correctness by default — no accidental mutation,
              no silent failures.
            </SmallText>
          </>
        )}

        {activeCategory === "creation" && (
          <>
            <InfoBox>
              Strings in MiLost are created explicitly with safety in mind.
            </InfoBox>

            <FormGroup>
              <Label>Construction Methods</Label>
              <ul>
                <li>
                  <code>Str.fromRaw("text")</code>: Wrap a native string
                </li>
                <li>
                  <code>Str.empty()</code>: Create an empty string
                </li>
                <li>
                  <code>Str.fromChar('x')</code>: Build from a single character
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";

const greeting = Str.fromRaw("Hi");
const space = Str.fromChar(" ");
const empty = Str.empty();

console.log(greeting.len()); // 2
console.log(empty.isEmpty()); // true`}</Pre>
            </CodeBlock>

            <SmallText>
              Always construct strings through <code>Str</code> to gain type
              guarantees and avoid inconsistent behavior from native JS strings.
            </SmallText>
          </>
        )}

        {activeCategory === "transform" && (
          <>
            <InfoBox>
              Every transformation in MiLost is pure and non-destructive. You’ll
              never modify an existing string.
            </InfoBox>

            <FormGroup>
              <Label>Common Transformations</Label>
              <ul>
                <li>
                  <code>.toUpperCase()</code>
                </li>
                <li>
                  <code>.toLowerCase()</code>
                </li>
                <li>
                  <code>.trim()</code>
                </li>
                <li>
                  <code>.reverse()</code>
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
const input = Str.fromRaw("  Example String  ");

const upper = input.toUpperCase();
const trimmed = input.trim();
const reversed = input.reverse();

console.log(trimmed.unwrap()); // "Example String"
console.log(reversed.unwrap()); // "  gnirtS elpmaxE  "`}</Pre>
            </CodeBlock>

            <SmallText>
              Use transformation chains to build clear data pipelines:
              <code>input.trim().toUpperCase()</code>
            </SmallText>
          </>
        )}

        {activeCategory === "substring" && (
          <>
            <InfoBox>
              MiLost provides safe and expressive ways to access parts of
              strings.
            </InfoBox>

            <FormGroup>
              <Label>Working with Substrings</Label>
              <ul>
                <li>
                  <code>.substring(start, end)</code>
                </li>
                <li>
                  <code>.charAt(index)</code>
                </li>
                <li>
                  <code>.startsWith()</code>, <code>.endsWith()</code>
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
const word = Str.fromRaw("Immutable");

console.log(word.substring(0, 5).unwrap()); // "Immut"
console.log(word.charAt(2)); // "m"
console.log(word.startsWith("Im")); // true
console.log(word.endsWith("ble")); // true`}</Pre>
            </CodeBlock>

            <SmallText>
              Indexing is bounds-checked and safe. You’ll never get
              <code>undefined</code> — only valid results or handled errors.
            </SmallText>
          </>
        )}

        {activeCategory === "search" && (
          <>
            <InfoBox>
              MiLost enables flexible search operations over string content.
            </InfoBox>

            <FormGroup>
              <Label>Search Methods</Label>
              <ul>
                <li>
                  <code>.contains(text)</code>
                </li>
                <li>
                  <code>.indexOf(text)</code>
                </li>
                <li>
                  <code>.lastIndexOf(text)</code>
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
const title = Str.fromRaw("MiLost Library");

console.log(title.contains("Lib")); // true
console.log(title.indexOf("i")); // 1
console.log(title.lastIndexOf("i")); // 10`}</Pre>
            </CodeBlock>

            <SmallText>
              Searching is fast and safe — perfect for parsing structured or
              freeform input.
            </SmallText>
          </>
        )}

        {activeCategory === "manipulate" && (
          <>
            <InfoBox>
              Sometimes you want to modify structure, not just content. These
              operations let you reshape strings.
            </InfoBox>

            <FormGroup>
              <Label>Manipulation Methods</Label>
              <ul>
                <li>
                  <code>.replace(old, new)</code>
                </li>
                <li>
                  <code>.split(separator)</code>
                </li>
                <li>
                  <code>.concat(otherStr)</code>
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
const raw = Str.fromRaw("hello world");
const updated = raw.replace("world", "MiLost");
console.log(updated.unwrap()); // "hello MiLost"

const parts = raw.split(" ");
console.log(parts.map(p => p.unwrap())); // ["hello", "world"]

const joined = raw.concat(Str.fromRaw("!"));
console.log(joined.unwrap()); // "hello world!"`}</Pre>
            </CodeBlock>

            <SmallText>
              Always remember: these operations don’t mutate the original
              string. Capture their return value!
            </SmallText>
          </>
        )}

        {activeCategory === "comparison" && (
          <>
            <InfoBox>
              String comparisons can be tricky in JS. MiLost makes them explicit
              and safe.
            </InfoBox>

            <FormGroup>
              <Label>Comparison Utilities</Label>
              <ul>
                <li>
                  <code>.equals(otherStr)</code>: Deep equality check
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
const a = Str.fromRaw("test");
const b = Str.fromRaw("test");
const c = Str.fromRaw("Test");

console.log(a.equals(b)); // true
console.log(a.equals(c)); // false`}</Pre>
            </CodeBlock>

            <SmallText>
              Always use <code>equals()</code> for predictable, value-based
              comparison.
            </SmallText>
          </>
        )}

        {activeCategory === "performance" && (
          <>
            <InfoBox>
              MiLost's <code>Str</code> combines safety and speed using
              WebAssembly.
            </InfoBox>

            <FormGroup>
              <Label>Performance Design</Label>
              <ul>
                <li>
                  <strong>WASM acceleration</strong> for core string logic
                </li>
                <li>
                  <strong>Immutability</strong> allows structural sharing and
                  caching
                </li>
                <li>
                  <strong>Predictable costs</strong> for large-text workloads
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";
function benchmark() {
  const start = performance.now();
  let str = Str.empty();

  for (let i = 0; i < 10000; i++) {
    str = str.concat(Str.fromRaw("x"));
  }

  const end = performance.now();
  console.log(\`Built string of len: \${str.len()} in \${end - start}ms\`);
}

benchmark();`}</Pre>
            </CodeBlock>

            <SmallText>
              For small-scale or interactive workloads, performance will be more
              than sufficient. Measure before optimizing.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Here’s a full walkthrough showing how to compose <code>Str</code>{" "}
              operations in real code.
            </InfoBox>

            <CodeBlock>
              <Pre>{`import { Str } from "milost";

const raw = Str.fromRaw("  hello milost  ");
const clean = raw.trim().toUpperCase();

console.log(clean.unwrap()); // "HELLO MILOST"

const hasWord = clean.contains("MILOST");
console.log(hasWord); // true

const final = clean.concat(Str.fromRaw("!"));
console.log(final.unwrap()); // "HELLO MILOST!"`}</Pre>
            </CodeBlock>

            <SmallText>
              Composing pure transformations gives you clean, safe code that’s
              easy to follow.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default StringsPage;
