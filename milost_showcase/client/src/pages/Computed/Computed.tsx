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
} from "./Computed.styles";

function ComputedPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "computed", label: "Computed" },
    { id: "watcher", label: "Watcher" },
    { id: "async", label: "AsyncEffect" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Computed</Title>
        <Subtitle>
          Create reactive values, watchers, and async effects with deterministic
          memory-safe logic — designed to reflect Rust-like patterns and
          WebAssembly execution guarantees.
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
              The <code>Computed</code> module contains core reactive tools:{" "}
              <code>Computed</code> for derived values, <code>Watcher</code> for
              change tracking, and <code>AsyncEffect</code> for cancellable
              async flows.
            </InfoBox>
            <FormGroup>
              <Label>What’s Included?</Label>
              <ul>
                <li>
                  <strong>Computed</strong>: Lazily evaluated value from inputs
                </li>
                <li>
                  <strong>Watcher</strong>: Watches for changes and reacts
                </li>
                <li>
                  <strong>AsyncEffect</strong>: Runs cancellable async logic
                  safely
                </li>
              </ul>
            </FormGroup>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Functional purity with side-effect isolation</li>
                <li>Memory-safe lazy evaluation</li>
                <li>WASM-native determinism and control</li>
              </ul>
            </FormGroup>
            <Table>
              <thead>
                <tr>
                  <th>Use when you need...</th>
                  <th>Instead of...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Derived state based on dependencies</td>
                  <td>Manual recomputation logic</td>
                </tr>
                <tr>
                  <td>Callback on value change</td>
                  <td>Polling or reactive frameworks</td>
                </tr>
                <tr>
                  <td>Async behavior tied to scope</td>
                  <td>Loose fire-and-forget effects</td>
                </tr>
              </tbody>
            </Table>
            <CodeBlock>
              <Pre>{`import { Computed, Watcher, AsyncEffect } from "milost";`}</Pre>
            </CodeBlock>
            <SmallText>
              Together, these tools enable modular, observable, and predictable
              state transformations without needing external frameworks.
            </SmallText>
          </>
        )}

        {activeTab === "computed" && (
          <>
            <InfoBox>
              <code>Computed</code> caches a value derived from other values. It
              updates only when dependencies change.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>
                  Minimizes recalculation through shallow equality checks.
                </li>
                <li>Encapsulates reactive logic in a predictable container.</li>
                <li>Safe to pass around or serialize.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { Computed } from "milost";

const a = 5;
const b = 10;
const sum = Computed.from(() => a + b, [a, b]);
console.log(sum.get()); // 15`}</Pre>
            </CodeBlock>
            <SmallText>
              Re-run <code>update(newDeps)</code> when dependencies change.
              Useful in integration with boxes, inputs, or effects.
            </SmallText>
          </>
        )}

        {activeTab === "watcher" && (
          <>
            <InfoBox>
              <code>Watcher</code> runs a callback when the value returned from
              a function changes.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Track shallow changes to values safely.</li>
                <li>Useful for conditionally triggering downstream effects.</li>
                <li>
                  Clear lifecycle: run <code>check()</code> on tick or change.
                </li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { Watcher } from "milost";

let count = 0;

const watcher = new Watcher(
  () => count,
  (val) => console.log("Updated to", val)
);

count = 1;
watcher.check(); // logs "Updated to 1"`}</Pre>
            </CodeBlock>
            <SmallText>
              This is ideal for minimal observer-style hooks without pulling in
              full reactive frameworks.
            </SmallText>
          </>
        )}

        {activeTab === "async" && (
          <>
            <InfoBox>
              <code>AsyncEffect</code> executes an async function and lets you
              cancel it cleanly.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Encapsulates async lifecycles in WASM logic.</li>
                <li>Handles cancellation without leaks.</li>
                <li>Logs errors when active but fails.</li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { AsyncEffect } from "milost";

const effect = new AsyncEffect(async () => {
  await fetch("/data");
});

// Later...
effect.cancel();`}</Pre>
            </CodeBlock>
            <SmallText>
              Use when effects may outlive the caller — like in transitions or
              stream connections.
            </SmallText>
          </>
        )}

        {activeTab === "examples" && (
          <>
            <InfoBox>
              A combined example using <code>Computed</code>,{" "}
              <code>Watcher</code>, and <code>AsyncEffect</code>.
            </InfoBox>
            <FormGroup>
              <Label>Principles & Benefits</Label>
              <ul>
                <li>Models reactivity, effects, and mutation separately.</li>
                <li>Encourages modular reactive computation.</li>
                <li>
                  Great for real-time dashboards, animations, or pipelines.
                </li>
              </ul>
            </FormGroup>
            <CodeBlock>
              <Pre>{`import { Computed, Watcher, AsyncEffect } from "milost";

let count = 0;

const sum = Computed.from(() => count * 2, [count]);

new Watcher(
  () => sum.get(),
  (val) => {
    new AsyncEffect(async () => {
      await fetch(\`/update?val=\${val}\`);
    });
  }
);

count = 3;
sum.update([count]);`}</Pre>
            </CodeBlock>
            <SmallText>
              This architecture lets you build reactive chains that remain
              precise, testable, and efficient.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default ComputedPage;
