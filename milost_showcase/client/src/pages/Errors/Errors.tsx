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
} from "./Errors.styles";

// Content components for each tab
const OverviewContent = () => (
  <>
    <InfoBox>
      MiLost provides a comprehensive error handling system that makes errors
      first-class citizens in your codebase, with type safety, detailed error
      information, and clear error hierarchies.
    </InfoBox>

    <FormGroup>
      <Label>Error Handling Principles</Label>
      <p>
        MiLost's error system is designed to ensure that errors are explicit,
        informative, and handled consistently throughout your application.
      </p>
    </FormGroup>

    <FormGroup>
      <Label>Core Error Types</Label>
      <Table>
        <thead>
          <tr>
            <th>Error Type</th>
            <th>Description</th>
            <th>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>AppError</code>
            </td>
            <td>Base error type for all application errors</td>
            <td>General-purpose error handling</td>
          </tr>
          <tr>
            <td>
              <code>ValidationError</code>
            </td>
            <td>Input validation and constraint errors</td>
            <td>Form validation, data formatting</td>
          </tr>
          <tr>
            <td>
              <code>TypeError</code>
            </td>
            <td>Type-related errors</td>
            <td>Type conversion, invalid types</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { AppError, ValidationError, Result, Str } from "milost";

function processUserData(data) {
  // Validate input
  if (!data) {
    return Result.Err(new AppError(Str.fromRaw("Missing user data")));
  }

  // Validate required fields
  if (!data.email) {
    return Result.Err(new ValidationError(Str.fromRaw("Email is required")));
  }

  // Validate email format
  if (!data.email.includes('@')) {
    return Result.Err(new ValidationError(Str.fromRaw("Invalid email format")));
  }

  // Process the valid data
  return Result.Ok({
    normalizedEmail: data.email.toLowerCase(),
    // other processed data
  });
}

// Usage with explicit error handling
const result = processUserData(userData);
if (result.isOk()) {
  saveUserData(result.unwrap());
} else {
  const error = result.getError();
  
  if (error instanceof ValidationError) {
    showValidationError(error.message);
  } else {
    showGeneralError(error.message);
  }
}`}</Pre>
    </CodeBlock>

    <SmallText>
      MiLost's error system encourages explicit error handling and provides rich
      error information, helping you create more robust and maintainable
      applications.
    </SmallText>
  </>
);

const ErrorTypesContent = () => (
  <>
    <InfoBox>
      MiLost provides a hierarchy of error types that help categorize and handle
      different types of errors throughout your application.
    </InfoBox>

    <FormGroup>
      <Label>Error Type Hierarchy</Label>
      <Table>
        <thead>
          <tr>
            <th>Error Class</th>
            <th>Extends</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>AppError</code>
            </td>
            <td>JavaScript Error</td>
            <td>Base class for all application errors</td>
          </tr>
          <tr>
            <td>
              <code>ValidationError</code>
            </td>
            <td>AppError</td>
            <td>For data validation failures</td>
          </tr>
          <tr>
            <td>
              <code>TypeError</code>
            </td>
            <td>AppError</td>
            <td>For type-related errors</td>
          </tr>
          <tr>
            <td>
              <code>NotFoundError</code>
            </td>
            <td>AppError</td>
            <td>When a requested resource doesn't exist</td>
          </tr>
          <tr>
            <td>
              <code>PermissionError</code>
            </td>
            <td>AppError</td>
            <td>Authorization and permission issues</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import {
  AppError,
  ValidationError,
  TypeError,
  NotFoundError,
  PermissionError,
  Str
} from "milost";

// Base application error
const generalError = new AppError(Str.fromRaw("Something went wrong"));

// Validation error for input issues
const validationError = new ValidationError(
  Str.fromRaw("Username must be at least 3 characters")
);

// Type error for type mismatches
const typeError = new TypeError(Str.fromRaw("Expected number, got string"));

// Not found error for missing resources
const notFoundError = new NotFoundError(Str.fromRaw("User ID not found"));

// Permission error for access control
const permissionError = new PermissionError(
  Str.fromRaw("Not authorized to access this resource")
);

// Checking error types
function handleError(error) {
  if (error instanceof ValidationError) {
    showValidationMessage(error.message);
  } else if (error instanceof NotFoundError) {
    showNotFoundPage(error.message);
  } else if (error instanceof PermissionError) {
    redirectToLogin(error.message);
  } else if (error instanceof TypeError) {
    logTypeError(error.message);
  } else {
    // Generic AppError or other errors
    showGenericErrorMessage(error.message);
  }
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Creating Custom Error Types</Label>
      <p>
        You can easily extend MiLost's error hierarchy to create domain-specific
        error types:
      </p>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { AppError, Str } from "milost";

// Create domain-specific error classes
class DatabaseError extends AppError {
  constructor(message, details = {}) {
    super(message);
    this.name = "DatabaseError";
    this.details = details;
  }
}

class NetworkError extends AppError {
  constructor(message, statusCode = null) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

// Usage
try {
  // Database operation
} catch (error) {
  throw new DatabaseError(
    Str.fromRaw("Failed to insert record"), 
    { table: "users", operation: "insert" }
  );
}

// API call with error mapping
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NetworkError(
        Str.fromRaw(\`Request failed: \${response.statusText}\`),
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error; // Re-throw our custom error
    }
    
    // Convert normal fetch errors to our custom type
    throw new NetworkError(
      Str.fromRaw(\`Network error: \${error.message}\`)
    );
  }
}`}</Pre>
    </CodeBlock>

    <SmallText>
      Creating specific error types helps categorize errors and enables more
      precise error handling throughout your application, improving both
      developer experience and user feedback.
    </SmallText>
  </>
);

const ErrorPropertiesContent = () => (
  <>
    <InfoBox>
      MiLost errors carry rich metadata and contextual information to help with
      debugging, logging, and providing useful feedback to users.
    </InfoBox>

    <FormGroup>
      <Label>Error Properties</Label>
      <Table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>message</code>
            </td>
            <td>Str</td>
            <td>Human-readable error message</td>
          </tr>
          <tr>
            <td>
              <code>name</code>
            </td>
            <td>string</td>
            <td>Name of the error type</td>
          </tr>
          <tr>
            <td>
              <code>cause</code>
            </td>
            <td>Error (optional)</td>
            <td>Original error that caused this one</td>
          </tr>
          <tr>
            <td>
              <code>timestamp</code>
            </td>
            <td>Date</td>
            <td>When the error occurred</td>
          </tr>
          <tr>
            <td>
              <code>code</code>
            </td>
            <td>string (optional)</td>
            <td>Error code for categorization</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { AppError, Str } from "milost";

// Creating an error with rich metadata
const error = new AppError(
  Str.fromRaw("Failed to save user data"),
  {
    // Include the original cause
    cause: originalError,
    
    // Add an error code
    code: "USER_SAVE_FAILED",
    
    // Include context details
    details: {
      userId: 123,
      operation: "update",
      fields: ["email", "username"]
    }
  }
);

// Accessing error properties
console.log(error.message.toString());  // "Failed to save user data"
console.log(error.name);            // "AppError"
console.log(error.code);            // "USER_SAVE_FAILED"
console.log(error.timestamp);       // Date when error was created
console.log(error.details);         // The details object with context

// Error chaining
if (error.cause) {
  console.log("Caused by:", error.cause.message);
}

// Converting to string for logging
console.log(error.toString());

// Serializing to JSON
const serialized = error.toJSON();
console.log(JSON.stringify(serialized, null, 2));`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Recommended Error Properties</Label>
      <p>
        When creating custom errors, consider including these properties for
        better error reporting and debugging:
      </p>
      <ul>
        <li>
          <strong>code</strong>: String identifiers for error types
        </li>
        <li>
          <strong>details</strong>: Contextual information about the operation
        </li>
        <li>
          <strong>path</strong>: Location in data structures for validation
          errors
        </li>
        <li>
          <strong>suggestions</strong>: Potential solutions or next steps
        </li>
        <li>
          <strong>severity</strong>: Error importance (e.g., "warning",
          "critical")
        </li>
      </ul>
    </FormGroup>

    <SmallText>
      Rich error metadata helps with debugging and enables more useful error
      messages for users, improving both developer experience and application
      quality.
    </SmallText>
  </>
);

const ResultIntegrationContent = () => (
  <>
    <InfoBox>
      MiLost's error system integrates seamlessly with the Result type to
      provide safe, predictable error handling throughout your application.
    </InfoBox>

    <FormGroup>
      <Label>Error Handling with Result</Label>
      <p>
        The Result type provides a container that can hold either a successful
        value or an error, forcing explicit error handling and eliminating the
        need for try/catch blocks in many cases.
      </p>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { Result, AppError, ValidationError, Str } from "milost";

// Function that returns a Result instead of throwing
function divide(a, b) {
  if (b === 0) {
    return Result.Err(new ValidationError(Str.fromRaw("Cannot divide by zero")));
  }
  
  return Result.Ok(a / b);
}

// Using the Result-returning function
const result = divide(10, 2);

// Handle both success and error cases explicitly
if (result.isOk()) {
  const value = result.unwrap();
  console.log("Result:", value);  // "Result: 5"
} else {
  const error = result.getError();
  console.error("Error:", error.message.toString());
}

// Chaining Result operations
function validateAndProcessData(data) {
  return validateData(data)
    .andThen(validData => processData(validData))
    .andThen(processedData => saveData(processedData));
}

// Pattern matching with Result
const output = result.match(
  value => \`Success: \${value}\`,
  error => \`Error: \${error.message}\`
);`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Combining Multiple Results</Label>
      <p>
        When working with multiple operations that return Results, you can
        combine them in various ways:
      </p>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import { Result, Vec, AppError, Str } from "milost";

// Multiple operations that return Results
const results = Vec.from([
  validateUsername(username),
  validateEmail(email),
  validatePassword(password)
]);

// Check if all operations succeeded
const combinedResult = Result.all(results);
if (combinedResult.isOk()) {
  // All validations passed
  const [validUsername, validEmail, validPassword] = combinedResult.unwrap();
  createUser(validUsername, validEmail, validPassword);
} else {
  // At least one validation failed
  const error = combinedResult.getError();
  showValidationError(error.message);
}

// Executing operations until first success
function tryMultipleApproaches() {
  return firstApproach()
    .orElse(() => secondApproach())
    .orElse(() => thirdApproach())
    .orElse(() => {
      // Fallback approach if all others fail
      return Result.Ok(defaultValue);
    });
}

// Converting from try/catch to Result
function tryCatch(fn) {
  try {
    const value = fn();
    return Result.Ok(value);
  } catch (error) {
    return Result.Err(
      error instanceof AppError 
        ? error 
        : new AppError(Str.fromRaw(error.message))
    );
  }
}

// Using tryCatch for operations that might throw
const parseResult = tryCatch(() => JSON.parse(jsonString));`}</Pre>
    </CodeBlock>

    <SmallText>
      Combining the error system with Result types creates a comprehensive
      approach to error handling that makes errors explicit and enforces proper
      handling throughout your application.
    </SmallText>
  </>
);

const ErrorHandlingPatternsContent = () => (
  <>
    <InfoBox>
      MiLost encourages robust error handling patterns that improve code
      quality, maintainability, and user experience.
    </InfoBox>

    <FormGroup>
      <Label>Key Error Handling Patterns</Label>
      <Table>
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Description</th>
            <th>When to Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Result Type</td>
            <td>Return Result instead of throwing</td>
            <td>Most functions that can fail</td>
          </tr>
          <tr>
            <td>Error Categorization</td>
            <td>Use specific error types</td>
            <td>When different errors need different handling</td>
          </tr>
          <tr>
            <td>Error Translation</td>
            <td>Convert from one error type to another</td>
            <td>API boundaries, cross-module calls</td>
          </tr>
          <tr>
            <td>Early Validation</td>
            <td>Validate inputs before processing</td>
            <td>User inputs, API parameters</td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import {
  Result,
  Option,
  AppError,
  ValidationError,
  NotFoundError,
  Str
} from "milost";

// Pattern: Early Validation
function processOrder(order) {
  // Validate required fields early
  if (!order.items || order.items.length === 0) {
    return Result.Err(new ValidationError(Str.fromRaw("Order must have items")));
  }
  
  if (!order.customerId) {
    return Result.Err(new ValidationError(Str.fromRaw("Customer ID is required")));
  }
  
  // Continue with processing...
  return calculateOrderTotal(order);
}

// Pattern: Error Categorization
function lookupCustomer(customerId) {
  const customer = database.findCustomer(customerId);
  
  if (!customer) {
    return Result.Err(new NotFoundError(
      Str.fromRaw(\`Customer not found: \${customerId}\`)
    ));
  }
  
  if (!customer.active) {
    return Result.Err(new ValidationError(
      Str.fromRaw(\`Customer account is inactive: \${customerId}\`)
    ));
  }
  
  return Result.Ok(customer);
}

// Pattern: Error Translation
async function apiCall(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // Translate HTTP errors to domain errors
      if (response.status === 404) {
        return Result.Err(new NotFoundError(
          Str.fromRaw(\`Resource not found: \${endpoint}\`)
        ));
      }
      
      if (response.status === 403) {
        return Result.Err(new PermissionError(
          Str.fromRaw("Not authorized to access this resource")
        ));
      }
      
      return Result.Err(new AppError(
        Str.fromRaw(\`API error: \${response.statusText}\`)
      ));
    }
    
    const result = await response.json();
    return Result.Ok(result);
  } catch (error) {
    // Translate network errors
    return Result.Err(new AppError(
      Str.fromRaw(\`Network error: \${error.message}\`)
    ));
  }
}

// Pattern: Error Propagation with Context
function processPayment(orderId, amount) {
  return getOrder(orderId)
    .andThen(order => 
      validateOrderAmount(order, amount)
        .mapErr(error => {
          // Add context to the error
          return new ValidationError(
            Str.fromRaw(\`Payment validation failed: \${error.message}\`),
            { cause: error, orderId }
          );
        })
    )
    .andThen(validatedOrder => 
      chargeCustomer(validatedOrder.customerId, amount)
        .mapErr(error => {
          // Add context to payment error
          return new AppError(
            Str.fromRaw(\`Payment processing failed: \${error.message}\`),
            { cause: error, orderId }
          );
        })
    );
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Error Handling Best Practices</Label>
      <ol>
        <li>Be specific about the errors you return or throw</li>
        <li>Add context to errors as they propagate up the call stack</li>
        <li>Use Result for functions that might fail in expected ways</li>
        <li>Validate inputs early to fail fast</li>
        <li>Create domain-specific error types to improve error handling</li>
        <li>Include actionable information in error messages</li>
      </ol>
    </FormGroup>

    <SmallText>
      Following consistent error handling patterns makes your code more
      predictable, easier to debug, and improves the overall robustness of your
      application.
    </SmallText>
  </>
);

const ExamplesContent = () => (
  <>
    <InfoBox>
      Real-world examples demonstrating MiLost's error handling in action across
      different application scenarios.
    </InfoBox>

    <FormGroup>
      <Label>Example: Form Validation System</Label>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import {
  Result,
  ValidationError,
  AppError,
  Str,
  Vec
} from "milost";

// Domain-specific validation error
class FieldValidationError extends ValidationError {
  constructor(fieldName, message, constraints = {}) {
    super(message);
    this.fieldName = fieldName;
    this.constraints = constraints;
  }
}

// Validator functions that return Results
const validators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return Result.Err(new FieldValidationError(
        fieldName,
        Str.fromRaw(\`\${fieldName} is required\`)
      ));
    }
    return Result.Ok(value);
  },
  
  minLength: (min) => (value, fieldName) => {
    if (typeof value === 'string' && value.length < min) {
      return Result.Err(new FieldValidationError(
        fieldName,
        Str.fromRaw(\`\${fieldName} must be at least \${min} characters\`),
        { min }
      ));
    }
    return Result.Ok(value);
  },
  
  email: (value, fieldName) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (typeof value === 'string' && !emailRegex.test(value)) {
      return Result.Err(new FieldValidationError(
        fieldName,
        Str.fromRaw(\`\${fieldName} must be a valid email address\`)
      ));
    }
    return Result.Ok(value);
  }
};

// Validate a form using validators
function validateForm(formData, schema) {
  const errors = {};
  const validData = {};
  
  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = formData[field];
    
    // Chain validators for this field
    let result = Result.Ok(value);
    for (const validator of fieldSchema) {
      result = result.andThen(val => validator(val, field));
    }
    
    // Store validation results
    if (result.isOk()) {
      validData[field] = result.unwrap();
    } else {
      const error = result.getError();
      errors[field] = error;
    }
  }
  
  // Return overall validation result
  if (Object.keys(errors).length > 0) {
    return Result.Err(new ValidationError(
      Str.fromRaw("Form validation failed"),
      { fields: errors }
    ));
  }
  
  return Result.Ok(validData);
}

// Usage
const userSchema = {
  username: [
    validators.required,
    validators.minLength(3)
  ],
  email: [
    validators.required,
    validators.email
  ],
  password: [
    validators.required,
    validators.minLength(8)
  ]
};

function handleFormSubmit(formData) {
  const validationResult = validateForm(formData, userSchema);
  
  if (validationResult.isOk()) {
    const validData = validationResult.unwrap();
    return createUser(validData);
  } else {
    const error = validationResult.getError();
    displayFormErrors(error.fields);
    return Result.Err(error);
  }
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Example: Error Handling in API Gateway</Label>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import {
  Result,
  AppError,
  ValidationError,
  NotFoundError,
  PermissionError,
  Str
} from "milost";

// API Gateway with error handling
class ApiGateway {
  async handleRequest(req, res) {
    try {
      // Parse request
      const result = await this.processRequest(req);
      
      // Handle based on result
      if (result.isOk()) {
        const data = result.unwrap();
        res.status(200).json({
          success: true,
          data
        });
      } else {
        // Convert domain errors to appropriate HTTP responses
        this.handleError(result.getError(), res);
      }
    } catch (error) {
      // Catch any uncaught errors
      console.error("Uncaught error in API gateway:", error);
      
      res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR"
        }
      });
    }
  }
  
  handleError(error, res) {
    console.log("Handling API error:", error);
    
    // Map error types to appropriate HTTP status codes
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: {
          message: error.message.toString(),
          code: "VALIDATION_ERROR",
          fields: error.fields || {}
        }
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          message: error.message.toString(),
          code: "NOT_FOUND"
        }
      });
    } else if (error instanceof PermissionError) {
      res.status(403).json({
        success: false,
        error: {
          message: error.message.toString(),
          code: "PERMISSION_DENIED"
        }
      });
    } else {
      // Generic AppError or unknown error
      res.status(500).json({
        success: false,
        error: {
          message: error.message.toString(),
          code: error.code || "UNKNOWN_ERROR"
        }
      });
    }
  }
  
  async processRequest(req) {
    // Validate request
    const validationResult = this.validateRequest(req);
    if (validationResult.isErr()) {
      return validationResult;
    }
    
    // Authenticate user
    const authResult = await this.authenticateUser(req);
    if (authResult.isErr()) {
      return authResult;
    }
    
    const user = authResult.unwrap();
    
    // Authorize action
    const authzResult = this.authorizeAction(user, req.path, req.method);
    if (authzResult.isErr()) {
      return authzResult;
    }
    
    // Process the request with the appropriate handler
    try {
      const handler = this.getRequestHandler(req.path, req.method);
      return await handler(req, user);
    } catch (error) {
      return Result.Err(new AppError(
        Str.fromRaw(\`Failed to process request: \${error.message}\`),
        { cause: error }
      ));
    }
  }
  
  // Other methods omitted for brevity...
}`}</Pre>
    </CodeBlock>

    <FormGroup>
      <Label>Example: Error Monitoring and Logging System</Label>
    </FormGroup>

    <CodeBlock>
      <Pre>{`import {
  AppError,
  Str
} from "milost";

// Error monitoring system
class ErrorMonitor {
  constructor(options = {}) {
    this.options = {
      enableLogging: true,
      enableReporting: true,
      minSeverity: "warning",
      ...options
    };
    
    this.errorCounts = {};
  }
  
  captureError(error, context = {}) {
    // Ensure we have an AppError
    const appError = this.normalizeError(error);
    
    // Add context to the error
    appError.context = {
      ...appError.context,
      ...context,
      timestamp: new Date().toISOString()
    };
    
    // Log the error
    if (this.options.enableLogging) {
      this.logError(appError);
    }
    
    // Track error metrics
    this.trackError(appError);
    
    // Report to error service if enabled and meets severity threshold
    if (
      this.options.enableReporting &&
      this.shouldReportError(appError)
    ) {
      this.reportError(appError);
    }
    
    return appError;
  }
  
  normalizeError(error) {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(
        Str.fromRaw(error.message),
        { cause: error }
      );
    }
    
    // Handle non-Error objects
    return new AppError(
      Str.fromRaw(String(error))
    );
  }
  
  logError(error) {
    const severity = error.severity || "error";
    const message = error.message.toString();
    
    switch (severity) {
      case "critical":
        console.error(\`[CRITICAL] \${message}\`, {
          error,
          stack: error.stack,
          context: error.context
        });
        break;
      case "error":
        console.error(\`[ERROR] \${message}\`, {
          error,
          context: error.context
        });
        break;
      case "warning":
        console.warn(\`[WARNING] \${message}\`, {
          error,
          context: error.context
        });
        break;
      default:
        console.log(\`[INFO] \${message}\`, {
          error,
          context: error.context
        });
    }
  }
  
  trackError(error) {
    const errorKey = error.code || error.name;
    this.errorCounts[errorKey] = (this.errorCounts[errorKey] || 0) + 1;
    
    // If this error is occurring frequently, we might want to
    // escalate its handling
    if (this.errorCounts[errorKey] >= 10) {
      console.warn(\`High error rate detected for \${errorKey}: \${this.errorCounts[errorKey]} occurrences\`);
    }
  }
  
  shouldReportError(error) {
    const severity = error.severity || "error";
    const severityLevels = {
      debug: 0,
      info: 1,
      warning: 2,
      error: 3,
      critical: 4
    };
    
    const minSeverityLevel = severityLevels[this.options.minSeverity] || 2;
    const errorSeverityLevel = severityLevels[severity] || 3;
    
    return errorSeverityLevel >= minSeverityLevel;
  }
  
  reportError(error) {
    // In a real system, this would send to an error reporting service
    // like Sentry, Rollbar, etc.
    console.log("Reporting error to error service:", {
      message: error.message.toString(),
      name: error.name,
      code: error.code,
      context: error.context,
      severity: error.severity || "error",
      stack: error.stack
    });
  }
  
  getErrorMetrics() {
    return {
      counts: { ...this.errorCounts },
      total: Object.values(this.errorCounts).reduce((sum, count) => sum + count, 0)
    };
  }
}

// Usage example
const errorMonitor = new ErrorMonitor({
  enableReporting: process.env.NODE_ENV === 'production',
  minSeverity: 'warning'
});

try {
  // Some operation that might fail
  processUserData(userData);
} catch (error) {
  // Capture and handle the error
  const monitoredError = errorMonitor.captureError(error, {
    userId: userData.id,
    operation: 'processUserData'
  });
  
  // Can still use the error for application logic
  showErrorNotification(monitoredError.message);
}`}</Pre>
    </CodeBlock>

    <SmallText>
      These examples demonstrate how MiLost's error system can be used in
      real-world scenarios to create robust, maintainable applications with
      clear error handling patterns.
    </SmallText>
  </>
);

// Main component
function ErrorsPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "types", label: "Error Types" },
    { id: "properties", label: "Error Properties" },
    { id: "result", label: "Result Integration" },
    { id: "patterns", label: "Error Patterns" },
    { id: "examples", label: "Examples" },
  ];

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeCategory) {
      case "overview":
        return <OverviewContent />;
      case "types":
        return <ErrorTypesContent />;
      case "properties":
        return <ErrorPropertiesContent />;
      case "result":
        return <ResultIntegrationContent />;
      case "patterns":
        return <ErrorHandlingPatternsContent />;
      case "examples":
        return <ExamplesContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Error Handling</Title>
        <Subtitle>Comprehensive Type-Safe Error Management</Subtitle>
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

export default ErrorsPage;
