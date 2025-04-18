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
  Label,
} from "./Result.styles";
import { FormGroup, InfoBox, Table } from "../Vector/Vector.styles";

function ResultPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "principles", label: "Core Principles" },
    { id: "benefits", label: "Benefits" },
    { id: "useCases", label: "Use Cases" },
    { id: "bestPractices", label: "Best Practices" },
    { id: "errorHandling", label: "Error Handling" },
  ];

  return (
    <Container>
      <Header>
        <Title>Result Type</Title>
        <Subtitle>
          Robust Error Handling with Functional Programming Principles
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
              The <code>Result</code> type is a powerful abstraction for
              handling operations that can either succeed with a value or fail
              with an error, providing explicit and safe error management.
            </InfoBox>

            <FormGroup>
              <Label>Key Features</Label>
              <ul>
                <li>
                  <strong>Explicit Error Handling</strong>: Represent success or
                  failure as first-class values
                </li>
                <li>
                  <strong>Type Safety</strong>: Compile-time checks for
                  potential errors
                </li>
                <li>
                  <strong>Functional Composition</strong>: Chain operations that
                  might fail
                </li>
                <li>
                  <strong>Predictable Error Management</strong>: Force handling
                  of potential failure scenarios
                </li>
                <li>
                  <strong>Immutability</strong>: Preserve original result state
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use Result</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use Result When...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Operations might fail</td>
                    <td>Throwing exceptions</td>
                  </tr>
                  <tr>
                    <td>Validating input</td>
                    <td>Boolean flags or null checks</td>
                  </tr>
                  <tr>
                    <td>Error-prone computations</td>
                    <td>Silent error handling</td>
                  </tr>
                  <tr>
                    <td>API calls with potential failures</td>
                    <td>Nested try-catch blocks</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Result type approach
function safeDivide(a, b) {
  return b === 0
    ? Result.Err(new Error('Division by zero'))
    : Result.Ok(a / b);
}`}</Pre>
            </CodeBlock>

            <SmallText>
              The Result type transforms error handling from a side effect to a
              first-class part of your program's logic.
            </SmallText>
          </>
        )}

        {activeCategory === "principles" && (
          <>
            <InfoBox>
              Result type embodies functional programming principles of explicit
              error management and predictable control flow.
            </InfoBox>

            <FormGroup>
              <Label>Core Principles</Label>
              <ul>
                <li>
                  <strong>Explicit Representation</strong>: Clearly distinguish
                  between successful and failed operations
                </li>
                <li>
                  <strong>Immutable Transformations</strong>: Create new Result
                  instances instead of modifying existing ones
                </li>
                <li>
                  <strong>Forced Error Handling</strong>: Require explicit
                  handling of potential errors
                </li>
                <li>
                  <strong>Composable Error Management</strong>: Chain and
                  transform results safely
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Two primary states
const successResult = Result.Ok(42);
const failureResult = Result.Err(new Error('Something went wrong'));

// Safe transformations
const processedResult = Result.from(operation)
  .map(value => value * 2)         // Transform successful results
  .mapErr(err => new CustomError(err)) // Transform errors
  .unwrapOr(0);                    // Provide a default on failure`}</Pre>
            </CodeBlock>

            <SmallText>
              These principles ensure consistent and predictable error handling
              across your application.
            </SmallText>
          </>
        )}

        {activeCategory === "benefits" && (
          <>
            <InfoBox>
              The Result type offers numerous advantages for robust error
              management and code clarity.
            </InfoBox>

            <FormGroup>
              <Label>Practical Benefits</Label>
              <ul>
                <li>
                  <strong>Compile-Time Safety</strong>: Catch potential error
                  scenarios at compile-time
                </li>
                <li>
                  <strong>Explicit Error Paths</strong>: Make error handling a
                  first-class concern
                </li>
                <li>
                  <strong>Reduced Exception Overhead</strong>: Avoid performance
                  costs of exception throwing
                </li>
                <li>
                  <strong>Functional Composition</strong>: Easily chain and
                  transform operations
                </li>
                <li>
                  <strong>Improved Readability</strong>: Make error scenarios
                  clear and predictable
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Chaining operations safely
const result = Result.from(fetchData)
  .andThen(parseData)
  .map(processData)
  .mapErr(logError)
  .match(
    value => \`Success: \${value}\`,
    error => \`Failed: \${error.message}\`
  );

// Combining multiple results
const combinedResults = Result.all([
  Result.Ok(1),
  Result.Ok(2),
  Result.Err(new Error('Failure'))
]);`}</Pre>
            </CodeBlock>

            <SmallText>
              These benefits demonstrate how the Result type improves error
              handling and code reliability.
            </SmallText>
          </>
        )}

        {activeCategory === "useCases" && (
          <>
            <InfoBox>
              Result types are versatile and can be applied in various scenarios
              to improve error management.
            </InfoBox>

            <FormGroup>
              <Label>Common Use Cases</Label>
              <ul>
                <li>
                  <strong>API Interactions</strong>: Handle network request
                  failures
                </li>
                <li>
                  <strong>Data Validation</strong>: Validate and transform input
                  data
                </li>
                <li>
                  <strong>Configuration Parsing</strong>: Handle potential
                  configuration errors
                </li>
                <li>
                  <strong>Database Operations</strong>: Manage database query
                  failures
                </li>
                <li>
                  <strong>Parsing and Serialization</strong>: Handle data
                  transformation errors
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// API request handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return Result.Ok(data);
  } catch (error) {
    return Result.Err(new ApiError('Failed to fetch user'));
  }
}

// Configuration parsing
function parseConfig(rawConfig) {
  return Result.from(() => {
    const config = JSON.parse(rawConfig);
    if (!config.requiredField) {
      throw new ValidationError('Missing required field');
    }
    return config;
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These use cases illustrate the flexibility of the Result type in
              managing potential failures.
            </SmallText>
          </>
        )}

        {activeCategory === "bestPractices" && (
          <>
            <InfoBox>
              Following best practices ensures effective use of the Result type.
            </InfoBox>

            <FormGroup>
              <Label>Best Practices</Label>
              <ul>
                <li>
                  <strong>Always Handle Errors</strong>: Never ignore potential
                  failure scenarios
                </li>
                <li>
                  <strong>Use Transformational Methods</strong>: Leverage `map`,
                  `andThen`, and `mapErr`
                </li>
                <li>
                  <strong>Provide Meaningful Errors</strong>: Create descriptive
                  error types
                </li>
                <li>
                  <strong>Avoid Force Unwrapping</strong>: Never use `.unwrap()`
                  without checking
                </li>
                <li>
                  <strong>Compose Safely</strong>: Chain operations with error
                  handling
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Good: Explicit error handling
function processUserData(userData) {
  return Result.from(() => {
    if (!userData.isValid()) {
      throw new ValidationError('Invalid user data');
    }
    return processData(userData);
  })
  .map(transformData)
  .mapErr(logError)
  .unwrapOr(defaultValue);

// Bad: Ignoring potential errors
function badProcessUserData(userData) {
  return processData(userData); // Might throw an unhandled exception
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These practices help create more robust and predictable error
              handling.
            </SmallText>
          </>
        )}

        {activeCategory === "errorHandling" && (
          <>
            <InfoBox>
              Effective error handling is crucial for building reliable and
              maintainable applications.
            </InfoBox>

            <FormGroup>
              <Label>Error Handling Strategies</Label>
              <ul>
                <li>
                  <strong>Centralized Error Management</strong>: Create
                  consistent error handling patterns
                </li>
                <li>
                  <strong>Granular Error Types</strong>: Use specific error
                  classes for different scenarios
                </li>
                <li>
                  <strong>Contextual Error Information</strong>: Include
                  relevant context in error objects
                </li>
                <li>
                  <strong>Logging and Monitoring</strong>: Implement
                  comprehensive error logging
                </li>
                <li>
                  <strong>Graceful Degradation</strong>: Provide fallback
                  mechanisms for failures
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Custom error handling
class AppError extends Error {
  constructor(message, code, context) {
    super(message);
    this.code = code;
    this.context = context;
  }
}

function createErrorHandler() {
  return {
    handle(result) {
      return result.match(
        value => handleSuccess(value),
        error => {
          logError(error);
          return handleFailure(error);
        }
      );
    }
  };
}

// Comprehensive error handling
const errorHandler = createErrorHandler();
const result = fetchData()
  .andThen(validateData)
  .andThen(processData)
  .mapErr(err => new AppError(
    'Operation failed', 
    'DATA_PROCESSING_ERROR', 
    { originalError: err }
  ));

errorHandler.handle(result);`}</Pre>
            </CodeBlock>

            <SmallText>
              Effective error handling goes beyond simple try-catch blocks,
              creating a robust error management strategy.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default ResultPage;
