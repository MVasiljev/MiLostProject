import { ValidationError, Result, Ok, Err } from "../core/index.js";
import { Brand } from "./branding.js";
import { Str } from "./string.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

type RawNumber = number;

export type u8 = Brand<RawNumber, Str>;
export type u16 = Brand<RawNumber, Str>;
export type u32 = Brand<RawNumber, Str>;
export type u64 = Brand<RawNumber, Str>;
export type usize = Brand<RawNumber, Str>;
export type i8 = Brand<RawNumber, Str>;
export type i16 = Brand<RawNumber, Str>;
export type i32 = Brand<RawNumber, Str>;
export type i64 = Brand<RawNumber, Str>;
export type isize = Brand<RawNumber, Str>;
export type f32 = Brand<RawNumber, Str>;
export type f64 = Brand<RawNumber, Str>;

export const limits = {
  u8: [0, 255],
  u16: [0, 65535],
  u32: [0, 0xffffffff],
  u64: [0, Number.MAX_SAFE_INTEGER],
  usize: [0, Number.MAX_SAFE_INTEGER],
  i8: [-128, 127],
  i16: [-32768, 32767],
  i32: [-2147483648, 2147483647],
  i64: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  isize: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  f32: [-3.40282347e38, 3.40282347e38],
  f64: [Number.MIN_VALUE, Number.MAX_VALUE],
} as const;

const isInt = (n: RawNumber): boolean => Number.isInteger(n);
const isFiniteNum = (n: RawNumber): boolean =>
  typeof n === "number" && isFinite(n);

function validate(name: keyof typeof limits, value: RawNumber): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;

      switch (name) {
        case "u8":
          return primitives.validateU8(value);
        case "u16":
          return primitives.validateU16(value);
        case "u32":
          return primitives.validateU32(value);
        case "i8":
          return primitives.validateI8(value);
        case "i16":
          return primitives.validateI16(value);
        case "i32":
          return primitives.validateI32(value);
        case "f32":
          return primitives.validateF32(value);
        case "f64":
          return primitives.validateF64(value);
      }
    } catch (error) {
      console.warn(
        `WASM validation failed, falling back to JS implementation: ${error}`
      );
    }
  }

  const [min, max] = limits[name];
  return name.startsWith("f")
    ? isFiniteNum(value)
    : isInt(value) && value >= min && value <= max;
}

function wrap<T>(name: keyof typeof limits, value: RawNumber): T {
  if (!validate(name, value)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type: ${name}`));
  }
  return value as T;
}

function safeWrap<T>(
  name: keyof typeof limits,
  value: RawNumber
): Result<T, ValidationError> {
  return validate(name, value)
    ? Ok(value as T)
    : Err(new ValidationError(Str.fromRaw(`Invalid value for type: ${name}`)));
}

export const u8 = (v: RawNumber): u8 => wrap("u8", v);
export const u16 = (v: RawNumber): u16 => wrap("u16", v);
export const u32 = (v: RawNumber): u32 => wrap("u32", v);
export const u64 = (v: RawNumber): u64 => wrap("u64", v);
export const usize = (v: RawNumber): usize => wrap("usize", v);
export const i8 = (v: RawNumber): i8 => wrap("i8", v);
export const i16 = (v: RawNumber): i16 => wrap("i16", v);
export const i32 = (v: RawNumber): i32 => wrap("i32", v);
export const i64 = (v: RawNumber): i64 => wrap("i64", v);
export const isize = (v: RawNumber): isize => wrap("isize", v);
export const f32 = (v: RawNumber): f32 => wrap("f32", v);
export const f64 = (v: RawNumber): f64 => wrap("f64", v);

export type byte = u8;
export type short = i16;
export type int = i32;
export type long = i64;
export type uint = u32;
export type ulong = u64;
export type float = f32;
export type double = f64;

export async function initPrimitives(): Promise<void> {
  if (!isWasmInitialized()) {
    try {
      await initWasm();
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
}

export function format_bin(v: u32): Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return Str.fromRaw(primitives.formatBin(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM formatBin failed, using JS fallback: ${error}`);
    }
  }
  return Str.fromRaw((v as unknown as RawNumber).toString(2));
}

export function format_hex(v: u32): Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return Str.fromRaw(primitives.formatHex(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM formatHex failed, using JS fallback: ${error}`);
    }
  }
  return Str.fromRaw((v as unknown as RawNumber).toString(16));
}

export function format_oct(v: u32): Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return Str.fromRaw(primitives.formatOct(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM formatOct failed, using JS fallback: ${error}`);
    }
  }
  return Str.fromRaw((v as unknown as RawNumber).toString(8));
}

export function format_int(v: u32, radix: u8, pad: u8): Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return Str.fromRaw(
        primitives.formatInt(
          v as unknown as RawNumber,
          radix as unknown as RawNumber,
          pad as unknown as RawNumber
        )
      );
    } catch (error) {
      console.warn(`WASM formatInt failed, using JS fallback: ${error}`);
    }
  }
  const raw = (v as unknown as RawNumber).toString(radix as unknown as number);
  return Str.fromRaw(raw.padStart(pad as unknown as number, "0"));
}

export function format_float(v: f32, digits: u8 = u8(2)): Str {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return Str.fromRaw(
        primitives.formatFloat(
          v as unknown as RawNumber,
          digits as unknown as RawNumber
        )
      );
    } catch (error) {
      console.warn(`WASM formatFloat failed, using JS fallback: ${error}`);
    }
  }
  return Str.fromRaw(
    (v as unknown as RawNumber).toFixed(digits as unknown as number)
  );
}

export function is_power_of_two(v: u32): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return primitives.isPowerOfTwo(v as unknown as RawNumber);
    } catch (error) {
      console.warn(`WASM isPowerOfTwo failed, using JS fallback: ${error}`);
    }
  }
  const raw = v as unknown as RawNumber;
  return raw > 0 && (raw & (raw - 1)) === 0;
}

export function next_power_of_two(v: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return u32(primitives.nextPowerOfTwo(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM nextPowerOfTwo failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as unknown as RawNumber;
  if (raw <= 0) return u32(1);
  raw--;
  raw |= raw >> 1;
  raw |= raw >> 2;
  raw |= raw >> 4;
  raw |= raw >> 8;
  raw |= raw >> 16;
  return u32(raw + 1);
}

export function leading_zeros(v: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return u32(primitives.leadingZeros(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM leadingZeros failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as unknown as RawNumber;
  if (raw === 0) return u32(32);
  let count = 0;
  while ((raw & 0x80000000) === 0) {
    count++;
    raw <<= 1;
  }
  return u32(count);
}

export function trailing_zeros(v: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return u32(primitives.trailingZeros(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM trailingZeros failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as unknown as RawNumber;
  if (raw === 0) return u32(32);
  let count = 0;
  while ((raw & 1) === 0) {
    count++;
    raw >>= 1;
  }
  return u32(count);
}

export function count_ones(v: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      return u32(primitives.countOnes(v as unknown as RawNumber));
    } catch (error) {
      console.warn(`WASM countOnes failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as unknown as RawNumber;
  let count = 0;
  while (raw !== 0) {
    count += raw & 1;
    raw >>>= 1;
  }
  return u32(count);
}

export function add_u8(a: u8, b: u8): Result<u8, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.addU8(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u8: ${a} + ${b}`)
          )
        );
      }

      return Ok(u8(result));
    } catch (error) {
      console.warn(`WASM addU8 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as unknown as number) + (b as unknown as number);
  if (sum > limits.u8[1]) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Addition would overflow u8: ${a} + ${b} = ${sum}`)
      )
    );
  }
  return Ok(u8(sum));
}

export function add_u16(a: u16, b: u16): Result<u16, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.addU16(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u16: ${a} + ${b}`)
          )
        );
      }

      return Ok(u16(result));
    } catch (error) {
      console.warn(`WASM addU16 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as unknown as number) + (b as unknown as number);
  if (sum > limits.u16[1]) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Addition would overflow u16: ${a} + ${b} = ${sum}`)
      )
    );
  }
  return Ok(u16(sum));
}

export function add_u32(a: u32, b: u32): Result<u32, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.addU32(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u32: ${a} + ${b}`)
          )
        );
      }

      return Ok(u32(result));
    } catch (error) {
      console.warn(`WASM addU32 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as unknown as number) + (b as unknown as number);
  if (sum > limits.u32[1]) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Addition would overflow u32: ${a} + ${b} = ${sum}`)
      )
    );
  }
  return Ok(u32(sum));
}

export function sub_u32(a: u32, b: u32): Result<u32, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.subU32(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b}`)
          )
        );
      }

      return Ok(u32(result));
    } catch (error) {
      console.warn(`WASM subU32 failed, using JS fallback: ${error}`);
    }
  }

  const diff = (a as unknown as number) - (b as unknown as number);
  if (diff < limits.u32[0]) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b} = ${diff}`)
      )
    );
  }
  return Ok(u32(diff));
}

export function mul_u32(a: u32, b: u32): Result<u32, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.mulU32(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Multiplication would overflow u32: ${a} * ${b}`)
          )
        );
      }

      return Ok(u32(result));
    } catch (error) {
      console.warn(`WASM mulU32 failed, using JS fallback: ${error}`);
    }
  }

  const product = (a as unknown as number) * (b as unknown as number);
  if (product > limits.u32[1]) {
    return Err(
      new ValidationError(
        Str.fromRaw(
          `Multiplication would overflow u32: ${a} * ${b} = ${product}`
        )
      )
    );
  }
  return Ok(u32(product));
}

export function div_u32(a: u32, b: u32): Result<u32, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = wasmModule.Primitives;
      const result = primitives.divU32(
        a as unknown as RawNumber,
        b as unknown as RawNumber
      );

      if (result === null || result === undefined) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
      }

      return Ok(u32(result));
    } catch (error) {
      console.warn(`WASM divU32 failed, using JS fallback: ${error}`);
    }
  }

  const bValue = b as unknown as number;
  if (bValue === 0) {
    return Err(new ValidationError(Str.fromRaw("Division by zero")));
  }
  return Ok(u32(Math.floor((a as unknown as number) / bValue)));
}

export function u8_to_u16(value: u8): u16 {
  return u16(value as unknown as number);
}

export function u8_to_u32(value: u8): u32 {
  return u32(value as unknown as number);
}

export function u8_to_u64(value: u8): u64 {
  return u64(value as unknown as number);
}

export function u16_to_u32(value: u16): u32 {
  return u32(value as unknown as number);
}

export function u16_to_u64(value: u16): u64 {
  return u64(value as unknown as number);
}

export function u32_to_u64(value: u32): u64 {
  return u64(value as unknown as number);
}

export function i8_to_i16(value: i8): i16 {
  return i16(value as unknown as number);
}

export function i8_to_i32(value: i8): i32 {
  return i32(value as unknown as number);
}

export function i8_to_i64(value: i8): i64 {
  return i64(value as unknown as number);
}

export function i16_to_i32(value: i16): i32 {
  return i32(value as unknown as number);
}

export function i16_to_i64(value: i16): i64 {
  return i64(value as unknown as number);
}

export function i32_to_i64(value: i32): i64 {
  return i64(value as unknown as number);
}

export function f32_to_f64(value: f32): f64 {
  return f64(value as unknown as number);
}

export function u8_to_i8(value: u8): Result<i8, ValidationError> {
  const num = value as unknown as number;
  if (num > limits.i8[1]) {
    return Err(
      new ValidationError(Str.fromRaw(`Value ${num} is too large for i8`))
    );
  }
  return Ok(i8(num));
}

export function u16_to_i16(value: u16): Result<i16, ValidationError> {
  const num = value as unknown as number;
  if (num > limits.i16[1]) {
    return Err(
      new ValidationError(Str.fromRaw(`Value ${num} is too large for i16`))
    );
  }
  return Ok(i16(num));
}

export function u32_to_i32(value: u32): Result<i32, ValidationError> {
  const num = value as unknown as number;
  if (num > limits.i32[1]) {
    return Err(
      new ValidationError(Str.fromRaw(`Value ${num} is too large for i32`))
    );
  }
  return Ok(i32(num));
}

export function i8_to_u8(value: i8): Result<u8, ValidationError> {
  const num = value as unknown as number;
  if (num < 0) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Cannot convert negative value ${num} to u8`)
      )
    );
  }
  return Ok(u8(num));
}

export function i16_to_u16(value: i16): Result<u16, ValidationError> {
  const num = value as unknown as number;
  if (num < 0) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Cannot convert negative value ${num} to u16`)
      )
    );
  }
  return Ok(u16(num));
}

export function i32_to_u32(value: i32): Result<u32, ValidationError> {
  const num = value as unknown as number;
  if (num < 0) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Cannot convert negative value ${num} to u32`)
      )
    );
  }
  return Ok(u32(num));
}

export function f32_to_i32(value: f32): Result<i32, ValidationError> {
  const num = value as unknown as number;
  if (!Number.isInteger(num)) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Cannot convert non-integer value ${num} to i32`)
      )
    );
  }
  if (num < limits.i32[0] || num > limits.i32[1]) {
    return Err(
      new ValidationError(Str.fromRaw(`Value ${num} is outside i32 range`))
    );
  }
  return Ok(i32(num));
}

export function f64_to_i64(value: f64): Result<i64, ValidationError> {
  const num = value as unknown as number;
  if (!Number.isInteger(num)) {
    return Err(
      new ValidationError(
        Str.fromRaw(`Cannot convert non-integer value ${num} to i64`)
      )
    );
  }
  if (num < limits.i64[0] || num > limits.i64[1]) {
    return Err(
      new ValidationError(Str.fromRaw(`Value ${num} is outside i64 range`))
    );
  }
  return Ok(i64(num));
}

export function i32_to_f32(value: i32): f32 {
  return f32(value as unknown as number);
}

export function i64_to_f64(value: i64): f64 {
  return f64(value as unknown as number);
}

export const Byte = u8;
export const Short = i16;
export const Int = i32;
export const Long = i64;
export const UInt = u32;
export const ULong = u64;
export const Float = f32;
export const Double = f64;

export function to_binary(value: number): string {
  return value.toString(2);
}

export function to_hex(value: number): string {
  return value.toString(16);
}

export function to_octal(value: number): string {
  return value.toString(8);
}
