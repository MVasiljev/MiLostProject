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
} from "./Reference.styles";
import { Table } from "../Vector/Vector.styles";

function ReferencePage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "immutable", label: "Immutable References" },
    { id: "mutable", label: "Mutable References" },
    { id: "patterns", label: "Reference Patterns" },
    { id: "safety", label: "Safety Guarantees" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Reference Types</Title>
        <Subtitle>
          Controlled Resource Borrowing with Compile-Time Safety
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
              References in systems programming provide a powerful mechanism for
              safely borrowing and accessing resources without transferring
              ownership.
            </InfoBox>

            <FormGroup>
              <Label>What are References?</Label>
              <p>
                References are a core concept in memory-safe programming,
                allowing temporary, controlled access to resources with strict
                compile-time guarantees.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Key Concepts</Label>
              <ul>
                <li>
                  <strong>Borrowing</strong>: Temporary access to a resource
                </li>
                <li>
                  <strong>Ownership Control</strong>: Prevent unauthorized
                  modifications
                </li>
                <li>
                  <strong>Compile-Time Safety</strong>: Eliminate runtime errors
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Reference Types</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Reference Type</th>
                    <th>Characteristics</th>
                    <th>Primary Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Immutable Reference</td>
                    <td>Read-only, multiple simultaneous references</td>
                    <td>Safe data reading</td>
                  </tr>
                  <tr>
                    <td>Mutable Reference</td>
                    <td>Exclusive, single mutable access</td>
                    <td>Controlled data modification</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Overview section
import { Ref, RefMut } from "milost";

// Traditional Approach (Error-Prone)
function oldDataProcessing(data) {
  // No guarantees about data lifecycle or access
  modifyData(data);
}

// Reference Approach (Safe)
function safeDataProcessing(data) {
  // Create a safe reference with controlled access
  const ref = Ref.create(data);
  
  // Safely borrow and use the reference
  ref.borrow(value => {
    processValue(value);
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              References transform resource access from a potential source of
              bugs to a predictable, safe system integrated into the language
              design.
            </SmallText>
          </>
        )}

        {activeCategory === "immutable" && (
          <>
            <InfoBox>
              Immutable references provide safe, read-only access to resources
              with multiple simultaneous references.
            </InfoBox>

            <FormGroup>
              <Label>Immutable Reference Principles</Label>
              <ol>
                <li>
                  <strong>Read-Only Access</strong>: Cannot modify the
                  underlying data
                </li>
                <li>
                  <strong>Multiple References</strong>: Multiple readers allowed
                  simultaneously
                </li>
                <li>
                  <strong>Compile-Time Safety</strong>: Prevents unexpected
                  modifications
                </li>
              </ol>
            </FormGroup>

            <FormGroup>
              <Label>Key Characteristics</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Aspect</th>
                    <th>Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Modification</td>
                    <td>Strictly read-only</td>
                  </tr>
                  <tr>
                    <td>Concurrent Access</td>
                    <td>Multiple simultaneous references allowed</td>
                  </tr>
                  <tr>
                    <td>Lifetime</td>
                    <td>Automatically managed, cannot outlive source</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Immutable Reference Usage
import { Ref } from "milost";

function analyzeData(data) {
  // Create an immutable reference
  const ref = Ref.create(data);
  
  // Multiple safe reads possible
  const result1 = ref.borrow(value => calculateAverage(value));
  const result2 = ref.borrow(value => findMaximum(value));
  
  return { average: result1, maximum: result2 };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Immutable references provide a safe way to share data across
              different parts of a program without risk of unexpected changes.
            </SmallText>
          </>
        )}

        {activeCategory === "mutable" && (
          <>
            <InfoBox>
              Mutable references provide exclusive, controlled access to modify
              resources temporarily.
            </InfoBox>

            <FormGroup>
              <Label>Mutable Reference Principles</Label>
              <ol>
                <li>
                  <strong>Exclusive Access</strong>: Only one mutable reference
                  at a time
                </li>
                <li>
                  <strong>Controlled Modification</strong>: Temporary, safe
                  mutation
                </li>
                <li>
                  <strong>Prevent Data Races</strong>: Compile-time checks
                  ensure safety
                </li>
              </ol>
            </FormGroup>

            <FormGroup>
              <Label>Key Characteristics</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Aspect</th>
                    <th>Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access</td>
                    <td>Exclusive, single mutable reference</td>
                  </tr>
                  <tr>
                    <td>Modification</td>
                    <td>Full read and write access</td>
                  </tr>
                  <tr>
                    <td>Concurrent Access</td>
                    <td>No other references allowed during mutation</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Mutable Reference Usage
import { RefMut } from "milost";

function updateData(data) {
  // Create a mutable reference
  const ref = RefMut.create(data);
  
  // Exclusive, controlled modification
  ref.set(value => {
    // Safely modify the value
    return transformValue(value);
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Mutable references provide a controlled mechanism for temporary
              modification, preventing common concurrency and mutation-related
              bugs.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              Reference patterns provide structured approaches to safely
              managing resource access and modification.
            </InfoBox>

            <FormGroup>
              <Label>Reference Usage Patterns</Label>
              <ul>
                <li>
                  <strong>Temporary Borrowing</strong>: Short-term resource
                  access
                </li>
                <li>
                  <strong>Safe Mutation</strong>: Controlled, exclusive
                  modification
                </li>
                <li>
                  <strong>Lifetime Management</strong>: Automatic reference
                  tracking
                </li>
                <li>
                  <strong>Composition</strong>: Combining references safely
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Advanced Reference Techniques</Label>
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
                    <td>Nested Borrowing</td>
                    <td>Chained references with controlled access</td>
                    <td>Complex data transformation</td>
                  </tr>
                  <tr>
                    <td>Conditional Access</td>
                    <td>Safe, guarded reference manipulation</td>
                    <td>Defensive programming</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Reference Composition Pattern
import { Ref, RefMut } from "milost";

function processData(data) {
  const ref = Ref.create(data);
  
  return ref.borrow(value => {
    if (value.length === 0) {
      return [];
    }
    
    const mutableRef = RefMut.create(value);
    
    return mutableRef.set(items => 
      items.filter(item => item > 0)
    );
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Advanced reference patterns enable sophisticated data manipulation
              while maintaining strict safety guarantees.
            </SmallText>
          </>
        )}

        {activeCategory === "safety" && (
          <>
            <InfoBox>
              References provide compile-time safety mechanisms to prevent
              common memory management errors.
            </InfoBox>

            <FormGroup>
              <Label>Safety Guarantees</Label>
              <ul>
                <li>
                  <strong>No Dangling References</strong>: Prevent accessing
                  invalid memory
                </li>
                <li>
                  <strong>Exclusive Mutation</strong>: Prevent simultaneous
                  mutable access
                </li>
                <li>
                  <strong>Lifetime Tracking</strong>: Ensure references don't
                  outlive their source
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Common Error Prevention</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Error Type</th>
                    <th>Prevention Mechanism</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Use-After-Free</td>
                    <td>Compile-time reference lifetime checks</td>
                  </tr>
                  <tr>
                    <td>Data Races</td>
                    <td>Exclusive mutable access rules</td>
                  </tr>
                  <tr>
                    <td>Unintended Mutations</td>
                    <td>Immutable reference guarantees</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`// Safety Guarantees Demonstration
import { Ref, RefMut } from "milost";

function demonstrateSafetyGuarantees(data) {
  // Prevent simultaneous mutable and immutable access
  const ref = Ref.create(data);
  
  // Multiple simultaneous reads are safe
  ref.borrow(value => processA(value));
  ref.borrow(value => processB(value));

  // Mutable reference ensures exclusive access
  const mutableRef = RefMut.create(data);
  mutableRef.set(value => {
    // Exclusive modification
    return transformValue(value);
  });

  // Attempting to create another reference during mutation would fail
  // This prevents data races and unexpected modifications
}

// Error Prevention Example
function preventDanglingReferences(data) {
  const ref = Ref.create(data);
  
  // References automatically become invalid after use
  const processedValue = ref.borrow(value => {
    // Process and transform value
    return heavyComputation(value);
  });
  
  // Attempting to use the reference again would fail
  // ref.borrow(...) is no longer valid
}`}</Pre>
            </CodeBlock>

            <SmallText>
              By enforcing strict rules at compile-time, references eliminate
              entire classes of memory-related bugs.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Practical scenarios demonstrating the power and safety of
              reference types.
            </InfoBox>

            <CodeBlock>
              <Pre>{`// Comprehensive Reference Usage
import { Ref, RefMut } from "milost";

function processUserData(users) {
  const ref = Ref.create(users);
  
  // Safe, read-only analysis
  const activeUsers = ref.borrow(data => 
    data.filter(user => user.isActive)
  );

  const mutableRef = RefMut.create(users);
  
  // Controlled, exclusive modification
  const updatedUsers = mutableRef.set(data => 
    data.map(user => ({
      ...user,
      lastProcessed: new Date()
    }))
  );

  return { activeUsers, updatedUsers };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples illustrate how references provide safe, controlled
              access to data with minimal overhead.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default ReferencePage;
