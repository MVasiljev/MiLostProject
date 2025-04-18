import React from "react";
import {
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";
import { InfoBox } from "../Vector/Vector.styles";

const FunctionalPerformance: React.FC = () => {
  return (
    <>
      <InfoBox>
        Performance in functional programming balances code clarity with
        computational efficiency through strategic design patterns and
        optimization techniques.
      </InfoBox>

      <FormGroup>
        <Label>Performance Challenges</Label>
        <ul>
          <li>
            <strong>Immutability Overhead</strong>: Creating new objects instead
            of mutating existing ones
          </li>
          <li>
            <strong>Function Call Overhead</strong>: Multiple function
            compositions can impact performance
          </li>
          <li>
            <strong>Memory Allocation</strong>: Generating intermediate data
            structures
          </li>
          <li>
            <strong>Recursion Limitations</strong>: Potential stack overflow in
            deeply recursive functions
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Performance Comparison
// Imperative Approach
function imperativeSum(arr) {
  let total = 0;
  for (let num of arr) {
    total += num;
  }
  return total;
}

// Functional Approach
const functionalSum = arr => 
  arr.reduce((sum, num) => sum + num, 0);

// Benchmarking
console.time('Imperative');
imperativeSum(largeArray);
console.timeEnd('Imperative');

console.time('Functional');
functionalSum(largeArray);
console.timeEnd('Functional');`}</Pre>
      </CodeBlock>

      <FormGroup>
        <Label>Optimization Strategies</Label>
        <ul>
          <li>
            <strong>Memoization</strong>: Cache expensive function results
          </li>
          <li>
            <strong>Lazy Evaluation</strong>: Compute values only when necessary
          </li>
          <li>
            <strong>Tail Call Optimization</strong>: Minimize call stack growth
            in recursive functions
          </li>
          <li>
            <strong>Efficient Data Structures</strong>: Choose appropriate
            collections
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Memoization Technique
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Lazy Evaluation with Generators
function* lazyMap(iterable, mapper) {
  for (const item of iterable) {
    yield mapper(item);
  }
}

// Tail Call Optimization
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
}`}</Pre>
      </CodeBlock>

      <FormGroup>
        <Label>Performance Considerations</Label>
        <ul>
          <li>
            <strong>Benchmark Specific Use Cases</strong>: Performance varies
            based on specific implementations
          </li>
          <li>
            <strong>Avoid Premature Optimization</strong>: Prioritize
            readability and correctness
          </li>
          <li>
            <strong>Use Built-in Methods</strong>: Leverage optimized native
            implementations
          </li>
          <li>
            <strong>Profile Your Code</strong>: Measure actual performance
            impacts
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Profiling Example
function profileFunction(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(\`Function executed in \${end - start} milliseconds\`);
    return result;
  }
}

// Usage
const optimizedFunction = profileFunction(expensiveComputation);
optimizedFunction(largeDataset);`}</Pre>
      </CodeBlock>

      <SmallText>
        While functional programming may introduce some performance overhead,
        the benefits in code clarity, maintainability, and predictability often
        outweigh minor performance concerns.
      </SmallText>
    </>
  );
};

export default FunctionalPerformance;
