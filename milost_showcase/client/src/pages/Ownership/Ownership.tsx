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
} from "./Ownership.styles";

function OwnershipPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "owned", label: "Owned Type" },
    { id: "ref", label: "Ref Type" },
    { id: "refmut", label: "RefMut Type" },
    { id: "borrowing", label: "Borrowing Pattern" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Ownership System</Title>
        <Subtitle>
          Type-Safe Memory Management with Rust-Inspired Ownership Model
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
              MiLost brings Rust's powerful ownership system to TypeScript,
              enabling safer memory management and preventing common bugs like
              use-after-free and data races.
            </InfoBox>

            <FormGroup>
              <Label>Ownership Principles</Label>
              <p>
                The ownership system enforces strict rules about how values are
                accessed and modified, ensuring memory safety without a garbage
                collector.
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
                    <td>Owned</td>
                    <td>Represents exclusive ownership of a value</td>
                  </tr>
                  <tr>
                    <td>Ref</td>
                    <td>Immutable reference to a value</td>
                  </tr>
                  <tr>
                    <td>RefMut</td>
                    <td>Mutable reference to a value</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Owned, Ref, RefMut } from "milost";

// Create a value with single ownership
const ownedValue = Owned.create(42);

// Borrow the value immutably
ownedValue.borrow(value => {
  console.log("Value is:", value);  // Value is: 42
});

// Borrow the value mutably
ownedValue.borrowMut(value => {
  return value * 2;  // Updates the inner value
});

// Check the updated value
ownedValue.borrow(value => {
  console.log("Updated value:", value);  // Updated value: 84
});

// Consume the value (takes ownership)
const finalValue = ownedValue.consume();
console.log(finalValue);  // 84

// This would throw an error - value has been consumed
// ownedValue.borrow(value => console.log(value));`}</Pre>
            </CodeBlock>

            <SmallText>
              MiLost's ownership system ensures values have a single owner at
              any given time, preventing memory leaks and data races without
              relying on garbage collection.
            </SmallText>
          </>
        )}

        {activeCategory === "owned" && (
          <>
            <InfoBox>
              The <code>Owned</code> type implements exclusive ownership of a
              value, ensuring it can only be accessed through controlled
              borrowing or consumption.
            </InfoBox>

            <FormGroup>
              <Label>Owned Type Features</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Exclusive Ownership</td>
                    <td>Each value has exactly one owner</td>
                  </tr>
                  <tr>
                    <td>Safe Borrowing</td>
                    <td>Temporary, controlled access to owned values</td>
                  </tr>
                  <tr>
                    <td>Value Consumption</td>
                    <td>Transfer ownership of the value</td>
                  </tr>
                  <tr>
                    <td>Runtime Safety Checks</td>
                    <td>Prevents use-after-consume errors</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Owned } from "milost";

// Create an owned string
const ownedString = Owned.create("Hello, world!");

// Check if owned value is still valid
console.log(ownedString.isAlive());  // true

// Borrow immutably
ownedString.borrow(str => {
  console.log(str.length);  // 13
  console.log(str.toUpperCase());  // "HELLO, WORLD!"
});

// Modify the string
ownedString.borrowMut(str => {
  return str.replace("world", "TypeScript");
});

// Borrow again to see changes
ownedString.borrow(str => {
  console.log(str);  // "Hello, TypeScript!"
});

// Consume the value (transfer ownership)
const finalString = ownedString.consume();
console.log(finalString);  // "Hello, TypeScript!"

// Value is no longer owned
console.log(ownedString.isAlive());  // false
console.log(ownedString.isConsumed());  // true

// This would throw an OwnershipError
try {
  ownedString.borrow(str => console.log(str));
} catch (error) {
  console.error(error.message);  // "Cannot borrow consumed value"
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Owned Type API</Label>
              <ul>
                <li>
                  <strong>create(value)</strong>: Create a new Owned instance
                </li>
                <li>
                  <strong>borrow(fn)</strong>: Immutably borrow the value
                </li>
                <li>
                  <strong>borrowMut(fn)</strong>: Mutably borrow the value
                </li>
                <li>
                  <strong>consume()</strong>: Take ownership of the value
                </li>
                <li>
                  <strong>isAlive()</strong>: Check if the value is still owned
                </li>
                <li>
                  <strong>isConsumed()</strong>: Check if the value was consumed
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              The Owned type enforces exclusive ownership, preventing multiple
              parts of your code from modifying the same data simultaneously.
            </SmallText>
          </>
        )}

        {activeCategory === "ref" && (
          <>
            <InfoBox>
              The <code>Ref</code> type represents an immutable reference to a
              value, allowing safe, read-only access without transferring
              ownership.
            </InfoBox>

            <FormGroup>
              <Label>Ref Type Features</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Immutable References</td>
                    <td>Read-only access to values</td>
                  </tr>
                  <tr>
                    <td>Explicit Lifetimes</td>
                    <td>References can be explicitly dropped</td>
                  </tr>
                  <tr>
                    <td>Safety Checks</td>
                    <td>Prevents use-after-drop errors</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Ref } from "milost";

// Create an immutable reference
const userRef = Ref.create({ name: "Alice", age: 30 });

// Access the referenced value
const user = userRef.get();
console.log(user.name);  // "Alice"
console.log(user.age);   // 30

// Check if the reference is valid
console.log(userRef.isActive());  // true

// Drop the reference when no longer needed
userRef.drop();
console.log(userRef.isActive());  // false

// This would throw an OwnershipError
try {
  userRef.get();
} catch (error) {
  console.error(error.message);  // "Reference is no longer valid"
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Ref Type API</Label>
              <ul>
                <li>
                  <strong>create(value)</strong>: Create a new Ref instance
                </li>
                <li>
                  <strong>get()</strong>: Access the referenced value
                </li>
                <li>
                  <strong>drop()</strong>: Invalidate the reference
                </li>
                <li>
                  <strong>isActive()</strong>: Check if the reference is still
                  valid
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Ref provides a safe way to share read-only access to values
              without transferring ownership, preventing unintended
              modifications.
            </SmallText>
          </>
        )}

        {activeCategory === "refmut" && (
          <>
            <InfoBox>
              The <code>RefMut</code> type represents a mutable reference to a
              value, allowing controlled modification without transferring
              ownership.
            </InfoBox>

            <FormGroup>
              <Label>RefMut Type Features</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mutable References</td>
                    <td>Read-write access to values</td>
                  </tr>
                  <tr>
                    <td>Controlled Updates</td>
                    <td>Safe value modifications</td>
                  </tr>
                  <tr>
                    <td>Explicit Lifetimes</td>
                    <td>References can be explicitly dropped</td>
                  </tr>
                  <tr>
                    <td>Safety Checks</td>
                    <td>Prevents use-after-drop errors</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { RefMut } from "milost";

// Create a mutable reference to an object
const configRefMut = RefMut.create({
  theme: "light",
  fontSize: 14,
  notifications: true
});

// Access the referenced value
const config = configRefMut.get();
console.log(config.theme);  // "light"

// Update the referenced value
configRefMut.set(current => ({
  ...current,
  theme: "dark",
  fontSize: 16
}));

// Access the updated value
const updatedConfig = configRefMut.get();
console.log(updatedConfig.theme);    // "dark"
console.log(updatedConfig.fontSize); // 16

// Check if the reference is valid
console.log(configRefMut.isActive()); // true

// Drop the reference when no longer needed
configRefMut.drop();
console.log(configRefMut.isActive()); // false

// This would throw an OwnershipError
try {
  configRefMut.get();
} catch (error) {
  console.error(error.message); // "Mutable reference is no longer valid"
}`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>RefMut Type API</Label>
              <ul>
                <li>
                  <strong>create(value)</strong>: Create a new RefMut instance
                </li>
                <li>
                  <strong>get()</strong>: Access the referenced value
                </li>
                <li>
                  <strong>set(updater)</strong>: Update the referenced value
                </li>
                <li>
                  <strong>drop()</strong>: Invalidate the reference
                </li>
                <li>
                  <strong>isActive()</strong>: Check if the reference is still
                  valid
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              RefMut provides a safe way to modify values without transferring
              ownership, ensuring controlled updates while preventing data races
              and use-after-free errors.
            </SmallText>
          </>
        )}

        {activeCategory === "borrowing" && (
          <>
            <InfoBox>
              Borrowing is a fundamental concept in MiLost's ownership system,
              allowing temporary, controlled access to owned values without
              transferring ownership.
            </InfoBox>

            <FormGroup>
              <Label>Borrowing Principles</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Principle</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Immutable XOR Mutable</td>
                    <td>
                      Either multiple immutable borrows OR one mutable borrow at
                      a time
                    </td>
                  </tr>
                  <tr>
                    <td>Scoped Lifetimes</td>
                    <td>Borrows are valid only within their defined scope</td>
                  </tr>
                  <tr>
                    <td>Owner Precedence</td>
                    <td>
                      The owner controls all borrowing and retains ultimate
                      control
                    </td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Owned, Ref, RefMut } from "milost";

// Create an owned vector of numbers
const numbers = Owned.create([1, 2, 3, 4, 5]);

// Immutable borrowing with Owned.borrow
numbers.borrow(nums => {
  // We can perform read-only operations
  const sum = nums.reduce((a, b) => a + b, 0);
  console.log("Sum:", sum); // 15
  
  // nums is a temporary reference, we can't modify it:
  // nums.push(6); // This would cause a TypeScript error
});

// Mutable borrowing with Owned.borrowMut
numbers.borrowMut(nums => {
  // We can modify the array
  nums.push(6);
  nums.sort((a, b) => b - a); // Sort in descending order
  return nums; // Return the modified array
});

// Verify the changes
numbers.borrow(nums => {
  console.log(nums); // [6, 5, 4, 3, 2, 1]
});

// External references
function processList(ref: Ref<number[]>) {
  // Safe read-only access
  const values = ref.get();
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  console.log("Average:", average);
}

function updateList(ref: RefMut<number[]>) {
  // Safe mutable access
  ref.set(current => {
    return [...current, 7, 8, 9];
  });
}

// Create separate references
const numbersRef = Ref.create([1, 2, 3]);
const otherRefMut = RefMut.create([4, 5, 6]);

// Use the references
processList(numbersRef);
updateList(otherRefMut);`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Borrowing Best Practices</Label>
              <ol>
                <li>
                  Keep borrow scopes as small as possible to minimize
                  restrictions
                </li>
                <li>
                  Prefer immutable borrowing when mutation isn't necessary
                </li>
                <li>
                  Drop references explicitly when they're no longer needed
                </li>
                <li>
                  Use function parameters to clearly indicate borrowing patterns
                </li>
                <li>
                  Consider type aliases like <code>BorrowFn&lt;T, R&gt;</code>{" "}
                  for clearer APIs
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              The borrowing system provides a controlled way to access values
              without transferring ownership, preventing common memory errors
              while maintaining clarity about data access patterns.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Real-world examples demonstrating MiLost's ownership system in
              action, solving common programming challenges with safer memory
              management.
            </InfoBox>

            <FormGroup>
              <Label>Example Applications</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Example</th>
                    <th>Ownership Features Used</th>
                    <th>Key Benefits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Resource Manager</td>
                    <td>Owned, Ref, RefMut</td>
                    <td>Safe resource acquisition and release</td>
                  </tr>
                  <tr>
                    <td>Configuration System</td>
                    <td>Owned, RefMut</td>
                    <td>Controlled configuration updates</td>
                  </tr>
                  <tr>
                    <td>Data Pipeline</td>
                    <td>Ownership Transfer</td>
                    <td>Clear data flow and responsibility</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Owned, Ref, RefMut } from "milost";

// Example 1: Resource Manager
class DatabaseConnection {
  constructor(private url: string) {
    console.log(\`Connected to \${url}\`);
  }
  
  query(sql: string) {
    return \`Results for: \${sql}\`;
  }
  
  close() {
    console.log("Connection closed");
  }
}

class ResourceManager {
  private connection: Owned<DatabaseConnection>;
  
  constructor(dbUrl: string) {
    this.connection = Owned.create(new DatabaseConnection(dbUrl));
  }
  
  executeQuery(sql: string): string {
    return this.connection.borrow(conn => {
      return conn.query(sql);
    });
  }
  
  getConnectionRef(): Ref<DatabaseConnection> {
    let ref: Ref<DatabaseConnection> | null = null;
    
    this.connection.borrow(conn => {
      ref = Ref.create(conn);
    });
    
    return ref!;
  }
  
  close() {
    if (this.connection.isAlive()) {
      this.connection.borrow(conn => conn.close());
    }
  }
}

// Example 2: Configuration System
class AppConfig {
  private config: Owned<{
    theme: string;
    fontSize: number;
    enableNotifications: boolean;
    apiEndpoints: { [key: string]: string };
  }>;
  
  constructor() {
    this.config = Owned.create({
      theme: "light",
      fontSize: 14,
      enableNotifications: true,
      apiEndpoints: {
        users: "/api/users",
        products: "/api/products"
      }
    });
  }
  
  getConfig(): Ref<any> {
    let configRef: Ref<any> | null = null;
    
    this.config.borrow(cfg => {
      configRef = Ref.create(cfg);
    });
    
    return configRef!;
  }
  
  updateTheme(theme: string) {
    this.config.borrowMut(cfg => ({
      ...cfg,
      theme
    }));
  }
  
  updateApiEndpoint(name: string, url: string) {
    this.config.borrowMut(cfg => ({
      ...cfg,
      apiEndpoints: {
        ...cfg.apiEndpoints,
        [name]: url
      }
    }));
  }
}

// Example 3: Data Processing Pipeline
interface DataProcessor {
  process(data: Owned<string[]>): Owned<number[]>;
}

class DataCleaner implements DataProcessor {
  process(data: Owned<string[]>): Owned<string[]> {
    // Take ownership of the input data
    const dirtyData = data.consume();
    
    // Process and return a new owned value
    const cleanData = dirtyData
      .filter(item => item.trim().length > 0)
      .map(item => item.trim().toLowerCase());
      
    return Owned.create(cleanData);
  }
}

class DataParser implements DataProcessor {
  process(data: Owned<string[]>): Owned<number[]> {
    // Take ownership of the input data
    const strings = data.consume();
    
    // Process and return a new owned value
    const numbers = strings
      .map(str => parseFloat(str))
      .filter(num => !isNaN(num));
      
    return Owned.create(numbers);
  }
}

class DataAnalyzer {
  analyze(data: Owned<number[]>): { sum: number, avg: number, max: number } {
    // Borrow the data immutably for analysis
    return data.borrow(numbers => {
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      return {
        sum,
        avg: sum / numbers.length,
        max: Math.max(...numbers)
      };
    });
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples demonstrate how MiLost's ownership system clarifies
              responsibility for resources and data, preventing memory leaks and
              use-after-free errors while maintaining clear data flow throughout
              an application.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default OwnershipPage;
