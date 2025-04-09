import { ValidationError, Result, Ok, Err } from "../core/index";
import { Brand } from "./branding";
import { Str } from "./string";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";
import { callWasmStaticMethod } from "../initWasm/lib";

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

export type byte = u8;
export type short = i16;
export type int = i32;
export type long = i64;
export type uint = u32;
export type ulong = u64;
export type float = f32;
export type double = f64;

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

export function validateU8(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateU8(n);
    } catch (error) {
      console.warn(`WASM validateU8 failed, using JS fallback: ${error}`);
    }
  }
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 255;
}

export function validateU16(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateU16(n);
    } catch (error) {
      console.warn(`WASM validateU16 failed, using JS fallback: ${error}`);
    }
  }
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 65535;
}

export function validateU32(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateU32(n);
    } catch (error) {
      console.warn(`WASM validateU32 failed, using JS fallback: ${error}`);
    }
  }
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 0xffffffff;
}

export function validateI8(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateI8(n);
    } catch (error) {
      console.warn(`WASM validateI8 failed, using JS fallback: ${error}`);
    }
  }
  return Number.isFinite(n) && Number.isInteger(n) && n >= -128 && n <= 127;
}

export function validateI16(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateI16(n);
    } catch (error) {
      console.warn(`WASM validateI16 failed, using JS fallback: ${error}`);
    }
  }
  return Number.isFinite(n) && Number.isInteger(n) && n >= -32768 && n <= 32767;
}

export function validateI32(n: number): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.validateI32(n);
    } catch (error) {
      console.warn(`WASM validateI32 failed, using JS fallback: ${error}`);
    }
  }
  return (
    Number.isFinite(n) &&
    Number.isInteger(n) &&
    n >= -2147483648 &&
    n <= 2147483647
  );
}

export function u8(v: RawNumber): u8 {
  if (!validateU8(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type u8: ${v}`));
  }
  return v as u8;
}

export function u16(v: RawNumber): u16 {
  if (!validateU16(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type u16: ${v}`));
  }
  return v as u16;
}

export function u32(v: RawNumber): u32 {
  if (!validateU32(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type u32: ${v}`));
  }
  return v as u32;
}

export function u64(v: RawNumber): u64 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      if (!primitives.validateU64(v)) {
        throw new ValidationError(
          Str.fromRaw(`Invalid value for type u64: ${v}`)
        );
      }
      return v as u64;
    } catch (error) {
      console.warn(`WASM validateU64 failed, using JS fallback: ${error}`);
    }
  }

  if (
    !Number.isFinite(v) ||
    !Number.isInteger(v) ||
    v < 0 ||
    v > Number.MAX_SAFE_INTEGER
  ) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type u64: ${v}`));
  }
  return v as u64;
}

export function i8(v: RawNumber): i8 {
  if (!validateI8(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type i8: ${v}`));
  }
  return v as i8;
}

export function i16(v: RawNumber): i16 {
  if (!validateI16(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type i16: ${v}`));
  }
  return v as i16;
}

export function i32(v: RawNumber): i32 {
  if (!validateI32(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type i32: ${v}`));
  }
  return v as i32;
}

export function i64(v: RawNumber): i64 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      if (!primitives.validateI64(v)) {
        throw new ValidationError(
          Str.fromRaw(`Invalid value for type i64: ${v}`)
        );
      }
      return v as i64;
    } catch (error) {
      console.warn(`WASM validateI64 failed, using JS fallback: ${error}`);
    }
  }

  if (
    !Number.isFinite(v) ||
    !Number.isInteger(v) ||
    v < Number.MIN_SAFE_INTEGER ||
    v > Number.MAX_SAFE_INTEGER
  ) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type i64: ${v}`));
  }
  return v as i64;
}

export function f32(v: RawNumber): f32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      if (!primitives.validateF32(v)) {
        throw new ValidationError(
          Str.fromRaw(`Invalid value for type f32: ${v}`)
        );
      }
      return v as f32;
    } catch (error) {
      console.warn(`WASM validateF32 failed, using JS fallback: ${error}`);
    }
  }

  if (!Number.isFinite(v) || v < -3.40282347e38 || v > 3.40282347e38) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type f32: ${v}`));
  }
  return v as f32;
}

export function f64(v: RawNumber): f64 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      if (!primitives.validateF64(v)) {
        throw new ValidationError(
          Str.fromRaw(`Invalid value for type f64: ${v}`)
        );
      }
      return v as f64;
    } catch (error) {
      console.warn(`WASM validateF64 failed, using JS fallback: ${error}`);
    }
  }

  if (!Number.isFinite(v)) {
    throw new ValidationError(Str.fromRaw(`Invalid value for type f64: ${v}`));
  }
  return v as f64;
}

export function add_u8(a: u8, b: u8): Result<u8, ValidationError> {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      const result = primitives.add_u8(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u8: ${a} + ${b}`)
          )
        );
      }

      return Ok(result as u8);
    } catch (error) {
      console.warn(`WASM add_u8 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as number) + (b as number);
  if (sum > 255) {
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
      const primitives = new wasmModule.Primitives();
      const result = primitives.add_u16(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u16: ${a} + ${b}`)
          )
        );
      }

      return Ok(result as u16);
    } catch (error) {
      console.warn(`WASM add_u16 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as number) + (b as number);
  if (sum > 65535) {
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
      const primitives = new wasmModule.Primitives();
      const result = primitives.add_u32(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Addition would overflow u32: ${a} + ${b}`)
          )
        );
      }

      return Ok(result as u32);
    } catch (error) {
      console.warn(`WASM add_u32 failed, using JS fallback: ${error}`);
    }
  }

  const sum = (a as number) + (b as number);
  if (sum > 0xffffffff) {
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
      const primitives = new wasmModule.Primitives();
      const result = primitives.sub_u32(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b}`)
          )
        );
      }

      return Ok(result as u32);
    } catch (error) {
      console.warn(`WASM sub_u32 failed, using JS fallback: ${error}`);
    }
  }

  const diff = (a as number) - (b as number);
  if (diff < 0) {
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
      const primitives = new wasmModule.Primitives();
      const result = primitives.mul_u32(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(
            Str.fromRaw(`Multiplication would overflow u32: ${a} * ${b}`)
          )
        );
      }

      return Ok(result as u32);
    } catch (error) {
      console.warn(`WASM mul_u32 failed, using JS fallback: ${error}`);
    }
  }

  const product = (a as number) * (b as number);
  if (product > 0xffffffff) {
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
      const primitives = new wasmModule.Primitives();
      const result = primitives.div_u32(a as number, b as number);

      if (result === null || result === undefined) {
        return Err(
          new ValidationError(Str.fromRaw(`Division by zero: ${a} / ${b}`))
        );
      }

      return Ok(result as u32);
    } catch (error) {
      console.warn(`WASM div_u32 failed, using JS fallback: ${error}`);
    }
  }

  if ((b as number) === 0) {
    return Err(
      new ValidationError(Str.fromRaw(`Division by zero: ${a} / ${b}`))
    );
  }
  return Ok(u32(Math.floor((a as number) / (b as number))));
}

export function u8_to_u16(value: u8): u16 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.u8_to_u16(value as number) as u16;
    } catch (error) {
      console.warn(`WASM u8_to_u16 failed, using JS fallback: ${error}`);
    }
  }
  return u16(value as number);
}

export function u8_to_u32(value: u8): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.u8_to_u32(value as number) as u32;
    } catch (error) {
      console.warn(`WASM u8_to_u32 failed, using JS fallback: ${error}`);
    }
  }
  return u32(value as number);
}

export function i8_to_i16(value: i8): i16 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.i8_to_i16(value as number) as i16;
    } catch (error) {
      console.warn(`WASM i8_to_i16 failed, using JS fallback: ${error}`);
    }
  }
  return i16(value as number);
}

export function i8_to_i32(value: i8): i32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.i8_to_i32(value as number) as i32;
    } catch (error) {
      console.warn(`WASM i8_to_i32 failed, using JS fallback: ${error}`);
    }
  }
  return i32(value as number);
}

export function format_bin(v: u32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.format_bin(v as number);
    } catch (error) {
      console.warn(`WASM format_bin failed, using JS fallback: ${error}`);
    }
  }
  return (v as number).toString(2);
}

export function format_hex(v: u32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.format_hex(v as number);
    } catch (error) {
      console.warn(`WASM format_hex failed, using JS fallback: ${error}`);
    }
  }
  return (v as number).toString(16);
}

export function format_oct(v: u32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.format_oct(v as number);
    } catch (error) {
      console.warn(`WASM format_oct failed, using JS fallback: ${error}`);
    }
  }
  return (v as number).toString(8);
}

export function format_int(v: u32, radix: u8, pad: u8): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.format_int(v as number, radix as number, pad as number);
    } catch (error) {
      console.warn(`WASM format_int failed, using JS fallback: ${error}`);
    }
  }
  const raw = (v as number).toString(radix as number);
  return raw.padStart(pad as number, "0");
}

export function format_float(v: f32, digits: u8 = u8(2)): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.format_float(v as number, digits as number);
    } catch (error) {
      console.warn(`WASM format_float failed, using JS fallback: ${error}`);
    }
  }
  return (v as number).toFixed(digits as number);
}

export function is_power_of_two(v: u32): boolean {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.isPowerOfTwo(v as number);
    } catch (error) {
      console.warn(`WASM isPowerOfTwo failed, using JS fallback: ${error}`);
    }
  }
  const raw = v as number;
  return raw > 0 && (raw & (raw - 1)) === 0;
}

export function next_power_of_two(v: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.nextPowerOfTwo(v as number));
    } catch (error) {
      console.warn(`WASM nextPowerOfTwo failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as number;
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
      const primitives = new wasmModule.Primitives();
      return u32(primitives.leadingZeros(v as number));
    } catch (error) {
      console.warn(`WASM leadingZeros failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as number;
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
      const primitives = new wasmModule.Primitives();
      return u32(primitives.trailingZeros(v as number));
    } catch (error) {
      console.warn(`WASM trailingZeros failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as number;
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
      const primitives = new wasmModule.Primitives();
      return u32(primitives.countOnes(v as number));
    } catch (error) {
      console.warn(`WASM countOnes failed, using JS fallback: ${error}`);
    }
  }

  let raw = v as number;
  let count = 0;
  while (raw !== 0) {
    count += raw & 1;
    raw >>>= 1;
  }
  return u32(count);
}

export function bitwise_and(a: u32, b: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.bitwise_and(a as number, b as number));
    } catch (error) {
      console.warn(`WASM bitwise_and failed, using JS fallback: ${error}`);
    }
  }
  return u32((a as number) & (b as number));
}

export function bitwise_or(a: u32, b: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.bitwise_or(a as number, b as number));
    } catch (error) {
      console.warn(`WASM bitwise_or failed, using JS fallback: ${error}`);
    }
  }
  return u32((a as number) | (b as number));
}

export function bitwise_xor(a: u32, b: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.bitwise_xor(a as number, b as number));
    } catch (error) {
      console.warn(`WASM bitwise_xor failed, using JS fallback: ${error}`);
    }
  }
  return u32((a as number) ^ (b as number));
}

export function bitwise_not(a: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.bitwise_not(a as number));
    } catch (error) {
      console.warn(`WASM bitwise_not failed, using JS fallback: ${error}`);
    }
  }
  return u32(~(a as number) & 0xffffffff);
}

export function shift_left(a: u32, bits: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.shift_left(a as number, bits as number));
    } catch (error) {
      console.warn(`WASM shift_left failed, using JS fallback: ${error}`);
    }
  }
  return u32((a as number) << (bits as number));
}

export function shift_right(a: u32, bits: u32): u32 {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return u32(primitives.shift_right(a as number, bits as number));
    } catch (error) {
      console.warn(`WASM shift_right failed, using JS fallback: ${error}`);
    }
  }
  return u32((a as number) >>> (bits as number));
}

export function to_binary(value: i32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.to_binary(value as number);
    } catch (error) {
      console.warn(`WASM to_binary failed, using JS fallback: ${error}`);
    }
  }
  return (value as number).toString(2);
}

export function to_hex(value: i32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.to_hex(value as number);
    } catch (error) {
      console.warn(`WASM to_hex failed, using JS fallback: ${error}`);
    }
  }
  return (value as number).toString(16);
}

export function to_octal(value: i32): string {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const primitives = new wasmModule.Primitives();
      return primitives.to_octal(value as number);
    } catch (error) {
      console.warn(`WASM to_octal failed, using JS fallback: ${error}`);
    }
  }
  return (value as number).toString(8);
}

export const Byte = u8;
export const Short = i16;
export const Int = i32;
export const Long = i64;
export const UInt = u32;
export const ULong = u64;
export const Float = f32;
export const Double = f64;
