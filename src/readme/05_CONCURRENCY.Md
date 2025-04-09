# Concurrency Module in MiLost

## Overview

The Concurrency Module provides robust primitives for managing asynchronous operations, channels, and tasks with a focus on type safety, functional programming, and WebAssembly optimization.

## Key Features

🔀 Async Task Management
📡 Channel-based Communication
🛡️ Type-Safe Concurrency Primitives
🚀 WebAssembly Optimized
💡 Functional Programming Patterns

## Task Management

### Creating and Manipulating Tasks

```typescript
import { Task, Patterns } from "milost";

const fetchData = (url: string) =>
  Task.new(async (signal) => {
    const response = await fetch(url, { signal });
    return response.ok
      ? Result.Ok(await response.json())
      : Result.Err(new Error("Fetch failed"));
  });

const processTask = async () => {
  const task = fetchData("https://api.example.com/data");

  const result = await Patterns.match(task, {
    Task: async (t) => {
      const outcome = await t.run();
      return Patterns.match(outcome, {
        Ok: (data) => `Data received: ${data}`,
        Err: (error) => `Error: ${error.message}`,
      });
    },
    _: () => "Invalid task",
  });

  // Optionally cancel long-running tasks
  if (task.isCancelled) {
    console.log("Task was cancelled");
  }
};
```

### Task Composition

```typescript
import { Task, Result } from "milost";

const fetchUsers = () =>
  Task.new(async () => {
    const response = await fetch("/users");
    return response.ok
      ? Result.Ok(await response.json())
      : Result.Err(new Error("Users fetch failed"));
  });

const fetchPosts = () =>
  Task.new(async () => {
    const response = await fetch("/posts");
    return response.ok
      ? Result.Ok(await response.json())
      : Result.Err(new Error("Posts fetch failed"));
  });

const combineData = async () => {
  const combinedTask = fetchUsers().flatMap((users) =>
    fetchPosts().map((posts) => ({ users, posts }))
  );

  const result = await combinedTask.run();

  return Patterns.match(result, {
    Ok: (data) => `Users: ${data.users.length}, Posts: ${data.posts.length}`,
    Err: (error) => `Fetch failed: ${error.message}`,
  });
};
```

## Channels

### Creating and Using Channels

```typescript
import { createChannel, Patterns } from "milost";

const createWorkerChannel = async () => {
  const [sender, receiver] = await createChannel<number>();

  // Sender thread
  const sendData = async () => {
    for (let i = 0; i < 10; i++) {
      await sender.send(i);
    }
    sender.close();
  };

  // Receiver thread
  const receiveData = async () => {
    while (!receiver.closed) {
      const value = await receiver.receive();

      await Patterns.match(value, {
        Some: (num) => console.log(`Received: ${num}`),
        None: () => console.log("Channel closed"),
      });
    }
  };

  // Start threads
  sendData();
  receiveData();
};
```

## Concurrency Patterns

### Parallel Processing

```typescript
import { Task } from "milost";

const processItems = async (items: number[]) => {
  const tasks = items.map((item) =>
    Task.new(async () => {
      // Simulate async processing
      await new Promise((resolve) => setTimeout(resolve, 100));
      return Result.Ok(item * 2);
    })
  );

  const combinedTask = Task.all(tasks);
  const result = await combinedTask.run();

  return Patterns.match(result, {
    Ok: (processedItems) => processedItems,
    Err: (error) => `Processing failed: ${error.message}`,
  });
};
```

## Performance Considerations

- WebAssembly-backed implementations
- Lazy evaluation
- Minimal runtime overhead
- Functional composition of async operations

## Best Practices

### ✅ Do

- Use `Task` for complex async operations
- Leverage channels for inter-thread communication
- Use pattern matching for result handling
- Compose tasks functionally

### ❌ Avoid

- Nested promise chains
- Manual error handling
- Blocking operations

## Limitations

- Overhead for very simple async tasks
- Learning curve for functional concurrency
- Requires understanding of functional patterns
