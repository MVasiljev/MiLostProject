import { useState } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  TabsContainer,
  Tab,
  Card,
  CardTitle,
  InfoBox,
  FormGroup,
  Label,
  Table,
  CodeBlock,
  Pre,
  SmallText,
} from "./SmartPointers.styles";

function SmartPointersPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "arc", label: "Arc" },
    { id: "rc", label: "Rc" },
    { id: "box", label: "Box" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Smart Pointers</Title>
        <Subtitle>
          Model ownership, borrowing, and safe mutation with Rust-inspired smart
          pointers — powered by WebAssembly for predictable and performant
          memory management.
        </Subtitle>
      </Header>

      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <Card>
        <CardTitle>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </CardTitle>

        {activeTab === "overview" && (
          <>
            <InfoBox>
              Smart pointers manage access to values with ownership rules,
              reference counting, or interior mutability — enabling safe and
              expressive memory control inside WebAssembly.
            </InfoBox>
            <FormGroup>
              <Label>What’s Included?</Label>
              <ul>
                <li>
                  <strong>Arc</strong>: Thread-safe reference-counted shared
                  ownership
                </li>
                <li>
                  <strong>Rc</strong>: Non-thread-safe reference-counted
                  ownership
                </li>
                <li>
                  <strong>Box</strong>: Heap allocation with ownership transfer
                </li>
              </ul>
            </FormGroup>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>
                  Ownership and borrowing improve predictability and safety.
                </li>
                <li>Reference counting enables shared responsibility.</li>
                <li>Heap allocation gives explicit memory boundaries.</li>
              </ul>
            </FormGroup>
            <Label>When to Use Smart pointers</Label>
            <Table>
              <thead>
                <tr>
                  <th>Use when you need...</th>
                  <th>Instead of...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shared ownership across threads</td>
                  <td>Manual cloning, global caches</td>
                </tr>
                <tr>
                  <td>Ownership with reference safety</td>
                  <td>Raw objects with aliasing bugs</td>
                </tr>
                <tr>
                  <td>Controlled heap memory</td>
                  <td>JS object references without move semantics</td>
                </tr>
              </tbody>
            </Table>
            <CodeBlock>
              <Pre>{`import { createBox } from "milost";

const boxed = createBox(42);
console.log(boxed.get()); // 42`}</Pre>
            </CodeBlock>
            <SmallText>
              These abstractions are not just educational — they offer true
              structural memory control, helping you build performant systems
              that reflect real-world ownership semantics.
            </SmallText>
          </>
        )}

        {activeTab === "arc" && (
          <>
            <InfoBox>
              <code>Arc</code> allows shared ownership of data across multiple
              parts of your program, while automatically tracking references.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Automatic reference counting across threads.</li>
                <li>Memory is deallocated only when no references remain.</li>
                <li>Safer concurrency with internal locking.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createArc } from "milost";

const shared = createArc({ counter: 0 });
const value = shared.get();
console.log(value.counter);`}</Pre>
            </CodeBlock>
            <SmallText>
              Perfect for scenarios where shared immutable or read-mostly state
              is needed between closures or concurrent flows.
            </SmallText>
          </>
        )}

        {activeTab === "rc" && (
          <>
            <InfoBox>
              <code>Rc</code> provides reference-counted shared access in
              single-threaded environments.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Reference counting without thread synchronization.</li>
                <li>Safe shared access without global scope.</li>
                <li>Efficient and ergonomic in sequential tasks.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createRc } from "milost";

const cell = createRc([1, 2, 3]);
console.log(cell.get());`}</Pre>
            </CodeBlock>
            <SmallText>
              Ideal for functionally structured flows or UI state where thread
              safety is not required.
            </SmallText>
          </>
        )}

        {activeTab === "box" && (
          <>
            <InfoBox>
              <code>Box</code> provides heap-allocated memory for values that
              need to be moved, cloned, or wrapped safely.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Gives explicit control over heap memory use.</li>
                <li>Supports copying, taking, and replacing values cleanly.</li>
                <li>
                  Reflects how Rust manages values with <code>{`Box<T>`}</code>.
                </li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createBox } from "milost";

const box = createBox("hello");
console.log(box.get());
box.set("updated");
console.log(box.get());`}</Pre>
            </CodeBlock>
            <SmallText>
              Useful when building abstractions that benefit from owned
              encapsulation and movement of values.
            </SmallText>
          </>
        )}

        {activeTab === "examples" && (
          <>
            <InfoBox>
              A combined example using <code>Arc</code>, <code>Rc</code>, and{" "}
              <code>Box</code> to show how smart pointers interoperate to manage
              complex ownership scenarios.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>
                  Composition of pointer types supports real-world modeling.
                </li>
                <li>
                  Enforces access discipline across layers of abstraction.
                </li>
                <li>Makes mutation explicit and scoped.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createArc, createRc, createBox } from "milost";

const sharedCounter = createArc({ count: 0 });
const list = createRc(["a", "b"]);
const flag = createBox(true);

console.log(sharedCounter.get(), list.get(), flag.get());`}</Pre>
            </CodeBlock>
            <SmallText>
              You can combine smart pointers to represent real application state
              safely — just like you would in Rust.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default SmartPointersPage;
