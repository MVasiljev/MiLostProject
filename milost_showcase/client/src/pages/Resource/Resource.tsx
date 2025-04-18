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
} from "./Resource.styles";
import { Table } from "../Vector/Vector.styles";

function ResourcePage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "resource", label: "Resource Management" },
    { id: "disposable", label: "Disposable Resources" },
    { id: "patterns", label: "Resource Patterns" },
    { id: "error-handling", label: "Error Handling" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Resource Management</Title>
        <Subtitle>Safe and Controlled Resource Lifecycle Handling</Subtitle>
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
              Resource management is a critical aspect of writing robust,
              memory-safe applications, ensuring proper acquisition, use, and
              release of system resources.
            </InfoBox>

            <FormGroup>
              <Label>What is Resource Management?</Label>
              <p>
                Resource management involves carefully controlling the lifecycle
                of system resources like files, network connections, and memory.
                The goal is to prevent leaks, ensure timely cleanup, and
                maintain system stability.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Key Challenges in Resource Management</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Challenge</th>
                    <th>Traditional Approach</th>
                    <th>MiLost Approach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Resource Leaks</td>
                    <td>Manual tracking and cleanup</td>
                    <td>Automatic lifecycle management</td>
                  </tr>
                  <tr>
                    <td>Error Handling</td>
                    <td>Prone to forgetting cleanup</td>
                    <td>Guaranteed resource release</td>
                  </tr>
                  <tr>
                    <td>Concurrency</td>
                    <td>Complex manual synchronization</td>
                    <td>Built-in safety mechanisms</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Resource } from "milost";

// Traditional Approach
function processFile(filename) {
  const file = openFile(filename);
  try {
    processData(file);
  } finally {
    file.close(); // Easy to forget
  }

// Resource Approach (Safe and Clear)
function processFile(filename) {
  const resource = Resource.new(
    openFile(filename), 
    file => file.close()
  );

  return resource.use(file => {
    // Process file, guaranteed to be closed afterward
    return processData(file);
  });
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Resource management transforms error-prone manual cleanup into a
              predictable, safe system integrated into the language design.
            </SmallText>
          </>
        )}

        {activeCategory === "resource" && (
          <>
            <InfoBox>
              The Resource type provides a comprehensive mechanism for managing
              resource lifecycles with compile-time safety.
            </InfoBox>

            <FormGroup>
              <Label>Resource Core Principles</Label>
              <ul>
                <li>
                  <strong>Explicit Ownership</strong>: Clear responsibility for
                  resource lifecycle
                </li>
                <li>
                  <strong>Automatic Cleanup</strong>: Resources automatically
                  freed
                </li>
                <li>
                  <strong>Error Safety</strong>: Cleanup occurs even if errors
                  happen
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Resource Lifecycle Methods</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>new(value, dispose)</td>
                    <td>Create a resource with its disposal method</td>
                  </tr>
                  <tr>
                    <td>use()</td>
                    <td>Use the resource, guaranteed cleanup</td>
                  </tr>
                  <tr>
                    <td>dispose()</td>
                    <td>Manually trigger resource cleanup</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Resource } from "milost";

// Creating a Resource
const dbConnection = Resource.new(
  openDatabaseConnection(),
  conn => conn.close()
);

// Using the Resource
const result = dbConnection.use(conn => {
  // Use the connection safely
  return conn.query("SELECT * FROM users");
});

// Connection automatically closed after use
// Even if an error occurs during query`}</Pre>
            </CodeBlock>

            <SmallText>
              Resources provide a declarative way to manage system resources,
              ensuring they are always properly handled.
            </SmallText>
          </>
        )}

        {activeCategory === "disposable" && (
          <>
            <InfoBox>
              Disposable resources allow for explicit, safe management of
              resources that require cleanup.
            </InfoBox>

            <FormGroup>
              <Label>Disposable Interface</Label>
              <p>
                The Disposable pattern defines a standard way to release
                resources, ensuring consistent cleanup across different types of
                resources.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Disposable Resource Characteristics</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Grouped Management</td>
                    <td>Manage multiple resources together</td>
                  </tr>
                  <tr>
                    <td>Automatic Cleanup</td>
                    <td>Resources released in reverse order of addition</td>
                  </tr>
                  <tr>
                    <td>Error Tolerance</td>
                    <td>Cleanup continues even if one resource fails</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { DisposableGroup } from "milost";

// Creating a Disposable Group
const resources = DisposableGroup.new()
  .add(openFileHandle())
  .add(createNetworkConnection())
  .add(allocateMemoryBuffer());

// Safely manage multiple resources
try {
  resources.use(group => {
    // Use resources within the group
    processResources(group);
  });
} finally {
  // Guaranteed cleanup of all resources
  resources.dispose();
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Disposable resources provide a structured approach to managing
              complex resource lifecycles.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              Resource management patterns provide robust strategies for
              handling system resources safely and efficiently.
            </InfoBox>

            <FormGroup>
              <Label>Resource Management Patterns</Label>
              <ul>
                <li>
                  <strong>RAII (Resource Acquisition Is Initialization)</strong>
                </li>
                <li>
                  <strong>Scoped Resource Management</strong>
                </li>
                <li>
                  <strong>Explicit Cleanup</strong>
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Resource Management Techniques</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Description</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Scoped Management</td>
                    <td>Automatic resource cleanup within defined scope</td>
                    <td>File, network, and database operations</td>
                  </tr>
                  <tr>
                    <td>Grouped Resources</td>
                    <td>Manage multiple related resources together</td>
                    <td>Complex system interactions</td>
                  </tr>
                  <tr>
                    <td>Conditional Cleanup</td>
                    <td>Selective resource release based on conditions</td>
                    <td>Advanced resource management scenarios</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Resource, DisposableGroup } from "milost";

// Complex Resource Management Pattern
function processMultipleResources() {
  const group = DisposableGroup.new();

  try {
    const file = group.add(openFile('data.txt'));
    const network = group.add(createNetworkConnection());
    const cache = group.add(createMemoryCache());

    return group.use(() => {
      const fileData = file.read();
      const networkResult = network.sendData(fileData);
      cache.store(networkResult);
      return networkResult;
    });
  } finally {
    // Guaranteed cleanup of all resources
    group.dispose();
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Resource management patterns provide flexible and safe approaches
              to handling system resources across different scenarios.
            </SmallText>
          </>
        )}

        {activeCategory === "error-handling" && (
          <>
            <InfoBox>
              Robust error handling is crucial in resource management to prevent
              resource leaks and ensure system stability.
            </InfoBox>

            <FormGroup>
              <Label>Error Handling Strategies</Label>
              <ul>
                <li>
                  <strong>Automatic Cleanup</strong>: Resources freed even on
                  errors
                </li>
                <li>
                  <strong>Error Propagation</strong>: Preserve original error
                  context
                </li>
                <li>
                  <strong>Fallback Mechanisms</strong>: Handle resource
                  acquisition failures
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Error Handling Mechanisms</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Mechanism</th>
                    <th>Description</th>
                    <th>Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Resource Errors</td>
                    <td>Specific errors for resource-related issues</td>
                    <td>Precise error identification</td>
                  </tr>
                  <tr>
                    <td>Guaranteed Cleanup</td>
                    <td>Resources always released, even on errors</td>
                    <td>Prevent resource leaks</td>
                  </tr>
                  <tr>
                    <td>Error Propagation</td>
                    <td>Maintain original error context</td>
                    <td>Preserve debugging information</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Resource, ResourceError } from "milost";

function robustResourceHandling() {
  try {
    const resource = Resource.new(
      openExpensiveResource(),
      resource => resource.close()
    );

    return resource.use(res => {
      // Potentially failing operation
      if (!res.isValid()) {
        // Throw a specific resource-related error
        throw new ResourceError("Invalid resource state");
      }

      return processWithResource(res);
    });
  } catch (error) {
    if (error instanceof ResourceError) {
      // Handle specific resource-related errors
      logResourceError(error);
    } else {
      // Handle other unexpected errors
      handleUnexpectedError(error);
    }
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Effective error handling ensures that resources are always
              properly managed, regardless of unexpected conditions.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Real-world scenarios demonstrating comprehensive resource
              management techniques.
            </InfoBox>

            <FormGroup>
              <Label>Example Scenarios</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Resource Types</th>
                    <th>Key Technique</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Database Operation</td>
                    <td>Database Connection, Cache, Log File</td>
                    <td>Grouped Resource Management</td>
                  </tr>
                  <tr>
                    <td>System Monitoring</td>
                    <td>Expensive System Resource</td>
                    <td>Lifecycle Tracking</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Resource, DisposableGroup } from "milost";

// Comprehensive Resource Management Example
async function complexSystemOperation() {
  const group = DisposableGroup.new();

  try {
    // Acquire multiple resources
    const database = group.add(openDatabaseConnection());
    const cache = group.add(createRedisCache());
    const logFile = group.add(openLogFile('system.log'));

    // Use resources within a managed context
    return await group.use(async () => {
      // Perform interdependent operations
      const userData = await database.query('SELECT * FROM users');
      
      // Cache and log results
      await cache.set('user_data', userData);
      logFile.write(JSON.stringify(userData));

      return processUserData(userData);
    });
  } catch (error) {
    // Centralized error handling
    handleSystemError(error);
  } finally {
    // Guaranteed cleanup of all resources
    group.dispose();
  }
}

// Real-time Resource Monitoring
function resourceLifecycleMonitoring() {
  const resource = Resource.new(
    createExpensiveResource(),
    res => res.cleanup()
  );

  // Track resource lifecycle
  const result = resource.use(res => {
    monitorResourceUsage(res);
    return processResource(res);
  });

  return result;
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples showcase the power of systematic resource
              management, demonstrating how to handle complex, interconnected
              resources safely and efficiently.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default ResourcePage;
