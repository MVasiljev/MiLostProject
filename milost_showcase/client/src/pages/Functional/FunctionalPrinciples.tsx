import React from "react";
import {
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";
import { InfoBox } from "../Vector/Vector.styles";

const FunctionalPrinciples: React.FC = () => {
  return (
    <>
      <InfoBox>
        Functional programming is built on fundamental principles that promote
        writing more predictable, maintainable, and testable code.
      </InfoBox>

      <FormGroup>
        <Label>Core Principles</Label>
        <ul>
          <li>
            <strong>Immutability</strong>: Create new data instead of modifying
            existing data
          </li>
          <li>
            <strong>Pure Functions</strong>: Functions with no side effects and
            predictable outputs
          </li>
          <li>
            <strong>Function Composition</strong>: Build complex operations by
            combining simple functions
          </li>
          <li>
            <strong>Declarative Programming</strong>: Describe what to do, not
            how to do it
          </li>
          <li>
            <strong>Higher-Order Functions</strong>: Functions that can take or
            return other functions
          </li>
        </ul>
      </FormGroup>

      <FormGroup>
        <Label>Pure Functions Explained</Label>
        <p>A pure function is a function that:</p>
        <ul>
          <li>Always returns the same output for the same input</li>
          <li>Does not modify external state</li>
          <li>Does not have side effects</li>
          <li>
            Can be replaced with its corresponding value without changing
            program behavior
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Pure Function Example
function add(a, b) {
  return a + b;
}

// Impure Function (modifies external state)
let total = 0;
function addToTotal(value) {
  total += value;  // Side effect: modifies external state
}

// Pure Function with Immutability
function addToList(list, item) {
  return [...list, item];  // Creates new list instead of modifying
}

// Higher-Order Function
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

// Function Composition
const double = x => x * 2;
const increment = x => x + 1;
const doubleAndIncrement = compose(increment, double);

console.log(doubleAndIncrement(5));  // 11`}</Pre>
      </CodeBlock>

      <FormGroup>
        <Label>Principles in Action</Label>
        <p>
          Functional programming principles transform how we think about and
          write code:
        </p>
        <ul>
          <li>
            <strong>Predictability</strong>: Eliminate unexpected state changes
          </li>
          <li>
            <strong>Testability</strong>: Easier to write unit tests for pure
            functions
          </li>
          <li>
            <strong>Modularity</strong>: Create small, reusable function
            components
          </li>
          <li>
            <strong>Parallelism</strong>: Easier to parallelize pure function
            computations
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Principle of Immutability
function processData(data) {
  return data
    .filter(item => item.isValid)
    .map(transformItem)
    .reduce((acc, item) => {
      // Create new accumulator instead of mutating
      return [...acc, processItem(item)];
    }, []);
}

// Principle of Composition
const pipeline = compose(
  removeInvalidItems,
  transformData,
  sortByPriority
);

const processedData = pipeline(rawData);`}</Pre>
      </CodeBlock>

      <SmallText>
        These principles provide a robust framework for writing clear,
        predictable, and maintainable code by emphasizing immutability and
        function composition.
      </SmallText>
    </>
  );
};

export default FunctionalPrinciples;
