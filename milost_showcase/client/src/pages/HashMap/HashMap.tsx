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
  Pre,
  CodeBlock,
  SmallText,
  FormGroup,
  Label,
  InfoBox,
} from "./HashMap.styles";
import { Table } from "../Vector/Vector.styles";

function HashMapPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "creating", label: "Creating & Accessing" },
    { id: "modifying", label: "Modifying" },
    { id: "querying", label: "Querying" },
    { id: "transforming", label: "Transformations" },
    { id: "performance", label: "Performance" },
  ];

  return (
    <Container>
      <Header>
        <Title>HashMap Collection</Title>
        <Subtitle>
          Immutable, type-safe key-value storage with WASM acceleration
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
              The <code>HashMap</code> type is MiLost's immutable key-value map
              implementation. It provides a safe, predictable alternative to
              JavaScript's objects and Map with strong type safety and
              functional operations.
            </InfoBox>

            <FormGroup>
              <Label>Key Features</Label>
              <ul>
                <li>
                  <strong>Immutable:</strong> All operations return new maps
                  instead of modifying the original
                </li>
                <li>
                  <strong>Type-safe:</strong> Full TypeScript support for key
                  and value types
                </li>
                <li>
                  <strong>Explicit API:</strong> Clear, predictable methods for
                  all operations
                </li>
                <li>
                  <strong>Key safety:</strong> Safer key access than JavaScript
                  objects
                </li>
                <li>
                  <strong>Performance:</strong> WASM acceleration for map
                  operations when available
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use HashMap</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use HashMap when you need...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Immutable key-value storage</td>
                    <td>Mutable JavaScript objects or Maps</td>
                  </tr>
                  <tr>
                    <td>Explicit, safe key access</td>
                    <td>Direct property access that may return undefined</td>
                  </tr>
                  <tr>
                    <td>Functional transformation of key-value data</td>
                    <td>Imperative object manipulation with side effects</td>
                  </tr>
                  <tr>
                    <td>Predictable iteration order</td>
                    <td>JavaScript objects with inconsistent key ordering</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

// Create a user map
const userMap = HashMap.from([
  ["alice", { name: "Alice", age: 30 }],
  ["bob", { name: "Bob", age: 25 }]
]);

// Safe access with explicit handling for missing keys
const user = userMap.get("alice");
if (user !== undefined) {
  console.log(user.name);  // "Alice"
}

// Check if key exists
console.log(userMap.contains("charlie"));  // false

// Immutable updates - original map unchanged
const updatedMap = userMap.insert("charlie", { name: "Charlie", age: 35 });
console.log(userMap.contains("charlie"));      // false
console.log(updatedMap.contains("charlie"));   // true

// Map transformation
const namesOnly = userMap.map((value, key) => value.name);
console.log(namesOnly.get("alice"));  // "Alice"

// Filtering
const adults = userMap.filter((value, key) => value.age >= 30);
console.log(adults.contains("bob"));   // false
console.log(adults.contains("alice")); // true`}</Pre>
            </CodeBlock>

            <SmallText>
              HashMap provides a powerful alternative to JavaScript objects for
              key-value data. By enforcing immutability, it eliminates an entire
              class of bugs related to unexpected mutations, while providing
              rich functional operations for data transformation.
            </SmallText>
          </>
        )}

        {activeCategory === "creating" && (
          <>
            <InfoBox>
              MiLost provides several ways to create HashMaps and access their
              values. Key access is designed to be explicit and safe, avoiding
              the pitfalls of JavaScript's property access.
            </InfoBox>

            <FormGroup>
              <Label>Creating HashMaps</Label>
              <ul>
                <li>
                  <strong>HashMap.from(entries)</strong>: Create a map from
                  key-value pairs
                </li>
                <li>
                  <strong>HashMap.empty()</strong>: Create an empty map
                </li>
                <li>
                  <strong>existingMap.insert(key, value)</strong>: Add to
                  existing map
                </li>
                <li>
                  <strong>existingMap.extend(otherMap)</strong>: Combine maps
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Accessing Values</Label>
              <ul>
                <li>
                  <strong>map.get(key)</strong>: Get a value by key (returns
                  undefined if not found)
                </li>
                <li>
                  <strong>map.contains(key)</strong>: Check if a key exists
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

// Create from key-value pairs
const userMap = HashMap.from([
  ["user1", { name: "Alice", role: "admin" }],
  ["user2", { name: "Bob", role: "user" }]
]);

// Create an empty map
const emptyMap = HashMap.empty();

// Build a map incrementally
let configMap = HashMap.empty();
configMap = configMap.insert("host", "localhost");
configMap = configMap.insert("port", 8080);
configMap = configMap.insert("debug", true);

// Combine maps
const defaultConfig = HashMap.from([
  ["timeout", 30000],
  ["retries", 3]
]);
const fullConfig = configMap.extend(defaultConfig);

// Safe value access
const user1 = userMap.get("user1");
console.log(user1);  // { name: "Alice", role: "admin" }

// Handling missing keys
const user3 = userMap.get("user3");
console.log(user3);  // undefined

// Check if key exists before access
if (userMap.contains("user2")) {
  const user = userMap.get("user2");
  console.log(user.name);  // "Bob"
}

// Safe access pattern
function getUserRole(userId, userMap) {
  if (!userMap.contains(userId)) {
    return "guest";  // Default role
  }
  return userMap.get(userId).role;
}

console.log(getUserRole("user1", userMap));  // "admin"
console.log(getUserRole("user3", userMap));  // "guest"

// Converting to/from JavaScript objects
function fromObject(obj) {
  return HashMap.from(Object.entries(obj));
}

function toObject(map) {
  return Object.fromEntries(map.entries().toArray());
}

const jsObject = { name: "Charlie", age: 30 };
const hashMap = fromObject(jsObject);
const backToObject = toObject(hashMap);`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Best Practices for Creating and Accessing</Label>
              <ol>
                <li>
                  Use <code>HashMap.from()</code> when you have all entries
                  upfront
                </li>
                <li>
                  Always check if a key exists with <code>contains()</code>{" "}
                  before accessing it
                </li>
                <li>
                  For complex maps, build them incrementally with{" "}
                  <code>insert()</code>
                </li>
                <li>
                  Use <code>extend()</code> to merge default values with
                  overrides
                </li>
                <li>
                  Provide fallback values when accessing potentially missing
                  keys
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              HashMap provides explicit, safe key access that avoids many common
              JavaScript pitfalls like accessing undefined properties or
              accidental prototype chain lookups. This leads to more robust code
              with fewer unexpected behaviors.
            </SmallText>
          </>
        )}

        {activeCategory === "modifying" && (
          <>
            <InfoBox>
              HashMap is immutable, which means it's never modified in place.
              Instead, operations that would modify a mutable map return a new
              HashMap instance with the requested changes.
            </InfoBox>

            <FormGroup>
              <Label>Modification Operations</Label>
              <ul>
                <li>
                  <strong>map.insert(key, value)</strong>: Add or update a
                  key-value pair
                </li>
                <li>
                  <strong>map.remove(key)</strong>: Remove a key-value pair
                </li>
                <li>
                  <strong>map.extend(otherMap)</strong>: Merge with another map
                </li>
                <li>
                  <strong>map.clear()</strong>: Clear all entries
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

// Start with a base map
const users = HashMap.from([
  ["alice", { name: "Alice", age: 30 }],
  ["bob", { name: "Bob", age: 25 }]
]);

// Insert a new key (returns a new map)
const withCharlie = users.insert("charlie", { name: "Charlie", age: 35 });
console.log(users.size());        // 2 (original unchanged)
console.log(withCharlie.size());  // 3 (new map with charlie)

// Update an existing key
const updatedBob = users.insert("bob", { name: "Bob", age: 26 });
console.log(users.get("bob").age);       // 25 (original)
console.log(updatedBob.get("bob").age);  // 26 (updated)

// Remove a key
const withoutBob = users.remove("bob");
console.log(withoutBob.contains("bob"));  // false

// Merge maps
const moreUsers = HashMap.from([
  ["dave", { name: "Dave", age: 40 }],
  ["alice", { name: "Alice", age: 31 }]  // Note: overlapping key
]);

const mergedUsers = users.extend(moreUsers);
console.log(mergedUsers.size());             // 3 (alice, bob, dave)
console.log(mergedUsers.get("alice").age);   // 31 (from moreUsers)

// Clear all entries
const emptyUsers = users.clear();
console.log(emptyUsers.isEmpty());  // true

// Building a state object immutably
function updateUserAge(users, userId, newAge) {
  if (!users.contains(userId)) {
    return users;  // No change if user not found
  }
  
  const user = users.get(userId);
  const updatedUser = {
    ...user,
    age: newAge
  };
  
  return users.insert(userId, updatedUser);
}

const updatedUsers = updateUserAge(users, "alice", 31);
console.log(updatedUsers.get("alice").age);  // 31`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Immutable Update Patterns</Label>
              <ul>
                <li>
                  <strong>Simple Update:</strong> Direct insert/remove and
                  reassignment
                </li>
                <li>
                  <strong>Conditional Update:</strong> Only update if certain
                  conditions are met
                </li>
                <li>
                  <strong>Deep Update:</strong> Update nested object properties
                  within values
                </li>
                <li>
                  <strong>Batch Update:</strong> Make multiple changes and chain
                  them
                </li>
                <li>
                  <strong>Transactional Update:</strong> All-or-nothing updates
                  based on validation
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              The immutable nature of HashMap means that you can safely pass
              maps around your application without worrying about unexpected
              modifications. Each update creates a new version, making it easy
              to track changes and implement features like undo/redo.
            </SmallText>
          </>
        )}

        {activeCategory === "querying" && (
          <>
            <InfoBox>
              HashMap provides a rich set of methods for querying and inspecting
              its contents, from simple key checks to advanced iteration and
              search operations.
            </InfoBox>

            <FormGroup>
              <Label>Query Operations</Label>
              <ul>
                <li>
                  <strong>map.size()</strong>: Get the number of entries
                </li>
                <li>
                  <strong>map.isEmpty()</strong>: Check if map has no entries
                </li>
                <li>
                  <strong>map.contains(key)</strong>: Check if a key exists
                </li>
                <li>
                  <strong>map.get(key)</strong>: Get a value by key
                </li>
                <li>
                  <strong>map.keys()</strong>: Get all keys as a vector
                </li>
                <li>
                  <strong>map.values()</strong>: Get all values as a vector
                </li>
                <li>
                  <strong>map.entries()</strong>: Get all key-value pairs as a
                  vector
                </li>
                <li>
                  <strong>map.find(predicate)</strong>: Find entry matching a
                  condition
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

const users = HashMap.from([
  ["alice", { name: "Alice", role: "admin", active: true }],
  ["bob", { name: "Bob", role: "user", active: true }],
  ["charlie", { name: "Charlie", role: "user", active: false }]
]);

// Basic queries
console.log(users.size());          // 3
console.log(users.isEmpty());       // false
console.log(users.contains("dave")); // false

// Get collections of data
const keys = users.keys();
console.log(keys.toArray());  // ["alice", "bob", "charlie"]

const values = users.values();
console.log(values.toArray());  // [{ name: "Alice", ...}, ...]

const entries = users.entries();
console.log(entries.toArray());  // [["alice", { name: "Alice", ...}], ...]

// Find the first matching entry
const admin = users.find((user, key) => user.role === "admin");
console.log(admin);  // ["alice", { name: "Alice", ...}]

// Iteration with forEach
users.forEach((user, key) => {
  console.log(\`\${key}: \${user.name} (\${user.role})\`);
});

// Practical query example: retrieving active users
function getActiveUsersByRole(users, role) {
  return users
    .filter((user, key) => user.active && user.role === role)
    .keys()
    .toArray();
}

const activeAdmins = getActiveUsersByRole(users, "admin");
console.log(activeAdmins);  // ["alice"]

// Complex query: Get user statistics
function getUserStatistics(users) {
  let totalUsers = 0;
  let activeUsers = 0;
  let roles = new Set();
  
  users.forEach((user, key) => {
    totalUsers++;
    if (user.active) activeUsers++;
    roles.add(user.role);
  });
  
  return {
    total: totalUsers,
    active: activeUsers,
    inactive: totalUsers - activeUsers,
    roles: Array.from(roles)
  };
}

const stats = getUserStatistics(users);
console.log(stats);
// { total: 3, active: 2, inactive: 1, roles: ["admin", "user"] }`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Common Query Patterns</Label>
              <ul>
                <li>
                  <strong>Key Existence Check:</strong> Use contains before
                  accessing values
                </li>
                <li>
                  <strong>Collection Transformation:</strong> Convert
                  keys/values to arrays for further processing
                </li>
                <li>
                  <strong>Entry Search:</strong> Find entries matching specific
                  criteria
                </li>
                <li>
                  <strong>Aggregation:</strong> Compute statistics or summaries
                  from map data
                </li>
                <li>
                  <strong>Lookup Tables:</strong> Use maps as efficient lookup
                  structures
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              The query capabilities of HashMap make it perfect for representing
              complex domain data where you need to look up, filter, and analyze
              information. The predictable behavior ensures consistent results
              across your application.
            </SmallText>
          </>
        )}

        {activeCategory === "transforming" && (
          <>
            <InfoBox>
              HashMap supports powerful functional transformations that let you
              create new maps derived from existing ones. These operations
              follow functional programming principles and preserve
              immutability.
            </InfoBox>

            <FormGroup>
              <Label>Transformation Operations</Label>
              <ul>
                <li>
                  <strong>map.map(mapFn)</strong>: Transform values while
                  preserving keys
                </li>
                <li>
                  <strong>map.filter(predicate)</strong>: Keep entries that
                  match a condition
                </li>
                <li>
                  <strong>map.extend(other)</strong>: Combine two maps
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

const users = HashMap.from([
  ["alice", { name: "Alice", age: 30, score: 85 }],
  ["bob", { name: "Bob", age: 25, score: 70 }],
  ["charlie", { name: "Charlie", age: 35, score: 90 }]
]);

// Transform values with map
const userAges = users.map((user, key) => user.age);
console.log(userAges.get("alice"));  // 30

// Generate report cards
const grades = users.map((user, key) => {
  let grade;
  if (user.score >= 90) grade = "A";
  else if (user.score >= 80) grade = "B";
  else if (user.score >= 70) grade = "C";
  else grade = "F";
  
  return { name: user.name, grade };
});

console.log(grades.get("charlie"));  // { name: "Charlie", grade: "A" }

// Filter entries
const adults = users.filter((user, key) => user.age >= 30);
console.log(adults.contains("bob"));     // false
console.log(adults.contains("alice"));   // true
console.log(adults.contains("charlie")); // true

const highScorers = users.filter((user, key) => user.score >= 85);
console.log(highScorers.size());  // 2 (Alice and Charlie)

// Combine transformations for complex operations
const adultScores = users
  .filter((user, key) => user.age >= 30)
  .map((user, key) => user.score);
  
console.log(adultScores.get("alice"));   // 85
console.log(adultScores.get("charlie")); // 90
console.log(adultScores.contains("bob")); // false

// Create new derived data
function calculateAgeGroups(users) {
  const groups = HashMap.empty();
  
  users.forEach((user, key) => {
    const decade = Math.floor(user.age / 10) * 10;
    const group = \`\${decade}s\`;
    
    if (groups.contains(group)) {
      const currentMembers = groups.get(group);
      const updatedMembers = [...currentMembers, key];
      groups = groups.insert(group, updatedMembers);
    } else {
      groups = groups.insert(group, [key]);
    }
  });
  
  return groups;
}

const ageGroups = calculateAgeGroups(users);
console.log(ageGroups.get("20s"));  // ["bob"]
console.log(ageGroups.get("30s"));  // ["alice", "charlie"]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Functional Transformation Patterns</Label>
              <ul>
                <li>
                  <strong>Data Projection:</strong> Extract specific properties
                  from complex objects
                </li>
                <li>
                  <strong>Data Enrichment:</strong> Add computed properties to
                  values
                </li>
                <li>
                  <strong>Filtering:</strong> Remove entries that don't match
                  criteria
                </li>
                <li>
                  <strong>Grouping:</strong> Organize data into categories or
                  buckets
                </li>
                <li>
                  <strong>Pipeline Processing:</strong> Chain multiple
                  transformations
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Transformations are a powerful way to derive new data from
              existing maps. By focusing on what the data should become, rather
              than how to update it, you create more declarative, maintainable
              code with less room for bugs.
            </SmallText>
          </>
        )}

        {activeCategory === "performance" && (
          <>
            <InfoBox>
              HashMap balances immutability with performance through structural
              sharing and WebAssembly acceleration. Understanding its
              performance characteristics helps you use it effectively in your
              applications.
            </InfoBox>

            <FormGroup>
              <Label>Performance Considerations</Label>
              <ul>
                <li>
                  <strong>Structural Sharing:</strong> HashMap reuses parts of
                  the original data structure when creating modified copies
                </li>
                <li>
                  <strong>WASM Acceleration:</strong> Performance-critical
                  operations run in WebAssembly when available
                </li>
                <li>
                  <strong>Memory Usage:</strong> Typically higher than mutable
                  maps due to preserving multiple versions
                </li>
                <li>
                  <strong>Operation Complexity:</strong> HashMap operations have
                  predictable performance characteristics
                </li>
                <li>
                  <strong>JavaScript Integration:</strong> Conversion to/from
                  JavaScript objects has performance implications
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Operation Performance Characteristics</Label>
              <table>
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Time Complexity</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>get, contains, insert, remove</td>
                    <td>O(1) average</td>
                    <td>Constant time lookup and modification</td>
                  </tr>
                  <tr>
                    <td>size, isEmpty</td>
                    <td>O(1)</td>
                    <td>Constant time size check</td>
                  </tr>
                  <tr>
                    <td>keys, values, entries</td>
                    <td>O(n)</td>
                    <td>Linear time collection creation</td>
                  </tr>
                  <tr>
                    <td>map, filter, forEach</td>
                    <td>O(n)</td>
                    <td>Linear time iteration operations</td>
                  </tr>
                  <tr>
                    <td>extend</td>
                    <td>O(m) where m is size of second map</td>
                    <td>Merging maps is proportional to second map size</td>
                  </tr>
                </tbody>
              </table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashMap } from "milost";

// Performance optimization strategies

// 1. Batch modifications instead of incremental ones
function inefficient(data) {
  let map = HashMap.empty();
  
  // Inefficient: creates many intermediate maps
  for (const [key, value] of Object.entries(data)) {
    map = map.insert(key, value);
  }
  
  return map;
}

function efficient(data) {
  // Efficient: creates a single map from all entries
  return HashMap.from(Object.entries(data));
}

// 2. Avoid unnecessary conversions between HashMap and JS objects
function inefficient2(map, keys) {
  // Inefficient: converts to object, modifies, converts back
  const obj = Object.fromEntries(map.entries().toArray());
  
  for (const key of keys) {
    delete obj[key];
  }
  
  return HashMap.from(Object.entries(obj));
}

function efficient2(map, keys) {
  // Efficient: stays within HashMap operations
  let result = map;
  
  for (const key of keys) {
    result = result.remove(key);
  }
  
  return result;
}

// 3. Use the appropriate data structure for the task
// HashMap is great for:
// - Keyed lookup with frequent modifications
// - Associating metadata with identifiers
// - Building lookup tables

// Consider alternatives when:
// - Your keys are sequential integers (use Vec instead)
// - You need ordered iteration by key (use a sorted array of entries)
// - You're storing huge amounts of data with rare modifications

// 4. Reuse common map structures
const baseConfig = HashMap.from([
  ["timeout", 1000],
  ["retries", 3],
  ["baseUrl", "https://api.example.com"]
]);

// Instead of creating completely new maps, extend the base one
function getConfig(environment) {
  const envSpecific = HashMap.from([
    ["environment", environment],
    ["baseUrl", environment === "prod" 
      ? "https://api.example.com" 
      : "https://test-api.example.com"]
  ]);
  
  return baseConfig.extend(envSpecific);
}`}</Pre>
            </CodeBlock>

            <SmallText>
              While HashMap has some performance overhead compared to mutable
              JavaScript objects, this is often outweighed by the benefits of
              immutability: predictable code, easier debugging, and fewer bugs.
              Modern techniques like structural sharing and WASM acceleration
              minimize this overhead in most scenarios.
            </SmallText>
          </>
        )}
      </Card>

      <Card>
        <CardTitle>HashMap API Examples</CardTitle>

        <CodeBlock>
          <Pre>{`import { HashMap } from "milost";

// Create a hash map from entries
const userMap = HashMap.from([
  ["id", 1],
  ["name", "John Doe"],
  ["email", "john@example.com"],
  ["isActive", true]
]);

// Create an empty hash map
const emptyMap = HashMap.empty();
console.log(emptyMap.isEmpty());  // true

// Get a value by key
console.log(userMap.get("name"));         // "John Doe"
console.log(userMap.get("unknown"));      // undefined

// Check if a key exists
console.log(userMap.contains("email"));   // true
console.log(userMap.contains("age"));     // false

// Insert a new key-value pair (returns a new HashMap)
const updatedMap = userMap.insert("age", 30);
console.log(updatedMap.get("age"));       // 30
console.log(userMap.get("age"));          // undefined (original unchanged)

// Remove a key (returns a new HashMap)
const withoutEmail = userMap.remove("email");
console.log(withoutEmail.contains("email"));  // false
console.log(userMap.contains("email"));       // true (original unchanged)

// Get all keys
const keys = userMap.keys();
console.log(keys.toArray());              // ["id", "name", "email", "isActive"]

// Get all values
const values = userMap.values();
console.log(values.toArray());            // [1, "John Doe", "john@example.com", true]

// Get all entries
const entries = userMap.entries();
console.log(entries.toArray());           // [["id", 1], ["name", "John Doe"], ...]

// Map values
const mapped = userMap.map((value, key) => {
  if (typeof value === "number") return value * 2;
  if (typeof value === "string") return value.toUpperCase();
  return value;
});
console.log(mapped.get("id"));            // 2
console.log(mapped.get("name"));          // "JOHN DOE"

// Filter entries
const stringValues = userMap.filter((value, key) => 
  typeof value === "string"
);
console.log(stringValues.keys().toArray()); // ["name", "email"]

// Find the first matching entry
const found = userMap.find((value, key) => 
  typeof value === "boolean"
);
console.log(found);                       // ["isActive", true]

// Iterate over entries
userMap.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});

// Combine multiple hash maps (returns a new HashMap)
const extraInfo = HashMap.from([
  ["age", 35],
  ["location", "New York"]
]);
const combined = userMap.extend(extraInfo);
console.log(combined.get("location"));    // "New York"

// Convert to array of entries
const asArray = userMap.toArray();
console.log(asArray);                     // [["id", 1], ["name", "John Doe"], ...]

// Create a HashMap with complex key types (using string serialization)
const complexMap = HashMap.from([
  ["user:1", { name: "Alice", role: "admin" }],
  ["user:2", { name: "Bob", role: "user" }]
]);

// String representation (for debugging)
console.log(userMap.toString());          // [HashMap size=4]`}</Pre>
        </CodeBlock>

        <SmallText>
          MiLost's HashMap class provides a type-safe, immutable hash map
          implementation with WASM acceleration when available. All operations
          return new hash map instances instead of modifying the original,
          making it perfect for state management and data transformation.
        </SmallText>
      </Card>
    </Container>
  );
}

export default HashMapPage;
