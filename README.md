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
- **Regular Expressions**: Powerful regular expression utilities with fluent interfaces
- **Resource Management**: Manage disposable resources safely
- **Pattern Matching**: Elegant pattern matching for complex control flow

## 📦 Installation

```bash
npm install milost
```

or

```bash
yarn add milost
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

### Regular Expression Builder

```typescript
import { RegexBuilder, RegexLanguage } from "milost";

async function demoRegex() {
  // Low-level builder
  const regex = await RegexBuilder.create();
  regex.startCapture().digits().endCapture().find("-").digits();
  const pattern = regex.done();
  console.log(pattern); // "(\d+)-\d+"

  const matches = regex.extractMatches("Product ID: 12345-678");
  console.log(matches); // ["12345-678"]

  // Natural language interface
  const language = await RegexLanguage.create();
  language
    .iWantToFind()
    .findMe("Product ID: ")
    .startCapturing()
    .digits()
    .endCapturing();

  console.log(language.test("Product ID: 12345")); // true
}
```

### Atom-based State Management

```typescript
import { createAtom, createSelector, createAction } from "milost";

async function setupState() {
  // Create atoms to store state
  const counterAtom = await createAtom<number>(0);
  const textAtom = await createAtom<string>("");

  // Create actions to update state
  const increment = createAction(
    counterAtom,
    (state, amount: number) => state + amount
  );

  // Create a selector to derive data
  const doubledCounter = createSelector(counterAtom, (state) => state * 2);

  // Subscribe to changes
  counterAtom.subscribe(() => {
    console.log(`Counter: ${counterAtom.getState()}`);
    console.log(`Doubled: ${doubledCounter()}`);
  });

  // Use the actions
  increment(5); // Counter: 5, Doubled: 10
}
```

### Asynchronous Programming with Tasks and Channels

```typescript
import { Task, createChannel, Result, Ok } from "milost";

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
}
```

### Resource Management

```typescript
import { Resource, withResource, DisposableGroup } from "milost";

class DatabaseConnection {
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
import { MatchBuilder, __ } from "milost";

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

async function calculateArea(shape: Shape) {
  return await MatchBuilder.create(shape)
    .with({ kind: "circle" }, (s) => Math.PI * s.radius * s.radius)
    .with({ kind: "rectangle" }, (s) => s.width * s.height)
    .otherwise(() => 0);
}
```

## 🚀 WebAssembly Integration

MiLost automatically uses WebAssembly when available for maximum performance, with seamless fallback to pure JavaScript implementations. You can explicitly initialize WebAssembly support:

```typescript
import { initWasm, isWasmInitialized } from "milost";

async function setup() {
  await initWasm();

  if (isWasmInitialized()) {
    console.log("Using WebAssembly for maximum performance");
  } else {
    console.log("Using JavaScript fallback implementation");
  }
}
```

## 📄 License

MIT © Milan Vasiljev
