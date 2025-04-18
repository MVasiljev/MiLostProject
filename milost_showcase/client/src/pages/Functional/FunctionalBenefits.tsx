import React from "react";
import {
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";
import { InfoBox, Table } from "../Vector/Vector.styles";

const FunctionalBenefits: React.FC = () => {
  return (
    <React.Fragment>
      <InfoBox>
        Functional programming offers numerous benefits that improve code
        quality, maintainability, and developer productivity.
      </InfoBox>

      <FormGroup>
        <Label>Key Benefits</Label>
        <ul>
          <li>
            <strong>Reduced Complexity</strong>: Simpler, more predictable code
            structure
          </li>
          <li>
            <strong>Enhanced Testability</strong>: Pure functions are easier to
            test
          </li>
          <li>
            <strong>Improved Debugging</strong>: Predictable function behavior
          </li>
          <li>
            <strong>Parallel Processing</strong>: Easier to parallelize pure
            functions
          </li>
          <li>
            <strong>Better Modularity</strong>: Compose complex logic from
            simple functions
          </li>
        </ul>
      </FormGroup>

      <FormGroup>
        <Label>Comparative Benefits</Label>
        <Table>
          <thead>
            <tr>
              <th>Functional Approach</th>
              <th>Traditional Approach</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Immutable data</td>
              <td>Mutable state</td>
            </tr>
            <tr>
              <td>Predictable function behavior</td>
              <td>Side-effect-prone functions</td>
            </tr>
            <tr>
              <td>Declarative style</td>
              <td>Imperative instructions</td>
            </tr>
            <tr>
              <td>Easy composition</td>
              <td>Complex interdependencies</td>
            </tr>
          </tbody>
        </Table>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Benefit: Easier Reasoning About Code
// Traditional Approach
function processUserData(users) {
  for (let user of users) {
    user.totalSpending = 0;
    for (let purchase of user.purchases) {
      user.totalSpending += purchase.amount;
    }
    user.category = determineCategoryBySpending(user.totalSpending);
  }
  return users;
}

// Functional Approach
const processUserData = users => users
  .map(user => ({
    ...user,
    totalSpending: user.purchases.reduce(
      (total, purchase) => total + purchase.amount, 
      0
    )
  }))
  .map(user => ({
    ...user,
    category: determineCategoryBySpending(user.totalSpending)
  }));

// Benefit: Easier Parallel Processing
const processDataInParallel = data => 
  data
    .map(heavyComputation)
    .filter(isValid)
    .reduce(combineResults, initialValue);`}</Pre>
      </CodeBlock>

      <FormGroup>
        <Label>Debugging and Maintenance Benefits</Label>
        <ul>
          <li>
            <strong>Predictable Behavior</strong>: Functions always produce same
            output for same input
          </li>
          <li>
            <strong>Easier Refactoring</strong>: Isolated, pure functions are
            easier to modify
          </li>
          <li>
            <strong>Reduced Cognitive Load</strong>: Less mental tracking of
            state changes
          </li>
          <li>
            <strong>Better Tooling Support</strong>: More amenable to static
            analysis and optimization
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Debugging Benefit: Tracing and Logging
const tracedComputation = compose(
  logResult,
  measureExecutionTime,
  validateInput,
  actualComputation
);

// Composition Benefit: Building Complex Logic
const processDataPipeline = compose(
  removeInvalidEntries,
  normalizeData,
  transformData,
  aggregateResults
);

const finalResult = processDataPipeline(rawData);`}</Pre>
      </CodeBlock>

      <SmallText>
        Functional programming transforms code from a series of imperative
        instructions to a composition of pure, predictable transformations.
      </SmallText>
    </React.Fragment>
  );
};

export default FunctionalBenefits;
