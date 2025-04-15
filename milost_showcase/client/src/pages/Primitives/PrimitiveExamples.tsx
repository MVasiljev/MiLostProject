import {
  Card,
  CardTitle,
  CodeBlock,
  Pre,
  SmallText,
} from "./Primitives.styles";

function PrimitiveExamples() {
  return (
    <Card>
      <CardTitle>Primitive Type Examples</CardTitle>

      <CodeBlock>
        <Pre>
          {`import { 
  u8, u16, u32, u64, 
  i8, i16, i32, i64, 
  f32, f64,
  format_bin,
  format_hex,
  format_oct,
  bitwise_and,
  bitwise_or
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

// Bitwise operations
const andResult = bitwise_and(u32(5), u32(3));
console.log(andResult); // Bitwise AND: 1 (binary 0101 & 0011 = 0001)

// Formatting numbers
const binaryRepresentation = format_bin(u32(42));
const hexRepresentation = format_hex(u32(255));
const octalRepresentation = format_oct(u32(64));

console.log(binaryRepresentation);  // "101010"
console.log(hexRepresentation);     // "ff"
console.log(octalRepresentation);   // "100"

// Bit manipulation
const isPowerOfTwo = is_power_of_two(u32(16));  // true
const nextPowerOfTwo = next_power_of_two(u32(50)); // 64
const leadingZerosCount = leading_zeros(u32(16)); // Number of leading zero bits
const trailingZerosCount = trailing_zeros(u32(16)); // Number of trailing zero bits
const onesCount = count_ones(u32(42)); // Number of 1 bits in binary representation

// Type conversion with safety checks
const convertToF32 = f32(u32(42));
const convertToI64 = i64(f32(3.14));

// Validation
const validateU8 = (value: number) => {
  try {
    const safeValue = u8(value);
    console.log("Valid u8 value:", safeValue);
  } catch (error) {
    console.error("Value out of u8 range");
  }
}

validateU8(255);  // Valid
validateU8(256);  // Throws error`}
        </Pre>
      </CodeBlock>

      <SmallText>
        MiLost's primitive types provide type-safe, Rust-inspired number
        handling with built-in overflow and range checking. Operations return
        Result types to handle potential errors gracefully.
      </SmallText>
    </Card>
  );
}

export default PrimitiveExamples;
