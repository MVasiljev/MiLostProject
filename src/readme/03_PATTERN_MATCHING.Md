# Pattern Matching in MiLost

## Overview

Pattern matching is a powerful functional programming technique that provides a more expressive and safer way to handle complex conditional logic in TypeScript/JavaScript. The MiLost Pattern Matching system offers a robust, type-safe alternative to traditional `switch` statements and verbose `if-else` chains.

## Key Features

🔍 Powerful Pattern Matching

- Match against values, types, and complex object structures
- Support for `Option` and `Result` types
- WebAssembly-optimized performance
- Type-safe pattern extraction
- Flexible matching strategies

## Basic Usage

### Value Matching

```typescript
import { Patterns } from "milost";

// Simple value matching
const result = await Patterns.match(5, {
  1: () => "One",
  5: () => "Five",
  _: (val) => `Other value: ${val}`,
});
console.log(result); // Outputs: 'Five'
```

### Type Matching

```typescript
import { Patterns, Str, Vec } from "milost";

const result = await Patterns.type(value, {
  str: (val: Str) => `String: ${val.unwrap()}`,
  numeric: (val) => `Number: ${val}`,
  vec: (val: Vec<number>) => `Vector with ${val.len()} elements`,
  default: () => "Unknown type",
});
```

### Option and Result Matching

```typescript
import { Option, Result, Patterns } from "milost";

// Matching Option
const someValue = Option.Some(42);
const result = await Patterns.match(someValue, {
  Some: (val) => `Value is ${val}`,
  None: () => "No value",
});

// Matching Result
const apiResult = Result.Ok(100);
const processResult = await Patterns.match(apiResult, {
  Ok: (val) => `Success: ${val}`,
  Err: (error) => `Error: ${error.message}`,
});
```

### Advanced Object Matching

```typescript
interface User {
  type: Str;
  name: string;
  age: number;
}

const user: User = { type: Str.fromRaw("admin"), name: "John", age: 30 };

const result = await Patterns.tag(user, {
  admin: (u) => `Admin: ${u.name}`,
  user: (u) => `Regular User: ${u.name}`,
  _: () => "Unknown user type",
});
```

## Pattern Matching Techniques

### Wildcard Matching

```typescript
const value = 42;
const result = await Patterns.match(value, [
  [5, () => "Five"],
  [Patterns.Wildcard, (val) => `Other value: ${val}`],
]);
```

### Predicate Matching

```typescript
const result = await Patterns.pattern(value, [
  [(x) => x > 10, (val) => `Large value: ${val}`],
  [(x) => x <= 10, (val) => `Small value: ${val}`],
]);
```

## Best Practices

### ✅ Do

- Use pattern matching for complex conditional logic
- Leverage type safety
- Handle all possible cases
- Use wildcard (`_`) for default cases

### ❌ Avoid

- Nested, complex conditional statements
- Ignoring potential error cases
- Using type assertions over pattern matching

## Performance Considerations

- Optimized with WebAssembly backend
- Fallback to JavaScript for maximum compatibility
- Minimal overhead compared to traditional conditionals

## Error Handling

Pattern matching provides robust error handling:

- Throws `ValidationError` if no matching pattern is found
- Encourages explicit case handling
- Prevents runtime type errors

## Comparison with Traditional Approaches

```typescript
// Traditional Approach
function traditionalApproach(value: any) {
  if (typeof value === 'string') {
    // String logic
  } else if (typeof value === 'number') {
    // Number logic
  } else {
    // Default logic
  }
}

// Pattern Matching Approach
async function patternMatchingApproach(value: any) {
  return await Patterns.type(value, {
    str: (val) => /* String logic */,
    numeric: (val) => /* Number logic */,
    default: () => /* Default logic */
  });
}
```

## Limitations

- Slightly more complex syntax compared to simple `if-else`
- Learning curve for developers new to functional programming
- Performance overhead for extremely simple conditions
