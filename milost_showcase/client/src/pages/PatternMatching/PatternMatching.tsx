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
} from "./PatternMatching.styles";
import { Table } from "../Vector/Vector.styles";

function PatternMatchingPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "basic", label: "Basic Matching" },
    { id: "advanced", label: "Advanced Patterns" },
    { id: "builder", label: "Match Builder" },
    { id: "techniques", label: "Matching Techniques" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Pattern Matching</Title>
        <Subtitle>
          Powerful, Type-Safe Pattern Matching for Complex Data Structures
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
              Pattern matching is a powerful technique for analyzing and
              transforming data structures with compile-time safety and
              expressiveness.
            </InfoBox>

            <FormGroup>
              <Label>What is Pattern Matching?</Label>
              <p>
                Pattern matching provides a systematic way to deconstruct and
                analyze complex data structures, offering a more powerful
                alternative to traditional conditional logic.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Key Benefits</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Benefit</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Type Safety</td>
                    <td>Compile-time checks for pattern validity</td>
                  </tr>
                  <tr>
                    <td>Expressiveness</td>
                    <td>Concise handling of complex data structures</td>
                  </tr>
                  <tr>
                    <td>Exhaustiveness</td>
                    <td>Compiler ensures all cases are handled</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { matchValue } from "milost";

// Traditional Approach
function processValue(value) {
  if (value instanceof Option) {
    if (value.isSome()) {
      return processNonEmpty(value.unwrap());
    } else {
      return handleEmpty();
    }
  }

// Pattern Matching Approach
function processValue(value) {
  return matchValue(value, {
    Some: val => processNonEmpty(val),
    None: () => handleEmpty()
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Pattern matching transforms complex conditional logic into clear,
              concise, and type-safe code.
            </SmallText>
          </>
        )}

        {activeCategory === "basic" && (
          <>
            <InfoBox>
              Basic pattern matching allows matching against simple values,
              types, and conditions.
            </InfoBox>

            <FormGroup>
              <Label>Pattern Matching Types</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Match Type</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Value Match</td>
                    <td>Match exact values</td>
                    <td>
                      <code>[{`42, () => "Answer"`}]</code>
                    </td>
                  </tr>
                  <tr>
                    <td>Predicate Match</td>
                    <td>Match using condition functions</td>
                    <td>
                      <code>{`[x => x > 0, val => "Positive"]`}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>Wildcard Match</td>
                    <td>Match any value</td>
                    <td>
                      <code>{`[__, () => "Default"]`}</code>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { matchValue, __ } from "milost";

// Matching against values
const result = matchValue(someValue, [
  [42, () => "The answer"],
  [__, () => "Something else"]
]);

// Matching with predicates
const processNumber = matchValue(number, [
  [x => x > 0, val => "Positive"],
  [x => x < 0, val => "Negative"],
  [0, () => "Zero"]
]);

// Object pattern matching
const user = { name: "Alice", age: 30 };
const ageGroup = matchValue(user, [
  [{ age: x => x < 18 }, () => "Minor"],
  [{ age: x => x >= 18 && x < 65 }, () => "Adult"],
  [{ age: x => x >= 65 }, () => "Senior"]
]);`}</Pre>
            </CodeBlock>

            <SmallText>
              Basic pattern matching provides a flexible way to handle different
              value scenarios with minimal code.
            </SmallText>
          </>
        )}

        {activeCategory === "advanced" && (
          <>
            <InfoBox>
              Advanced pattern matching enables complex data structure
              deconstruction and conditional processing.
            </InfoBox>

            <FormGroup>
              <Label>Advanced Matching Techniques</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Description</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Type-Specific Matching</td>
                    <td>Match based on type and structure</td>
                    <td>Handling Option and Result types</td>
                  </tr>
                  <tr>
                    <td>Nested Matching</td>
                    <td>Match complex nested data structures</td>
                    <td>Deep data analysis</td>
                  </tr>
                  <tr>
                    <td>Conditional Matching</td>
                    <td>Apply predicates within matches</td>
                    <td>Sophisticated filtering</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { matchValue, Option, Result } from "milost";

// Matching Option types
const processOption = matchValue(someOption, {
  Some: value => processValue(value),
  None: () => handleEmptyCase()
});

// Matching Result types
const processResult = matchValue(apiResult, {
  Ok: value => processSuccessfulResult(value),
  Err: error => handleError(error)
});

// Complex nested matching
const complexMatch = matchValue(complexData, [
  [{ type: 'user', data: { age: x => x < 18 } }, data => "Junior User"],
  [{ type: 'admin', permissions: [] }, () => "Restricted Admin"],
  [{ type: 'admin', permissions: x => x.length > 0 }, data => "Powerful Admin"],
  [__, () => "Unknown Entity"]
]);`}</Pre>
            </CodeBlock>

            <SmallText>
              Advanced pattern matching allows for intricate data analysis with
              compile-time safety and expressiveness.
            </SmallText>
          </>
        )}

        {activeCategory === "builder" && (
          <>
            <InfoBox>
              The Match Builder provides a fluent, object-oriented approach to
              pattern matching.
            </InfoBox>

            <FormGroup>
              <Label>Match Builder Advantages</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Advantage</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fluent Interface</td>
                    <td>Chainable method calls for pattern definition</td>
                  </tr>
                  <tr>
                    <td>Readability</td>
                    <td>More intuitive and clear pattern expressions</td>
                  </tr>
                  <tr>
                    <td>Flexibility</td>
                    <td>Combine different matching strategies</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { MatchBuilder, __ } from "milost";

// Using Match Builder
const result = MatchBuilder.create(value)
  .with(42, () => "The answer")
  .with(x => x > 0, val => "Positive")
  .with(__, () => "Something else")
  .otherwise(() => "Default");

// Complex object matching
const processUser = MatchBuilder.create(user)
  .with({ age: x => x < 18 }, user => "Minor")
  .with({ role: 'admin' }, user => "Administrator")
  .with({ status: 'active' }, user => "Active User")
  .otherwise(() => "Unknown User");`}</Pre>
            </CodeBlock>

            <SmallText>
              Match Builder provides a more object-oriented and readable
              approach to pattern matching.
            </SmallText>
          </>
        )}

        {activeCategory === "techniques" && (
          <>
            <InfoBox>
              Advanced pattern matching techniques enable sophisticated data
              processing and analysis.
            </InfoBox>

            <FormGroup>
              <Label>Pattern Matching Techniques</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Description</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Exhaustive Matching</td>
                    <td>Compile-time checks for complete pattern coverage</td>
                    <td>Enum-like type handling</td>
                  </tr>
                  <tr>
                    <td>Hybrid Matching</td>
                    <td>Combine functional and builder-style matching</td>
                    <td>Complex data processing</td>
                  </tr>
                  <tr>
                    <td>Predicate Matching</td>
                    <td>Use functions to define complex match conditions</td>
                    <td>Dynamic pattern evaluation</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { matchValue, MatchBuilder } from "milost";

// Combining Multiple Matching Techniques
function complexDataProcessing(data) {
  // Functional-style matching
  const simpleResult = matchValue(data, [
    [x => Array.isArray(x), arr => \`Array of length \${arr.length}\`],
    [x => typeof x === 'object', obj => \`Object with keys: \${Object.keys(obj)}\`],
    [x => x === null, () => "Null value"],
    [__, () => "Primitive value"]
  ]);

  // Builder-style matching for more complex scenarios
  const advancedResult = MatchBuilder.create(data)
    .with(x => x instanceof Promise, async val => {
      const resolved = await val;
      return \`Resolved Promise: \${resolved}\`;
    })
    .with({ type: 'user' }, user => processUserData(user))
    .with({ type: 'config' }, config => validateConfig(config))
    .otherwise(() => "Unrecognized data structure");

  return { simple: simpleResult, advanced: advancedResult };
}

// Exhaustive Pattern Matching
function processPaymentMethod(method) {
  return matchValue(method, {
    CreditCard: card => processCredit(card),
    PayPal: payment => processPayPal(payment),
    BankTransfer: transfer => processBankTransfer(transfer),
    // Compiler ensures all payment methods are handled
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Advanced matching techniques provide powerful tools for
              sophisticated data analysis and transformation.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Real-world scenarios demonstrating the power of pattern matching.
            </InfoBox>

            <FormGroup>
              <Label>Example Scenarios</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Pattern Matching Technique</th>
                    <th>Key Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Authentication Flow</td>
                    <td>Result Type Matching</td>
                    <td>Precise error handling</td>
                  </tr>
                  <tr>
                    <td>API Response Processing</td>
                    <td>Complex Condition Matching</td>
                    <td>Flexible response handling</td>
                  </tr>
                  <tr>
                    <td>State Machine</td>
                    <td>Exhaustive State Matching</td>
                    <td>Clear state transition logic</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { matchValue, Option, Result } from "milost";

// Authentication Flow
function handleAuthResult(result) {
  return matchValue(result, {
    Ok: user => {
      logSuccessfulLogin(user);
      return navigateToDashboard(user);
    },
    Err: error => {
      if (error.type === 'InvalidCredentials') {
        showLoginError("Invalid username or password");
      } else if (error.type === 'AccountLocked') {
        showAccountLockedWarning();
      } else {
        showGenericError("Login failed");
      }
    }
  });
}

// Complex Data Transformation
function processApiResponse(response) {
  return matchValue(response, {
    // Successful user data retrieval
    { status: 200, data: { users: x => x.length > 0 } }: data => {
      const processedUsers = data.users.map(transformUser);
      return updateUserCache(processedUsers);
    },
    // Empty user list
    { status: 200, data: { users: [] } }: () => {
      showEmptyStateMessage();
      return [];
    },
    // Error handling
    { status: x => x >= 400 }: error => {
      logApiError(error);
      handleErrorNotification(error);
    },
    // Unexpected response format
    __: () => {
      reportUnexpectedResponseFormat();
      return null;
    }
  });
}

// State Machine Simulation
function trafficLightController(state) {
  return matchValue(state, {
    Red: () => stopTraffic(),
    Yellow: () => prepareToStop(),
    Green: () => proceedTraffic(),
    __: () => {
      logInvalidState(state);
      defaultTrafficState();
    }
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples illustrate how pattern matching can simplify
              complex conditional logic across various domains.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default PatternMatchingPage;
