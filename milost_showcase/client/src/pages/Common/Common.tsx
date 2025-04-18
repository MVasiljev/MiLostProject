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
} from "./Common.styles";

function CommonPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "typecheck", label: "Type Checking" },
    { id: "vec", label: "Convert to Vec" },
    { id: "loading", label: "Loading States" },
    { id: "brand", label: "Brand Types" },
    { id: "option", label: "Option Type" },
    { id: "result", label: "Result Type" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Common Utilities</Title>
        <Subtitle>
          MiLost includes a suite of utility types and helpers to validate,
          transform, and safely operate on values.
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
              Common utilities provide reliable, WASM-powered methods to
              interact with dynamic values in a type-safe and predictable way.
            </InfoBox>
            <FormGroup>
              <Label>What's Included?</Label>
              <ul>
                <li>Advanced type guards for runtime safety</li>
                <li>Option and Result types for nullable/error-prone logic</li>
                <li>
                  Utility types like loading state enums and branded types
                </li>
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
                  <td>Safe checking of unknown input</td>
                  <td>
                    <code>typeof</code>, <code>instanceof</code>
                  </td>
                </tr>
                <tr>
                  <td>Nullable safety with default values</td>
                  <td>
                    Chained <code>||</code> logic
                  </td>
                </tr>
                <tr>
                  <td>Interfacing WASM-native Vec</td>
                  <td>JavaScript Arrays</td>
                </tr>
              </tbody>
            </Table>
            <CodeBlock>
              <Pre>{`// Minimal Example
import { isDefined } from "milost";

console.log(isDefined(null)); // true

// Full API demonstration
import {
  isDefined, isNumeric, isVec, isStr, isBoolean,
  iterableToVec, Option, Result, LoadingStates, BrandTypes
} from "milost";

const value = 42;
console.log(isNumeric(value)); // true
console.log(isStr("hello"));   // true
console.log(Option.Some("x").unwrap()); // "x"
console.log(Result.Ok(1).unwrap()); // 1
console.log(LoadingStates.LOADING); // "loading"
console.log(BrandTypes.PERCENTAGE); // "percentage"`}</Pre>
            </CodeBlock>
            <SmallText>
              Every utility is pure and safe. You never mutate the original
              input. Both minimal and full applications can coexist to aid
              readability and completeness.
            </SmallText>
          </>
        )}

        {activeTab === "typecheck" && (
          <>
            <InfoBox>
              Type guards help you inspect unknown values with precision and
              safety.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { isDefined, isNumeric, isBoolean, isStr, isVec } from "milost";

console.log(isDefined(null)); // true
console.log(isNumeric(42));   // true
console.log(isBoolean(false)); // true
console.log(isStr("hi"));     // true
console.log(isVec([1, 2, 3])); // false (not a WASM Vec)`}</Pre>
            </CodeBlock>
            <SmallText>
              These helpers are perfect for validating user input, JSON
              payloads, or dynamic data sources.
            </SmallText>
          </>
        )}

        {activeTab === "vec" && (
          <>
            <InfoBox>
              JavaScript arrays can be converted to MiLost Vec for better WASM
              compatibility.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { iterableToVec } from "milost";

const jsArray = ["a", "b", "c"];
const vec = iterableToVec(jsArray);

console.log(vec.len()); // 3`}</Pre>
            </CodeBlock>
            <SmallText>
              <code>Vec</code> is the foundation for high-performance containers
              in MiLost.
            </SmallText>
          </>
        )}

        {activeTab === "loading" && (
          <>
            <InfoBox>
              LoadingStates define common lifecycle phases of async operations.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { LoadingStates } from "milost";

console.log(LoadingStates.IDLE);      // "idle"
console.log(LoadingStates.LOADING);   // "loading"
console.log(LoadingStates.SUCCEEDED); // "succeeded"
console.log(LoadingStates.FAILED);    // "failed"`}</Pre>
            </CodeBlock>
            <SmallText>
              Use these states to simplify UI and state machine logic.
            </SmallText>
          </>
        )}

        {activeTab === "brand" && (
          <>
            <InfoBox>
              Branded types label data with semantic meaning and validation
              rules.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { BrandTypes } from "milost";

console.log(BrandTypes.JSON);       // "json"
console.log(BrandTypes.PERCENTAGE); // "percentage"
console.log(BrandTypes.POSITIVE);   // "positive"`}</Pre>
            </CodeBlock>
            <SmallText>
              Pair <code>BrandTypes</code> with the Branded API to construct
              domain-safe values.
            </SmallText>
          </>
        )}

        {activeTab === "option" && (
          <>
            <InfoBox>
              Option is a better alternative to <code>null</code> and{" "}
              <code>undefined</code>.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { Option } from "milost";

const some = Option.Some("text");
const none = Option.None();

console.log(some.unwrap());       // "text"
console.log(none.unwrapOr(""));  // ""`}</Pre>
            </CodeBlock>
            <SmallText>
              Options help express the absence of a value in a safe, functional
              way.
            </SmallText>
          </>
        )}

        {activeTab === "result" && (
          <>
            <InfoBox>
              Result is used to model success/failure of an operation with value
              safety.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { Result } from "milost";

const success = Result.Ok("data");
const failure = Result.Err("error");

console.log(success.isOk()); // true
console.log(failure.isErr()); // true
console.log(success.unwrap()); // "data"
console.log(failure.unwrapOr("fallback")); // "fallback"`}</Pre>
            </CodeBlock>
            <SmallText>
              Result is a drop-in replacement for <code>try/catch</code> that
              makes error flows more expressive.
            </SmallText>
          </>
        )}

        {activeTab === "examples" && (
          <>
            <InfoBox>
              Putting it all together — an end-to-end data flow using common
              utilities.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import {
  isDefined, isNumeric, iterableToVec,
  Option, Result, LoadingStates, BrandTypes
} from "milost";

const input = 42;
if (isDefined(input) && isNumeric(input)) {
  const vec = iterableToVec([input]);
  const optional = Option.Some(vec.len());
  const result = Result.Ok(optional.unwrap());
  console.log(result.unwrap()); // 1
}`}</Pre>
            </CodeBlock>
            <SmallText>
              This example validates input, collects it in a Vec, wraps it in
              Option, and extracts with Result — all using MiLost common
              helpers.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default CommonPage;
