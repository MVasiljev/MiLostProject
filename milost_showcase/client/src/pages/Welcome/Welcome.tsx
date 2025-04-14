import {
  Container,
  Header,
  Title,
  TitleHighlight,
  Subtitle,
  FeaturesGrid,
  CodeBlock,
  CodeBlockTitle,
  CodeContent,
  Pre,
  SmallFeaturesGrid,
} from "./Welcome.styles";

function Welcome() {
  return (
    <Container>
      <Header>
        <Title>
          <TitleHighlight>MiLost</TitleHighlight> Library
        </Title>
        <Subtitle>
          High-performance TypeScript library powered by Rust and WebAssembly
        </Subtitle>
      </Header>

      <FeaturesGrid>
        <FeatureCard
          title="Rust Under the Hood"
          description="Core functionality implemented in Rust for maximum performance and safety"
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#d97706">
              <path d="M23.5 17l-5 5-5-5 1.5-1.5 3.5 3.5 3.5-3.5 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.5 0 2.91-.32 4.2-.88-1.1-1.22-1.7-2.82-1.7-4.62 0-3.86 3.14-7 7-7h.59c-.04-.23-.08-.46-.09-.69V8.5c0-3.58-2.92-6.5-6.5-6.5H12z" />
            </svg>
          }
        />
        <FeatureCard
          title="WebAssembly Acceleration"
          description="Native-like performance with seamless fallback to pure JS when WASM is unavailable"
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#d97706">
              <path d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87z" />
              <circle cx="9" cy="8" r="4" />
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24C14.5 5.27 15 6.58 15 8s-.5 2.73-1.33 3.76c.42.14.86.24 1.33.24zM9 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
            </svg>
          }
        />
      </FeaturesGrid>

      <CodeBlock>
        <CodeBlockTitle>Quick Start</CodeBlockTitle>
        <CodeContent>
          <Pre>
            {`import { Str, Vec, Result, Ok, Err, Option } from "milost";

// Working with Strings
const greeting = Str.fromRaw("Hello, world!");
console.log(greeting.unwrap()); // "Hello, world!"

// Working with Vectors
const numbers = Vec.from([1, 2, 3, 4, 5]);
const doubled = numbers.map((n) => n * 2);
console.log(doubled.toArray()); // [2, 4, 6, 8, 10]

// Error Handling with Result
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return Err(new Error("Division by zero"));
  }
  return Ok(a / b);
}`}
          </Pre>
        </CodeContent>
      </CodeBlock>

      <SmallFeaturesGrid>
        <FeatureItem
          title="Rust-Inspired Patterns"
          description="Result, Option, Vec, HashMap and other Rust patterns directly available in TypeScript"
        />
        <FeatureItem
          title="Memory Management"
          description="Smart pointers (Rc, Arc, RefCell) for controlled mutation and memory safety"
        />
        <FeatureItem
          title="Type Safety"
          description="Strong type safety with branded types and validation"
        />
        <FeatureItem
          title="Concurrency Tools"
          description="Channels, Tasks and synchronization primitives built on Rust's efficient implementations"
        />
        <FeatureItem
          title="Functional Programming"
          description="Compose, curry, pipe and other functional utilities optimized in Rust"
        />
        <FeatureItem
          title="Data Structures"
          description="High-performance Rust-implemented collections like Vec, HashMap, HashSet"
        />
      </SmallFeaturesGrid>
    </Container>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="feature-item">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Welcome;
