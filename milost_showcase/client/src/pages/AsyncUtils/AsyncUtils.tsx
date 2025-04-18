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
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
  Table,
} from "./AsyncUtils.styles";

// Component for Overview tab content
const OverviewContent = () => (
  <>
    <InfoBox>
      MiLost provides a rich set of async utilities for making asynchronous
      programming safer, more predictable, and easier to reason about, all with
      explicit error handling through Result types.
    </InfoBox>

    <FormGroup>
      <Label>Async Utilities Overview</Label>
      <p>
        MiLost's AsyncUtils namespace provides a comprehensive set of utilities
        for working with asynchronous operations. These utilities help you
        handle common async patterns with explicit error handling and type
        safety.
      </p>
    </FormGroup>

    <FormGroup>
      <Label>Core AsyncUtils Features</Label>
      <Table>
        <thead>
          <tr>
            <th>Feature Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Promise Management</td>
            <td>Utilities for handling multiple promises with Result types</td>
          </tr>
          <tr>
            <td>Error Handling</td>
            <td>Robust error management with retries and fallbacks</td>
          </tr>
          <tr>
            <td>Timing Control</td>
            <td>Timeouts, debouncing, and rate limiting</td>
          </tr>
          <tr>
            <td>Sequential Processing</td>
            <td>Controlled execution of async operations in sequence</td>
          </tr>
          <tr>
            <td>Cancellation Support</td>
            <td>First-class support for cancellable operations</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { async, Result, AppError } from "milost";

// Enhanced Promise.all with Result error handling
const results = await async.all([
  fetchUserProfile(),
  fetchUserSettings(),
  fetchUserPreferences()
]);

// Check if all operations succeeded
if (results.isOk()) {
  const [profile, settings, preferences] = results.unwrap();
  initializeUserInterface(profile, settings, preferences);
} else {
  // Handle the first error that occurred
  handleError(results.getError());
}

// Retry an operation with exponential backoff
const result = await async.retry(
  fetchData,   // The operation to retry
  {
    maxRetries: 3,
    baseDelay: 100,
    maxDelay: 5000
  }
);

// Process items in sequence, not in parallel
const processedItems = await async.mapSeries(
  items,
  async (item) => {
    // Process each item one at a time
    const result = await processItem(item);
    return Result.Ok(result);
  }
);`}</Pre>
    </CodeBlock>

    <SmallText>
      MiLost's async utilities provide robust solutions for common async
      challenges, emphasizing type safety, explicit error handling, and
      predictable behavior.
    </SmallText>
  </>
);

// Component for Promise Utilities tab content
const PromiseUtilitiesContent = () => (
  <>
    <InfoBox>
      MiLost provides enhanced Promise utilities that wrap standard JavaScript
      Promise operations with Result types for more explicit error handling.
    </InfoBox>

    <FormGroup>
      <Label>Promise Handling Utilities</Label>
      <Table>
        <thead>
          <tr>
            <th>Utility</th>
            <th>Description</th>
            <th>JavaScript Equivalent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>async.all</code>
            </td>
            <td>
              Handles multiple promises, returns Result with all values or the
              first error
            </td>
            <td>
              <code>Promise.all</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>async.allSettled</code>
            </td>
            <td>
              Waits for all promises to complete, returns Result with values or
              the first error
            </td>
            <td>
              <code>Promise.allSettled</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>async.cancellable</code>
            </td>
            <td>Creates a cancellable promise that returns a Result</td>
            <td>N/A (custom implementation)</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { async, Result, Vec, AppError } from "milost";

// --- async.all Example ---
// Wraps Promise.all with Result error handling
async function fetchMultipleResources() {
  const resourcePromises = Vec.from([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);

  const result = await async.all(resourcePromises);
  
  if (result.isOk()) {
    // All promises resolved successfully
    const users = result.unwrap();
    console.log("All users:", users);
    return users;
  } else {
    // At least one promise rejected
    const error = result.getError();
    console.error("Failed to fetch all users:", error);
    throw error;
  }
}

// --- async.allSettled Example ---
// Similar to Promise.allSettled but with Result types
async function attemptMultipleOperations() {
  const operationPromises = Vec.from([
    sendEmail(user1),
    sendEmail(user2),
    sendEmail(user3)
  ]);

  const result = await async.allSettled(operationPromises);
  
  if (result.isOk()) {
    // All operations completed successfully
    const successfulOperations = result.unwrap();
    return successfulOperations;
  } else {
    // At least one operation failed
    logError(result.getError());
    return Vec.empty();
  }
}

// --- async.cancellable Example ---
// Create a cancellable operation
function fetchWithCancellation(url) {
  const { promise, cancel } = async.cancellable(async (signal) => {
    try {
      const response = await fetch(url, { signal });
      
      if (!response.ok) {
        return Result.Err(new AppError(\`HTTP error \${response.status}\`));
      }
      
      const data = await response.json();
      return Result.Ok(data);
    } catch (error) {
      return Result.Err(new AppError(String(error)));
    }
  });

  // Set a timeout to auto-cancel after 5 seconds
  const timeout = setTimeout(() => {
    cancel();
    console.log("Request cancelled after timeout");
  }, 5000);

  // Return both the promise and a way to clear the timeout
  return {
    promise: promise.then(result => {
      clearTimeout(timeout);
      return result;
    }),
    cancel: () => {
      clearTimeout(timeout);
      cancel();
    }
  };
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Key Benefits</Label>
      <ul>
        <li>
          <strong>Explicit Error Handling</strong>: Uses Result types to force
          handling of errors
        </li>
        <li>
          <strong>Type Safety</strong>: Full TypeScript support for improved
          error detection
        </li>
        <li>
          <strong>Cancellation Support</strong>: First-class support for
          cancelling operations
        </li>
        <li>
          <strong>Consistent API</strong>: Unified approach to async operations
        </li>
      </ul>
    </FormGroup>

    <SmallText>
      These Promise utilities enhance JavaScript's native Promise API with
      stronger typing, explicit error handling, and additional features like
      cancellation support.
    </SmallText>
  </>
);

// Component for Error Handling tab content
const ErrorHandlingContent = () => (
  <>
    <InfoBox>
      MiLost provides robust error handling utilities for asynchronous
      operations, including automatic retries with backoff and explicit error
      management.
    </InfoBox>

    <FormGroup>
      <Label>Error Handling Features</Label>
      <Table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>async.retry</code>
            </td>
            <td>
              Automatically retry failed operations with configurable backoff
            </td>
          </tr>
          <tr>
            <td>Result-based returns</td>
            <td>
              All async utilities return Result types for explicit error
              handling
            </td>
          </tr>
          <tr>
            <td>Custom error predicates</td>
            <td>Fine-grained control over which errors trigger retries</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { async, Result, AppError, u32 } from "milost";

// Basic retry with default settings
async function fetchWithRetry(url) {
  return async.retry(
    async () => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          return Result.Err(new AppError(\`HTTP error \${response.status}\`));
        }
        
        const data = await response.json();
        return Result.Ok(data);
      } catch (error) {
        return Result.Err(new AppError(String(error)));
      }
    }
  );
}

// Advanced retry with custom configuration
async function robustDatabaseOperation(query) {
  return async.retry(
    // The operation to retry
    async () => {
      try {
        const result = await database.execute(query);
        return Result.Ok(result);
      } catch (error) {
        return Result.Err(new AppError(error.message));
      }
    },
    // Retry configuration
    {
      maxRetries: u32(5),           // Try up to 5 times
      baseDelay: u32(100),          // Start with 100ms delay
      maxDelay: u32(10000),         // Cap delay at 10 seconds
      shouldRetry: (error, attempt) => {
        // Only retry on specific error types
        const isTransientError = 
          error.message.includes("connection") ||
          error.message.includes("timeout") ||
          error.message.includes("deadlock");
          
        // Don't retry on certain attempt numbers (e.g., for testing)
        const skipAttempt = attempt === u32(3);
        
        return isTransientError && !skipAttempt;
      }
    }
  );
}

// Combining retry with fallback logic
async function fetchDataWithFallback(primaryUrl, fallbackUrl) {
  // First try the primary URL with retries
  const primaryResult = await async.retry(
    () => fetchData(primaryUrl),
    { maxRetries: u32(2), baseDelay: u32(300) }
  );
  
  // If primary succeeds, return the data
  if (primaryResult.isOk()) {
    return primaryResult;
  }
  
  console.warn(
    \`Failed to fetch from primary source: \${primaryResult.getError().message}. 
     Trying fallback...\`
  );
  
  // If primary fails, try the fallback URL with different retry settings
  return async.retry(
    () => fetchData(fallbackUrl),
    { 
      maxRetries: u32(3), 
      baseDelay: u32(200),
      shouldRetry: (error) => !error.message.includes("404")
    }
  );
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Exponential Backoff Algorithm</Label>
      <p>
        The retry utility uses exponential backoff with jitter to avoid
        overwhelming the system being called and to prevent synchronized retry
        storms from multiple clients:
      </p>
      <ul>
        <li>
          <strong>Base formula</strong>: delay = baseDelay * 2^attempt
        </li>
        <li>
          <strong>Jitter</strong>: Random variation of 85-115% to avoid
          synchronized retries
        </li>
        <li>
          <strong>Maximum cap</strong>: Delays never exceed the configured
          maxDelay
        </li>
      </ul>
    </FormGroup>

    <SmallText>
      Robust error handling is essential for resilient applications. MiLost's
      retry system provides configurable, intelligent retries with exponential
      backoff to handle transient failures gracefully.
    </SmallText>
  </>
);

// Component for Timing Control tab content
const TimingControlContent = () => (
  <>
    <InfoBox>
      MiLost provides utilities for controlling the timing of asynchronous
      operations, including timeouts, debouncing, and rate limiting.
    </InfoBox>

    <FormGroup>
      <Label>Timing Control Utilities</Label>
      <Table>
        <thead>
          <tr>
            <th>Utility</th>
            <th>Description</th>
            <th>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>async.withTimeout</code>
            </td>
            <td>Add timeout to async operations</td>
            <td>Prevent operations from hanging indefinitely</td>
          </tr>
          <tr>
            <td>
              <code>async.debounce</code>
            </td>
            <td>Delay execution until input stops changing</td>
            <td>Search inputs, window resize handlers</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { async, Result, AppError, u32 } from "milost";

// --- async.withTimeout Example ---
// Add timeout to any async operation
async function fetchWithTimeout(url, timeoutMs = 5000) {
  // Create a custom timeout error
  const timeoutError = new AppError("Request timed out");
  
  // Wrap the fetch operation with timeout
  return async.withTimeout(
    // The async operation that returns a Result
    (async () => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          return Result.Err(new AppError(\`HTTP error \${response.status}\`));
        }
        
        const data = await response.json();
        return Result.Ok(data);
      } catch (error) {
        return Result.Err(new AppError(String(error)));
      }
    })(),
    // Timeout in milliseconds
    u32(timeoutMs),
    // Error to return if timeout occurs
    timeoutError
  );
}

// Usage example
async function fetchUserData(userId) {
  const result = await fetchWithTimeout(\`/api/users/\${userId}\`, 3000);
  
  if (result.isOk()) {
    return result.unwrap();
  } else {
    if (result.getError().message === "Request timed out") {
      console.error("User data request timed out");
    } else {
      console.error("Failed to fetch user data:", result.getError().message);
    }
    return null;
  }
}

// --- async.debounce Example ---
// Create a debounced search function
const debouncedSearch = async.debounce(
  // The function to debounce
  async (query) => {
    try {
      const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
      
      if (!response.ok) {
        return Result.Err(new AppError(\`Search failed: \${response.status}\`));
      }
      
      const results = await response.json();
      return Result.Ok(results);
    } catch (error) {
      return Result.Err(new AppError(\`Search error: \${error.message}\`));
    }
  },
  // Wait time in milliseconds
  u32(300)
);

// Event handler for a search input
function handleSearchInput(event) {
  const query = event.target.value;
  
  // Show loading indicator
  setLoading(true);
  
  // Call the debounced function
  debouncedSearch(query)
    .then(result => {
      if (result.isOk()) {
        setSearchResults(result.unwrap());
      } else {
        setSearchError(result.getError().message);
        setSearchResults([]);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

// Combining timeout and retry
async function robustDataFetch(url) {
  return async.retry(
    async () => {
      return async.withTimeout(
        fetchData(url),
        u32(2000),
        new AppError("Request timed out")
      );
    },
    {
      maxRetries: u32(3),
      shouldRetry: (error) => error.message.includes("timed out")
    }
  );
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Debounce Implementation Details</Label>
      <p>
        The debounce utility delays execution of a function until after a
        specified wait time has elapsed since the last invocation:
      </p>
      <ul>
        <li>
          <strong>Reset timer</strong>: Each invocation resets the timer
        </li>
        <li>
          <strong>Latest args</strong>: Only the most recent arguments are used
        </li>
        <li>
          <strong>Promise-based</strong>: Returns a promise that resolves with
          the result
        </li>
        <li>
          <strong>Result wrapped</strong>: Results are always wrapped in a
          Result type
        </li>
      </ul>
    </FormGroup>

    <SmallText>
      Timing control utilities help manage the execution flow of asynchronous
      operations, preventing operations from hanging indefinitely and optimizing
      performance by reducing unnecessary function calls.
    </SmallText>
  </>
);

// Component for Sequential Execution tab content
const SequentialExecutionContent = () => (
  <>
    <InfoBox>
      MiLost provides utilities for sequential processing of async operations,
      giving you control over execution order while maintaining type safety.
    </InfoBox>

    <FormGroup>
      <Label>Sequential Processing Features</Label>
      <Table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>async.mapSeries</code>
            </td>
            <td>Process items one by one in sequence</td>
            <td>API rate limiting, ordered processing</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { async, Result, Vec, AppError, u32 } from "milost";

// Process a collection of items in sequence
async function processUserFilesSequentially(userId, fileIds) {
  // Create a vector of file IDs
  const fileIdsVec = Vec.from(fileIds);
  
  // Process each file in sequence, not in parallel
  const result = await async.mapSeries(
    fileIdsVec,
    // Process function that runs for each item
    async (fileId, index) => {
      try {
        console.log(\`Processing file \${index + 1}/\${fileIds.length}: \${fileId}\`);
        
        // Fetch the file metadata
        const metadata = await fetchFileMetadata(userId, fileId);
        
        // Process the file content
        const processedContent = await processFileContent(userId, fileId);
        
        // Update the file status
        await updateFileStatus(userId, fileId, "processed");
        
        return Result.Ok({
          fileId,
          metadata,
          processedContent,
          status: "success"
        });
      } catch (error) {
        return Result.Err(
          new AppError(\`Failed to process file \${fileId}: \${error.message}\`)
        );
      }
    }
  );
  
  // Handle the overall result
  if (result.isOk()) {
    const processedFiles = result.unwrap();
    console.log(\`Successfully processed all \${processedFiles.len()} files\`);
    return processedFiles;
  } else {
    console.error(\`Sequential processing failed: \${result.getError().message}\`);
    throw result.getError();
  }
}

// Implementation with rate limiting
async function rateLimitedApiCalls(requests) {
  const requestsVec = Vec.from(requests);
  
  // Track the last request time for rate limiting
  let lastRequestTime = 0;
  const minRequestInterval = 500; // ms between requests
  
  const results = await async.mapSeries(
    requestsVec,
    async (request) => {
      try {
        // Apply rate limiting
        const now = Date.now();
        const elapsed = now - lastRequestTime;
        
        if (elapsed < minRequestInterval) {
          const delay = minRequestInterval - elapsed;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Record the time of this request
        lastRequestTime = Date.now();
        
        // Execute the API call
        const response = await fetch(request.url, request.options);
        
        if (!response.ok) {
          return Result.Err(
            new AppError(\`API call failed: \${response.status}\`)
          );
        }
        
        const data = await response.json();
        return Result.Ok(data);
      } catch (error) {
        return Result.Err(new AppError(\`Request error: \${error.message}\`));
      }
    }
  );
  
  return results;
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Sequential vs Parallel Execution</Label>
      <p>
        While JavaScript naturally supports parallel execution of async
        operations (e.g., with <code>Promise.all</code>), sequential execution
        is sometimes necessary:
      </p>
      <ul>
        <li>
          <strong>Rate limiting</strong>: Prevent overwhelming APIs with too
          many requests
        </li>
        <li>
          <strong>Order dependency</strong>: When later operations depend on
          earlier ones
        </li>
        <li>
          <strong>Resource contention</strong>: Avoid concurrent access to
          shared resources
        </li>
        <li>
          <strong>Error handling</strong>: Stop processing immediately on first
          error
        </li>
      </ul>
    </FormGroup>

    <SmallText>
      Sequential processing gives you precise control over the execution order
      of asynchronous operations, which is crucial for rate-limited APIs,
      dependency chains, and resource management.
    </SmallText>
  </>
);

// Component for Examples tab content
const ExamplesContent = () => (
  <>
    <InfoBox>
      Real-world examples demonstrating how to use MiLost's async utilities to
      solve common asynchronous programming challenges.
    </InfoBox>

    <FormGroup>
      <Label>Example Applications</Label>
      <Table>
        <thead>
          <tr>
            <th>Example</th>
            <th>Features Used</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API Client</td>
            <td>retry, withTimeout, cancellable</td>
            <td>Resilient HTTP client with retry logic</td>
          </tr>
          <tr>
            <td>Data Import Pipeline</td>
            <td>mapSeries, all</td>
            <td>Process data in stages with controlled flow</td>
          </tr>
          <tr>
            <td>Resource Manager</td>
            <td>withTimeout, cancellable</td>
            <td>Safely manage async resources with timeouts</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { 
  async, 
  Result, 
  Vec, 
  AppError, 
  u32 
} from "milost";

// Example 1: Resilient API Client
class ResilientApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      timeout: options.timeout || 5000,
      maxRetries: options.maxRetries || 3,
      baseDelay: options.baseDelay || 300,
      headers: options.headers || {}
    };
  }
  
  async get(path, queryParams = {}) {
    const url = this._buildUrl(path, queryParams);
    return this._request('GET', url);
  }
  
  async post(path, data) {
    const url = this._buildUrl(path);
    return this._request('POST', url, data);
  }
  
  async put(path, data) {
    const url = this._buildUrl(path);
    return this._request('PUT', url, data);
  }
  
  async delete(path) {
    const url = this._buildUrl(path);
    return this._request('DELETE', url);
  }
  
  _buildUrl(path, queryParams = {}) {
    const url = new URL(\`\${this.baseUrl}/\${path}\`);
    
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }
    
    return url.toString();
  }
  
  async _request(method, url, data = null) {
    const timeoutError = new AppError(\`Request to \${url} timed out after \${this.options.timeout}ms\`);
    
    return async.retry(
      async () => {
        // Create a cancellable request
        const { promise, cancel } = async.cancellable(async (signal) => {
          try {
            const requestOptions = {
              method,
              headers: {
                'Content-Type': 'application/json',
                ...this.options.headers
              },
              signal
            };
            
            if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
              requestOptions.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
              return Result.Err(new AppError(
                \`HTTP error \${response.status}: \${await response.text()}\`
              ));
            }
            
            const responseData = await response.json();
            return Result.Ok(responseData);
          } catch (error) {
            return Result.Err(new AppError(\`Request failed: \${error.message}\`));
          }
        });
        
        // Add timeout to the request
        return async.withTimeout(
          promise,
          u32(this.options.timeout),
          timeoutError
        );
      },
      {
        maxRetries: u32(this.options.maxRetries),
        baseDelay: u32(this.options.baseDelay),
        shouldRetry: (error) => {
          // Only retry network errors, timeouts, and server errors
          return error.message.includes('timeout') ||
                 error.message.includes('network') ||
                 error.message.includes('HTTP error 5'); // 5xx errors
        }
      }
    );
  }
}`}</Pre>
    </CodeBlock>

    <CodeBlock>
      <Pre>{`// Example 2: Data Import Pipeline
async function importDataPipeline(dataFiles) {
  const dataFilesVec = Vec.from(dataFiles);
  
  // Step 1: Load and validate all files (parallel operation)
  console.log("Step 1: Loading and validating files...");
  const validationResults = await async.all(
    dataFilesVec.map(file => validateFile(file))
  );
  
  if (validationResults.isErr()) {
    return Result.Err(
      new AppError(\`Validation failed: \${validationResults.getError().message}\`)
    );
  }
  
  const validatedFiles = validationResults.unwrap();
  console.log(\`Successfully validated \${validatedFiles.len()} files\`);
  
  // Step 2: Transform each file sequentially
  console.log("Step 2: Transforming data...");
  const transformationResults = await async.mapSeries(
    validatedFiles,
    async (fileData, index) => {
      try {
        console.log(\`Transforming file \${index + 1}/\${validatedFiles.len()}\`);
        const transformed = await transformData(fileData);
        return Result.Ok(transformed);
      } catch (error) {
        return Result.Err(
          new AppError(\`Transformation failed for file \${index + 1}: \${error.message}\`)
        );
      }
    }
  );
  
  if (transformationResults.isErr()) {
    return Result.Err(
      new AppError(\`Transformation failed: \${transformationResults.getError().message}\`)
    );
  }
  
  const transformedData = transformationResults.unwrap();
  
  // Step 3: Import to database (synchronously to prevent conflicts)
  console.log("Step 3: Importing to database...");
  const importResults = await async.mapSeries(
    transformedData,
    async (data, index) => {
      try {
        console.log(\`Importing dataset \${index + 1}/\${transformedData.len()}\`);
        // Add rate limiting delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 500));
        const importResult = await importToDatabase(data);
        return Result.Ok(importResult);
      } catch (error) {
        return Result.Err(
          new AppError(\`Import failed for dataset \${index + 1}: \${error.message}\`)
        );
      }
    }
  );
  
  if (importResults.isErr()) {
    return Result.Err(
      new AppError(\`Import failed: \${importResults.getError().message}\`)
    );
  }
  
  const importedRecords = importResults.unwrap();
  
  // Final step: Generate report
  console.log("Step 4: Generating import report...");
  return Result.Ok({
    filesProcessed: dataFiles.length,
    recordsImported: importedRecords.len(),
    timestamp: new Date().toISOString()
  });
}`}</Pre>
    </CodeBlock>

    <CodeBlock>
      <Pre>{`// Example 3: Resource Manager with Async Timeouts
class AsyncResourceManager {
  constructor(options = {}) {
    this.options = {
      acquireTimeout: options.acquireTimeout || 5000,
      releaseTimeout: options.releaseTimeout || 2000,
      maxRetries: options.maxRetries || 2
    };
    this.resources = new Map();
  }
  
  async acquire(resourceId, factory) {
    console.log(\`Acquiring resource: \${resourceId}\`);
    
    // Check if resource already exists
    if (this.resources.has(resourceId)) {
      return Result.Ok(this.resources.get(resourceId));
    }
    
    // Try to create the resource with retry logic and timeout
    const result = await async.retry(
      async () => {
        return async.withTimeout(
          (async () => {
            try {
              const resource = await factory();
              return Result.Ok(resource);
            } catch (error) {
              return Result.Err(
                new AppError(\`Failed to create resource: \${error.message}\`)
              );
            }
          })(),
          u32(this.options.acquireTimeout),
          new AppError(\`Resource acquisition timed out after \${this.options.acquireTimeout}ms\`)
        );
      },
      {
        maxRetries: u32(this.options.maxRetries),
        baseDelay: u32(300)
      }
    );
    
    if (result.isOk()) {
      const resource = result.unwrap();
      this.resources.set(resourceId, resource);
      return Result.Ok(resource);
    }
    
    return result;
  }
  
  async release(resourceId) {
    if (!this.resources.has(resourceId)) {
      return Result.Err(
        new AppError(\`Resource not found: \${resourceId}\`)
      );
    }
    
    const resource = this.resources.get(resourceId);
    
    // Set up cancellable release
    const { promise, cancel } = async.cancellable(async (signal) => {
      try {
        if (typeof resource.close === 'function') {
          await resource.close();
        } else if (typeof resource.release === 'function') {
          await resource.release();
        } else if (typeof resource.dispose === 'function') {
          await resource.dispose();
        }
        
        this.resources.delete(resourceId);
        return Result.Ok(true);
      } catch (error) {
        return Result.Err(
          new AppError(\`Failed to release resource: \${error.message}\`)
        );
      }
    });
    
    // Add timeout to the release operation
    const result = await async.withTimeout(
      promise,
      u32(this.options.releaseTimeout),
      new AppError(\`Resource release timed out after \${this.options.releaseTimeout}ms\`)
    );
    
    // Force removal even if release fails or times out
    if (result.isErr()) {
      console.warn(\`Forced removal of resource \${resourceId} after error: \${result.getError().message}\`);
      this.resources.delete(resourceId);
    }
    
    return result;
  }
  
  async releaseAll() {
    const resourceIds = Array.from(this.resources.keys());
    const results = await async.all(
      Vec.from(resourceIds.map(id => this.release(id)))
    );
    
    if (results.isErr()) {
      return Result.Err(
        new AppError(\`Failed to release all resources: \${results.getError().message}\`)
      );
    }
    
    return Result.Ok(true);
  }
}`}</Pre>
    </CodeBlock>

    <SmallText>
      These examples demonstrate how MiLost's async utilities can be combined to
      create robust, resilient systems that gracefully handle errors, timeouts,
      and resource management in real-world scenarios.
    </SmallText>
  </>
);

// Main component with tab selection
function AsyncUtilsPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "promise", label: "Promise Utilities" },
    { id: "error", label: "Error Handling" },
    { id: "timing", label: "Timing Control" },
    { id: "sequence", label: "Sequential Execution" },
    { id: "examples", label: "Examples" },
  ];

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeCategory) {
      case "overview":
        return <OverviewContent />;
      case "promise":
        return <PromiseUtilitiesContent />;
      case "error":
        return <ErrorHandlingContent />;
      case "timing":
        return <TimingControlContent />;
      case "sequence":
        return <SequentialExecutionContent />;
      case "examples":
        return <ExamplesContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Async Utilities</Title>
        <Subtitle>
          Powerful Tools for Working with Asynchronous Operations
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

        {renderContent()}
      </Card>
    </Container>
  );
}

export default AsyncUtilsPage;
