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
} from "./SyncPrimitives.styles";

function SyncPrimitivesPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "mutex", label: "Mutex" },
    { id: "rwlock", label: "RwLock" },
    { id: "arc_mutex", label: "ArcMutex" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Sync Primitives</Title>
        <Subtitle>
          Learn how to manage shared state safely using Rust-inspired
          synchronization primitives. Backed by WebAssembly, these tools bring
          predictable, thread-safe behavior to JavaScript applications.
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
              Synchronization primitives help you coordinate access to shared
              state — safely and efficiently. Inspired by Rust’s ownership
              model, these abstractions give you fine-grained control without
              risking race conditions.
            </InfoBox>
            <FormGroup>
              <Label>What’s Included?</Label>
              <ul>
                <li>
                  <strong>Mutex</strong>: Exclusive access locking
                </li>
                <li>
                  <strong>RwLock</strong>: Shared (read) and exclusive (write)
                  access
                </li>
                <li>
                  <strong>ArcMutex</strong>: Reference-counted thread-safe state
                </li>
              </ul>
            </FormGroup>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Shared state should be coordinated explicitly.</li>
                <li>
                  Concurrency is safe when access is structured and predictable.
                </li>
                <li>
                  Reduces accidental mutation and improves reasoning about code
                  flow.
                </li>
              </ul>
            </FormGroup>
            <Label>When to Use Sync primitives</Label>
            <Table>
              <thead>
                <tr>
                  <th>Use when you need...</th>
                  <th>Instead of...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Safe interior mutability</td>
                  <td>Global variables, manual state mutation</td>
                </tr>
                <tr>
                  <td>Thread-safe shared access</td>
                  <td>Ad hoc refs, shallow copies</td>
                </tr>
                <tr>
                  <td>Borrow checker-inspired safety</td>
                  <td>Manual JS locks</td>
                </tr>
              </tbody>
            </Table>
            <CodeBlock>
              <Pre>{`import { createMutex } from "milost";

const mutex = createMutex(42);
const value = mutex.lock();
console.log(value); // 42`}</Pre>
            </CodeBlock>
            <SmallText>
              MiLost provides low-level memory coordination primitives like{" "}
              <code>Mutex</code>, <code>RwLock</code>, and <code>ArcMutex</code>
              , modeled after Rust’s proven patterns. These aren’t polyfills —
              they operate inside WebAssembly memory and enforce access
              discipline with zero JavaScript-level race risk.
            </SmallText>
          </>
        )}

        {activeTab === "mutex" && (
          <>
            <InfoBox>
              A <code>Mutex</code> enforces exclusive access to a value. While
              locked, no other code can mutate or read it — ensuring atomic
              updates and preventing inconsistent state.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Only one caller should mutate data at a time.</li>
                <li>Atomic updates guarantee safety under concurrency.</li>
                <li>Helps isolate mutations from side effects.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createMutex } from "milost";

const counter = createMutex(0);
const val = counter.lock();
counter.unlock(val + 1);`}</Pre>
            </CodeBlock>
            <SmallText>
              Use <code>lock()</code> to retrieve a copy of the inner value.
              When done, call <code>unlock(updatedValue)</code> to release it.
              This enforces a clear entry/exit lifecycle for mutations.
            </SmallText>
          </>
        )}

        {activeTab === "rwlock" && (
          <>
            <InfoBox>
              <code>RwLock</code> lets many readers access the value at once,
              but only one writer can hold it exclusively. This improves
              performance when writes are infrequent.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Reading should be concurrent when possible.</li>
                <li>
                  Writing requires exclusive access to ensure consistency.
                </li>
                <li>Improves performance in read-heavy applications.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createRwLock } from "milost";

const config = createRwLock({ theme: "dark" });

const read = config.read();
console.log(read.theme);

config.write({ theme: "light" });`}</Pre>
            </CodeBlock>
            <SmallText>
              Use <code>read()</code> to access the current state, and{" "}
              <code>write(newValue)</code> to mutate it. Writes block readers
              and vice versa.
            </SmallText>
          </>
        )}

        {activeTab === "arc_mutex" && (
          <>
            <InfoBox>
              <code>ArcMutex</code> wraps a <code>Mutex</code> in atomic
              reference counting — allowing safe shared ownership across
              closures and threads.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Ownership can be shared if access is managed safely.</li>
                <li>
                  Reference counting ensures memory is cleaned
                  deterministically.
                </li>
                <li>
                  Supports concurrency without leaks or undefined behavior.
                </li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { createArcMutex } from "milost";

const shared = createArcMutex({ users: 0 });

const locked = shared.lock();
shared.unlock({ users: locked.users + 1 });`}</Pre>
            </CodeBlock>
            <SmallText>
              This mimics Rust’s <code>Arc&lt;Mutex&lt;T&gt;&gt;</code>,
              enabling shared mutability with automatic memory management and
              safety guarantees.
            </SmallText>
          </>
        )}

        {activeTab === "examples" && (
          <>
            <InfoBox>
              Below is a composite example combining <code>Mutex</code>,{" "}
              <code>RwLock</code>, and <code>ArcMutex</code>. Together, they
              offer a complete toolbox for thread-safe, deterministic state
              handling in JavaScript.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>
                  Composing primitives leads to expressive, safe concurrency.
                </li>
                <li>Decouples access control from business logic.</li>
                <li>Prevents mutation bugs across async and closure scopes.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import {
  createMutex,
  createRwLock,
  createArcMutex
} from "milost";

const cache = createRwLock({ count: 1 });
const tracker = createMutex(0);
const sharedData = createArcMutex({ messages: [] });

// Read cache
console.log(cache.read());

// Update lock
const old = tracker.lock();
tracker.unlock(old + 1);

// Push message
const current = sharedData.lock();
sharedData.unlock({ messages: [...current.messages, "hello"] });`}</Pre>
            </CodeBlock>
            <SmallText>
              These tools empower you to build robust systems with predictable
              concurrency — without leaving the safety of the type system or
              resorting to shared mutable JavaScript state.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default SyncPrimitivesPage;
