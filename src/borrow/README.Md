# Ownership and Reference Types

## Table of Contents

1. [Introduction](#introduction)
2. [Ownership Concepts](#ownership-concepts)
3. [Owned Type](#owned-type)
4. [Reference Types](#reference-types)
5. [Error Handling](#error-handling)
6. [Performance and Safety](#performance-and-safety)
7. [Usage Examples](#usage-examples)

## Introduction

This ownership system brings Rust-like memory management and borrowing semantics to JavaScript and TypeScript, providing a robust mechanism for controlling value lifecycles, preventing common memory-related errors, and enforcing strict ownership rules through compile-time and runtime checks.

### Key Features and Principles

- 🔒 Explicit Ownership Transfer
- 🛡️ Memory Safety Guarantees
- 🚀 Zero-Cost Ownership Abstractions
- 🔄 Controlled Borrowing Mechanisms
- 💡 Compile-Time and Runtime Enforcement
- 🚀 WebAssembly Performance
- 🔄 Flexible Immutable and Mutable References
- 🛡️ Comprehensive Safety Mechanisms

## Ownership Concepts

Ownership is a novel memory management paradigm that solves critical issues in traditional programming languages by introducing strict rules for value lifecycle and memory management.

### Core Ownership Rules

#### 1. Single Ownership

- Each value has exactly one owner at any given time
- Ownership can be transferred explicitly
- Prevents multiple simultaneous mutable references

```typescript
const data = Owned.new({ id: 1, content: "example" });
const transferredData = data.consume(); // Ownership transferred
// data is no longer valid
```

#### 2. Borrowing Mechanisms

- Immutable Borrowing: Multiple read-only references
- Mutable Borrowing: Exclusive, controlled mutation
- Prevents data races and undefined behavior

```typescript
// Immutable Borrow
const readValue = data.borrow((val) => val.id);

// Mutable Borrow
const updatedValue = data.borrowMut((val) => ({
  ...val,
  content: "updated",
}));
```

### Memory Safety Patterns

#### Preventing Common Errors

- Use-after-free
- Double-free
- Uncontrolled mutation
- Dangling references

```typescript
const owned = Owned.new(42);
owned.consume();
owned.consume(); // ❌ Throws OwnershipError
```

### Lifetime Management

#### Automatic Resource Cleanup

- Explicit value consumption
- Automatic dropping of references
- Deterministic resource management

```typescript
const ref = Ref.new({ name: "Temporary" });
ref.drop(); // Explicitly end reference lifecycle
```

### Ownership vs Traditional References

#### Traditional Approach

```typescript
let data = { value: 10 };
let ref1 = data;
let ref2 = data;
// Unpredictable mutations
```

#### Ownership Approach

```typescript
const owned = Owned.new({ value: 10 });
const processedValue = owned.borrow((val) => val.value * 2);
// Controlled, safe access
```

### Reference Types Hierarchy

#### 1. Ref<T>: Immutable Reference

- Read-only access
- Multiple simultaneous references allowed
- Cannot modify underlying value

#### 2. RefMut<T>: Mutable Reference

- Exclusive mutable access
- Controlled mutation
- Prevents concurrent modifications

#### 3. Owned<T>: Exclusive Ownership

- Complete control over value
- Explicit ownership transfer
- Comprehensive lifecycle management

### Performance Considerations

- WebAssembly-optimized implementations
- Zero-overhead abstractions
- Compile-time and runtime checks
- Minimal runtime performance impact

### Design Philosophy

- Bring Rust's safety guarantees to JavaScript/TypeScript
- Provide explicit, predictable memory management
- Reduce cognitive load of manual memory tracking
- Enable safer, more predictable code

### Memory Safety Pattern

JavaScript and TypeScript traditionally lack strict ownership rules. This implementation introduces:

- Explicit ownership transfer
- Borrowing rules
- Compile-time and runtime checks
- Prevention of use-after-free and double-free errors

## Owned Type

### Overview

`Owned<T>` represents exclusive ownership of a value with strict consumption rules.

### Key Methods

- `static new<T>(value: T)`: Create new owned value
- `consume()`: Consume and transfer ownership
- `borrow<R>(fn)`: Temporarily borrow value
- `borrowMut<R>(fn)`: Mutably borrow value
- `isConsumed()`: Check consumption status
- `isAlive()`: Check if value is available

### Basic Usage

```typescript
import { Owned } from "./ownership";

// Create an owned value
const ownedNumber = Owned.new(42);

// Consume the value
const value = ownedNumber.consume(); // ✅ Valid
const secondConsume = ownedNumber.consume(); // ❌ Throws OwnershipError

// Borrow the value
const result = ownedNumber.borrow((val) => val * 2);
```

### Borrowing Patterns

```typescript
// Immutable borrow
const doubled = ownedNumber.borrow((val) => val * 2);

// Mutable borrow (with transformation)
const incremented = ownedNumber.borrowMut((val) => val + 1);
```

## Reference Types

### Ref<T>: Immutable Reference

Provides read-only access to a value with strict lifetime management.

```typescript
import { Ref } from "./ref";

const ref = Ref.new({ name: "John" });

// Read value
const value = ref.get(); // { name: 'John' }

// Drop reference
ref.drop();
ref.get(); // ❌ Throws OwnershipError
```

### RefMut<T>: Mutable Reference

Allows controlled mutation of a value.

```typescript
import { RefMut } from "./refmut";

const person = RefMut.new({ name: "John", age: 30 });

// Get current value
const currentValue = person.get();

// Update value
person.set((p) => ({ ...p, age: 31 }));

// Drop reference
person.drop();
person.get(); // ❌ Throws OwnershipError
```

## Error Handling

### OwnershipError

A specialized error for ownership violations:

- Prevents accessing consumed values
- Blocks use-after-free scenarios
- Provides clear, actionable error messages

```typescript
try {
  const owned = Owned.new(42);
  owned.consume();
  owned.consume(); // Throws OwnershipError
} catch (err) {
  if (err instanceof OwnershipError) {
    console.log("Ownership violation detected");
  }
}
```

## Performance and Safety

### WebAssembly Integration

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

## Detailed Usage Scenarios

### Complex Ownership Transfer

```typescript
function processData<T>(data: Owned<T>): T {
  // Consume and process owned data
  return data.consume();
}

const originalData = Owned.new({ id: 1, value: "test" });
const processed = processData(originalData);
```

### Safe Mutable Borrowing

```typescript
const config = RefMut.new({
  maxRetries: 3,
  timeout: 1000,
});

// Safely update configuration
config.set((cfg) => ({
  ...cfg,
  maxRetries: 5,
}));

// Prevent further modifications
config.drop();
```

## Best Practices

### 👍 Do

```typescript
// Create owned values
const data = Owned.new(complexObject);

// Use borrowing for safe access
const result = data.borrow((val) => processValue(val));

// Explicitly manage ownership
const processed = data.consume();
```

### 👎 Avoid

```typescript
// Unsafe direct mutation
let data = complexObject;
data.prop = newValue; // Unpredictable changes

// Multiple references without control
const ref1 = data;
const ref2 = data; // Potential race conditions
```

## Use Cases

- Complex state management
- Immutable data processing
- Memory-sensitive applications
- Functional programming patterns
- Safe concurrent programming

## Limitations

- Overhead for simple, non-performance-critical code
- Learning curve for developers unfamiliar with ownership concepts
- Requires explicit ownership management
