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
} from "./Struct.styles";

function StructPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "immutability", label: "Immutability Principle" },
    { id: "design", label: "Design Philosophy" },
    { id: "patterns", label: "Usage Patterns" },
    { id: "benefits", label: "Key Benefits" },
    { id: "bestPractices", label: "Best Practices" },
    { id: "comparisons", label: "Comparisons" },
  ];

  return (
    <Container>
      <Header>
        <Title>Structured Data Handling</Title>
        <Subtitle>
          Exploring a safer, more predictable approach to working with complex
          data
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
              Traditional data structures often lead to unpredictable and
              error-prone code. A structured approach transforms how we think
              about and manage complex data.
            </InfoBox>

            <FormGroup>
              <Label>The Problem with Traditional Data Handling</Label>
              <ul>
                <li>Uncontrolled mutations</li>
                <li>Implicit type conversions</li>
                <li>Lack of clear data transformation paths</li>
                <li>Hidden side effects</li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional approach (problematic)
let user = { name: "John", age: 30 };
function updateUser(userData) {
  // Modifies original object directly
  userData.age += 1;
  return userData;
}

// What happens if this object is used elsewhere?
updateUser(user);  // Original object mutated unexpectedly`}</Pre>
            </CodeBlock>

            <SmallText>
              This approach leads to unpredictable behavior and makes tracking
              data changes challenging.
            </SmallText>
          </>
        )}

        {activeCategory === "immutability" && (
          <>
            <InfoBox>
              Immutability is about creating new data instances instead of
              modifying existing ones, ensuring predictability and preventing
              unintended side effects.
            </InfoBox>

            <FormGroup>
              <Label>Core Principles of Immutability</Label>
              <ul>
                <li>
                  <strong>Create, Don't Modify</strong>: Each operation returns
                  a new instance
                </li>
                <li>
                  <strong>Predictable State</strong>: Data remains consistent
                  throughout its lifecycle
                </li>
                <li>
                  <strong>Thread Safety</strong>: Eliminates race conditions in
                  concurrent environments
                </li>
                <li>
                  <strong>Easy Debugging</strong>: Clear data transformation
                  history
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Immutable approach
const user = { name: "John", age: 30 };
function birthday(userData) {
  // Creates a new object instead of modifying
  return { ...userData, age: userData.age + 1 };
}

const updatedUser = birthday(user);
console.log(user.age);        // Still 30
console.log(updatedUser.age); // 31`}</Pre>
            </CodeBlock>

            <SmallText>
              By creating new instances, we maintain the original data's
              integrity while clearly tracking transformations.
            </SmallText>
          </>
        )}

        {activeCategory === "design" && (
          <>
            <InfoBox>
              Structured data management is about creating a predictable,
              type-safe approach to handling complex information.
            </InfoBox>

            <FormGroup>
              <Label>Design Considerations</Label>
              <ul>
                <li>
                  <strong>Type Safety</strong>: Enforce strict typing at compile
                  and runtime
                </li>
                <li>
                  <strong>Explicit Transformations</strong>: Clear, intentional
                  data modifications
                </li>
                <li>
                  <strong>Performance Optimization</strong>: Efficient data
                  sharing and minimal copying
                </li>
                <li>
                  <strong>Functional Programming Principles</strong>: Treat data
                  as immutable, transformable entities
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Structured data design
class UserProfile {
  constructor(data) {
    // Freeze to prevent direct mutations
    this.data = Object.freeze({
      name: data.name,
      age: data.age,
      verified: false
    });
  }

  // Explicit transformation method
  verify() {
    // Returns new instance with updated state
    return new UserProfile({
      ...this.data,
      verified: true
    });
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              This approach creates a clear, predictable way of working with
              data.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              Effective data management is about choosing the right patterns for
              different scenarios.
            </InfoBox>

            <FormGroup>
              <Label>Common Structured Data Patterns</Label>
              <ul>
                <li>
                  <strong>Immutable Update</strong>: Create new instances on
                  changes
                </li>
                <li>
                  <strong>Selective Modification</strong>: Update specific
                  fields without affecting others
                </li>
                <li>
                  <strong>Nested Structure Handling</strong>: Safely manage
                  complex, multi-level data
                </li>
                <li>
                  <strong>Transformation Pipelines</strong>: Chain multiple data
                  transformations
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Transformation pipeline pattern
function processUserData(userData) {
  return userData
    .validate()     // Validate data
    .normalize()    // Standardize format
    .enrich()       // Add additional information
    .sanitize();    // Remove sensitive data
}

// Selective modification pattern
function updateUserPartial(user, updates) {
  return {
    ...user,
    ...updates  // Merge only specified fields
  };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These patterns provide flexible, predictable data management
              strategies.
            </SmallText>
          </>
        )}

        {activeCategory === "benefits" && (
          <>
            <InfoBox>
              Structured data handling offers significant advantages over
              traditional approaches.
            </InfoBox>

            <FormGroup>
              <Label>Advantages of Structured Data Management</Label>
              <ul>
                <li>
                  <strong>Predictability</strong>: Eliminate unexpected state
                  changes
                </li>
                <li>
                  <strong>Debugging Simplicity</strong>: Easier to track and
                  understand data transformations
                </li>
                <li>
                  <strong>Reduced Complexity</strong>: Clear, intentional data
                  manipulation
                </li>
                <li>
                  <strong>Enhanced Testability</strong>: Pure functions with
                  predictable outputs
                </li>
                <li>
                  <strong>Concurrent Safety</strong>: Eliminates race conditions
                  in multi-threaded environments
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional approach (error-prone)
function processOrder(order) {
  // Multiple potential side effects
  calculateTax(order);
  applyDiscount(order);
  updateInventory(order);
  return order;
}

// Structured approach (predictable)
function processOrder(order) {
  return order
    .calculateTax()
    .applyDiscount()
    .updateInventory();
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Each transformation becomes a clear, traceable step in data
              processing.
            </SmallText>
          </>
        )}

        {activeCategory === "bestPractices" && (
          <>
            <InfoBox>
              Effective structured data management requires thoughtful design
              and consistent practices.
            </InfoBox>

            <FormGroup>
              <Label>Best Practices for Data Handling</Label>
              <ul>
                <li>
                  <strong>Minimize Mutations</strong>: Create new instances
                  instead of modifying existing data
                </li>
                <li>
                  <strong>Use Explicit Transformations</strong>: Make data
                  changes clear and intentional
                </li>
                <li>
                  <strong>Leverage Type Systems</strong>: Use strong typing to
                  prevent errors
                </li>
                <li>
                  <strong>Keep Transformations Pure</strong>: Ensure functions
                  have no side effects
                </li>
                <li>
                  <strong>Validate at Boundaries</strong>: Check data integrity
                  when entering/exiting systems
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Bad Practice
function updateUser(user) {
  user.lastLogin = new Date();  // Direct mutation
  return user;
}

// Good Practice
function updateUser(user) {
  return {
    ...user,
    lastLogin: new Date()  // New instance with updated field
  };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Consistent application of these practices leads to more
              maintainable and robust code.
            </SmallText>
          </>
        )}

        {activeCategory === "comparisons" && (
          <>
            <InfoBox>
              Understanding how structured data management differs from
              traditional approaches.
            </InfoBox>

            <FormGroup>
              <Label>Comparison of Approaches</Label>
              <table>
                <thead>
                  <tr>
                    <th>Traditional Approach</th>
                    <th>Structured Approach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mutable objects</td>
                    <td>Immutable data structures</td>
                  </tr>
                  <tr>
                    <td>Direct modifications</td>
                    <td>Create new instances</td>
                  </tr>
                  <tr>
                    <td>Implicit changes</td>
                    <td>Explicit transformations</td>
                  </tr>
                  <tr>
                    <td>Difficult to track changes</td>
                    <td>Clear change history</td>
                  </tr>
                  <tr>
                    <td>Potential side effects</td>
                    <td>Predictable state management</td>
                  </tr>
                </tbody>
              </table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional (error-prone)
const config = { debug: false };
function enableDebug(config) {
  config.debug = true;  // Modifies original object
  return config;
}

// Structured (safe)
function enableDebug(config) {
  return {
    ...config,
    debug: true  // Creates new object
  };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              The structured approach provides clarity, safety, and
              predictability in data management.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default StructPage;
