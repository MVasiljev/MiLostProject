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
  IntroText,
  QuickLinks,
  SectionDivider,
  ContactLink,
  ContactLinks,
} from "./Welcome.styles";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";

function Welcome() {
  return (
    <Container>
      <Header>
        <Title>
          <TitleHighlight>MiLost</TitleHighlight> Library
        </Title>
        <Subtitle>
          Bringing Rust's Safety and Web Assembly Performance to TypeScript
          Development
        </Subtitle>
      </Header>

      {/* <QuickLinks>
        <Link to={ROUTES.GET_STARTED}>Getting Started Guide</Link>
        <Link to={ROUTES.VECTORS}>Collections</Link>
        <Link to={ROUTES.OPTION}>Error Handling</Link>
        <Link to={ROUTES.COMPUTED}>Reactive Programming</Link>
        <Link to={ROUTES.ASYNC}>Concurrency</Link>
      </QuickLinks> */}

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

      <IntroText>
        <p>
          MiLost bridges the gap between Rust's safety guarantees and
          TypeScript's developer experience. It provides a comprehensive set of
          data structures, utilities, and patterns inspired by Rust's most
          powerful features, all with optional WebAssembly acceleration for
          near-native performance.
        </p>
        <p>
          Whether you're building a complex web application, processing data at
          scale, or just looking to write more reliable code, MiLost provides
          the building blocks for robust, maintainable software.
        </p>
      </IntroText>

      <SectionDivider>
        <span>Core Principles</span>
      </SectionDivider>

      <CodeBlock>
        <CodeBlockTitle>The MiLost Philosophy</CodeBlockTitle>
        <CodeContent>
          <Pre>{`// Embracing Safe and Expressive Programming

// 1. Immutability by Default
const immutableList = Vec.from([1, 2, 3])
  .map(x => x * 2)  // Creates a new vector
  .filter(x => x > 2);

// 2. Explicit Error Handling
function divide(a: number, b: number): Result<number, Error> {
  return b !== 0 
    ? Ok(a / b)
    : Err(new Error("Division by zero is not allowed"));
}

// 3. Option for Nullable Values
function findUser(id: number): Option<User> {
  return id > 0 
    ? Option.Some(getUserById(id))
    : Option.None();
}

// 4. Pattern Matching for Complex Logic
const result = matchValue(findUser(42), [
  [SomePattern, user => \`Found user: \${user.name}\`],
  [NonePattern, () => "User not found"]
]);

// 5. Functional Composition
const processData = pipe(
  (data: Data) => data.filter(isValid),
  map(transform),
  reduce(aggregate)
);`}</Pre>
        </CodeContent>
      </CodeBlock>

      <IntroText>
        <p>
          MiLost's philosophy centers around making correct code the path of
          least resistance. By providing immutable data structures, explicit
          error handling, and powerful abstractions, MiLost helps developers
          write code that is more maintainable, safer, and often more efficient.
        </p>
        <p>
          The library introduces concepts like <strong>Option</strong> and{" "}
          <strong>Result</strong> types from Rust, which transform error
          handling from an afterthought to a core part of your function
          signatures. Similarly, immutable collections like <strong>Vec</strong>{" "}
          and <strong>HashMap</strong>
          eliminate entire classes of bugs related to unexpected mutations.
        </p>
      </IntroText>

      <SectionDivider>
        <span>Solving Real Problems</span>
      </SectionDivider>

      <CodeBlock>
        <CodeBlockTitle>Why MiLost?</CodeBlockTitle>
        <CodeContent>
          <Pre>{`// Addressing Common JavaScript/TypeScript Pain Points

// Problem: Unchecked Nulls and Undefined
// Traditional JS
function divide(a, b) {
  return a / b;  // Silently returns Infinity or NaN
}

// MiLost Solution
function safeDivide(a: number, b: number): Result<number, Error> {
  return b !== 0 
    ? Ok(a / b)
    : Err(new Error("Safe division requires non-zero denominator"));
}

// Problem: Inconsistent Error Handling
// Traditional JS
async function fetchData() {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    // Inconsistent error handling
    console.error(error);
  }
}

// MiLost Solution
async function fetchData(): Promise<Result<Data, NetworkError>> {
  return Result.tryCatchAsync(async () => {
    const response = await fetch(url);
    return response.json();
  });
}`}</Pre>
        </CodeContent>
      </CodeBlock>

      <IntroText>
        <p>
          JavaScript and TypeScript developers face common challenges that
          MiLost directly addresses: null/undefined errors, unexpected
          mutations, race conditions, and inconsistent error handling.
        </p>
        <p>
          The examples above are just the beginning. MiLost's approach to memory
          management through the
          <strong>Owned</strong>, <strong>Ref</strong>, and{" "}
          <strong>RefMut</strong> types provides explicit control over how
          values are accessed and modified. The library's concurrency primitives
          like <strong>Channel</strong> and <strong>Task</strong> enable safe
          communication between asynchronous operations, preventing race
          conditions and memory leaks.
        </p>
      </IntroText>

      <SectionDivider>
        <span>Ready to Start?</span>
      </SectionDivider>

      <CodeBlock>
        <CodeBlockTitle>Getting Started</CodeBlockTitle>
        <CodeContent>
          <Pre>{`# Installation
npm install milost

# Core Concepts
import { 
  Vec, Result, Option, 
  Ok, Err, contract, 
  pipe, match 
} from 'milost';

// Recommended Learning Path:
// 1. Result and Option for Error Handling
// 2. Functional Utilities (pipe, compose)
// 3. Collections (Vec, HashMap)
// 4. Advanced: Smart Pointers, Concurrency`}</Pre>
        </CodeContent>
      </CodeBlock>

      <IntroText>
        <p>
          Getting started with MiLost is simple. The library is modular,
          allowing you to adopt features incrementally as needed. We recommend
          starting with the error handling types (Result and Option) and
          immutable collections (Vec), then exploring the more advanced features
          as you grow more comfortable with the Rust-inspired paradigms.
        </p>
        <p>
          The documentation provides comprehensive guides and examples for each
          feature, along with best practices and performance considerations.
          Whether you're building a new project or enhancing an existing one,
          MiLost can be integrated smoothly into your workflow.
        </p>
      </IntroText>

      <SectionDivider>
        <span>Feature Highlights</span>
      </SectionDivider>

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

      <SectionDivider>
        <span>Community & Support</span>
      </SectionDivider>

      <IntroText>
        <p>
          MiLost is an open-source project currently in active development. As
          the creator, I welcome contributions, feedback, and questions from
          developers interested in Rust-inspired patterns for JavaScript and
          TypeScript.
        </p>
        <p>
          The project is available on GitHub under MIT license. If you're
          interested in contributing or have questions about the library, please
          open an issue on the GitHub repository or reach out directly.
        </p>
        <p>
          Whether you want to report a bug, suggest a feature, improve
          documentation, or contribute code, your involvement is welcome.
          Together, we can build a library that brings the best of Rust's safety
          patterns to the JavaScript ecosystem.
        </p>

        <ContactLinks>
          <ContactLink href="https://github.com/MVasiljev/MiLostProject">
            <FaGithub /> GitHub
          </ContactLink>
          <ContactLink href="mailto:milan.vasiljev.work@gmail.com">
            <FaEnvelope /> Email
          </ContactLink>
          <ContactLink href="https://www.linkedin.com/in/milan-vasiljev/">
            <FaLinkedin /> LinkedIn
          </ContactLink>
        </ContactLinks>
      </IntroText>
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
