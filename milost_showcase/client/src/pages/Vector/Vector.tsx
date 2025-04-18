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
  Pre,
  CodeBlock,
  SmallText,
  FormGroup,
  Label,
  InfoBox,
  Table,
} from "./Vector.styles";

function VectorPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "creating", label: "Creating Vectors" },
    { id: "transforming", label: "Transformations" },
    { id: "querying", label: "Querying" },
    { id: "immutability", label: "Immutability" },
    { id: "performance", label: "Performance" },
  ];

  return (
    <Container>
      <Header>
        <Title>Vector Collection</Title>
        <Subtitle>
          Immutable, type-safe vector implementation with WASM acceleration
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
              The <code>Vec</code> type is MiLost's immutable vector
              implementation. It provides a safe, predictable alternative to
              JavaScript's mutable arrays with powerful functional operations.
            </InfoBox>

            <FormGroup>
              <Label>Key Features</Label>
              <ul>
                <li>
                  <strong>Immutable:</strong> All operations return new vectors
                  instead of modifying the original
                </li>
                <li>
                  <strong>Type-safe:</strong> Works seamlessly with TypeScript's
                  type system
                </li>
                <li>
                  <strong>Predictable:</strong> Eliminates bugs caused by
                  unexpected mutations
                </li>
                <li>
                  <strong>Functional:</strong> Rich API for transformations like
                  map, filter, fold
                </li>
                <li>
                  <strong>Performance:</strong> WASM acceleration for
                  performance-critical operations
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use Vec</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use Vec when you need...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Predictable data that won't change unexpectedly</td>
                    <td>Mutable arrays with potential side effects</td>
                  </tr>
                  <tr>
                    <td>Clear data transformation pipelines</td>
                    <td>Complex mutation logic with side effects</td>
                  </tr>
                  <tr>
                    <td>Safe iteration without modification concerns</td>
                    <td>Defensive copying to prevent modification</td>
                  </tr>
                  <tr>
                    <td>Functional programming patterns</td>
                    <td>Imperative loop-based array manipulation</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

// Create a vector of numbers
const numbers = Vec.from([1, 2, 3, 4, 5]);

// Basic properties
console.log(numbers.len());        // 5
console.log(numbers.isEmpty());    // false

// Transformation pipeline (immutable - original unchanged)
const result = numbers
  .filter(n => n % 2 === 0)   // Keep even numbers: [2, 4]
  .map(n => n * 10)           // Multiply by 10: [20, 40]
  .fold(0, (sum, n) => sum + n); // Calculate sum: 60

console.log(result);  // 60
console.log(numbers.toArray());  // Still [1, 2, 3, 4, 5]`}</Pre>
            </CodeBlock>

            <SmallText>
              Vec provides a safer, more predictable alternative to JavaScript
              arrays by ensuring that operations never modify the original data.
              This eliminates an entire class of bugs related to unexpected
              mutations.
            </SmallText>
          </>
        )}

        {activeCategory === "creating" && (
          <>
            <InfoBox>
              MiLost provides several ways to create vectors, each with
              different performance characteristics and use cases.
            </InfoBox>

            <FormGroup>
              <Label>Creation Methods</Label>
              <ul>
                <li>
                  <strong>Vec.from(iterable)</strong>: Create a vector from any
                  iterable (arrays, sets, etc.)
                </li>
                <li>
                  <strong>Vec.empty()</strong>: Create an empty vector
                </li>
                <li>
                  <strong>Vec.withCapacity(n)</strong>: Create an empty vector
                  with pre-allocated capacity for performance
                </li>
                <li>
                  <strong>Existing vector's push()</strong>: Add an item to
                  create a new vector
                </li>
                <li>
                  <strong>Existing vector's concat()</strong>: Combine vectors
                  to create a new one
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

// From an array
const fromArray = Vec.from([1, 2, 3]);

// From other iterables
const fromSet = Vec.from(new Set([1, 2, 3]));
const fromMap = Vec.from(new Map([["a", 1], ["b", 2]]).values());

// Empty vector
const empty = Vec.empty();

// With pre-allocated capacity (performance optimization)
const withCapacity = Vec.withCapacity(10);

// Building a vector incrementally
let vector = Vec.empty();
for (let i = 0; i < 5; i++) {
  vector = vector.push(i * 10);
}
console.log(vector.toArray());  // [0, 10, 20, 30, 40]

// Combining vectors
const first = Vec.from([1, 2]);
const second = Vec.from([3, 4]);
const combined = first.concat(second);
console.log(combined.toArray());  // [1, 2, 3, 4]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Best Practices</Label>
              <ol>
                <li>
                  Use <code>Vec.from()</code> when you already have all items in
                  an iterable
                </li>
                <li>
                  Use <code>Vec.withCapacity()</code> when you know the size in
                  advance for better performance
                </li>
                <li>
                  When building vectors in loops, assign the result back to a
                  variable
                </li>
                <li>
                  Consider collecting items in a regular array first, then
                  creating a Vec if you're doing many push operations
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              When creating vectors, remember that they're immutable. Operations
              like push and concat don't modify the original vector - they
              return a new one. Always capture the return value.
            </SmallText>
          </>
        )}

        {activeCategory === "transforming" && (
          <>
            <InfoBox>
              Vectors shine when it comes to data transformations. MiLost
              provides a rich set of functional operations that make it easy to
              transform data in a clear, composable way.
            </InfoBox>

            <FormGroup>
              <Label>Transformation Operations</Label>
              <ul>
                <li>
                  <strong>map(fn)</strong>: Transform each element
                </li>
                <li>
                  <strong>filter(fn)</strong>: Keep elements that match a
                  predicate
                </li>
                <li>
                  <strong>fold(initial, fn)</strong>: Reduce to a single value
                </li>
                <li>
                  <strong>reverse()</strong>: Reverse the order of elements
                </li>
                <li>
                  <strong>take(n)</strong>: Take the first n elements
                </li>
                <li>
                  <strong>drop(n)</strong>: Skip the first n elements
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

const numbers = Vec.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Transform each item (map)
const doubled = numbers.map(n => n * 2);
console.log(doubled.toArray());  // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter items
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens.toArray());  // [2, 4, 6, 8, 10]

// Combine operations in a pipeline
const sumOfSquaresOfEvens = numbers
  .filter(n => n % 2 === 0)    // Keep even numbers
  .map(n => n * n)             // Square each number
  .fold(0, (acc, n) => acc + n); // Sum them up
console.log(sumOfSquaresOfEvens);  // 220 (4 + 16 + 36 + 64 + 100)

// Take and drop
const firstThree = numbers.take(3);
console.log(firstThree.toArray());  // [1, 2, 3]

const withoutFirstTwo = numbers.drop(2);
console.log(withoutFirstTwo.toArray());  // [3, 4, 5, 6, 7, 8, 9, 10]

// Complex example: calculate moving average
function movingAverage(values, windowSize) {
  const result = [];
  
  for (let i = 0; i <= values.len() - windowSize; i++) {
    const window = values.drop(i).take(windowSize);
    const avg = window.fold(0, (sum, n) => sum + n) / windowSize;
    result.push(avg);
  }
  
  return Vec.from(result);
}

const data = Vec.from([2, 6, 4, 8, 5, 7]);
const avgWindow3 = movingAverage(data, 3);
console.log(avgWindow3.toArray());  // [4, 6, 5.67, 6.67]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Functional Transformation Patterns</Label>
              <ul>
                <li>
                  <strong>Pipeline Pattern</strong>: Chain operations to express
                  complex transformations clearly
                </li>
                <li>
                  <strong>Map-Reduce Pattern</strong>: Transform items then
                  collapse to a summary
                </li>
                <li>
                  <strong>Filter-Map Pattern</strong>: Select items then
                  transform them (common in data processing)
                </li>
                <li>
                  <strong>Windowing Pattern</strong>: Process sliding windows of
                  elements (like moving averages)
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Thinking in transformations rather than mutations leads to
              clearer, more predictable code. Each operation produces a new
              vector, allowing you to build complex data pipelines without side
              effects.
            </SmallText>
          </>
        )}

        {activeCategory === "querying" && (
          <>
            <InfoBox>
              MiLost's Vector provides various ways to query and inspect its
              contents safely. Unlike arrays, these operations never throw index
              out of bounds errors.
            </InfoBox>

            <FormGroup>
              <Label>Query Operations</Label>
              <ul>
                <li>
                  <strong>get(index)</strong>: Safely get an element at index
                  (returns Option)
                </li>
                <li>
                  <strong>find(predicate)</strong>: Find the first element
                  matching a condition
                </li>
                <li>
                  <strong>all(predicate)</strong>: Check if all elements match a
                  condition
                </li>
                <li>
                  <strong>any(predicate)</strong>: Check if any elements match a
                  condition
                </li>
                <li>
                  <strong>len()</strong>: Get the number of elements
                </li>
                <li>
                  <strong>isEmpty()</strong>: Check if the vector is empty
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

const items = Vec.from([10, 20, 30, 40, 50]);

// Safe access with Option type (never throws)
const item = items.get(2);
if (item.isSome()) {
  console.log(item.unwrap());  // 30
}

// Safe access for non-existent index
const missing = items.get(10);
console.log(missing.isNone());  // true

// Find an element
const found = items.find(n => n > 35);
if (found.isSome()) {
  console.log(found.unwrap());  // 40
}

// Check conditions
const allPositive = items.all(n => n > 0);
console.log(allPositive);  // true

const anyLarge = items.any(n => n > 45);
console.log(anyLarge);  // true

// Iterating with forEach
items.forEach((item, index) => {
  console.log(\`Item at \${index}: \${item}\`);
});

// Convert to array if needed
const array = items.toArray();
console.log(array);  // [10, 20, 30, 40, 50]

// Using with array destructuring (via toArray)
const [first, second, ...rest] = items.toArray();
console.log(first, second, rest);  // 10 20 [30, 40, 50]

// String representation
console.log(items.toString());  // [Vec len=5]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Safe Access Pattern with Options</Label>
              <p>
                The <code>get()</code> method returns an <code>Option</code>{" "}
                type instead of throwing errors or returning undefined:
              </p>
              <ul>
                <li>
                  <strong>Explicit handling</strong>: You must check if the
                  value exists
                </li>
                <li>
                  <strong>No exceptions</strong>: Never throws index out of
                  bounds errors
                </li>
                <li>
                  <strong>Pattern matching</strong>: Use
                  <code>match()</code> for elegant handling of both cases
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              The query operations in Vec prioritize safety over convenience.
              They guide you toward writing code that explicitly handles all
              edge cases, such as missing elements, which improves reliability.
            </SmallText>
          </>
        )}

        {activeCategory === "immutability" && (
          <>
            <InfoBox>
              Immutability is a core principle of functional programming that
              leads to more predictable, easier to understand code. MiLost's Vec
              is fully immutable - once created, it never changes.
            </InfoBox>

            <FormGroup>
              <Label>Key Benefits of Immutability</Label>
              <ul>
                <li>
                  <strong>Predictability</strong>: Data doesn't change
                  unexpectedly
                </li>
                <li>
                  <strong>Thread safety</strong>: Safe to share across threads
                  without locks
                </li>
                <li>
                  <strong>Easier debugging</strong>: Data only changes when
                  explicitly reassigned
                </li>
                <li>
                  <strong>Referential transparency</strong>: Same inputs always
                  produce same outputs
                </li>
                <li>
                  <strong>Simpler caching</strong>: Can cache results without
                  invalidation concerns
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

// Regular JavaScript array (mutable)
const jsArray = [1, 2, 3];
function processMutable(arr) {
  arr.push(4);  // Modifies the original array!
}
processMutable(jsArray);
console.log(jsArray);  // [1, 2, 3, 4] - Original changed!

// MiLost Vec (immutable)
const vector = Vec.from([1, 2, 3]);
function processImmutable(vec) {
  const newVec = vec.push(4);  // Returns a new vector
  return newVec;
}
const newVector = processImmutable(vector);
console.log(vector.toArray());    // [1, 2, 3] - Original unchanged!
console.log(newVector.toArray()); // [1, 2, 3, 4] - New vector with changes

// State management with immutability
class Counter {
  constructor() {
    this.history = Vec.from([0]);
    this.current = 0;
  }
  
  increment() {
    const next = this.current + 1;
    this.history = this.history.push(next);
    this.current = next;
    return next;
  }
  
  decrement() {
    const next = this.current - 1;
    this.history = this.history.push(next);
    this.current = next;
    return next;
  }
  
  getHistory() {
    return this.history;
  }
}

const counter = new Counter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getHistory().toArray());  // [0, 1, 2, 1]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Common Immutability Patterns</Label>
              <ol>
                <li>
                  <strong>Reassignment Pattern</strong>: Assign the result of
                  operations back to a variable
                </li>
                <li>
                  <strong>Builder Pattern</strong>: Chain multiple operations to
                  build a result
                </li>
                <li>
                  <strong>History Pattern</strong>: Keep a sequence of states to
                  track changes over time
                </li>
                <li>
                  <strong>Lens Pattern</strong>: Focus on and update a specific
                  part of a larger data structure
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              Embracing immutability requires a mindset shift from modifying
              existing data to transforming data into new forms. This approach
              leads to more predictable code with fewer bugs related to
              unexpected state changes.
            </SmallText>
          </>
        )}

        {activeCategory === "performance" && (
          <>
            <InfoBox>
              MiLost's Vec provides immutability without sacrificing performance
              by using efficient structural sharing and WebAssembly acceleration
              for critical operations.
            </InfoBox>

            <FormGroup>
              <Label>Performance Considerations</Label>
              <ul>
                <li>
                  <strong>Structural Sharing</strong>: Vec reuses portions of
                  the original data when creating modified copies
                </li>
                <li>
                  <strong>WASM Acceleration</strong>: Performance-critical
                  operations run in WebAssembly when available
                </li>
                <li>
                  <strong>JavaScript Fallbacks</strong>: Graceful degradation to
                  JS implementations when WASM isn't available
                </li>
                <li>
                  <strong>Memory Usage</strong>: Generally higher than mutable
                  arrays due to keeping multiple versions
                </li>
                <li>
                  <strong>Optimization Strategies</strong>: Techniques to
                  minimize performance impact of immutability
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Performance Optimization Strategies</Label>
              <ol>
                <li>
                  <strong>Minimize Creation Frequency</strong>: Batch
                  transformations together to reduce intermediate vectors
                </li>
                <li>
                  <strong>Use Capacity Hints</strong>: Allocate vectors with
                  expected size using <code>withCapacity()</code>
                </li>
                <li>
                  <strong>Process Bulk Operations</strong>: Transform in bulk
                  rather than one item at a time
                </li>
                <li>
                  <strong>Avoid Premature Optimization</strong>: Use Vector by
                  default, optimize only when needed
                </li>
                <li>
                  <strong>Measure Actual Performance</strong>: Don't assume
                  immutability is always slower
                </li>
              </ol>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Vec } from "milost";

// Performance comparison: mutable vs immutable
function benchmarkVector(size) {
  console.time("Vector Build");
  let vec = Vec.withCapacity(size);
  for (let i = 0; i < size; i++) {
    vec = vec.push(i);
  }
  console.timeEnd("Vector Build");
  
  console.time("Vector Map");
  const doubled = vec.map(x => x * 2);
  console.timeEnd("Vector Map");
  
  console.time("Vector Filter");
  const evens = vec.filter(x => x % 2 === 0);
  console.timeEnd("Vector Filter");
  
  return vec.len();
}

function benchmarkArray(size) {
  console.time("Array Build");
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i);
  }
  console.timeEnd("Array Build");
  
  console.time("Array Map");
  const doubled = arr.map(x => x * 2);
  console.timeEnd("Array Map");
  
  console.time("Array Filter");
  const evens = arr.filter(x => x % 2 === 0);
  console.timeEnd("Array Filter");
  
  return arr.length;
}

// Run the benchmarks with different sizes
benchmarkVector(10000);
benchmarkArray(10000);

// Optimization: batch operations
function inefficient(size) {
  let vec = Vec.empty();
  // Inefficient: creates many intermediate vectors
  for (let i = 0; i < size; i++) {
    vec = vec.push(i);
  }
  return vec;
}

function efficient(size) {
  // Efficient: creates a temporary mutable array, then a single vector
  const temp = [];
  for (let i = 0; i < size; i++) {
    temp.push(i);
  }
  return Vec.from(temp);
}

console.time("Inefficient");
inefficient(10000);
console.timeEnd("Inefficient");

console.time("Efficient");
efficient(10000);
console.timeEnd("Efficient");`}</Pre>
            </CodeBlock>

            <SmallText>
              While immutable data structures may have some performance overhead
              compared to mutable ones, the benefits in code clarity,
              predictability, and reduced bugs often outweigh the costs. Modern
              techniques like structural sharing and WebAssembly acceleration
              minimize this overhead in MiLost.
            </SmallText>
          </>
        )}
      </Card>

      <Card>
        <CardTitle>Vector API Examples</CardTitle>

        <CodeBlock>
          <Pre>{`import { Vec } from "milost";

// Creating a vector
const numbers = Vec.from([1, 2, 3, 4, 5]);

// Basic properties
console.log(numbers.len());        // 5
console.log(numbers.isEmpty());    // false

// Basic operations
const reversed = numbers.reverse();
console.log(reversed.toArray());   // [5, 4, 3, 2, 1]

// Map operations
const doubled = numbers.map((n) => n * 2);
console.log(doubled.toArray());    // [2, 4, 6, 8, 10]

// Filter operations
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens.toArray());      // [2, 4]

// Fold/reduce operations
const sum = numbers.fold(0, (acc, n) => acc + n);
console.log(sum);                  // 15

// Take and drop
const firstThree = numbers.take(3);
console.log(firstThree.toArray()); // [1, 2, 3]

const withoutFirstTwo = numbers.drop(2);
console.log(withoutFirstTwo.toArray()); // [3, 4, 5]

// Check operations
const allPositive = numbers.all((n) => n > 0);
console.log(allPositive);          // true

const anyGreaterThanFour = numbers.any((n) => n > 4);
console.log(anyGreaterThanFour);   // true

// Create new vector with additional element
const withSix = numbers.push(6);
console.log(withSix.toArray());    // [1, 2, 3, 4, 5, 6]

// Concatenate vectors
const moreNumbers = Vec.from([6, 7, 8]);
const combined = numbers.concat(moreNumbers);
console.log(combined.toArray());   // [1, 2, 3, 4, 5, 6, 7, 8]

// Find item
const found = numbers.find((n) => n > 3);
console.log(found.unwrap());       // 4

// Get item by index
const third = numbers.get(2);
console.log(third.unwrap());       // 3

// Example: Working with a todo list
function createTodoApp() {
  let todos = Vec.from([
    { id: 1, text: "Learn MiLost", completed: false },
    { id: 2, text: "Write immutable code", completed: false }
  ]);
  
  function addTodo(text) {
    const newId = todos.len() + 1;
    todos = todos.push({ id: newId, text, completed: false });
    return newId;
  }
  
  function toggleTodo(id) {
    todos = todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    );
  }
  
  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
  }
  
  function getTodos() {
    return todos;
  }
  
  return { addTodo, toggleTodo, deleteTodo, getTodos };
}

// Using the todo app
const todoApp = createTodoApp();
todoApp.addTodo("Build an app");
todoApp.toggleTodo(1);
console.log(todoApp.getTodos().toArray());`}</Pre>
        </CodeBlock>

        <SmallText>
          MiLost's Vec class provides a Rust-like immutable vector
          implementation with WASM acceleration when available. All operations
          return new vector instances instead of modifying the original,
          eliminating an entire class of bugs related to unexpected mutations.
        </SmallText>
      </Card>
    </Container>
  );
}

export default VectorPage;
