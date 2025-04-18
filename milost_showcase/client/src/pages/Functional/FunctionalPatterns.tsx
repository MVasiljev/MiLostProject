import React from "react";
import {
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";
import { InfoBox, Table } from "../Vector/Vector.styles";

const FunctionalPatterns: React.FC = () => {
  return (
    <>
      <InfoBox>
        Functional programming introduces powerful design patterns that simplify
        complex logic and improve code organization.
      </InfoBox>

      <FormGroup>
        <Label>Key Functional Design Patterns</Label>
        <ul>
          <li>
            <strong>Function Composition</strong>: Combine simple functions to
            create complex operations
          </li>
          <li>
            <strong>Currying</strong>: Transform functions with multiple
            arguments into a series of single-argument functions
          </li>
          <li>
            <strong>Partial Application</strong>: Create new functions by fixing
            some arguments of an existing function
          </li>
          <li>
            <strong>Memoization</strong>: Cache function results to improve
            performance
          </li>
          <li>
            <strong>Pipe and Compose</strong>: Create data transformation
            pipelines
          </li>
        </ul>
      </FormGroup>

      <FormGroup>
        <Label>Pattern Complexity Comparison</Label>
        <Table>
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Complexity</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Function Composition</td>
              <td>Low</td>
              <td>Combining simple transformations</td>
            </tr>
            <tr>
              <td>Currying</td>
              <td>Medium</td>
              <td>Creating flexible, reusable functions</td>
            </tr>
            <tr>
              <td>Partial Application</td>
              <td>Medium</td>
              <td>Configuring functions with preset arguments</td>
            </tr>
            <tr>
              <td>Memoization</td>
              <td>High</td>
              <td>Optimizing expensive computations</td>
            </tr>
          </tbody>
        </Table>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Function Composition
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

// Currying
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return (...moreArgs) => 
        curried.apply(this, args.concat(moreArgs));
    }
  };
};

// Example of Currying
const add = curry((a, b, c) => a + b + c);
const add5 = add(5);
console.log(add5(3, 2));  // 10

// Partial Application
const partial = (fn, ...presetArgs) => 
  (...laterArgs) => fn(...presetArgs, ...laterArgs);

const multiply = (a, b, c) => a * b * c;
const double = partial(multiply, 2);
console.log(double(3, 4));  // 24

// Memoization
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Pipe (Left-to-Right Composition)
const pipe = (...fns) => x => 
  fns.reduce((acc, fn) => fn(acc), x);

const processData = pipe(
  removeInvalidEntries,
  normalizeData,
  transformData,
  aggregateResults
);`}</Pre>
      </CodeBlock>

      <FormGroup>
        <Label>Advanced Composition Techniques</Label>
        <ul>
          <li>
            <strong>Point-Free Style</strong>: Define functions without
            explicitly mentioning arguments
          </li>
          <li>
            <strong>Function Chaining</strong>: Create fluent interfaces with
            method chaining
          </li>
          <li>
            <strong>Higher-Order Functions</strong>: Functions that manipulate
            other functions
          </li>
        </ul>
      </FormGroup>

      <CodeBlock>
        <Pre>{`// Point-Free Style
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const toLowerCase = s => s.toLowerCase();
const sanitizeName = pipe(
  toLowerCase,
  capitalize
);

// Function Chaining
class FunctionalList {
  constructor(array) {
    this.array = array;
  }

  map(fn) {
    return new FunctionalList(this.array.map(fn));
  }

  filter(predicate) {
    return new FunctionalList(this.array.filter(predicate));
  }

  reduce(reducer, initial) {
    return this.array.reduce(reducer, initial);
  }
}

const result = new FunctionalList([1, 2, 3, 4])
  .map(x => x * 2)
  .filter(x => x > 4)
  .reduce((a, b) => a + b, 0);`}</Pre>
      </CodeBlock>

      <SmallText>
        These patterns demonstrate how functional programming provides powerful
        tools for creating more flexible, composable, and maintainable code.
      </SmallText>
    </>
  );
};

export default FunctionalPatterns;
