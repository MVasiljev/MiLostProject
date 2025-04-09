# Borrow Module in MiLost

## Overview

The Borrow Module introduces Rust-inspired ownership and borrowing semantics to JavaScript and TypeScript, providing a robust mechanism for memory management, preventing common programming errors, and ensuring safe value lifecycles.

## Key Features

🔒 Explicit Ownership Transfer
🛡️ Memory Safety Guarantees
🚀 WebAssembly-Optimized Performance
💡 Controlled Borrowing Mechanisms
🔄 Immutable and Mutable References

## Core Ownership Types

### Owned<T>: Exclusive Ownership

```typescript
import { Owned, Patterns } from "milost";

const ownedData = Owned.new({ id: 1, content: "example" });

const result = await Patterns.match(ownedData, {
  Owned: (data) => {
    // Consume or borrow the value
    const processedId = data.borrow((val) => val.id);
    return processedId;
  },
  _: () => null,
});
```

### Ref<T>: Immutable Reference

```typescript
import { Ref, Patterns } from "milost";

const ref = Ref.new({ name: "John" });

const result = await Patterns.match(ref, {
  Ref: (value) => {
    // Safely access the value
    const name = value.get().name;
    value.drop();
    return name;
  },
  _: () => null,
});
```

### RefMut<T>: Mutable Reference

```typescript
import { RefMut, Patterns } from "milost";

const person = RefMut.new({ name: "John", age: 30 });

const result = await Patterns.match(person, {
  RefMut: (ref) => {
    // Mutate the value
    ref.set((p) => ({ ...p, age: 31 }));
    const updatedAge = ref.get().age;
    ref.drop();
    return updatedAge;
  },
  _: () => null,
});
```

## Ownership Principles

### 1. Single Ownership

- Each value has exactly one owner
- Ownership can be transferred explicitly
- Prevents multiple simultaneous mutable references

### 2. Borrowing Mechanisms

- Immutable Borrowing: Multiple read-only references
- Mutable Borrowing: Exclusive, controlled mutation
- Prevents data races and undefined behavior

## Error Handling with Pattern Matching

```typescript
import { Owned, Patterns } from "milost";

const processOwned = async (owned: Owned<number>) => {
  const result = await Patterns.match(owned, {
    Owned: (data) => {
      try {
        const value = data.consume();
        return `Processed value: ${value}`;
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
    _: () => "Invalid owned value",
  });
};
```

## WebAssembly Integration

- Optimized performance through WebAssembly backend
- Fallback to JavaScript implementation if WASM unavailable
- Zero-cost abstractions for type safety

### Initialization

```typescript
// Optional: Explicitly initialize WASM module
await Owned.init();
await Ref.init();
await RefMut.init();
```

## Use Cases

- Complex state management
- Immutable data processing
- Memory-sensitive applications
- Functional programming patterns
- Safe concurrent programming

## Performance Considerations

- Minimal runtime overhead
- WebAssembly optimization
- Compile-time and runtime ownership checks

## Best Practices

### ✅ Do

- Use `Owned` for values requiring explicit ownership
- Leverage pattern matching for safe access
- Explicitly manage ownership lifecycle

### ❌ Avoid

- Direct mutation without controlled borrowing
- Ignoring ownership transfer
- Accessing values after consumption

## Limitations

- Overhead for simple, non-performance-critical code
- Learning curve for developers unfamiliar with ownership concepts
- Requires explicit ownership management
