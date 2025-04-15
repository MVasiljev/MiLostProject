import { Card, CardTitle, CodeBlock, Pre, SmallText } from "./HashSet.styles";

function HashSetExamples() {
  return (
    <Card>
      <CardTitle>HashSet API Examples</CardTitle>

      <CodeBlock>
        <Pre>
          {`import { HashSet } from "milost";
  
  // Create a HashSet
  const set = HashSet.from([1, 2, 3, "hello", true]);
  
  // Create an empty HashSet
  const emptySet = HashSet.empty();
  console.log(emptySet.isEmpty()); // true
  
  // Check if a HashSet contains a value
  console.log(set.contains("hello")); // true
  console.log(set.contains(4));       // false
  
  // Get the size of a HashSet
  console.log(set.size());            // 5
  
  // Insert a value (immutable - returns new HashSet)
  const newSet = set.insert(4);
  console.log(newSet.size());         // 6
  console.log(set.size());            // 5 (original unchanged)
  
  // Remove a value
  const smallerSet = set.remove("hello");
  console.log(smallerSet.contains("hello")); // false
  
  // Get all values
  const values = set.values();
  console.log(values.toArray());      // [1, 2, 3, "hello", true]
  
  // Map values (applies to each element)
  const mapped = set.map(value => {
    if (typeof value === "number") return value * 2;
    if (typeof value === "string") return value.toUpperCase();
    return value;
  });
  console.log(mapped.values().toArray()); // [2, 4, 6, "HELLO", true]
  
  // Filter values
  const numbers = set.filter(value => typeof value === "number");
  console.log(numbers.values().toArray()); // [1, 2, 3]
  
  // Set Operations
  const set1 = HashSet.from([1, 2, 3]);
  const set2 = HashSet.from([3, 4, 5]);
  
  // Union: all elements from both sets
  const union = set1.union(set2);
  console.log(union.values().toArray()); // [1, 2, 3, 4, 5]
  
  // Intersection: elements common to both sets
  const intersection = set1.intersection(set2);
  console.log(intersection.values().toArray()); // [3]
  
  // Difference: elements in first set but not in second
  const difference = set1.difference(set2);
  console.log(difference.values().toArray()); // [1, 2]
  
  // Symmetric Difference: elements in either set but not in both
  const symDiff = set1.symmetricDifference(set2);
  console.log(symDiff.values().toArray()); // [1, 2, 4, 5]
  
  // Check if one set is a subset of another
  console.log(set1.isSubset(union)); // true
  
  // Check if one set is a superset of another
  console.log(union.isSuperset(set1)); // true`}
        </Pre>
      </CodeBlock>

      <SmallText>
        MiLost's HashSet provides a Rust-like, immutable set implementation with
        efficient lookup, insertion, and removal. All operations create new
        instances rather than modifying the original, making it suitable for
        functional programming patterns.
      </SmallText>
    </Card>
  );
}

export default HashSetExamples;
