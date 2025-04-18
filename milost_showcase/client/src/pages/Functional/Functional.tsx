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
} from "./Functional.styles";

// Import additional components for detailed sections
import FunctionalOverview from "./FunctionalOverview";
import FunctionalPrinciples from "./FunctionalPrinciples";
import FunctionalBenefits from "./FunctionalBenefits";
import FunctionalPatterns from "./FunctionalPatterns";
import FunctionalPerformance from "./FunctionalPerformance";

function FunctionalPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "principles", label: "Core Principles" },
    { id: "benefits", label: "Benefits" },
    { id: "patterns", label: "Design Patterns" },
    { id: "performance", label: "Performance" },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case "overview":
        return <FunctionalOverview />;
      case "principles":
        return <FunctionalPrinciples />;
      case "benefits":
        return <FunctionalBenefits />;
      case "patterns":
        return <FunctionalPatterns />;
      case "performance":
        return <FunctionalPerformance />;
      default:
        return <FunctionalOverview />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Functional Programming</Title>
        <Subtitle>
          Transformative Approach to Writing Robust, Predictable Code
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

        {renderContent()}
      </Card>

      <Card>
        <CardTitle>Functional Programming Examples</CardTitle>
        <CodeBlock>
          <Pre>{`import * as F from "milost";

// Map operations
const hashMap = F.toHashMap(iter, x => x.id);  // Creates HashMap from iterator
const hashSet = F.toHashSet(iter);             // Creates HashSet from iterator
const vec = F.toVec(iter);                     // Creates Vec from iterator

// Transform operations
const merged = F.mergeDeep([obj1, obj2, obj3]);  // Deep merges multiple objects
const piped = F.pipe(fn1, fn2, fn3);             // Creates pipeline of functions
const composed = F.compose(fn3, fn2, fn1);       // Composes functions (right to left)
const curriedFn = F.curry((a, b, c) => a + b + c);  // Creates curried function

// Execution operations
const throttledFn = F.throttle(fn, 300);         // Limits function calls
const debouncedFn = F.debounce(fn, 300);         // Debounces function calls
const noop = F.noop();                           // No-operation function

// Predicate and utility operations
const notPred = F.not(x => x > 3);               // Negates predicate
const allOf = F.allOf(pred1, pred2, pred3);      // Combines with AND
const anyOf = F.anyOf(pred1, pred2, pred3);      // Combines with OR

// Advanced composition
const partialFn = F.partial(sum, 1, 2);          // Partially applies function
const flippedFn = F.flip((a, b) => a / b);       // Flips function arguments
const juxtFn = F.juxt([Math.min, Math.max]);     // Applies functions to same input`}</Pre>
        </CodeBlock>

        <SmallText>
          These examples showcase the versatility of functional programming
          utilities, demonstrating how they can simplify complex operations and
          improve code readability.
        </SmallText>
      </Card>
    </Container>
  );
}

export default FunctionalPage;
