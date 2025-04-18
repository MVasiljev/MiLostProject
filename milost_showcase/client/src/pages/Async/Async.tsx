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
  InfoBox,
  CodeBlock,
} from "./Async.styles";
import { FormGroup, Label, Pre, SmallText } from "../Strings/Strings.styles";
import { Table } from "../Vector/Vector.styles";

function AsyncPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "channels", label: "Channels" },
    { id: "tasks", label: "Tasks" },
    { id: "cancellation", label: "Cancellation" },
    { id: "patterns", label: "Async Patterns" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Async Concurrency</Title>
        <Subtitle>
          Safe and Predictable Asynchronous Programming with Channels and Tasks
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
              MiLost provides robust abstractions for concurrent and
              asynchronous programming, drawing inspiration from Rust's
              concurrency model to ensure safety and predictability.
            </InfoBox>

            <FormGroup>
              <Label>Async Primitives</Label>
              <p>
                MiLost's async system provides powerful primitives for managing
                concurrent operations with explicit error handling and
                cancellation support.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Core Components</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Channel</td>
                    <td>
                      Communication between concurrent tasks with
                      Sender/Receiver pairs
                    </td>
                  </tr>
                  <tr>
                    <td>Task</td>
                    <td>
                      Manageable asynchronous operations with Result-based error
                      handling
                    </td>
                  </tr>
                  <tr>
                    <td>Cancellation</td>
                    <td>
                      First-class support for safely cancelling async operations
                    </td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Task, createChannel } from "milost";

// Create a communication channel 
const [sender, receiver] = await createChannel();

// Create a task that produces values
const producer = Task.new(async (signal) => {
  for (let i = 0; i < 5; i++) {
    // Check if task was cancelled
    if (signal.aborted) break;
    
    await sender.send(i);
    await new Promise(r => setTimeout(r, 100));
  }
  
  // Close the channel when done
  sender.close();
  return Ok("Producer completed");
});

// Create a task that consumes values
const consumer = Task.new(async (signal) => {
  while (!receiver.closed) {
    // Check if task was cancelled
    if (signal.aborted) break;
    
    const value = await receiver.receive();
    if (value.isSome()) {
      console.log("Received:", value.unwrap());
    } else {
      break; // Channel closed
    }
  }
  
  return Ok("Consumer completed");
});

// Run both tasks
const producerResult = await producer.run();
const consumerResult = await consumer.run();`}</Pre>
            </CodeBlock>

            <SmallText>
              MiLost's async primitives provide a structured approach to
              concurrent programming, with built-in safety mechanisms that
              prevent common pitfalls like race conditions and memory leaks.
            </SmallText>
          </>
        )}

        {activeCategory === "channels" && (
          <>
            <InfoBox>
              Channels provide a safe way for concurrent tasks to communicate,
              implementing the message-passing concurrency model inspired by CSP
              (Communicating Sequential Processes).
            </InfoBox>

            <FormGroup>
              <Label>Channel Concepts</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Concept</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sender</td>
                    <td>Sends values to the channel</td>
                  </tr>
                  <tr>
                    <td>Receiver</td>
                    <td>Receives values from the channel</td>
                  </tr>
                  <tr>
                    <td>Capacity</td>
                    <td>Optional buffer size for channel messages</td>
                  </tr>
                  <tr>
                    <td>Blocking</td>
                    <td>Senders block when capacity is reached</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { createChannel, u32 } from "milost";

// Create a channel with default (unlimited) capacity
const [sender, receiver] = await createChannel();

// Create a channel with buffer capacity
const [bufferedSender, bufferedReceiver] = await createChannel(u32(10));

// Sending values
await sender.send("hello");

// Try sending without blocking
const sent = await sender.trySend("world");
if (sent) {
  console.log("Message sent immediately");
} else {
  console.log("Would block, not sent");
}

// Receiving values (returns Option<T>)
const received = await receiver.receive();
if (received.isSome()) {
  console.log("Received:", received.unwrap());
} else {
  console.log("Channel closed");
}

// Try receiving without blocking
const tryReceived = receiver.tryReceive();
if (tryReceived.isSome()) {
  console.log("Received immediately:", tryReceived.unwrap());
} else {
  console.log("No message available");
}

// Closing a channel
sender.close();

// Checking if a channel is closed
if (receiver.closed) {
  console.log("The channel is closed");
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Channel Characteristics</Label>
              <ul>
                <li>
                  <strong>MPSC</strong>: Multiple producers, single consumer
                  pattern
                </li>
                <li>
                  <strong>Async/Await</strong>: Full support for async/await for
                  blocking operations
                </li>
                <li>
                  <strong>Non-blocking alternatives</strong>: trySend and
                  tryReceive for non-blocking operations
                </li>
                <li>
                  <strong>Explicit closure</strong>: Channels must be closed
                  explicitly
                </li>
                <li>
                  <strong>WebAssembly acceleration</strong>:
                  Performance-critical operations can be accelerated
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Channels provide a safe mechanism for communication between
              concurrent tasks, eliminating the need for shared mutable state
              and reducing the risk of race conditions.
            </SmallText>
          </>
        )}

        {activeCategory === "tasks" && (
          <>
            <InfoBox>
              Tasks provide a structured approach to managing asynchronous
              operations, with built-in error handling, cancellation support,
              and composition capabilities.
            </InfoBox>

            <FormGroup>
              <Label>Task Features</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Result-based returns</td>
                    <td>Tasks always return Result&lt;T, E&gt;</td>
                  </tr>
                  <tr>
                    <td>Cancellation</td>
                    <td>Built-in support for cancelling operations</td>
                  </tr>
                  <tr>
                    <td>Composition</td>
                    <td>map, flatMap, and other composable operations</td>
                  </tr>
                  <tr>
                    <td>Error handling</td>
                    <td>Explicit error handling with catch method</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Task, AppError, Ok, Err } from "milost";

// Create a task with explicit error handling
const fetchUserTask = Task.new(async (signal) => {
  try {
    const response = await fetch("/api/user", { signal });
    
    if (!response.ok) {
      return Err(new AppError("Failed to fetch user"));
    }
    
    const user = await response.json();
    return Ok(user);
  } catch (error) {
    if (signal.aborted) {
      return Err(new AppError("Task cancelled"));
    }
    return Err(new AppError(String(error)));
  }
});

// Transform task results with map
const userNameTask = fetchUserTask.map(user => user.name);

// Chain tasks with flatMap
const userPermissionsTask = fetchUserTask
  .flatMap(user => fetchPermissions(user.id));

// Handle errors with catch
const fallbackTask = fetchUserTask
  .catch(error => {
    console.error("Error fetching user:", error);
    return Ok({ name: "Guest", id: 0 });
  });

// Combining multiple tasks
const combinedTask = Task.all([
  fetchUserTask,
  fetchSettingsTask,
  fetchPreferencesTask
]);

// Execute the task
const result = await combinedTask.run();
if (result.isOk()) {
  const [user, settings, preferences] = result.unwrap();
  renderDashboard(user, settings, preferences);
} else {
  showError(result.getError().message);
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Static Task Methods</Label>
              <ul>
                <li>
                  <strong>Task.new(executor)</strong>: Create a new task from an
                  async function
                </li>
                <li>
                  <strong>Task.resolve(value)</strong>: Create a task that
                  resolves with a value
                </li>
                <li>
                  <strong>Task.reject(error)</strong>: Create a task that
                  rejects with an error
                </li>
                <li>
                  <strong>Task.all(tasks)</strong>: Combine multiple tasks into
                  one
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Tasks provide a structured approach to asynchronous programming
              with an emphasis on safety, error handling, and cancellation
              support.
            </SmallText>
          </>
        )}

        {activeCategory === "cancellation" && (
          <>
            <InfoBox>
              MiLost provides first-class support for cancellation, allowing
              safe and reliable termination of ongoing asynchronous operations.
            </InfoBox>

            <FormGroup>
              <Label>Cancellation Features</Label>
              <ul>
                <li>
                  <strong>AbortSignal integration</strong>: Uses standard web
                  AbortSignal
                </li>
                <li>
                  <strong>Graceful termination</strong>: Resources are properly
                  released
                </li>
                <li>
                  <strong>Explicit cancellation API</strong>: Tasks and
                  operations have explicit cancel() methods
                </li>
                <li>
                  <strong>Cancellation propagation</strong>: Cancellation can
                  cascade to dependent operations
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Task, AsyncUtils } from "milost";

// Creating a cancellable task
const longRunningTask = Task.new(async (signal) => {
  // Perform setup
  const resource = await acquireResource();
  
  try {
    // Check for cancellation periodically
    for (let i = 0; i < 100; i++) {
      if (signal.aborted) {
        console.log("Task was cancelled");
        break;
      }
      
      await performStep(i);
      await new Promise(r => setTimeout(r, 100));
    }
    
    return Ok("Task completed successfully");
  } finally {
    // Always release resources, even if cancelled
    await resource.release();
  }
});

// Start the task
const runningTask = longRunningTask.run();

// Cancel the task after 5 seconds
setTimeout(() => {
  console.log("Cancelling task...");
  longRunningTask.cancel();
}, 5000);

// Using AsyncUtils for cancellable operations
const { promise, cancel } = AsyncUtils.cancellable(async (signal) => {
  const response = await fetch("/api/data", { signal });
  const data = await response.json();
  return Ok(data);
});

// Cancel the operation after 3 seconds
setTimeout(() => {
  cancel();
}, 3000);

// Wait for the result
const result = await promise;
if (result.isErr()) {
  console.log("Operation failed or was cancelled");
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Cancellation Best Practices</Label>
              <ol>
                <li>
                  Always check the signal.aborted flag periodically in
                  long-running operations
                </li>
                <li>
                  Use try/finally blocks to ensure resources are released even
                  when cancelled
                </li>
                <li>
                  Pass the AbortSignal to APIs that support it (like fetch)
                </li>
                <li>Explicitly handle cancellation in error paths</li>
                <li>
                  Consider using AsyncUtils.withTimeout for automatic
                  cancellation after a timeout
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              Proper cancellation handling ensures that resources are released
              promptly and prevents memory leaks in long-running or potentially
              problematic operations.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              MiLost enables powerful async patterns inspired by functional
              programming and concurrent systems like CSP and Actors, with a
              focus on safety and predictability.
            </InfoBox>

            <FormGroup>
              <Label>Async Pattern Types</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Pattern</th>
                    <th>Description</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Producer-Consumer</td>
                    <td>Separating data producers from consumers</td>
                    <td>Work queues, pipelines</td>
                  </tr>
                  <tr>
                    <td>Fan-Out/Fan-In</td>
                    <td>Distribute work and collect results</td>
                    <td>Parallel processing</td>
                  </tr>
                  <tr>
                    <td>Timeouts</td>
                    <td>Limit the time operations can take</td>
                    <td>API calls, user-facing operations</td>
                  </tr>
                  <tr>
                    <td>Retries</td>
                    <td>Automatic retry with backoff</td>
                    <td>Network operations, transient errors</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Task, AsyncUtils, createChannel, u32 } from "milost";

// Producer-Consumer Pattern
async function setupWorkerPool(numWorkers, jobs) {
  const [sender, receiver] = await createChannel();
  
  // Producer: send jobs to the channel
  const producer = Task.new(async (signal) => {
    for (const job of jobs) {
      if (signal.aborted) break;
      await sender.send(job);
    }
    sender.close();
    return Ok("All jobs enqueued");
  });
  
  // Multiple consumers (workers)
  const workers = [];
  for (let i = 0; i < numWorkers; i++) {
    const worker = Task.new(async (signal) => {
      while (!receiver.closed) {
        if (signal.aborted) break;
        
        const job = await receiver.receive();
        if (job.isSome()) {
          await processJob(job.unwrap());
        }
      }
      return Ok(\`Worker \${i} completed\`);
    });
    
    workers.push(worker);
  }
  
  // Fan-In: collect all worker results
  return Task.all([producer, ...workers]);
}

// Timeout Pattern
async function fetchWithTimeout(url, timeoutMs) {
  return AsyncUtils.withTimeout(
    fetch(url).then(r => r.json()).then(Ok),
    u32(timeoutMs),
    new ApiError("Request timed out")
  );
}

// Retry Pattern with Exponential Backoff
async function reliableFetch(url) {
  return AsyncUtils.retry(
    async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return Err(new ApiError(\`HTTP error \${response.status}\`));
        }
        return Ok(await response.json());
      } catch (err) {
        return Err(new ApiError(String(err)));
      }
    },
    {
      maxRetries: u32(5),
      baseDelay: u32(100),
      maxDelay: u32(5000),
      shouldRetry: (error, attempt) => 
        error.message.includes("HTTP error 5") || // Retry server errors
        error.message.includes("network")        // Retry network errors
    }
  );
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These patterns provide robust solutions for common async
              challenges while maintaining the safety and explicit error
              handling that MiLost emphasizes.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Real-world examples demonstrating MiLost's async capabilities in
              action.
            </InfoBox>

            <FormGroup>
              <Label>Example Applications</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Example</th>
                    <th>Technologies Used</th>
                    <th>Key Concepts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Processing Pipeline</td>
                    <td>Channels, Tasks</td>
                    <td>Sequential processing stages</td>
                  </tr>
                  <tr>
                    <td>API Request Manager</td>
                    <td>Tasks, Timeouts, Retries</td>
                    <td>Resilient network operations</td>
                  </tr>
                  <tr>
                    <td>Websocket Handler</td>
                    <td>Channels, Tasks, Cancellation</td>
                    <td>Long-lived connections with cleanup</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { 
  Task, 
  createChannel, 
  AsyncUtils, 
  Vec, 
  Option,
  Result
} from "milost";

// Example 1: Data Processing Pipeline
async function processingPipeline(rawData) {
  // Create processing stages
  const [stage1Sender, stage1Receiver] = await createChannel();
  const [stage2Sender, stage2Receiver] = await createChannel();
  const [resultSender, resultReceiver] = await createChannel();
  
  // Stage 1: Parse raw data
  const parserTask = Task.new(async (signal) => {
    for (const item of rawData) {
      if (signal.aborted) break;
      
      try {
        const parsed = JSON.parse(item);
        await stage1Sender.send(parsed);
      } catch (err) {
        console.error("Parse error:", err);
      }
    }
    
    stage1Sender.close();
    return Ok("Parsing complete");
  });
  
  // Stage 2: Transform data
  const transformTask = Task.new(async (signal) => {
    while (!stage1Receiver.closed) {
      if (signal.aborted) break;
      
      const item = await stage1Receiver.receive();
      if (item.isSome()) {
        const transformed = transformData(item.unwrap());
        await stage2Sender.send(transformed);
      }
    }
    
    stage2Sender.close();
    return Ok("Transformation complete");
  });
  
  // Stage 3: Validate and store
  const validatorTask = Task.new(async (signal) => {
    const results = Vec.empty();
    
    while (!stage2Receiver.closed) {
      if (signal.aborted) break;
      
      const item = await stage2Receiver.receive();
      if (item.isSome()) {
        const value = item.unwrap();
        if (validateData(value)) {
          await resultSender.send(value);
        }
      }
    }
    
    resultSender.close();
    return Ok("Validation complete");
  });
  
  // Start all tasks
  Task.all([parserTask, transformTask, validatorTask]).run();
  
  // Collect results
  const results = Vec.empty();
  while (!resultReceiver.closed) {
    const item = await resultReceiver.receive();
    if (item.isSome()) {
      results = results.push(item.unwrap());
    } else {
      break;
    }
  }
  
  return results;
}

// Example 2: API Request Manager with Rate Limiting
class ApiManager {
  constructor(baseUrl, requestsPerSecond) {
    this.baseUrl = baseUrl;
    this.requestInterval = 1000 / requestsPerSecond;
    this.lastRequestTime = 0;
  }
  
  async request(endpoint, options = {}) {
    // Rate limiting
    const now = Date.now();
    const timeToWait = this.lastRequestTime + this.requestInterval - now;
    
    if (timeToWait > 0) {
      await new Promise(r => setTimeout(r, timeToWait));
    }
    
    this.lastRequestTime = Date.now();
    
    // Make the request with retries and timeout
    return AsyncUtils.retry(
      () => {
        const url = \`\${this.baseUrl}/\${endpoint}\`;
        return AsyncUtils.withTimeout(
          Task.new(async (signal) => {
            const response = await fetch(url, { 
              ...options, 
              signal 
            });
            
            if (!response.ok) {
              return Err(new ApiError(\`HTTP \${response.status}\`));
            }
            
            const data = await response.json();
            return Ok(data);
          }).run(),
          u32(5000),
          new ApiError("Request timed out")
        );
      },
      {
        maxRetries: u32(3),
        baseDelay: u32(500),
        shouldRetry: (error) => 
          error.message.includes("timeout") ||
          error.message.includes("HTTP 5")
      }
    );
  }
}

// Example 3: WebSocket Connection with Heartbeat
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.messageChannel = null;
    this.heartbeatTask = null;
    this.connectionTask = null;
  }
  
  async connect() {
    // Create message channel
    const [sender, receiver] = await createChannel();
    this.messageChannel = { sender, receiver };
    
    // Set up connection
    this.connectionTask = Task.new(async (signal) => {
      const ws = new WebSocket(this.url);
      
      // Set up event handlers
      ws.onopen = () => {
        console.log("WebSocket connected");
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        sender.send(data).catch(err => console.error("Send error:", err));
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      ws.onclose = () => {
        console.log("WebSocket closed");
        sender.close();
      };
      
      // Handle cancellation
      signal.addEventListener("abort", () => {
        console.log("Closing WebSocket connection");
        ws.close();
      });
      
      // Keep connection alive until cancelled
      while (!signal.aborted && ws.readyState === WebSocket.OPEN) {
        await new Promise(r => setTimeout(r, 1000));
      }
      
      return Ok("WebSocket connection ended");
    });
    
    // Set up heartbeat
    this.heartbeatTask = Task.new(async (signal) => {
      while (!signal.aborted) {
        await this.send({ type: "heartbeat", timestamp: Date.now() });
        await new Promise(r => setTimeout(r, 30000));
      }
      
      return Ok("Heartbeat stopped");
    });
    
    // Start tasks
    this.connectionTask.run();
    this.heartbeatTask.run();
    
    return this;
  }
  
  async send(message) {
    // Implement sending logic
  }
  
  async receive() {
    if (!this.messageChannel || this.messageChannel.receiver.closed) {
      return Option.None();
    }
    
    return await this.messageChannel.receiver.receive();
  }
  
  disconnect() {
    if (this.connectionTask) {
      this.connectionTask.cancel();
    }
    
    if (this.heartbeatTask) {
      this.heartbeatTask.cancel();
    }
    
    if (this.messageChannel) {
      this.messageChannel.sender.close();
    }
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples demonstrate how MiLost's async primitives enable
              robust and maintainable solutions to complex asynchronous
              programming challenges.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default AsyncPage;
