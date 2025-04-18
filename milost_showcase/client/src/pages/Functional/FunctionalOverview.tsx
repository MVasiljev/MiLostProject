import React from "react";
import {
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";
import { InfoBox, Table } from "../Vector/Vector.styles";

const FunctionalOverview: React.FC = () => {
  return (
    <>
      <InfoBox>
        Functional programming is a paradigm that treats computation as the
        evaluation of mathematical functions, avoiding changing state and
        mutable data.
      </InfoBox>

      <FormGroup>
        <Label>Key Characteristics</Label>
        <ul>
          <li>
            <strong>Immutability</strong>: Data cannot be changed after creation
          </li>
          <li>
            <strong>Pure Functions</strong>: Functions always produce same
            output for same input
          </li>
          <li>
            <strong>First-Class Functions</strong>: Functions can be passed as
            arguments and returned
          </li>
          <li>
            <strong>Declarative Style</strong>: Describe what to do, not how to
            do it
          </li>
          <li>
            <strong>Composition</strong>: Build complex operations from simple
            functions
          </li>
        </ul>
      </FormGroup>

      <FormGroup>
        <Label>When to Use Functional Programming</Label>
        <Table>
          <thead>
            <tr>
              <th>Use Functional Programming When...</th>
              <th>Instead of...</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Complex data transformations</td>
              <td>Imperative mutation loops</td>
            </tr>
            <tr>
              <td>Parallel processing</td>
              <td>Stateful sequential operations</td>
            </tr>
            <tr>
              <td>Predictable code behavior</td>
              <td>Side-effect-prone implementations</td>
            </tr>
            <tr>
              <td>Managing complex state</td>
              <td>Mutable global state</td>
            </tr>
          </tbody>
        </Table>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Imperative (Traditional) Approach
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}

// Functional Approach
const calculateTotal = items => 
  items.reduce((total, item) => total + item.price, 0);

// Immutable transformation
const processUsers = users => users
  .filter(user => user.isActive)
  .map(user => ({
    ...user,
    fullName: \`\${user.firstName} \${user.lastName}\`
  }))
  .sort((a, b) => a.age - b.age);`}</Pre>
      </CodeBlock>

      <SmallText>
        Functional programming shifts focus from how to compute something to
        what should be computed, leading to more predictable and maintainable
        code.
      </SmallText>
    </>
  );
};

export default FunctionalOverview;
