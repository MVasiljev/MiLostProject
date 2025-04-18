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
  Pre,
  CodeBlock,
  SmallText,
  FormGroup,
  Label,
} from "./Option.styles";
import { InfoBox, Table } from "../Vector/Vector.styles";

function OptionPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "principles", label: "Core Principles" },
    { id: "benefits", label: "Benefits" },
    { id: "useCases", label: "Use Cases" },
    { id: "bestPractices", label: "Best Practices" },
    { id: "performance", label: "Performance" },
  ];

  return (
    <Container>
      <Header>
        <Title>Option Type</Title>
        <Subtitle>
          Safely Handle Optional Values with Explicit Error Management
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
              The <code>Option</code> type is a powerful abstraction for
              handling potentially absent values safely and explicitly,
              eliminating the risks associated with null and undefined.
            </InfoBox>

            <FormGroup>
              <Label>Key Features</Label>
              <ul>
                <li>
                  <strong>Null Safety</strong>: Eliminate null pointer
                  exceptions
                </li>
                <li>
                  <strong>Explicit Handling</strong>: Force consideration of
                  potentially absent values
                </li>
                <li>
                  <strong>Functional Composition</strong>: Chain operations
                  safely
                </li>
                <li>
                  <strong>Immutability</strong>: Preserve original data
                </li>
                <li>
                  <strong>Type Safety</strong>: Compile-time checks for optional
                  values
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use Option</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use Option When...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Value might be absent</td>
                    <td>Using null or undefined</td>
                  </tr>
                  <tr>
                    <td>Optional function parameters</td>
                    <td>Nullable arguments</td>
                  </tr>
                  <tr>
                    <td>Transforming potentially invalid data</td>
                    <td>Throwing exceptions</td>
                  </tr>
                  <tr>
                    <td>Representing optional configurations</td>
                    <td>Complex default value logic</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional approach
function getUserName(user) {
  // Risky! Might throw an error
  return user.name;
}

// Option type approach
function getUserName(user) {
  return Option.from(user)
    .map(u => u.name)
    .unwrapOr('Anonymous');
}`}</Pre>
            </CodeBlock>

            <SmallText>
              The Option type transforms how we handle potentially absent
              values, making code more robust and predictable by forcing
              explicit handling of null or undefined scenarios.
            </SmallText>
          </>
        )}

        {activeCategory === "principles" && (
          <>
            <InfoBox>
              Option type follows core functional programming principles of
              making potential absence of values explicit and manageable.
            </InfoBox>

            <FormGroup>
              <Label>Core Principles</Label>
              <ul>
                <li>
                  <strong>Explicit Representation</strong>: Clear distinction
                  between present and absent values
                </li>
                <li>
                  <strong>Immutable Transformations</strong>: Create new Option
                  instances instead of modifying existing ones
                </li>
                <li>
                  <strong>Safe Composition</strong>: Chain operations without
                  risking null pointer exceptions
                </li>
                <li>
                  <strong>Forced Error Handling</strong>: Require explicit
                  handling of potential absence
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Two primary states
const validOption = Option.Some(42);
const emptyOption = Option.None();

// Safe transformations
const processedValue = Option.from(input)
  .map(x => x * 2)         // Transform if value exists
  .filter(x => x > 10)     // Apply additional conditions
  .unwrapOr(0);            // Provide a default if conditions fail`}</Pre>
            </CodeBlock>

            <SmallText>
              These principles ensure that optional values are handled
              consistently and safely throughout your application.
            </SmallText>
          </>
        )}

        {activeCategory === "benefits" && (
          <>
            <InfoBox>
              The Option type provides numerous benefits for writing more robust
              and predictable code.
            </InfoBox>

            <FormGroup>
              <Label>Practical Benefits</Label>
              <ul>
                <li>
                  <strong>Null Safety</strong>: Prevent null pointer exceptions
                </li>
                <li>
                  <strong>Explicit Handling</strong>: Force consideration of
                  potentially absent values
                </li>
                <li>
                  <strong>Functional Composition</strong>: Chain operations
                  safely
                </li>
                <li>
                  <strong>Improved Readability</strong>: Make potential value
                  absence clear
                </li>
                <li>
                  <strong>Compile-Time Checks</strong>: Catch potential errors
                  before runtime
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Chaining operations safely
const result = Option.from(input)
  .andThen(parseInteger)
  .map(num => num * 2)
  .match(
    value => \`Doubled: \${value}\`,
    () => 'Invalid input'
  );

// Combining multiple options
const firstValidOption = Option.firstSome(
  Option.None(), 
  Option.Some(null), 
  Option.Some(42)
);

const allValidOptions = Option.all([
  Option.Some(1), 
  Option.Some(2), 
  Option.Some(3)
]);`}</Pre>
            </CodeBlock>

            <SmallText>
              These benefits demonstrate how the Option type helps create more
              reliable and maintainable code.
            </SmallText>
          </>
        )}

        {activeCategory === "useCases" && (
          <>
            <InfoBox>
              Option types are versatile and can be applied in various
              programming scenarios to improve code safety.
            </InfoBox>

            <FormGroup>
              <Label>Common Use Cases</Label>
              <ul>
                <li>
                  <strong>Configuration Management</strong>: Handle optional
                  configuration parameters
                </li>
                <li>
                  <strong>Data Parsing</strong>: Safely parse potentially
                  invalid input
                </li>
                <li>
                  <strong>API Responses</strong>: Handle potentially missing
                  data
                </li>
                <li>
                  <strong>Database Queries</strong>: Represent potentially
                  non-existent records
                </li>
                <li>
                  <strong>Complex Calculations</strong>: Handle potentially
                  undefined intermediate results
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Parsing configuration
function getConfig(key) {
  return Option.from(userConfig[key])
    .or(Option.from(defaultConfig[key]))
    .unwrapOr(null);
}

// Safely parsing user input
function parseAge(input) {
  return Option.from(input)
    .andThen(str => {
      const parsed = parseInt(str);
      return isNaN(parsed) ? Option.None() : Option.Some(parsed);
    })
    .filter(age => age >= 0 && age < 120)
    .unwrapOr(null);
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These use cases demonstrate the flexibility and power of the
              Option type in handling potentially absent or invalid values.
            </SmallText>
          </>
        )}

        {activeCategory === "bestPractices" && (
          <>
            <InfoBox>
              Following best practices ensures you get the most benefit from the
              Option type.
            </InfoBox>

            <FormGroup>
              <Label>Best Practices</Label>
              <ul>
                <li>
                  <strong>Always Handle None Case</strong>: Never ignore
                  potential absence of a value
                </li>
                <li>
                  <strong>Use Transformational Methods</strong>: Leverage `map`,
                  `andThen`, and `filter`
                </li>
                <li>
                  <strong>Provide Default Values</strong>: Use `unwrapOr` for
                  safe fallback
                </li>
                <li>
                  <strong>Avoid Force Unwrapping</strong>: Never use `.unwrap()`
                  without checking
                </li>
                <li>
                  <strong>Compose Safely</strong>: Chain operations with
                  confidence
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Good: Explicit handling
function processUser(user) {
  return Option.from(user)
    .map(u => u.name)
    .filter(name => name.length > 0)
    .unwrapOr('Anonymous');
}

// Bad: Ignoring potential absence
function badProcessUser(user) {
  return user.name; // Might throw an error
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These best practices help prevent runtime errors and make your
              code more predictable and maintainable.
            </SmallText>
          </>
        )}

        {activeCategory === "performance" && (
          <>
            <InfoBox>
              While Option provides safety, it's important to understand its
              performance characteristics.
            </InfoBox>

            <FormGroup>
              <Label>Performance Considerations</Label>
              <ul>
                <li>
                  <strong>Minimal Overhead</strong>: Slight performance impact
                  compared to raw null checks
                </li>
                <li>
                  <strong>Memory Efficiency</strong>: Lightweight implementation
                  with low memory footprint
                </li>
                <li>
                  <strong>Compile-Time Optimizations</strong>: Modern compilers
                  can optimize Option operations
                </li>
                <li>
                  <strong>Avoid Excessive Chaining</strong>: Be mindful of
                  complex operation chains
                </li>
                <li>
                  <strong>Use for Safety, Not Micro-Optimization</strong>:
                  Prioritize code clarity over marginal performance gains
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Performance-conscious usage
function processData(data) {
  // Prefer simple, clear transformations
  return Option.from(data)
    .map(processStep1)
    .andThen(processStep2)
    .unwrapOr(defaultValue);

  // Avoid overly complex chains
  // Bad: Multiple nested transformations
  function complexProcessing(data) {
    return Option.from(data)
      .map(step1)
      .andThen(step2)
      .andThen(step3)
      .andThen(step4)
      .andThen(step5)
      .unwrapOr(defaultValue);
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              While Option introduces a small performance overhead, the safety
              and clarity it provides often outweigh minimal performance
              considerations.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default OptionPage;
