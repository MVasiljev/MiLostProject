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
} from "./Tuple.styles";
import { Table } from "../Vector/Vector.styles";

function TuplePage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "fundamentals", label: "Core Concepts" },
    { id: "advantages", label: "Advantages" },
    { id: "useCases", label: "Use Cases" },
    { id: "complexity", label: "Complexity Management" },
    { id: "patterns", label: "Design Patterns" },
    { id: "antiPatterns", label: "Anti-Patterns" },
  ];

  return (
    <Container>
      <Header>
        <Title>Heterogeneous Data Structures</Title>
        <Subtitle>
          Understanding Tuples: A Powerful Way to Handle Mixed-Type Collections
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
              Tuples represent a fundamental way to group different types of
              data with fixed structure and known positions.
            </InfoBox>

            <FormGroup>
              <Label>The Limitations of Traditional Arrays</Label>
              <ul>
                <li>No type safety for mixed collections</li>
                <li>Lack of semantic meaning</li>
                <li>Unclear data relationships</li>
                <li>Difficulty in expressing intent</li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use Tuples</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use Tuples when you need...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fixed-length, heterogeneous data grouping</td>
                    <td>Dynamic arrays with unclear element meanings</td>
                  </tr>
                  <tr>
                    <td>Semantic, positionally meaningful data</td>
                    <td>Unnamed, context-less data collections</td>
                  </tr>
                  <tr>
                    <td>Immutable data representations</td>
                    <td>Mutable objects that can change unexpectedly</td>
                  </tr>
                  <tr>
                    <td>Multiple return value handling</td>
                    <td>Complex object returns or reference passing</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Traditional array approach
const mixedData = [42, "hello", true];
// What does each index mean? No clear context.

// Problematic access
function processData(data) {
  // No guarantee of type or position
  const value = data[1];  
  // Is this always a string? Always at index 1?
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Traditional arrays lack the precision and safety needed for
              complex data representations.
            </SmallText>
          </>
        )}

        {activeCategory === "fundamentals" && (
          <>
            <InfoBox>
              Tuples provide a structured approach to grouping heterogeneous
              data with strong type guarantees and immutability.
            </InfoBox>

            <FormGroup>
              <Label>Core Characteristics of Tuples</Label>
              <ul>
                <li>
                  <strong>Fixed Length</strong>: Predetermined number of
                  elements
                </li>
                <li>
                  <strong>Heterogeneous Types</strong>: Can contain different
                  types of data
                </li>
                <li>
                  <strong>Positional Semantics</strong>: Each position has a
                  specific meaning
                </li>
                <li>
                  <strong>Immutability</strong>: Cannot be modified after
                  creation
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Tuple-like approach with semantic meaning
const userRecord = {
  id: 42,
  name: "John Doe",
  isActive: true
};

// Better: Clear structure, immutable
function createUserTuple(id, name, isActive) {
  return Object.freeze([id, name, isActive]);
}

const user = createUserTuple(42, "John Doe", true);
// Accessing with clear intent
const userId = user[0];      // Clearly the ID
const userName = user[1];    // Clearly the name`}</Pre>
            </CodeBlock>

            <SmallText>
              Tuples bring clarity and intentionality to data representation.
            </SmallText>
          </>
        )}

        {activeCategory === "advantages" && (
          <>
            <InfoBox>
              Tuples offer significant benefits over traditional data structures
              in terms of safety, clarity, and expressiveness.
            </InfoBox>

            <FormGroup>
              <Label>Key Advantages</Label>
              <ul>
                <li>
                  <strong>Type Safety</strong>: Compile-time checks for type
                  consistency
                </li>
                <li>
                  <strong>Immutability</strong>: Prevent unexpected
                  modifications
                </li>
                <li>
                  <strong>Performance</strong>: Efficient memory layout and
                  access
                </li>
                <li>
                  <strong>Semantic Clarity</strong>: Express data relationships
                  explicitly
                </li>
                <li>
                  <strong>Functional Programming</strong>: Support pure,
                  predictable transformations
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Complex data with clear structure
function processCoordinates(point) {
  const [x, y, z] = point;
  return {
    magnitude: Math.sqrt(x*x + y*y + z*z),
    normalized: [
      x / Math.sqrt(x*x + y*y + z*z),
      y / Math.sqrt(x*x + y*y + z*z),
      z / Math.sqrt(x*x + y*y + z*z)
    ]
  };
}

const point3D = [3, 4, 5];
const result = processCoordinates(point3D);`}</Pre>
            </CodeBlock>

            <SmallText>
              Tuples provide a clean, expressive way to handle structured data.
            </SmallText>
          </>
        )}

        {activeCategory === "useCases" && (
          <>
            <InfoBox>
              Tuples excel in scenarios requiring compact, type-safe
              representations of related data.
            </InfoBox>

            <FormGroup>
              <Label>Practical Use Cases</Label>
              <ul>
                <li>
                  <strong>Coordinate Systems</strong>: Representing 2D/3D points
                </li>
                <li>
                  <strong>API Responses</strong>: Grouping related return values
                </li>
                <li>
                  <strong>Configuration</strong>: Storing related settings
                </li>
                <li>
                  <strong>Database Records</strong>: Lightweight data containers
                </li>
                <li>
                  <strong>Algorithm Results</strong>: Multiple return values
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Multiple return value pattern
function divideWithRemainder(a, b) {
  const quotient = Math.floor(a / b);
  const remainder = a % b;
  return [quotient, remainder];
}

const [result, leftover] = divideWithRemainder(10, 3);
console.log(result);    // 3
console.log(leftover);  // 1

// Configuration tuple
const serverConfig = [
  'localhost',  // host
  8080,         // port
  true          // secure
];`}</Pre>
            </CodeBlock>

            <SmallText>
              Tuples provide elegant solutions for complex data grouping.
            </SmallText>
          </>
        )}

        {activeCategory === "complexity" && (
          <>
            <InfoBox>
              Managing complexity is crucial when working with heterogeneous
              data structures.
            </InfoBox>

            <FormGroup>
              <Label>Complexity Management Strategies</Label>
              <ul>
                <li>
                  <strong>Type Annotations</strong>: Provide clear type
                  information
                </li>
                <li>
                  <strong>Destructuring</strong>: Extract values with clarity
                </li>
                <li>
                  <strong>Immutable Transformations</strong>: Create new tuples
                  instead of modifying
                </li>
                <li>
                  <strong>Consistent Indexing</strong>: Maintain predictable
                  element positions
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Complex data management
class UserProfile {
  constructor(details) {
    // Immutable tuple-like structure
    this.data = Object.freeze([
      details.id,        // Unique identifier
      details.name,      // Full name
      details.email,     // Contact email
      details.roles      // Access roles
    ]);
  }

  // Immutable update method
  updateRoles(newRoles) {
    return Object.freeze([
      this.data[0],      // Keep original ID
      this.data[1],      // Keep original name
      this.data[2],      // Keep original email
      newRoles           // Update roles
    ]);
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Thoughtful design prevents complexity from becoming unmanageable.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              Design patterns help structure and manage tuple-based data more
              effectively.
            </InfoBox>

            <FormGroup>
              <Label>Effective Design Patterns</Label>
              <ul>
                <li>
                  <strong>Immutable Constructor</strong>: Create tuples with
                  guaranteed immutability
                </li>
                <li>
                  <strong>Transformation Method</strong>: Create new tuples
                  instead of modifying
                </li>
                <li>
                  <strong>Semantic Indexing</strong>: Use constants for index
                  access
                </li>
                <li>
                  <strong>Type Guard</strong>: Validate tuple structure
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Advanced tuple pattern
const USER_TUPLE = {
  ID: 0,
  NAME: 1,
  EMAIL: 2,
  ROLES: 3
};

function createUserTuple(id, name, email, roles) {
  return Object.freeze([id, name, email, roles]);
}

function isValidUserTuple(tuple) {
  return (
    tuple.length === 4 &&
    typeof tuple[USER_TUPLE.ID] === 'number' &&
    typeof tuple[USER_TUPLE.NAME] === 'string'
  );
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Patterns provide structure and predictability to tuple usage.
            </SmallText>
          </>
        )}

        {activeCategory === "antiPatterns" && (
          <>
            <InfoBox>
              Understanding common pitfalls helps create more robust tuple-based
              designs.
            </InfoBox>

            <FormGroup>
              <Label>Tuple Anti-Patterns to Avoid</Label>
              <ul>
                <li>
                  <strong>Magic Indexing</strong>: Using hard-coded, unexplained
                  indices
                </li>
                <li>
                  <strong>Mutable Tuples</strong>: Allowing modifications after
                  creation
                </li>
                <li>
                  <strong>Overloading</strong>: Putting too much unrelated data
                  in one tuple
                </li>
                <li>
                  <strong>Ignoring Type Safety</strong>: Bypassing type checks
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Anti-Pattern: Unclear, mutable tuple
let userData = [123, "John"];
userData[1] = "Jane";  // Unexpected mutation

// Better Approach
const createUser = (id, name) => Object.freeze([id, name]);
const user = createUser(123, "John");
// user[1] = "Jane";  // This would throw an error`}</Pre>
            </CodeBlock>

            <SmallText>
              Avoiding these patterns leads to more maintainable code.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default TuplePage;
