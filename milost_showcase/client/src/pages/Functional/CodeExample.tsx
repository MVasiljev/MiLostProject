import React from "react";
import {
  Card,
  CardTitle,
  CodeBlock,
  Pre,
  SmallText,
} from "./Functional.styles";

const CodeExample: React.FC = () => {
  return (
    <Card>
      <CardTitle>Functional Programming API Examples</CardTitle>

      <CodeBlock>
        <Pre>
          {`import * as F from "milost";

// Map operations
const hashMap = F.toHashMap(iter, x => x.id);  // Creates HashMap from iterator
const hashSet = F.toHashSet(iter);             // Creates HashSet from iterator
const vec = F.toVec(iter);                     // Creates Vec from iterator
const mappedObj = F.mapObject(obj, ([k, v]) => [k, v * 2]);  // Maps object entries
const filteredObj = F.filterObject(obj, ([k, v]) => v > 3);  // Filters object entries

// Transform operations
const merged = F.mergeDeep([obj1, obj2, obj3]);  // Deep merges multiple objects
const piped = F.pipe(fn1, fn2, fn3);             // Creates pipeline of functions
const composed = F.compose(fn3, fn2, fn1);       // Composes functions (right to left)
const curriedFn = F.curry((a, b, c) => a + b + c);  // Creates curried function
const memoizedFn = F.memoize(expensiveFn);       // Memoizes function results
const onceFn = F.once(setupFn);                  // Ensures function runs only once

// Execution operations
const throttledFn = F.throttle(fn, 300);         // Limits function calls
const debouncedFn = F.debounce(fn, 300);         // Debounces function calls
const noop = F.noop();                           // No-operation function
const identity = F.identity;                     // Returns input unchanged

// Predicate operations
const notPred = F.not(x => x > 3);               // Negates predicate
const allOf = F.allOf(pred1, pred2, pred3);      // Combines with AND
const anyOf = F.anyOf(pred1, pred2, pred3);      // Combines with OR
const getProp = F.prop('name');                  // Creates property accessor
const hasPropFn = F.hasProp('id');               // Checks if prop exists
const propEqFn = F.propEq('status', 'active');   // Checks prop equality

// Utility operations
const partialFn = F.partial(sum, 1, 2);          // Partially applies function
const flippedFn = F.flip((a, b) => a / b);       // Flips function arguments
const juxtFn = F.juxt([Math.min, Math.max]);     // Applies functions to same input
const zipped = F.zipWith((a, b) => a + b, arr1, arr2);  // Combines two arrays
const converged = F.converge(
  (a, b, c) => a + b + c,
  [x => x * 2, x => x + 1, x => x - 1]
);  // Applies transformers then combines results`}
        </Pre>
      </CodeBlock>

      <SmallText>
        MiLost's functional programming utilities provide powerful tools for
        composing functions, working with collections, and implementing
        functional programming patterns. These utilities are implemented with a
        focus on performance and immutability.
      </SmallText>
    </Card>
  );
};

export default CodeExample;
