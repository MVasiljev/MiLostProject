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
  CodeBlock,
  Pre,
  SmallText,
} from "../Strings/Strings.styles";
import { Table } from "../Vector/Vector.styles";

function BrandingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "creation", label: "Creating Brands" },
    { id: "validation", label: "Validation" },
    { id: "conversion", label: "Conversion" },
    { id: "unwrap", label: "Unwrapping" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Branded Types</Title>
        <Subtitle>
          Runtime-enforced semantic typing with brand validation for primitives.
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
              Branded types wrap primitive values and assign them a brand name,
              along with validation logic to enforce correctness at runtime.
            </InfoBox>
            <FormGroup>
              <Label>When to Use Branded Types</Label>
              <ul>
                <li>
                  When you want to distinguish between semantically different
                  values
                </li>
                <li>
                  When you want to enforce rules on basic types like numbers or
                  strings
                </li>
                <li>
                  When you want to convert between validated domain objects
                </li>
              </ul>
            </FormGroup>
            <Table>
              <thead>
                <tr>
                  <th>Use Branded When...</th>
                  <th>Instead of...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>You need runtime validation on primitive data</td>
                  <td>
                    Loose <code>number</code> or <code>string</code> values
                  </td>
                </tr>
                <tr>
                  <td>You want semantically strong API boundaries</td>
                  <td>Raw primitive types</td>
                </tr>
                <tr>
                  <td>You want to convert and compose logic safely</td>
                  <td>Manual if/else and mutation</td>
                </tr>
              </tbody>
            </Table>
            <CodeBlock>
              <Pre>{`// Minimal Example
import { Branded, BrandTypes } from "milost";

const Age = Branded.create(25, BrandTypes.NON_NEGATIVE, x => x >= 0);
console.log(Age.unwrap()); // 25

// Full API Demonstration
import { Str } from "milost";

const Percentage = Branded.create(95, BrandTypes.PERCENTAGE, x => x >= 0 && x <= 100);
const Renamed = Percentage.replace(Str.fromRaw("FinalGrade"));

console.log(Renamed.unwrap()); // 95
console.log(Renamed.brand());  // "FinalGrade"`}</Pre>
            </CodeBlock>
            <SmallText>
              Branding enables expressive value-level typing while ensuring
              safety, correctness, and immutability.
            </SmallText>
          </>
        )}

        {activeTab === "creation" && (
          <>
            <InfoBox>
              Use <code>Branded.create(value, brand, validate)</code> to build
              validated branded types.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { Branded, BrandTypes } from "milost";

const Score = Branded.create(87, BrandTypes.PERCENTAGE, x => x >= 0 && x <= 100);
const Username = Branded.create("alice", Str.fromRaw("Username"), name => name.length >= 3);`}</Pre>
            </CodeBlock>
            <SmallText>
              You can use predefined brand types or create custom brands via{" "}
              <code>Str.fromRaw("...")</code>.
            </SmallText>
          </>
        )}

        {activeTab === "validation" && (
          <>
            <InfoBox>
              Validators are any function that return <code>true</code> or{" "}
              <code>false</code> based on the value.
            </InfoBox>
            <CodeBlock>
              <Pre>{`Branded.create(10, "PositiveInt", x => x > 0);
Branded.create("ABC-1234", "LicensePlate", val => /^[A-Z]{3}-[0-9]{4}$/.test(val));`}</Pre>
            </CodeBlock>
            <SmallText>
              If validation fails, the branded constructor throws immediately.
            </SmallText>
          </>
        )}

        {activeTab === "conversion" && (
          <>
            <InfoBox>
              Use <code>.map(fn)</code> and <code>.replace("newBrand")</code> to
              derive a new branded value.
            </InfoBox>
            <CodeBlock>
              <Pre>{`const price = Branded.create(100, "USD", x => x > 0);
const withTax = price.map(p => p * 1.2).replace("FinalPrice");`}</Pre>
            </CodeBlock>
            <SmallText>
              Mapping and replacing allow safe transformation of the underlying
              value into a new brand.
            </SmallText>
          </>
        )}

        {activeTab === "unwrap" && (
          <>
            <InfoBox>
              You can extract the raw value using <code>.unwrap()</code> or
              fallback-safe <code>.unwrapOr()</code>.
            </InfoBox>
            <CodeBlock>
              <Pre>{`const safe = Branded.create(10, "Ten", x => x === 10);
console.log(safe.unwrap()); // 10
console.log(safe.unwrapOr(0)); // 10`}</Pre>
            </CodeBlock>
            <SmallText>
              Always prefer <code>unwrapOr</code> if there's any chance the
              brand may fail upstream.
            </SmallText>
          </>
        )}

        {activeTab === "examples" && (
          <>
            <InfoBox>
              Complete example of branded types applied in a validation
              pipeline.
            </InfoBox>
            <CodeBlock>
              <Pre>{`import { Branded, BrandTypes, Str } from "milost";

const Age = Branded.create(30, Str.fromRaw("Age"), v => v >= 18);
const Discount = Branded.create(10, BrandTypes.PERCENTAGE, x => x >= 0 && x <= 100);
const Total = Branded.create(200, BrandTypes.NON_NEGATIVE, x => x >= 0);

const FinalPrice = Total
  .map(x => x * (1 - Discount.unwrap() / 100))
  .replace(Str.fromRaw("FinalPrice"));

console.log(FinalPrice.unwrap()); // 180`}</Pre>
            </CodeBlock>
            <SmallText>
              Branded types let you verify, transform, and track the semantic
              identity of values across your domain.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default BrandingPage;
