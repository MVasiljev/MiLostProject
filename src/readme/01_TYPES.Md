# Types Module in MiLost

## Overview

The Types Module provides a robust, type-safe, and performant set of data structures and type utilities for JavaScript and TypeScript applications. Leveraging WebAssembly optimization and functional programming principles, it offers enhanced type safety and immutability.

## Key Features

🛡️ Type-Safe Primitives
🧊 Immutable Data Structures
🚀 WebAssembly-Optimized Performance
💡 Functional Programming Support
🔒 Strict Type Validation

## Primitive Types

### Numeric Types with Strict Validation

```typescript
import { u32, i16, f64, validateU32 } from "milost";

// Safe type creation with validation
const safeUint = u32(42); // ✅ Valid unsigned 32-bit integer
const safeFloat = f64(3.14159); // ✅ Valid 64-bit float

// Validation functions
const isValid = validateU32(100); // Returns true
const isInvalid = validateU32(5000000000); // Returns false
```

### Type Conversion and Formatting

```typescript
import { u8_to_u16, format_bin, format_hex } from "milost";

const converted = u8_to_u16(255); // Convert u8 to u16
const binary = format_bin(42); // Convert to binary string
const hex = format_hex(255); // Convert to hexadecimal
```

## Immutable Data Structures

### Vector (Vec)

```typescript
import { Vec } from "milost";

const numbers = Vec.from([1, 2, 3, 4, 5]);

// Functional operations
const doubled = numbers.map((x) => x * 2);
const filtered = numbers.filter((x) => x > 2);
const sum = numbers.fold(0, (acc, num) => acc + num);
```

### HashMap

```typescript
import { HashMap } from "milost";

const users = HashMap.from([
  ["john", { age: 30, role: "admin" }],
  ["jane", { age: 25, role: "user" }],
]);

const adminUsers = users.filter((user, key) => user.role === "admin");
```

### HashSet

```typescript
import { HashSet } from "milost";

const set1 = HashSet.from([1, 2, 3]);
const set2 = HashSet.from([3, 4, 5]);

const union = set1.union(set2);
const intersection = set1.intersection(set2);
```

## Branding and Type Safety

```typescript
import { Branded, BrandTypes } from "milost";

// Create branded types with validation
const createEmail = (value: string) =>
  Branded.create(value, BrandTypes.JSON, (email) => email.includes("@"));

const validEmail = createEmail("user@example.com");
```

## Utility Types

### Common Type Helpers

```typescript
import { isDefined, isObject, isNumeric, Nullable, DeepReadonly } from "milost";

// Type checking
const checkNumeric = isNumeric(42); // true
const checkObject = isObject({ name: "John" }); // true

// Utility types
type OptionalUser = Nullable<{ name: string }>;
type ReadonlyConfig = DeepReadonly<{
  settings: {
    theme: string;
  };
}>;
```

## Advanced String Handling

```typescript
import { Str } from "milost";

const greeting = Str.fromRaw("Hello, World!");
const upper = greeting.toUpperCase();
const trimmed = greeting.trim();
const substring = greeting.substring(0, 5);
```

## Performance Considerations

- WebAssembly backend for near-native performance
- Immutable operations prevent unexpected mutations
- Lazy evaluation and functional transformations
- Minimal runtime overhead

## Best Practices

### ✅ Do

- Use type-safe primitives
- Leverage immutable data structures
- Use functional transformations
- Validate input data

### ❌ Avoid

- Direct mutation of data
- Bypassing type validation
- Ignoring potential type errors

## Limitations

- Slight performance overhead for complex operations
- Learning curve for functional programming paradigms
- Requires explicit type conversions
