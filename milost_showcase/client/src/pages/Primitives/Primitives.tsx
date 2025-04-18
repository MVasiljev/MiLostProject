import React, { useState } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
  TabsContainer,
  Tab,
  InfoBox,
  Table,
} from "./Primitives.styles";

function PrimitivesPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  // Tab categories
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "numeric", label: "Numeric Types" },
    { id: "operations", label: "Safe Operations" },
    { id: "bitwise", label: "Bitwise Operations" },
    { id: "formatting", label: "Formatting" },
    { id: "conversion", label: "Type Conversion" },
  ];

  return (
    <Container>
      <Header>
        <Title>Primitive Type System</Title>
        <Subtitle>
          Strong, Rust-inspired primitive types with WebAssembly acceleration
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
              MiLost provides a comprehensive set of primitive types inspired by
              Rust, offering precise control over numeric ranges and behavior.
              These types help catch errors early and improve code reliability.
            </InfoBox>

            <FormGroup>
              <Label>Key Benefits</Label>
              <ul>
                <li>Range validation prevents common overflow errors</li>
                <li>Type-safe operations with explicit error handling</li>
                <li>WebAssembly acceleration for performance-critical code</li>
                <li>Compatible with TypeScript's type system</li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Types Overview</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>u8, u16, u32, u64</td>
                    <td>Unsigned integers</td>
                    <td>0 to 2^n-1</td>
                  </tr>
                  <tr>
                    <td>i8, i16, i32, i64</td>
                    <td>Signed integers</td>
                    <td>-2^(n-1) to 2^(n-1)-1</td>
                  </tr>
                  <tr>
                    <td>f32, f64</td>
                    <td>Floating point numbers</td>
                    <td>IEEE-754 ranges</td>
                  </tr>
                  <tr>
                    <td>byte, short, int, long</td>
                    <td>Aliases for common types</td>
                    <td>Same as their counterparts</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { u8, i32, add_u8 } from 'milost';

// Create type-safe primitive values
const maxByte = u8(255);  // OK
// const overflow = u8(256);  // Error: Invalid value for type u8: 256

// Safe arithmetic with overflow checking
const a = u8(200);
const b = u8(100);

const sum = add_u8(a, b);
if (sum.isOk()) {
  console.log(sum.unwrap());  // This won't execute - overflow!
} else {
  console.log(sum.unwrapErr().message); 
  // "Addition would overflow u8: 200 + 100 = 300"
}`}</Pre>
            </CodeBlock>

            <SmallText>
              MiLost's primitive types ensure that numerical operations are
              always safe and predictable, catching errors that would silently
              produce incorrect results in regular JavaScript.
            </SmallText>
          </>
        )}

        {activeCategory === "numeric" && (
          <>
            <InfoBox>
              MiLost provides precise numeric types with well-defined ranges and
              behaviors. Each type ensures values stay within appropriate
              bounds.
            </InfoBox>

            <FormGroup>
              <Label>Unsigned Integer Types</Label>
              <p>
                Unsigned integers represent non-negative whole numbers. They're
                perfect for quantities that can never be negative, like counts,
                indices, or buffer sizes.
              </p>
              <ul>
                <li>
                  <strong>u8</strong>: 0 to 255 (8 bits, ideal for bytes)
                </li>
                <li>
                  <strong>u16</strong>: 0 to 65,535 (16 bits)
                </li>
                <li>
                  <strong>u32</strong>: 0 to 4,294,967,295 (32 bits)
                </li>
                <li>
                  <strong>u64</strong>: 0 to 2^53-1 (limited by JavaScript)
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Signed Integer Types</Label>
              <p>
                Signed integers represent positive and negative whole numbers.
                Use these for values that might be negative, like temperature or
                coordinate systems.
              </p>
              <ul>
                <li>
                  <strong>i8</strong>: -128 to 127 (8 bits)
                </li>
                <li>
                  <strong>i16</strong>: -32,768 to 32,767 (16 bits)
                </li>
                <li>
                  <strong>i32</strong>: -2,147,483,648 to 2,147,483,647 (32
                  bits)
                </li>
                <li>
                  <strong>i64</strong>: -(2^53-1) to 2^53-1 (limited by
                  JavaScript)
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Floating Point Types</Label>
              <p>
                Floating point numbers represent real numbers with decimal
                points. Use these for measurements, calculations, and scientific
                values.
              </p>
              <ul>
                <li>
                  <strong>f32</strong>: Single-precision (32-bit) floating point
                </li>
                <li>
                  <strong>f64</strong>: Double-precision (64-bit) floating point
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { u8, i16, f32 } from 'milost';

// Unsigned 8-bit integer (0 to 255)
const userId = u8(42);

// Signed 16-bit integer (-32,768 to 32,767)
const temperature = i16(-10);

// 32-bit floating point
const pi = f32(3.14159);

// Runtime validation ensures values stay in range
try {
  const overflow = u8(300);  // Throws ValidationError
} catch (err) {
  console.error(err.message);  // "Invalid value for type u8: 300"
}`}</Pre>
            </CodeBlock>

            <SmallText>
              By using the appropriate numeric type for each value in your
              application, you create self-documenting code that prevents many
              common errors before they occur.
            </SmallText>
          </>
        )}

        {activeCategory === "operations" && (
          <>
            <InfoBox>
              MiLost provides safe arithmetic operations that protect against
              overflow, underflow, and division by zero. Each operation returns
              a Result type that must be explicitly handled.
            </InfoBox>

            <FormGroup>
              <Label>Safe Arithmetic</Label>
              <p>
                Unlike JavaScript's silent overflow behavior, MiLost's
                arithmetic operations explicitly check for overflow and return
                Result types:
              </p>
              <ul>
                <li>
                  <strong>add_u8, add_u16, add_u32</strong>: Safe addition
                </li>
                <li>
                  <strong>sub_u32</strong>: Safe subtraction with underflow
                  checking
                </li>
                <li>
                  <strong>mul_u32</strong>: Safe multiplication with overflow
                  checking
                </li>
                <li>
                  <strong>div_u32</strong>: Safe division with division-by-zero
                  checking
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { u8, u32, add_u8, mul_u32, div_u32 } from 'milost';

// Addition with overflow checking
const a = u8(200);
const b = u8(100);
const sum = add_u8(a, b);

if (sum.isOk()) {
  console.log("Sum:", sum.unwrap());
} else {
  console.error("Error:", sum.unwrapErr().message);
  // "Addition would overflow u8: 200 + 100 = 300"
}

// Multiplication with overflow checking
const product = mul_u32(u32(1000000), u32(1000000));
console.log(product.isOk()); // false - result would overflow u32

// Division with divide-by-zero checking
const divideByZero = div_u32(u32(10), u32(0));
console.log(divideByZero.isOk()); // false
console.log(divideByZero.unwrapErr().message); // "Division by zero: 10 / 0"`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Why Use Safe Operations?</Label>
              <p>
                JavaScript performs arithmetic modulo 2^53 for integers,
                silently wrapping around on overflow. This can cause
                hard-to-detect bugs:
              </p>
              <ul>
                <li>
                  <strong>Regular JS</strong>: 255 + 1 = 256 (correct)
                </li>
                <li>
                  <strong>Regular JS</strong>: 2^53 + 1 = 2^53 (incorrect,
                  silent precision loss)
                </li>
                <li>
                  <strong>MiLost</strong>: add_u8(u8(255), u8(1)) returns an
                  error (explicit overflow)
                </li>
              </ul>
            </FormGroup>

            <SmallText>
              Safe arithmetic operations force you to handle potential errors
              explicitly, leading to more robust code that doesn't silently
              produce incorrect results when calculations go out of bounds.
            </SmallText>
          </>
        )}

        {activeCategory === "bitwise" && (
          <>
            <InfoBox>
              Bitwise operations let you manipulate individual bits in numeric
              values. MiLost provides type-safe bitwise operations that are
              accelerated with WebAssembly when available.
            </InfoBox>

            <FormGroup>
              <Label>Available Bitwise Operations</Label>
              <ul>
                <li>
                  <strong>bitwise_and</strong>: Bitwise AND (a & b)
                </li>
                <li>
                  <strong>bitwise_or</strong>: Bitwise OR (a | b)
                </li>
                <li>
                  <strong>bitwise_xor</strong>: Bitwise XOR (a ^ b)
                </li>
                <li>
                  <strong>bitwise_not</strong>: Bitwise NOT (~a)
                </li>
                <li>
                  <strong>shift_left</strong>: Left shift ({`a << b`})
                </li>
                <li>
                  <strong>shift_right</strong>: Right shift ({`a >> b`})
                </li>
              </ul>
            </FormGroup>

            <FormGroup>
              <Label>Bit Manipulation Utilities</Label>
              <ul>
                <li>
                  <strong>is_power_of_two</strong>: Check if a number is a power
                  of 2
                </li>
                <li>
                  <strong>next_power_of_two</strong>: Find the next power of 2
                </li>
                <li>
                  <strong>leading_zeros</strong>: Count leading zero bits
                </li>
                <li>
                  <strong>trailing_zeros</strong>: Count trailing zero bits
                </li>
                <li>
                  <strong>count_ones</strong>: Count set bits (popcount)
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { 
  u32, 
  bitwise_and, 
  bitwise_or, 
  shift_left, 
  is_power_of_two,
  count_ones 
} from 'milost';

// Basic bitwise operations
const a = u32(5);  // 0101 in binary
const b = u32(3);  // 0011 in binary

const andResult = bitwise_and(a, b);  // 0001 = 1
const orResult = bitwise_or(a, b);    // 0111 = 7
const leftShift = shift_left(a, u32(1)); // 1010 = 10

// Bit manipulation utilities
console.log(is_power_of_two(u32(16)));  // true
console.log(is_power_of_two(u32(18)));  // false

// Count set bits
console.log(count_ones(u32(15)));  // 4 (1111 has four 1s)
console.log(count_ones(u32(0)));   // 0 (no bits set)

// Practical example: working with flags
const FLAG_READ = u32(1);      // 0001
const FLAG_WRITE = u32(2);     // 0010
const FLAG_EXECUTE = u32(4);   // 0100

// Set permissions
let permissions = u32(0);
permissions = bitwise_or(permissions, FLAG_READ);
permissions = bitwise_or(permissions, FLAG_WRITE);

// Check permissions
const canRead = bitwise_and(permissions, FLAG_READ) !== u32(0);
const canExecute = bitwise_and(permissions, FLAG_EXECUTE) !== u32(0);
console.log(canRead);     // true
console.log(canExecute);  // false`}</Pre>
            </CodeBlock>

            <SmallText>
              Bitwise operations are commonly used for flags, permissions, data
              compression, and low-level optimizations. MiLost provides
              type-safety on top of these powerful operations.
            </SmallText>
          </>
        )}

        {activeCategory === "formatting" && (
          <>
            <InfoBox>
              MiLost provides utilities for formatting numeric values in various
              bases and representations, which is useful for debugging, display,
              and interacting with low-level systems.
            </InfoBox>

            <FormGroup>
              <Label>Formatting Utilities</Label>
              <ul>
                <li>
                  <strong>format_bin</strong>: Format as binary string
                </li>
                <li>
                  <strong>format_hex</strong>: Format as hexadecimal string
                </li>
                <li>
                  <strong>format_oct</strong>: Format as octal string
                </li>
                <li>
                  <strong>format_int</strong>: Format as integer with custom
                  radix and padding
                </li>
                <li>
                  <strong>format_float</strong>: Format floating point with
                  precision
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { 
  u32, u8, f32,
  format_bin, 
  format_hex, 
  format_oct,
  format_int,
  format_float
} from 'milost';

const value = u32(42);

// Convert to different bases
console.log(format_bin(value));  // "101010"
console.log(format_hex(value));  // "2a"
console.log(format_oct(value));  // "52"

// Custom formatting
console.log(format_int(value, u8(16), u8(4)));  // "002a" (hex with padding)
console.log(format_int(value, u8(2), u8(8)));   // "00101010" (binary with padding)

// Floating point formatting
const pi = f32(3.14159);
console.log(format_float(pi, u8(2)));  // "3.14"
console.log(format_float(pi, u8(4)));  // "3.1416"

// Practical examples
function formatFileSize(bytes) {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${format_float(f32(bytes / 1024), u8(1))} KB\`;
  return \`\${format_float(f32(bytes / (1024 * 1024)), u8(2))} MB\`;
}

console.log(formatFileSize(500));       // "500 B"
console.log(formatFileSize(2048));      // "2.0 KB"
console.log(formatFileSize(1536000));   // "1.46 MB"

// Format a color as hexadecimal (common in web development)
function rgbToHex(r, g, b) {
  return "#" + 
    format_int(u32(r), u8(16), u8(2)) +
    format_int(u32(g), u8(16), u8(2)) +
    format_int(u32(b), u8(16), u8(2));
}

console.log(rgbToHex(255, 128, 0));  // "#ff8000" (orange)`}</Pre>
            </CodeBlock>

            <SmallText>
              Formatting functions provide a safe, consistent way to convert
              numeric values to strings for various purposes, from UI display to
              data serialization.
            </SmallText>
          </>
        )}

        {activeCategory === "conversion" && (
          <>
            <InfoBox>
              Type conversion is necessary when working with different numeric
              types. MiLost provides safe conversion functions that preserve
              value integrity and prevent data loss.
            </InfoBox>

            <FormGroup>
              <Label>Safe Type Conversion</Label>
              <p>
                Converting between numeric types can lead to overflow,
                underflow, or precision loss. MiLost's conversion functions are
                explicit and type-safe.
              </p>
              <ul>
                <li>
                  <strong>u8_to_u16, u8_to_u32</strong>: Widen unsigned integers
                  (always safe)
                </li>
                <li>
                  <strong>i8_to_i16, i8_to_i32</strong>: Widen signed integers
                  (always safe)
                </li>
                <li>
                  <strong>Explicit type constructors</strong>: For narrowing
                  conversions that require validation
                </li>
              </ul>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { 
  u8, u16, u32, i8, i16, f32,
  u8_to_u16, u8_to_u32, i8_to_i16
} from 'milost';

// Safe widening conversions
const small = u8(42);
const medium = u8_to_u16(small);  // u16(42) - always safe
const large = u8_to_u32(small);   // u32(42) - always safe

// Signed widening conversions
const negative = i8(-10);
const widerNegative = i8_to_i16(negative);  // i16(-10) - always safe

// Explicit narrowing conversions (may fail at runtime)
try {
  const narrowed = u8(u16(300));  // Throws - out of u8 range
} catch (e) {
  console.error(e.message);  // "Invalid value for type u8: 300"
}

// Converting between numeric types
function celsiusToFahrenheit(celsius) {
  // Safe arithmetic with mixed types
  const calculation = f32(celsius * 1.8 + 32);
  return calculation;
}

// Converting for external APIs that expect specific types
function sendUInt8Array(values) {
  // Convert our safe types to JavaScript standard types for APIs
  const buffer = new Uint8Array(values.length);
  values.forEach((value, i) => {
    buffer[i] = value;  // Automatic conversion via valueOf()
  });
  return buffer;
}

const safeBytes = [u8(10), u8(20), u8(30)];
const buffer = sendUInt8Array(safeBytes);`}</Pre>
            </CodeBlock>

            <FormGroup>
              <Label>Best Practices for Type Conversion</Label>
              <ol>
                <li>
                  Prefer widening conversions whenever possible, as they never
                  lose information
                </li>
                <li>
                  Be explicit about narrowing conversions and handle potential
                  failures
                </li>
                <li>
                  Use the most appropriate type for each stage of your
                  calculations
                </li>
                <li>
                  Convert to standard JavaScript types only at API boundaries
                </li>
              </ol>
            </FormGroup>

            <SmallText>
              Explicit type conversions make code more self-documenting and
              prevent subtle bugs that can occur when the system implicitly
              converts between different numeric representations.
            </SmallText>
          </>
        )}
      </Card>

      <Card>
        <CardTitle>Primitive Types API Examples</CardTitle>

        <CodeBlock>
          <Pre>{`import { 
  u8, u16, u32, u64, 
  i8, i16, i32, i64, 
  f32, f64,
  format_bin,
  format_hex,
  format_oct,
  bitwise_and,
  bitwise_or,
  add_u32,
  sub_u32,
  mul_u32,
  div_u32
} from "milost";

// Creating primitive values with type safety
const unsignedByte = u8(255);     // u8: 0-255
const signedInt = i32(-2147483648); // i32: -2^31 to 2^31 - 1
const floatValue = f32(3.14159);  // 32-bit float

// Arithmetic with overflow checking
const addResult = add_u32(u32(10), u32(20));
if (addResult.isOk()) {
  console.log(addResult.unwrap()); // Safe addition
}

const maxU32 = u32(0xffffffff);
const overflowResult = add_u32(maxU32, u32(1));
if (overflowResult.isErr()) {
  console.log(overflowResult.unwrapErr().message); 
  // "Addition would overflow u32: 4294967295 + 1"
}

// Bitwise operations
const andResult = bitwise_and(u32(5), u32(3));
console.log(andResult); // Bitwise AND: 1 (binary 0101 & 0011 = 0001)

const orResult = bitwise_or(u32(5), u32(3));
console.log(orResult);  // Bitwise OR: 7 (binary 0101 | 0011 = 0111)

// Formatting numbers
const binaryRepresentation = format_bin(u32(42));
const hexRepresentation = format_hex(u32(255));
const octalRepresentation = format_oct(u32(64));

console.log(binaryRepresentation);  // "101010"
console.log(hexRepresentation);     // "ff"
console.log(octalRepresentation);   // "100"

// Type conversion with safety checks
function safeConversion(value) {
  try {
    // Try to convert to u8 (will throw if out of range)
    const byteValue = u8(value);
    return \`Successfully converted to u8: \${byteValue}\`;
  } catch (error) {
    // Handle conversion failure
    return \`Conversion failed: \${error.message}\`;
  }
}

console.log(safeConversion(42));   // "Successfully converted to u8: 42"
console.log(safeConversion(300));  // "Conversion failed: Invalid value for type u8: 300"

// Practical example: Color manipulation with bitwise operations
function extractRgbComponents(rgbValue) {
  const value = u32(rgbValue);
  const r = u8(bitwise_and(bitwise_and(shift_right(value, u32(16)), u32(0xFF))));
  const g = u8(bitwise_and(bitwise_and(shift_right(value, u32(8)), u32(0xFF))));
  const b = u8(bitwise_and(value, u32(0xFF)));
  return { r, g, b };
}

const color = 0xFF5500;  // Orange
const { r, g, b } = extractRgbComponents(color);
console.log(\`RGB: \${r}, \${g}, \${b}\`);  // "RGB: 255, 85, 0"`}</Pre>
        </CodeBlock>

        <SmallText>
          MiLost's primitive types provide precise control over numeric values
          with built-in safety checks. By using these types, you can prevent
          many common programming errors and create more reliable code.
        </SmallText>
      </Card>
    </Container>
  );
}

export default PrimitivesPage;
