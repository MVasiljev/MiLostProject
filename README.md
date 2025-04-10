# MiLost

[![npm version](https://img.shields.io/npm/v/milost.svg)](https://www.npmjs.com/package/milost)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

MiLost is a high-performance TypeScript library powered by Rust and WebAssembly. By implementing core functionality in Rust and exposing it to JavaScript via WebAssembly bindings, MiLost delivers exceptional performance while maintaining a familiar TypeScript API. It brings Rust's robust patterns, efficient data structures, and precise memory management to JavaScript applications, providing a comprehensive set of tools for building reliable, maintainable applications with strong type safety and predictable behavior.

## 🌟 Features

- **Rust Under the Hood**: Core functionality implemented in Rust for maximum performance and safety
- **WebAssembly Acceleration**: Native-like performance with seamless fallback to pure JS when WASM is unavailable
- **Rust-Inspired Patterns**: Result, Option, Vec, HashMap and other Rust patterns directly available in TypeScript
- **Memory Management**: Smart pointers (Rc, Arc, RefCell) for controlled mutation and memory safety
- **Type Safety**: Strong type safety with branded types and validation
- **Concurrency Tools**: Channels, Tasks and synchronization primitives built on Rust's efficient implementations
- **Functional Programming**: Compose, curry, pipe and other functional utilities optimized in Rust
- **Data Structures**: High-performance Rust-implemented collections like Vec, HashMap, HashSet
- **State Management**: Atom-based reactive state management
- **Error Handling**: Comprehensive error types and handling patterns

## 📦 Installation

```bash
npm install milost
```

or

```bash
yarn add milost
```

## If using Vite

Add this to vite.config.ts

```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["milost/wasm", "milost"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  resolve: {
    extensions: [".js", ".mjs", ".cjs", ".json", ".wasm"],
  },
});

```

## 🚀 Quick Start

```typescript
import { Str, Vec, Result, Ok, Err, Option } from "milost";

// Working with Strings
const greeting = Str.fromRaw("Hello, world!");
console.log(greeting.unwrap()); // "Hello, world!"

// Working with Vectors
const numbers = Vec.from([1, 2, 3, 4, 5]);
const doubled = numbers.map((n) => n * 2);
console.log(doubled.toArray()); // [2, 4, 6, 8, 10]

// Error Handling with Result
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return Err(new Error("Division by zero"));
  }
  return Ok(a / b);
}

divide(10, 2).match(
  (value) => console.log(`Result: ${value}`), // Result: 5
  (error) => console.log(`Error: ${error.message}`)
);

divide(10, 0).match(
  (value) => console.log(`Result: ${value}`),
  (error) => console.log(`Error: ${error.message}`) // Error: Division by zero
);

// Optional values with Option
function findUser(id: string): Option<{ name: string }> {
  if (id === "1") {
    return Option.Some({ name: "John" });
  }
  return Option.None();
}

findUser("1").match(
  (user) => console.log(`Found: ${user.name}`), // Found: John
  () => console.log("User not found")
);
```

## 📚 Core Concepts

MiLost is built around several core concepts that will be familiar to Rust developers but accessible to JavaScript developers:

### Result and Error Handling

```typescript
import { Result, Ok, Err, AppError, ValidationError, Str } from "milost";

// Creating custom errors
class MyDomainError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

// Function that returns a Result
function processData(
  data: unknown
): Result<number, ValidationError | MyDomainError> {
  if (typeof data !== "number") {
    return Err(new ValidationError(Str.fromRaw("Expected a number")));
  }

  if (data < 0) {
    return Err(new MyDomainError(Str.fromRaw("Negative numbers not allowed")));
  }

  return Ok(data * 2);
}

// Using the function with pattern matching
processData("not a number").match(
  (value) => console.log(`Result: ${value}`),
  (error) => {
    if (error instanceof ValidationError) {
      console.error(`Validation error: ${error.message}`);
    } else {
      console.error(`Other error: ${error.message}`);
    }
  }
);

// Method chaining
processData(10)
  .map((value) => value + 5)
  .andThen((value) => {
    if (value > 100) {
      return Err(new ValidationError(Str.fromRaw("Value too large")));
    }
    return Ok(value);
  })
  .match(
    (value) => console.log(`Final result: ${value}`),
    (error) => console.error(`Error: ${error.message}`)
  );
```

### Option Type for Nullable Values

```typescript
import { Option, Str } from "milost";

// Function that might return a value
function findRecord(id: string): Option<{ name: string }> {
  const records = {
    "1": { name: "John" },
    "2": { name: "Jane" },
  };

  return id in records ? Option.Some(records[id]) : Option.None();
}

// Using unwrapOr to provide a default
const name = findRecord("3")
  .map((record) => record.name)
  .unwrapOr("Unknown");

console.log(name); // "Unknown"

// Using andThen for chaining operations that might fail
function getFirstLetter(str: string): Option<string> {
  return str.length > 0 ? Option.Some(str[0]) : Option.None();
}

findRecord("1")
  .map((record) => record.name)
  .andThen(getFirstLetter)
  .match(
    (letter) => console.log(`First letter: ${letter}`),
    () => console.log("No first letter found")
  );
```

### Vec for Collections

```typescript
import { Vec, u32 } from "milost";

// Create a vector
const items = Vec.from(["apple", "banana", "cherry"]);

// Transform the vector
const upperItems = items.map((item) => item.toUpperCase());
console.log(upperItems.toArray()); // ["APPLE", "BANANA", "CHERRY"]

// Filter items
const bItems = items.filter((item) => item.startsWith("b"));
console.log(bItems.toArray()); // ["banana"]

// Fold to accumulate values
const combined = items.fold(
  "Fruits: ",
  (acc, item, index) => `${acc}${index > 0 ? ", " : ""}${item}`
);
console.log(combined); // "Fruits: apple, banana, cherry"

// Safe indexing with Option
const firstItem = items.get(u32(0));
const nonExistent = items.get(u32(99));

console.log(firstItem.isSome()); // true
console.log(nonExistent.isNone()); // true
```

### HashMap and HashSet

```typescript
import { HashMap, HashSet, Str } from "milost";

// Create a HashMap
const userMap = HashMap.from([
  [Str.fromRaw("user1"), { name: "John", age: 25 }],
  [Str.fromRaw("user2"), { name: "Jane", age: 30 }],
]);

// Lookup values
const user1 = userMap.get(Str.fromRaw("user1"));
console.log(user1?.name); // "John"

// Add new entries (immutable)
const updatedMap = userMap.insert(Str.fromRaw("user3"), {
  name: "Bob",
  age: 35,
});

// Create a HashSet
const uniqueWords = HashSet.from(["apple", "banana", "apple", "cherry"]);
console.log(uniqueWords.size()); // 3 (duplicates are removed)

// Check membership
console.log(uniqueWords.contains("apple")); // true
console.log(uniqueWords.contains("grape")); // false
```

### Memory Management with Rc and RefCell

```typescript
import { Rc, RefCell, createRc, createRefCell } from "milost";

async function main() {
  // Create a reference-counted value
  const counter = await createRc(0);

  // Create multiple references to the same data
  const counterRef1 = counter.clone();
  const counterRef2 = counter.clone();

  // Use the value
  console.log(counterRef1.borrow()); // 0

  // Create a mutable cell
  const cell = await createRefCell(10);

  // Update the value
  cell.borrow_mut((value) => value + 5);
  console.log(cell.borrow()); // 15

  // Combine Rc and RefCell for shared mutability
  const sharedState = await createRcRefCell({ count: 0 });

  // Multiple owners can mutate the same data
  const stateRef1 = sharedState.clone();
  const stateRef2 = sharedState.clone();

  stateRef1.borrow_mut((state) => {
    state.count += 1;
    return state;
  });

  stateRef2.borrow_mut((state) => {
    state.count += 1;
    return state;
  });

  console.log(sharedState.borrow().count); // 2
}

main().catch(console.error);
```

### Atom-based State Management

```typescript
import { createAtom, createSelector, createAction, AtomManager } from "milost";

interface AppState {
  counter: number;
  text: string;
}

async function setupState() {
  // Create an atom to store state
  const counterAtom = await createAtom<number>(0);
  const textAtom = await createAtom<string>("");

  // Create actions to update state
  const increment = createAction(
    counterAtom,
    (state, amount: number) => state + amount
  );
  const updateText = createAction(textAtom, (_, text: string) => text);

  // Create a selector to derive data
  const doubledCounter = createSelector(counterAtom, (state) => state * 2);

  // Subscribe to changes
  counterAtom.subscribe(() => {
    console.log(`Counter changed: ${counterAtom.getState()}`);
    console.log(`Doubled counter: ${doubledCounter()}`);
  });

  // Use the actions
  increment(5); // Counter is now 5, doubled is 10
  increment(3); // Counter is now 8, doubled is 16
  updateText("Hello, world!");

  return {
    counterAtom,
    textAtom,
    increment,
    updateText,
    doubledCounter,
  };
}
```

### Asynchronous Programming with Tasks and Channels

```typescript
import { Task, createChannel } from "milost";

async function demoAsync() {
  // Create a task
  const task = Task.new(async (signal) => {
    // Operation that supports cancellation
    const result = await fetch("/api/data", { signal });
    const data = await result.json();
    return Ok(data);
  });

  // Create a channel for communication between tasks
  const [sender, receiver] = await createChannel();

  // Producer task
  Task.new(async () => {
    for (let i = 0; i < 5; i++) {
      await sender.send(i);
      await new Promise((r) => setTimeout(r, 100));
    }
    sender.close();
    return Ok(undefined);
  });

  // Consumer task
  Task.new(async () => {
    while (true) {
      const item = await receiver.receive();
      if (item.isNone()) {
        console.log("Channel closed");
        break;
      }
      console.log(`Received: ${item.unwrap()}`);
    }
    return Ok(undefined);
  });

  // Tasks can be cancelled
  setTimeout(() => task.cancel(), 2000);

  const result = await task.run();
  result.match(
    (data) => console.log("Task completed:", data),
    (error) => console.log("Task error:", error.message)
  );
}
```

## 🌉 Interoperability with Browser APIs

MiLost works seamlessly with browser APIs:

```typescript
import { tryAsync, Str, Option } from "milost";

// Wrap fetch in Result
async function fetchData(url: string) {
  return tryAsync(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  });
}

// Wrap localStorage in Option
function getFromStorage(key: string): Option<string> {
  const value = localStorage.getItem(key);
  return value !== null ? Option.Some(value) : Option.None();
}

function saveToStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}
```

## 📐 Architecture Design with MiLost

MiLost encourages you to design applications with clear boundaries and error handling:

```typescript
import {
  Result,
  Ok,
  Err,
  Str,
  Option,
  ValidationError,
  NetworkError,
  createAtom,
  Task,
} from "milost";

// Domain model with branded types
interface User {
  id: string;
  name: string;
  email: string;
}

// Repository layer
class UserRepository {
  async findById(id: string): Promise<Result<Option<User>, NetworkError>> {
    try {
      const response = await fetch(`/api/users/${id}`);

      if (!response.ok) {
        return Err(
          new NetworkError(
            Str.fromRaw(`Failed to fetch user: ${response.statusText}`)
          )
        );
      }

      const data = await response.json();
      return data ? Ok(Option.Some(data as User)) : Ok(Option.None());
    } catch (error) {
      return Err(
        new NetworkError(
          Str.fromRaw(
            `Network error: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        )
      );
    }
  }
}

// Service layer
class UserService {
  constructor(private repo: UserRepository) {}

  async getUser(
    id: string
  ): Promise<Result<User, NetworkError | ValidationError>> {
    if (!id) {
      return Err(new ValidationError(Str.fromRaw("User ID is required")));
    }

    const result = await this.repo.findById(id);

    return result.andThen((optionUser) =>
      optionUser.match(
        (user) => Ok(user),
        () => Err(new ValidationError(Str.fromRaw(`User not found: ${id}`)))
      )
    );
  }
}

// Application layer with state management
async function setupUserManagement() {
  const repo = new UserRepository();
  const service = new UserService(repo);

  const userAtom = await createAtom<Option<User>>(Option.None());
  const loadingAtom = await createAtom<boolean>(false);
  const errorAtom = await createAtom<Option<string>>(Option.None());

  async function loadUser(id: string) {
    loadingAtom.setState(() => true);
    errorAtom.setState(() => Option.None());

    const result = await service.getUser(id);

    result.match(
      (user) => {
        userAtom.setState(() => Option.Some(user));
        errorAtom.setState(() => Option.None());
      },
      (error) => {
        userAtom.setState(() => Option.None());
        errorAtom.setState(() => Option.Some(error.message.unwrap()));
      }
    );

    loadingAtom.setState(() => false);
  }

  return {
    loadUser,
    userAtom,
    loadingAtom,
    errorAtom,
  };
}
```

## 🧰 Extra Utilities

### Algorithms and Processing Tools

```typescript
import {
  Sorting,
  Search,
  TextProcessing,
  Graph,
  Crypto,
  RegexBuilder,
} from "milost";

// Sorting algorithms
const sorted = Sorting.quickSort([5, 2, 9, 1, 5]);
console.log(sorted); // [1, 2, 5, 5, 9]

// Binary search
const index = Search.binarySearch(sorted, 5);
console.log(index); // 2 (index of first occurrence)

// Text processing
const wordCount = TextProcessing.wordCount("Hello, world!");
console.log(wordCount); // 2

// Create a graph
const graph = await createGraph();
graph.addVertex(Str.fromRaw("A"));
graph.addVertex(Str.fromRaw("B"));
graph.addVertex(Str.fromRaw("C"));
graph.addEdge(Str.fromRaw("A"), Str.fromRaw("B"));
graph.addEdge(Str.fromRaw("B"), Str.fromRaw("C"));

// Path finding
const result = graph.dijkstra(Str.fromRaw("A"), Str.fromRaw("C"));

// Regex builder
const regex = await RegexBuilder.create();
regex.find("hello").or().find("world");
const pattern = regex.done();
console.log(pattern); // "hello|world"
```

## 🔩 Advanced Features

### Contracts and Invariants

```typescript
import { requires, ensures, contract, Invariant, Str } from "milost";

function divide(a: number, b: number): number {
  requires(b !== 0, Str.fromRaw("Divisor must not be zero"));

  const result = a / b;

  ensures(Number.isFinite(result), Str.fromRaw("Result must be finite"));
  return result;
}

// Invariants ensure values maintain certain properties
const positiveNumber = Invariant.new(
  10,
  (n) => n > 0,
  Str.fromRaw("Value must be positive")
);

// Value can only be transformed while preserving the invariant
const doubled = positiveNumber.map(
  (n) => n * 2,
  (n) => n > 0,
  Str.fromRaw("Value must remain positive")
);

// This would throw an error
try {
  positiveNumber.map(
    (n) => -n,
    (n) => n > 0,
    Str.fromRaw("Value must remain positive")
  );
} catch (e) {
  console.error(e.message); // "Value must remain positive"
}
```

### Resource Management

```typescript
import { Resource, withResource, DisposableGroup, IDisposable } from "milost";

// Manage resources that need cleanup
class DatabaseConnection implements IDisposable {
  constructor(private url: string) {
    console.log(`Connected to ${url}`);
  }

  query(sql: string) {
    return `Results for ${sql}`;
  }

  dispose() {
    console.log(`Connection to ${this.url} closed`);
  }
}

async function demoResources() {
  // Resources are automatically disposed when done
  await withResource(
    Resource.new(new DatabaseConnection("mysql://localhost/db"), (conn) =>
      conn.dispose()
    ),
    (conn) => {
      const result = conn.query("SELECT * FROM users");
      console.log(result);
      return result;
    }
  );

  // Group multiple resources together
  const group = await DisposableGroup.create();
  const conn1 = new DatabaseConnection("db1");
  const conn2 = new DatabaseConnection("db2");

  group
    .add({ dispose: () => conn1.dispose() })
    .add({ dispose: () => conn2.dispose() });

  try {
    // Use connections
  } finally {
    await group.dispose(); // Both connections closed
  }
}
```

### Pattern Matching

```typescript
import { build, __, matchValue, Patterns } from "milost";

// Simple pattern matching
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

async function calculateArea(shape: Shape) {
  return await build(shape)
    .with({ kind: "circle" }, (s) => Math.PI * s.radius * s.radius)
    .with({ kind: "rectangle" }, (s) => s.width * s.height)
    .with({ kind: "triangle" }, (s) => 0.5 * s.base * s.height)
    .otherwise(
      () => 0 // Default case
    );
}

// More advanced matching
async function describe(value: unknown) {
  return await matchValue(value, {
    Some: (val) => `Some(${val})`,
    None: () => "None",
    Ok: (val) => `Ok(${val})`,
    Err: (err) => `Err(${err.message})`,
    _: () => `Unknown value: ${String(value)}`,
  });
}
```

## 🚀 Rust-Powered Performance

MiLost brings the performance of Rust to your JavaScript applications through WebAssembly, automatically falling back to pure JavaScript implementations when WASM is unavailable.

### Performance Benefits

- **Native-like speeds**: Core algorithms implemented in Rust run significantly faster than pure JavaScript
- **Memory efficiency**: Rust's ownership system and precise memory management reduces overhead
- **Predictable performance**: Avoid JavaScript garbage collection pauses with Rust's deterministic memory management
- **Parallelism potential**: WebAssembly threads can take advantage of multiple cores when available

```typescript
import { initWasm, isWasmInitialized } from "milost";

async function setup() {
  try {
    // Explicitly initialize WASM (optional)
    await initWasm();

    if (isWasmInitialized()) {
      console.log(
        "Using Rust-powered WebAssembly implementation for maximum performance"
      );
    } else {
      console.log("Using JavaScript fallback implementation");
    }
  } catch (e) {
    console.warn(
      "WebAssembly initialization failed, using JavaScript fallback"
    );
  }
}
```

## 🔍 When to Use MiLost

MiLost is an excellent choice for:

- **Performance-critical applications**: When you need efficient data processing
- **Large-scale applications**: Managing complex state and data flows reliably
- **Applications requiring strong data validation**: Leveraging Rust's strict type system
- **Projects needing predictable error handling**: Using Result pattern throughout
- **Systems with high reliability requirements**: Employing Rust's safety guarantees
- **Applications dealing with complex data structures**: Using optimized Rust collections

## 🧬 Architecture Benefits

MiLost encourages clean architecture with:

- **Clear error boundaries**: Results make error handling explicit
- **Immutable by default**: Preventing unexpected state mutations
- **Controlled mutability**: Only when explicitly needed
- **Strong contracts**: Enforced by the type system
- **Resource safety**: Automatic cleanup of resources
- **Predictable state management**: Through reactive atoms

## 📄 License

MIT © Milan Vasiljev
