# Core Module in MiLost

## Overview

The Core Module is the foundational layer of the MiLost library, providing essential types, error handling, and functional programming utilities that enhance TypeScript/JavaScript development.

## Key Features

🛡️ Robust Error Handling
🔍 Powerful Type Utilities
🧩 Functional Programming Primitives
🚀 WebAssembly Optimized
💡 Immutable Data Structures

## Core Types

### Option<T>

A type-safe alternative to `null` or `undefined` that forces explicit handling of potentially absent values.

```typescript
import { Option, Patterns } from "milost";

const processValue = async (maybeValue: Option<number>) => {
  const result = await Patterns.match(maybeValue, {
    Some: (value) => value * 2,
    None: () => 0,
  });
  return result;
};

const someValue = Option.Some(42);
const noneValue = Option.None<number>();

await processValue(someValue); // 84
await processValue(noneValue); // 0
```

### Result<T, E>

Powerful error handling type that makes error management explicit and type-safe.

```typescript
import { Result, Patterns } from "milost";

const divide = (a: number, b: number): Result<number, Error> =>
  b !== 0 ? Result.Ok(a / b) : Result.Err(new Error("Division by zero"));

const processResult = async (result: Result<number, Error>) => {
  const output = await Patterns.match(result, {
    Ok: (value) => `Success: ${value}`,
    Err: (error) => `Error: ${error.message}`,
  });
  console.log(output);
};

await processResult(divide(10, 2)); // "Success: 5"
await processResult(divide(10, 0)); // "Error: Division by zero"
```

## Functional Programming Utilities

### Composition Functions

```typescript
import { pipe, compose } from "milost";

const double = (x: number) => x * 2;
const increment = (x: number) => x + 1;

// Pipe: Left-to-right function composition
const pipeResult = pipe(increment, double)(5); // (5 + 1) * 2 = 12

// Compose: Right-to-left function composition
const composeResult = compose(increment, double)(5); // (5 * 2) + 1 = 11
```

### Memoization and Caching

```typescript
import { memoize } from "milost";

const expensiveCalculation = memoize((x: number) => {
  console.log("Calculating...");
  return x * x;
});

expensiveCalculation(5); // Logs "Calculating..." and returns 25
expensiveCalculation(5); // Returns 25 instantly from cache
```

## Error Handling with Pattern Matching

```typescript
import { Result, Patterns, ValidationError } from "milost";

const validateUser = (user: any): Result<User, ValidationError> =>
  user.name
    ? Result.Ok(user)
    : Result.Err(new ValidationError(Str.fromRaw("User name is required")));

const processUser = async (userResult: Result<User, ValidationError>) => {
  const outcome = await Patterns.match(userResult, {
    Ok: (user) => `User created: ${user.name}`,
    Err: (error) => `Validation failed: ${error.message}`,
  });
  return outcome;
};
```

## Performance Considerations

- WebAssembly backend for near-native performance
- Lazy evaluation
- Immutable data structures
- Minimal runtime overhead

## Best Practices

### ✅ Do

- Use `Option` for potentially absent values
- Leverage `Result` for error-prone operations
- Prefer functional composition
- Use pattern matching for explicit error handling

### ❌ Avoid

- Ignoring potential errors
- Excessive nested conditionals
- Manual null checks

## Limitations

- Small performance overhead for complex operations
- Learning curve for functional programming paradigms
- Requires explicit error handling
