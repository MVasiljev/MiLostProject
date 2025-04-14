import { CodeBlock, Pre, SmallText } from "./HashMap.styles";

const HashMapApiExamples: React.FC = () => {
  return (
    <>
      <CodeBlock>
        <Pre>
          {`import { HashMap } from "milost";

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
console.log(userMap.toString());          // [HashMap size=4]`}
        </Pre>
      </CodeBlock>

      <SmallText>
        MiLost's HashMap class provides a type-safe, immutable hash map
        implementation with WASM acceleration when available. All operations
        return new hash map instances instead of modifying the original, making
        it perfect for state management and data transformation.
      </SmallText>
    </>
  );
};

export default HashMapApiExamples;
