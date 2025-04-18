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
} from "./HashSet.styles";
import { Table } from "../Vector/Vector.styles";

function HashSetPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "creating", label: "Creating & Checking" },
    { id: "modifying", label: "Modifying" },
    { id: "transforming", label: "Transformations" },
    { id: "operations", label: "Set Operations" },
    { id: "patterns", label: "Usage Patterns" },
  ];

  return (
    <Container>
      <Header>
        <Title>HashSet Collection</Title>
        <Subtitle>
          Immutable, type-safe set implementation with WASM acceleration
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
              The <code>HashSet</code> type is MiLost's immutable set
              implementation. It provides a collection for storing unique values
              with efficient membership testing and set operations.
            </InfoBox>

            <FormGroup>
              <Label>Key Features</Label>
              <ul>
                <li>
                  <strong>Immutable:</strong> All operations return new sets
                  instead of modifying the original
                </li>
                <li>
                  <strong>Unique Values:</strong> Automatically ensures each
                  value occurs only once
                </li>
                <li>
                  <strong>Efficient:</strong> O(1) average time for contains,
                  insert, and remove operations
                </li>
                <li>
                  <strong>Set Operations:</strong> Union, intersection,
                  difference, and more
                </li>
                <li>
                  <strong>Performance:</strong> WASM acceleration for set
                  operations when available
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>When to Use HashSet</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Use HashSet when you need...</th>
                    <th>Instead of...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fast membership testing</td>
                    <td>Linear search through arrays</td>
                  </tr>
                  <tr>
                    <td>Eliminating duplicates</td>
                    <td>Manual filtering and tracking unique items</td>
                  </tr>
                  <tr>
                    <td>Efficient set operations</td>
                    <td>Complex, manual array comparisons</td>
                  </tr>
                  <tr>
                    <td>Tracking visited/processed items</td>
                    <td>Manual tracking with additional data structures</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

// Create a set of unique values
const numbers = HashSet.from([1, 2, 3, 2, 1]);
console.log(numbers.size());  // 3 (duplicates removed)

// Check membership efficiently
console.log(numbers.contains(2));  // true
console.log(numbers.contains(5));  // false

// Add and remove values (immutably)
const withFour = numbers.insert(4);
console.log(withFour.size());       // 4
console.log(numbers.size());        // 3 (original unchanged)

const withoutTwo = numbers.remove(2);
console.log(withoutTwo.contains(2));  // false

// Set operations
const set1 = HashSet.from([1, 2, 3]);
const set2 = HashSet.from([3, 4, 5]);

const union = set1.union(set2);
console.log(union.values().toArray());  // [1, 2, 3, 4, 5]

const intersection = set1.intersection(set2);
console.log(intersection.values().toArray());  // [3]

const difference = set1.difference(set2);
console.log(difference.values().toArray());  // [1, 2]`}</Pre>
            </CodeBlock>

            <SmallText>
              HashSet provides an efficient way to work with collections of
              unique values. Its immutable nature ensures predictable behavior
              and makes it easy to reason about your code.
            </SmallText>
          </>
        )}

        {activeCategory === "creating" && (
          <>
            <InfoBox>
              HashSet provides multiple ways to create sets and check their
              contents. Creating with existing values automatically removes
              duplicates.
            </InfoBox>

            <FormGroup>
              <Label>Creating HashSets</Label>
              <ul>
                <li>
                  <strong>HashSet.from(values)</strong>: Create a set from any
                  iterable
                </li>
                <li>
                  <strong>HashSet.empty()</strong>: Create an empty set
                </li>
                <li>
                  <strong>existingSet.insert(value)</strong>: Add to existing
                  set
                </li>
                <li>
                  <strong>existingSet.union(otherSet)</strong>: Combine sets
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Checking Set Contents</Label>
              <ul>
                <li>
                  <strong>set.contains(value)</strong>: Check if a value exists
                  in the set
                </li>
                <li>
                  <strong>set.size()</strong>: Get the number of unique elements
                </li>
                <li>
                  <strong>set.isEmpty()</strong>: Check if the set has no
                  elements
                </li>
                <li>
                  <strong>set.values()</strong>: Get a vector of all values
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

// Create from values (duplicates automatically removed)
const fruits = HashSet.from(["apple", "banana", "apple", "cherry"]);
console.log(fruits.size());  // 3 (duplicate "apple" removed)

// Create an empty set
const emptySet = HashSet.empty();
console.log(emptySet.isEmpty());  // true

// Create incrementally
let colors = HashSet.empty();
colors = colors.insert("red");
colors = colors.insert("blue");
colors = colors.insert("green");
console.log(colors.size());  // 3

// Create from other iterables
const numbersSet = HashSet.from(new Set([1, 2, 3]));
const fromArray = HashSet.from([4, 5, 6]);
const fromMap = HashSet.from(new Map([["a", 1], ["b", 2]]).values());

// Check membership
console.log(fruits.contains("banana"));  // true
console.log(fruits.contains("orange"));  // false

// Get all values
const allFruits = fruits.values().toArray();
console.log(allFruits);  // ["apple", "banana", "cherry"]

// Use with different value types
const mixedSet = HashSet.from([
  1,
  "hello",
  true,
  { id: 1 }, // Note: object identity, not structural equality
]);

console.log(mixedSet.contains("hello"));  // true
console.log(mixedSet.contains({ id: 1 }));  // false (different object identity)

// Track visited items in an algorithm
function findPaths(graph, start, end) {
  const paths = [];
  
  function dfs(current, visited, path) {
    // Add current node to visited set (immutably)
    const newVisited = visited.insert(current);
    const newPath = [...path, current];
    
    if (current === end) {
      paths.push(newPath);
      return;
    }
    
    for (const neighbor of graph[current] || []) {
      // Only explore unvisited nodes
      if (!newVisited.contains(neighbor)) {
        dfs(neighbor, newVisited, newPath);
      }
    }
  }
  
  dfs(start, HashSet.empty(), []);
  return paths;
}

const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D', 'E'],
  'C': ['A', 'F'],
  'D': ['B'],
  'E': ['B', 'F'],
  'F': ['C', 'E']
};

const paths = findPaths(graph, 'A', 'F');
console.log(paths);  // Paths from A to F: [['A', 'C', 'F'], ['A', 'B', 'E', 'F']]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Best Practices for Creating and Checking</Label>
              <ol>
                <li>
                  Use <code>HashSet.from()</code> to automatically deduplicate
                  values
                </li>
                <li>
                  Always check if a value exists with <code>contains()</code>{" "}
                  before making decisions
                </li>
                <li>
                  Remember that object equality is by reference, not value
                </li>
                <li>
                  Use <code>values().toArray()</code> when you need to work with
                  all values
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              HashSet provides efficient membership testing with O(1) average
              time complexity. This makes it ideal for scenarios where you need
              to frequently check if an element exists in a collection.
            </SmallText>
          </>
        )}

        {activeCategory === "modifying" && (
          <>
            <InfoBox>
              HashSet is immutable, so operations that would modify a mutable
              set instead return a new HashSet instance with the requested
              changes.
            </InfoBox>

            <FormGroup>
              <Label>Modification Operations</Label>
              <ul>
                <li>
                  <strong>set.insert(value)</strong>: Add a value (if not
                  already present)
                </li>
                <li>
                  <strong>set.remove(value)</strong>: Remove a value
                </li>
                <li>
                  <strong>set.clear()</strong>: Remove all values
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

// Start with a base set
const numbers = HashSet.from([1, 2, 3]);

// Insert a value (returns a new set)
const withFour = numbers.insert(4);
console.log(numbers.size());    // 3 (original unchanged)
console.log(withFour.size());   // 4 (new set with 4)

// Insert an existing value (no effect)
const stillThree = numbers.insert(2);
console.log(stillThree.size()); // 3 (no duplicate added)

// Check the result of an insert
const result = numbers.insert(5);
const wasAdded = !numbers.contains(5) && result.contains(5);
console.log(wasAdded);  // true - the value was actually added

// Remove a value
const withoutTwo = numbers.remove(2);
console.log(numbers.contains(2));     // true (original unchanged)
console.log(withoutTwo.contains(2));  // false (value removed)

// Remove a non-existent value (no effect)
const unchanged = numbers.remove(10);
console.log(unchanged.size());  // 3 (same as original)

// Clear all values
const empty = numbers.clear();
console.log(empty.isEmpty());  // true
console.log(numbers.isEmpty());  // false (original unchanged)

// Building a set incrementally
function buildTagSet(items) {
  let tags = HashSet.empty();
  
  for (const item of items) {
    for (const tag of item.tags) {
      tags = tags.insert(tag);
    }
  }
  
  return tags;
}

const items = [
  { id: 1, tags: ["red", "large", "new"] },
  { id: 2, tags: ["blue", "small", "new"] },
  { id: 3, tags: ["red", "small", "sale"] }
];

const allTags = buildTagSet(items);
console.log(allTags.values().toArray());  
// ["red", "large", "new", "blue", "small", "sale"]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Immutable Update Patterns</Label>
              <ul>
                <li>
                  <strong>Single Insert/Remove:</strong> Use for simple updates
                </li>
                <li>
                  <strong>Batch Processing:</strong> For multiple values,
                  consider array operations then HashSet.from()
                </li>
                <li>
                  <strong>Set Building:</strong> Incrementally build sets by
                  capturing the return value
                </li>
                <li>
                  <strong>Safe Guard:</strong> Verify changes actually occurred
                  when needed
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              The immutable nature of HashSet ensures that you can pass sets
              around your application without worrying about unexpected
              modifications. Each update creates a new version, maintaining the
              integrity of the original data.
            </SmallText>
          </>
        )}

        {activeCategory === "transforming" && (
          <>
            <InfoBox>
              HashSet supports powerful functional transformations that create
              new sets by applying operations to existing ones. These follow
              functional programming principles and preserve immutability.
            </InfoBox>

            <FormGroup>
              <Label>Transformation Operations</Label>
              <ul>
                <li>
                  <strong>set.map(mapFn)</strong>: Create a new set by
                  transforming each value
                </li>
                <li>
                  <strong>set.filter(predicate)</strong>: Keep only values that
                  satisfy a condition
                </li>
                <li>
                  <strong>set.find(predicate)</strong>: Find the first value
                  that satisfies a condition
                </li>
                <li>
                  <strong>set.forEach(callback)</strong>: Execute a function for
                  each value
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

const numbers = HashSet.from([1, 2, 3, 4, 5]);

// Transform each value with map
const doubled = numbers.map(n => n * 2);
console.log(doubled.values().toArray());  // [2, 4, 6, 8, 10]

// Note: Map automatically handles duplicates
const modByThree = numbers.map(n => n % 3);
console.log(modByThree.values().toArray());  // [1, 2, 0]
// Not [1, 2, 0, 1, 2] because duplicates are removed

// Filter values
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens.values().toArray());  // [2, 4]

// Find the first matching element
const greaterThanThree = numbers.find(n => n > 3);
console.log(greaterThanThree);  // 4

// Process all values
numbers.forEach(value => {
  console.log(\`Value: \${value}\`);
});

// Complex transformations
const people = HashSet.from([
  { name: "Alice", age: 30, role: "developer" },
  { name: "Bob", age: 25, role: "designer" },
  { name: "Charlie", age: 35, role: "manager" },
  { name: "Diana", age: 28, role: "developer" }
]);

// Get a set of all roles
const roles = people.map(person => person.role);
console.log(roles.values().toArray());  // ["developer", "designer", "manager"]
// Note: "developer" only appears once (duplicates removed)

// Filter to people over 30
const over30 = people.filter(person => person.age > 30);
console.log(over30.size());  // 1 (only Charlie)

// Advanced: Type conversion with map
const stringSet = HashSet.from(["1", "2", "3", "4"]);
const numberSet = stringSet.map(str => parseInt(str, 10));
console.log(numberSet.values().toArray());  // [1, 2, 3, 4]

// Detecting unique property values
function getUniquePropertyValues(items, propertyName) {
  return HashSet.from(items.map(item => item[propertyName]));
}

const products = [
  { name: "Laptop", category: "Electronics" },
  { name: "Phone", category: "Electronics" },
  { name: "Desk", category: "Furniture" },
  { name: "Chair", category: "Furniture" }
];

const categories = getUniquePropertyValues(products, "category");
console.log(categories.values().toArray());  // ["Electronics", "Furniture"]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Transformation Patterns</Label>
              <ul>
                <li>
                  <strong>Deduplication:</strong> Use map to normalize and
                  deduplicate values
                </li>
                <li>
                  <strong>Property Extraction:</strong> Extract unique property
                  values from objects
                </li>
                <li>
                  <strong>Type Conversion:</strong> Convert between value types
                  while maintaining uniqueness
                </li>
                <li>
                  <strong>Selective Processing:</strong> Filter to a subset
                  before further operations
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Transformations are a powerful way to derive new sets from
              existing ones. Remember that HashSet automatically deduplicates
              values, so map operations may result in fewer items if the
              transformation creates duplicate values.
            </SmallText>
          </>
        )}

        {activeCategory === "operations" && (
          <>
            <InfoBox>
              HashSet provides a rich set of mathematical set operations like
              union, intersection, and difference. These are powerful tools for
              comparing and combining sets.
            </InfoBox>

            <FormGroup>
              <Label>Set Operations</Label>
              <ul>
                <li>
                  <strong>set1.union(set2)</strong>: All elements in either set
                </li>
                <li>
                  <strong>set1.intersection(set2)</strong>: Only elements in
                  both sets
                </li>
                <li>
                  <strong>set1.difference(set2)</strong>: Elements in set1 but
                  not in set2
                </li>
                <li>
                  <strong>set1.symmetricDifference(set2)</strong>: Elements in
                  either set but not both
                </li>
                <li>
                  <strong>set1.isSubset(set2)</strong>: Check if set1 is a
                  subset of set2
                </li>
                <li>
                  <strong>set1.isSuperset(set2)</strong>: Check if set1 is a
                  superset of set2
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

const set1 = HashSet.from([1, 2, 3, 4]);
const set2 = HashSet.from([3, 4, 5, 6]);

// Union (∪): elements in either set
const union = set1.union(set2);
console.log(union.values().toArray());  // [1, 2, 3, 4, 5, 6]

// Intersection (∩): elements in both sets
const intersection = set1.intersection(set2);
console.log(intersection.values().toArray());  // [3, 4]

// Difference (set1 - set2): elements in set1 but not in set2
const difference = set1.difference(set2);
console.log(difference.values().toArray());  // [1, 2]

// Symmetric Difference (set1 △ set2): elements in either set but not both
const symDiff = set1.symmetricDifference(set2);
console.log(symDiff.values().toArray());  // [1, 2, 5, 6]

// Subset and Superset relationships
const smallSet = HashSet.from([3, 4]);
console.log(smallSet.isSubset(set1));    // true (all elements in smallSet are in set1)
console.log(set1.isSuperset(smallSet));  // true (set1 contains all elements of smallSet)
console.log(set1.isSubset(set2));        // false
console.log(set2.isSubset(set1));        // false

// Practical examples with set operations

// Example 1: Finding common tags between products
const product1Tags = HashSet.from(["electronics", "laptop", "sale"]);
const product2Tags = HashSet.from(["electronics", "desktop", "new"]);

const commonTags = product1Tags.intersection(product2Tags);
console.log(commonTags.values().toArray());  // ["electronics"]

// Example 2: Feature comparison between products
const productA = { id: "A", features: HashSet.from(["wifi", "bluetooth", "usb-c"]) };
const productB = { id: "B", features: HashSet.from(["wifi", "usb-a", "hdmi"]) };
const productC = { id: "C", features: HashSet.from(["wifi", "bluetooth", "hdmi"]) };

// Features unique to product A
const uniqueToA = productA.features.difference(
  productB.features.union(productC.features)
);
console.log(uniqueToA.values().toArray());  // ["usb-c"]

// Example 3: User access control
function hasAccess(userRoles, requiredRoles) {
  // Check if user has any of the required roles
  return !userRoles.intersection(requiredRoles).isEmpty();
}

const userRoles = HashSet.from(["user", "editor"]);
const adminPages = HashSet.from(["admin", "superuser"]);
const editorPages = HashSet.from(["editor", "contributor"]);

console.log(hasAccess(userRoles, adminPages));   // false
console.log(hasAccess(userRoles, editorPages));  // true`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Common Set Operation Patterns</Label>
              <ul>
                <li>
                  <strong>Venn Diagram:</strong> Use intersection to find common
                  elements
                </li>
                <li>
                  <strong>Exclusion:</strong> Use difference to remove unwanted
                  elements
                </li>
                <li>
                  <strong>Combination:</strong> Use union to merge sets
                </li>
                <li>
                  <strong>Relationship Testing:</strong> Use isSubset/isSuperset
                  to check containment
                </li>
                <li>
                  <strong>Uniqueness:</strong> Use symmetricDifference to find
                  elements unique to each set
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Set operations are incredibly powerful for solving problems
              involving group relationships, comparisons, and classifications.
              They provide a mathematical foundation for working with distinct
              collections of items.
            </SmallText>
          </>
        )}

        {activeCategory === "patterns" && (
          <>
            <InfoBox>
              HashSet enables elegant solutions to many common programming
              problems. Understanding these patterns will help you leverage sets
              more effectively in your code.
            </InfoBox>

            <FormGroup>
              <Label>Common HashSet Usage Patterns</Label>
              <ul>
                <li>
                  <strong>Deduplication:</strong> Remove duplicates from
                  collections
                </li>
                <li>
                  <strong>Membership Testing:</strong> Efficient "has" checks
                </li>
                <li>
                  <strong>Tracking Visited States:</strong> Record processed
                  items
                </li>
                <li>
                  <strong>Finding Unique Values:</strong> Extract distinct
                  properties
                </li>
                <li>
                  <strong>Set-based Algorithms:</strong> Express problems in
                  terms of set operations
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { HashSet } from "milost";

// Pattern 1: Deduplication
function removeDuplicates(array) {
  return HashSet.from(array).values().toArray();
}

const duplicates = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicates(duplicates));  // [1, 2, 3, 4, 5]

// Pattern 2: Tracking Visited Items
function findAllPaths(graph, start, end) {
  const paths = [];
  
  function explore(current, visited, path) {
    // Mark current node as visited
    const newVisited = visited.insert(current);
    const newPath = [...path, current];
    
    if (current === end) {
      paths.push(newPath);
      return;
    }
    
    for (const neighbor of graph[current] || []) {
      // Only visit unvisited nodes to avoid cycles
      if (!newVisited.contains(neighbor)) {
        explore(neighbor, newVisited, newPath);
      }
    }
  }
  
  explore(start, HashSet.empty(), []);
  return paths;
}

// Pattern 3: Efficient Lookups
function findCommonElements(array1, array2) {
  const set = HashSet.from(array1);
  return array2.filter(item => set.contains(item));
}

// Much faster than array1.filter(item => array2.includes(item))
// for large arrays due to O(1) vs O(n) lookups

// Pattern 4: Permission System
class PermissionSystem {
  constructor() {
    this.userRoles = new Map(); // username -> HashSet of roles
    this.rolePermissions = new Map(); // role -> HashSet of permissions
  }
  
  addUserRole(username, role) {
    if (!this.userRoles.has(username)) {
      this.userRoles.set(username, HashSet.empty());
    }
    const roles = this.userRoles.get(username);
    this.userRoles.set(username, roles.insert(role));
  }
  
  addRolePermission(role, permission) {
    if (!this.rolePermissions.has(role)) {
      this.rolePermissions.set(role, HashSet.empty());
    }
    const permissions = this.rolePermissions.get(role);
    this.rolePermissions.set(role, permissions.insert(permission));
  }
  
  getUserPermissions(username) {
    if (!this.userRoles.has(username)) {
      return HashSet.empty();
    }
    
    const roles = this.userRoles.get(username);
    let allPermissions = HashSet.empty();
    
    roles.forEach(role => {
      if (this.rolePermissions.has(role)) {
        allPermissions = allPermissions.union(this.rolePermissions.get(role));
      }
    });
    
    return allPermissions;
  }
  
  hasPermission(username, permission) {
    return this.getUserPermissions(username).contains(permission);
  }
}

// Pattern 5: Analyzing Text
function getUniqueWords(text) {
  const words = text.toLowerCase().match(/\\w+/g) || [];
  return HashSet.from(words);
}

const text1 = "The quick brown fox jumps over the lazy dog";
const text2 = "The dog barks at the fox";

const words1 = getUniqueWords(text1);
const words2 = getUniqueWords(text2);

const commonWords = words1.intersection(words2);
console.log(commonWords.values().toArray());  
// ["the", "fox", "dog"]`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Best Practices</Label>
              <ol>
                <li>
                  Use HashSet when you need to frequently check if an item
                  exists
                </li>
                <li>
                  Express set-based algorithms using set operations rather than
                  loops
                </li>
                <li>
                  Leverage sets for tracking state in recursive algorithms
                </li>
                <li>
                  Remember that HashSet uses reference equality for objects
                </li>
                <li>
                  For optimal performance, build a set once rather than
                  incrementally when possible
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              HashSet shines when working with unique values and their
              relationships. By expressing your problem in terms of set
              operations, you can often find elegant, efficient solutions that
              are easier to understand and maintain.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default HashSetPage;
