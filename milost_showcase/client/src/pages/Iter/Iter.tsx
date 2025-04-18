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
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Iter.styles";
import { InfoBox, Table } from "../Vector/Vector.styles";

function IterPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "creation", label: "Creating Iterators" },
    { id: "transform", label: "Transformations" },
    { id: "filter", label: "Filtering" },
    { id: "find", label: "Finding" },
    { id: "utility", label: "Utility Methods" },
    { id: "collect", label: "Collecting Results" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Iterator Operations</Title>
        <Subtitle>
          Learn to work with lazy, functional iterators in MiLost for
          high-performance sequence processing.
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
              The <code>Iter</code> class in MiLost is a Rust-inspired,
              lazily-evaluated iterator interface. It's designed to handle large
              sequences with minimal memory usage.
            </InfoBox>

            <FormGroup>
              <Label>Why Iterators?</Label>
              <ul>
                <li>They process data only when needed (lazy evaluation)</li>
                <li>Composability: chain multiple operations safely</li>
                <li>WASM acceleration for speed</li>
                <li>No side effects, no mutation</li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>
                Use <code>Iter</code> when...
              </Label>
              <Table>
                <thead>
                  <tr>
                    <th>You want to...</th>
                    <th>
                      Use <code>Iter</code> instead of...
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Process large data lazily</td>
                    <td>
                      <code>Array.map/filter</code> which processes eagerly
                    </td>
                  </tr>
                  <tr>
                    <td>Chain operations without memory overhead</td>
                    <td>Multiple chained array copies</td>
                  </tr>
                  <tr>
                    <td>Build transformation pipelines</td>
                    <td>Nested loops or imperative logic</td>
                  </tr>
                  <tr>
                    <td>Work with WASM-native types</td>
                    <td>Standard JS collections</td>
                  </tr>
                  <tr>
                    <td>Use functional-style iteration with safety</td>
                    <td>Mutable for-loops</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Iter } from "milost";

const iter = Iter.from([1, 2, 3, 4, 5]);
const doubled = iter.map(x => x * 2);
const evens = doubled.filter(x => x % 2 === 0);
const result = evens.collect();

console.log(result.toArray()); // [2, 4, 6, 8, 10]`}</Pre>
            </CodeBlock>

            <SmallText>
              Iterators help you write clear, efficient, and immutable
              transformations on data — ideal for data pipelines and functional
              design patterns.
            </SmallText>
          </>
        )}

        {activeCategory === "creation" && (
          <>
            <InfoBox>
              MiLost provides multiple ways to construct iterators from arrays,
              vectors, or numeric ranges.
            </InfoBox>

            <FormGroup>
              <Label>Construction Methods</Label>
              <ul>
                <li>
                  <code>Iter.from([1, 2, 3])</code>: Create from an array
                </li>
                <li>
                  <code>Iter.fromVec(Vec.from([...]))</code>: From a MiLost Vec
                </li>
                <li>
                  <code>Iter.range(start, end)</code>: Range-based iterator
                </li>
                <li>
                  <code>Iter.empty()</code>: Empty iterator
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Iter, Vec } from "milost";

const arrIter = Iter.from([10, 20, 30]);
const vecIter = Iter.fromVec(Vec.from([1, 2, 3]));
const rangeIter = Iter.range(0, 5);  // [0, 1, 2, 3, 4]
const empty = Iter.empty();

console.log(arrIter.collect().toArray()); // [10, 20, 30]`}</Pre>
            </CodeBlock>

            <SmallText>
              Range-based iterators are ideal for indexed loops or testing,
              while <code>fromVec</code> is optimized for WASM-native data.
            </SmallText>
          </>
        )}

        {activeCategory === "transform" && (
          <>
            <InfoBox>
              Transform your iterator values without mutating them. All methods
              return a new iterator and preserve laziness.
            </InfoBox>

            <FormGroup>
              <Label>Transform Methods</Label>
              <ul>
                <li>
                  <code>.map(fn)</code>: Transform each element
                </li>
                <li>
                  <code>.take(n)</code>: Take first <code>n</code> items
                </li>
                <li>
                  <code>.skip(n)</code>: Skip first <code>n</code> items
                </li>
                <li>
                  <code>.enumerate()</code>: Add index as [index, value]
                </li>
                <li>
                  <code>.zip(other)</code>: Pair elements with another iterator
                </li>
                <li>
                  <code>.chain(other)</code>: Concatenate two iterators
                </li>
                <li>
                  <code>.flatMap(fn)</code>: Expand and flatten each result
                </li>
                <li>
                  <code>.chunks(size)</code>: Split into fixed-sized groups
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`const base = Iter.from([1, 2, 3, 4]);

const zipped = base.zip(Iter.range(10, 14));
const chained = base.chain(Iter.from([99, 100]));
const flat = base.flatMap(x => [x, x * 2]);
const chunked = base.chunks(2);

console.log(zipped.collect().toArray());   // [[1, 10], [2, 11], ...]
console.log(chained.collect().toArray());  // [1, 2, 3, 4, 99, 100]
console.log(flat.collect().toArray());     // [1, 2, 2, 4, 3, 6, 4, 8]
console.log(chunked.collect().toArray());  // [[1, 2], [3, 4]]`}</Pre>
            </CodeBlock>

            <SmallText>
              You can chain any of these transforms to build expressive and lazy
              pipelines.
            </SmallText>
          </>
        )}

        {activeCategory === "filter" && (
          <>
            <InfoBox>
              Filter your iterator data with standard or custom logic.
            </InfoBox>

            <FormGroup>
              <Label>Filtering Methods</Label>
              <ul>
                <li>
                  <code>.filter(fn)</code>: Keep only matching values
                </li>
                <li>
                  <code>.dedup()</code>: Remove consecutive duplicates
                </li>
                <li>
                  <code>.dedupBy(fn)</code>: Deduplicate by custom key
                </li>
                <li>
                  <code>.intersperse(separator)</code>: Insert value between
                  each item
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`const data = Iter.from([1, 2, 2, 3, 4, 4]);

const filtered = data.filter(x => x > 2);
const deduped = data.dedup();
const dedupedBy = Iter.from([{ id: 1 }, { id: 1 }, { id: 2 }]).dedupBy(x => x.id);
const interspersed = Iter.from(["a", "b", "c"]).intersperse("-");

console.log(filtered.collect().toArray()); // [3, 4, 4]
console.log(deduped.collect().toArray());  // [1, 2, 3, 4]
console.log(dedupedBy.collect().toArray()); // [{id:1}, {id:2}]
console.log(interspersed.collect().toArray()); // ["a", "-", "b", "-", "c"]`}</Pre>
            </CodeBlock>

            <SmallText>
              <code>dedup()</code> only removes consecutive duplicates — sort if
              needed.
            </SmallText>
          </>
        )}

        {activeCategory === "find" && (
          <>
            <InfoBox>
              Search or locate values without consuming the entire iterator.
            </InfoBox>

            <FormGroup>
              <Label>Find & Access Methods</Label>
              <ul>
                <li>
                  <code>.find(fn)</code>: First matching element
                </li>
                <li>
                  <code>.first()</code>: First element (same as .nth(0))
                </li>
                <li>
                  <code>.last()</code>: Last element (consumes iterator)
                </li>
                <li>
                  <code>.nth(n)</code>: Element at specific index
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`const base = Iter.from([1, 2, 3, 4, 5]);

const even = base.find(x => x % 2 === 0);  // 2
const first = base.first();               // 1
const last = base.last();                 // 5
const third = base.nth(2);                // 3`}</Pre>
            </CodeBlock>

            <SmallText>
              These methods consume the iterator. Use <code>.collect()</code> to
              inspect values afterward if needed.
            </SmallText>
          </>
        )}

        {activeCategory === "utility" && (
          <>
            <InfoBox>
              Utility methods provide aggregation, side effects, and more.
            </InfoBox>

            <FormGroup>
              <Label>Utility Methods</Label>
              <ul>
                <li>
                  <code>.next()</code>: Advance one item
                </li>
                <li>
                  <code>.forEach(fn)</code>: Apply function to each
                </li>
                <li>
                  <code>.all(fn)</code>: Returns true if all match
                </li>
                <li>
                  <code>.any(fn)</code>: Returns true if any match
                </li>
                <li>
                  <code>.count()</code>: Number of elements
                </li>
                <li>
                  <code>.fold(init, fn)</code>: Combine into final value
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`const items = Iter.from([1, 2, 3]);

let result = 0;
items.forEach(x => result += x);
console.log(result); // 6

const allEven = Iter.from([2, 4, 6]).all(x => x % 2 === 0); // true
const sum = Iter.from([1, 2, 3]).fold(0, (acc, x) => acc + x); // 6`}</Pre>
            </CodeBlock>

            <SmallText>
              Prefer <code>fold()</code> for reducing to a single result; it's
              safe and expressive.
            </SmallText>
          </>
        )}

        {activeCategory === "collect" && (
          <>
            <InfoBox>
              Collect the results of a lazy iterator into a full MiLost Vec.
            </InfoBox>

            <FormGroup>
              <Label>Collecting</Label>
              <ul>
                <li>
                  <code>.collect()</code>: Eagerly resolve the iterator into a
                  Vec
                </li>
                <li>
                  <code>.toArray()</code>: Extract plain JavaScript array
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`const iter = Iter.range(0, 4);
const vec = iter.collect();
console.log(vec.toArray()); // [0, 1, 2, 3]`}</Pre>
            </CodeBlock>

            <SmallText>
              Use <code>collect()</code> to finalize a chain and materialize
              results.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              A full pipeline example using many iterator features.
            </InfoBox>

            <CodeBlock>
              <Pre>{`const result = Iter.range(1, 10)
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
  .chunks(2)
  .intersperse([-1])
  .flatMap(x => x)
  .collect();

console.log(result.toArray());
// [20, 40, -1, 60, 80, -1]`}</Pre>
            </CodeBlock>

            <SmallText>
              This demonstrates the power of chaining lazy operations in a clean
              and efficient way.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default IterPage;
