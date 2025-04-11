# MiLost WebAssembly Integration

This document provides a comprehensive guide to the WebAssembly integration architecture used in the MiLost library. It explains how the architecture works, how to add new modules, and how developers should use the system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Components](#key-components)
3. [How to Add a New Module](#how-to-add-a-new-module)
4. [Module Implementation Pattern](#module-implementation-pattern)
5. [Using the WebAssembly Module](#using-the-webassembly-module)
6. [Initialization and Status Reporting](#initialization-and-status-reporting)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

MiLost's WebAssembly integration uses a modular registry pattern that allows separate library components to register themselves with a central system. This architecture provides:

1. **Centralized Initialization**: All modules are initialized through a single entry point
2. **Graceful Fallbacks**: Each module can fall back to JavaScript when needed
3. **Module Independence**: Modules define their own initialization requirements
4. **Detailed Logging**: Logging helps identify missing WASM functions
5. **Error Resilience**: The system handles partial WASM availability

![Architecture Diagram](https://example.com/architecture.png)

## Key Components

### 1. Module Registry (`registry.ts`)

The registry maintains a list of modules and coordinates initialization:

```typescript
// registry.ts
export interface WasmModule {
  name: string;
  initialize(wasmModule: any): void;
  fallback(): void;
}

export function registerModule(module: WasmModule): void;
export function initWasm(options?: {
  throwOnError?: boolean;
}): Promise<boolean>;
export function getWasmModule(): any;
export function isWasmInitialized(): boolean;
export function getInitializationStatus(): {
  isInitialized: boolean;
  registeredModules: string[];
  initializedModules: string[];
};
```

### 2. WASM Loader (`init.ts`)

Handles the actual loading of the WebAssembly module:

```typescript
// init.ts
export async function loadWasmModule(): Promise<any>;
```

### 3. Helper Functions (`lib.ts`)

Provides utility functions for interacting with WASM:

```typescript
// lib.ts
export function callWasmInstanceMethod<T>(
  instance: any,
  methodName: string,
  args?: any[],
  fallback: () => T
): T;

export function callWasmStaticMethod<T>(
  className: string,
  methodName: string,
  args?: any[],
  fallback: () => T
): T;

export function createWasmInstance<T>(
  className: string,
  args?: any[],
  fallback: () => T
): T;
```

## How to Add a New Module

To add a new module to the WebAssembly integration:

1. **Define the Module**:

```typescript
// mymodule.ts
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";

// Define your module
const myModule: WasmModule = {
  name: "MyModule",

  initialize(wasmModule: any) {
    console.log("Initializing MyModule with WASM...");

    // Check for required functions
    if (typeof wasmModule.MyModule === "function") {
      console.log("Found MyModule constructor in WASM");
      MyClass._useWasm = true;

      // Further initialization...
    } else {
      throw new Error("Required WASM functions not found for MyModule");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for MyModule");
    MyClass._useWasm = false;
  },
};

// Register the module
registerModule(myModule);

// Your module implementation
export class MyClass {
  static _useWasm: boolean = false;

  // Rest of your implementation...
}
```

2. **Use WASM in Your Methods**:

```typescript
methodName(): ReturnType {
  if (MyClass._useWasm) {
    try {
      const wasmModule = getWasmModule();
      if (wasmModule && wasmModule.MyModule) {
        // Use WASM implementation
        return wasmModule.someFunction();
      }
    } catch (error) {
      console.warn(`WASM call failed, using JS fallback: ${error}`);
    }
  }

  // JavaScript fallback implementation
  return fallbackResult;
}
```

## Module Implementation Pattern

Each module should follow this pattern:

### 1. Module Registration

```typescript
const moduleDefinition: WasmModule = {
  name: "ModuleName",
  initialize(wasmModule) {
    /* ... */
  },
  fallback() {
    /* ... */
  },
};

registerModule(moduleDefinition);
```

### 2. Static Initialization Flag

```typescript
export class YourClass {
  static _useWasm: boolean = false;

  // Rest of implementation...
}
```

### 3. Method Pattern

```typescript
someMethod(args: ArgType): ReturnType {
  if (YourClass._useWasm) {
    try {
      const wasmModule = getWasmModule();
      // WASM implementation
    } catch (error) {
      console.warn(`WASM method failed: ${error}`);
    }
  }

  // JS fallback
}
```

### 4. Static Method Pattern

```typescript
static someStaticMethod(args: ArgType): ReturnType {
  if (YourClass._useWasm) {
    try {
      const wasmModule = getWasmModule();
      if (wasmModule && wasmModule.YourClass && typeof wasmModule.YourClass.staticMethod === "function") {
        return wasmModule.YourClass.staticMethod(args);
      }
    } catch (error) {
      console.warn(`WASM static method failed: ${error}`);
    }
  }

  // JS fallback
}
```

## Using the WebAssembly Module

In your application code, using the WebAssembly integration is straightforward:

```typescript
import { initWasm, getInitializationStatus } from "milost";
import { YourClass } from "milost";

async function main() {
  // Initialize all modules
  await initWasm();

  // Get status
  const status = getInitializationStatus();
  console.log(`WASM Modules: ${status.initializedModules.join(", ")}`);

  // Use functionality (WASM or JS automatically chosen)
  const instance = new YourClass();
  const result = instance.method();
}
```

## Initialization and Status Reporting

The system provides detailed initialization status:

```typescript
const status = getInitializationStatus();
console.log(`Initialized: ${status.isInitialized}`);
console.log(`Registered: ${status.registeredModules.join(", ")}`);
console.log(`Using WASM: ${status.initializedModules.join(", ")}`);
```

## Best Practices

1. **Check Feature Availability**:
   Always check for specific WASM functions rather than assuming they exist

2. **Use Proper Error Handling**:
   Wrap all WASM calls in try/catch blocks with fallbacks

3. **Provide Detailed Logging**:
   Log which functions are missing to help with debugging

4. **Test Both Paths**:
   Test both WASM and JavaScript implementations

5. **Semantic Module Names**:
   Use clear, meaningful module names in the registry

6. **Document Requirements**:
   Document which WASM functions your module requires

## Troubleshooting

### Common Issues

1. **Missing WASM Functions**:

   - Check the console logs for "Missing required method" warnings
   - Add the missing functions to your Rust code
   - Rebuild the WASM module

2. **Initialization Errors**:

   - Look for "Failed to initialize module" errors
   - Check if the module is being loaded correctly
   - Verify path configuration in `init.ts`

3. **Performance Issues**:
   - Check if the right modules are using WASM
   - Verify that the performance-critical paths are properly optimized

### Debugging Tips

1. **Enable Verbose Logging**:

   ```typescript
   // Set before initialization
   globalThis.__MILOST_DEBUG__ = true;
   await initWasm();
   ```

2. **Check Initialization Status**:

   ```typescript
   const status = getInitializationStatus();
   console.log(status.initializedModules);
   ```

3. **Manual Module Check**:
   ```typescript
   if (YourClass._useWasm) {
     console.log("Using WASM for YourClass");
   } else {
     console.log("Using JS fallback for YourClass");
   }
   ```

---
