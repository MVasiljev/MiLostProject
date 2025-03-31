import { ValidationError, Ok, Err } from "../core";
import { Str } from "./string";
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
};
const isInt = (n) => Number.isInteger(n);
const isFiniteNum = (n) => typeof n === "number" && isFinite(n);
function validate(name, value) {
    const [min, max] = limits[name];
    return name.startsWith("f")
        ? isFiniteNum(value)
        : isInt(value) && value >= min && value <= max;
}
function wrap(name, value) {
    if (!validate(name, value)) {
        throw new ValidationError(Str.fromRaw("Invalid value for type: " + name));
    }
    return value;
}
function safeWrap(name, value) {
    return validate(name, value)
        ? Ok(value)
        : Err(new ValidationError(Str.fromRaw("Invalid value for type: " + name)));
}
export const u8 = (v) => wrap("u8", v);
export const u16 = (v) => wrap("u16", v);
export const u32 = (v) => wrap("u32", v);
export const u64 = (v) => wrap("u64", v);
export const usize = (v) => wrap("usize", v);
export const i8 = (v) => wrap("i8", v);
export const i16 = (v) => wrap("i16", v);
export const i32 = (v) => wrap("i32", v);
export const i64 = (v) => wrap("i64", v);
export const isize = (v) => wrap("isize", v);
export const f32 = (v) => wrap("f32", v);
export const f64 = (v) => wrap("f64", v);
// Format helpers
export function format_bin(v) {
    return Str.fromRaw(v.toString(2));
}
export function format_hex(v) {
    return Str.fromRaw(v.toString(16));
}
export function format_oct(v) {
    return Str.fromRaw(v.toString(8));
}
export function format_int(v, radix, pad) {
    const raw = v.toString(radix);
    return Str.fromRaw(raw.padStart(pad, "0"));
}
export function format_float(v, digits = u8(2)) {
    return Str.fromRaw(v.toFixed(digits));
}
export function is_power_of_two(v) {
    const raw = v;
    return raw > 0 && (raw & (raw - 1)) === 0;
}
export function next_power_of_two(v) {
    let raw = v;
    if (raw <= 0)
        return u32(1);
    raw--;
    raw |= raw >> 1;
    raw |= raw >> 2;
    raw |= raw >> 4;
    raw |= raw >> 8;
    raw |= raw >> 16;
    return u32(raw + 1);
}
export function leading_zeros(v) {
    let raw = v;
    if (raw === 0)
        return u32(32);
    let count = 0;
    while ((raw & 0x80000000) === 0) {
        count++;
        raw <<= 1;
    }
    return u32(count);
}
export function trailing_zeros(v) {
    let raw = v;
    if (raw === 0)
        return u32(32);
    let count = 0;
    while ((raw & 1) === 0) {
        count++;
        raw >>= 1;
    }
    return u32(count);
}
export function count_ones(v) {
    let raw = v;
    let count = 0;
    while (raw !== 0) {
        count += raw & 1;
        raw >>>= 1;
    }
    return u32(count);
}
export function u8_to_u16(value) {
    return u16(value);
}
export function u8_to_u32(value) {
    return u32(value);
}
export function u8_to_u64(value) {
    return u64(value);
}
export function u16_to_u32(value) {
    return u32(value);
}
export function u16_to_u64(value) {
    return u64(value);
}
export function u32_to_u64(value) {
    return u64(value);
}
export function i8_to_i16(value) {
    return i16(value);
}
export function i8_to_i32(value) {
    return i32(value);
}
export function i8_to_i64(value) {
    return i64(value);
}
export function i16_to_i32(value) {
    return i32(value);
}
export function i16_to_i64(value) {
    return i64(value);
}
export function i32_to_i64(value) {
    return i64(value);
}
export function f32_to_f64(value) {
    return f64(value);
}
export function u8_to_i8(value) {
    const num = value;
    if (num > limits.i8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Value ${num} is too large for i8`)));
    }
    return Ok(i8(num));
}
export function u16_to_i16(value) {
    const num = value;
    if (num > limits.i16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Value ${num} is too large for i16`)));
    }
    return Ok(i16(num));
}
export function u32_to_i32(value) {
    const num = value;
    if (num > limits.i32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Value ${num} is too large for i32`)));
    }
    return Ok(i32(num));
}
export function i8_to_u8(value) {
    const num = value;
    if (num < 0) {
        return Err(new ValidationError(Str.fromRaw(`Cannot convert negative value ${num} to u8`)));
    }
    return Ok(u8(num));
}
export function i16_to_u16(value) {
    const num = value;
    if (num < 0) {
        return Err(new ValidationError(Str.fromRaw(`Cannot convert negative value ${num} to u16`)));
    }
    return Ok(u16(num));
}
export function i32_to_u32(value) {
    const num = value;
    if (num < 0) {
        return Err(new ValidationError(Str.fromRaw(`Cannot convert negative value ${num} to u32`)));
    }
    return Ok(u32(num));
}
export function f32_to_i32(value) {
    const num = value;
    if (!Number.isInteger(num)) {
        return Err(new ValidationError(Str.fromRaw(`Cannot convert non-integer value ${num} to i32`)));
    }
    if (num < limits.i32[0] || num > limits.i32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Value ${num} is outside i32 range`)));
    }
    return Ok(i32(num));
}
export function f64_to_i64(value) {
    const num = value;
    if (!Number.isInteger(num)) {
        return Err(new ValidationError(Str.fromRaw(`Cannot convert non-integer value ${num} to i64`)));
    }
    if (num < limits.i64[0] || num > limits.i64[1]) {
        return Err(new ValidationError(Str.fromRaw(`Value ${num} is outside i64 range`)));
    }
    return Ok(i64(num));
}
export function i32_to_f32(value) {
    return f32(value);
}
export function i64_to_f64(value) {
    return f64(value);
}
export function add_u8(a, b) {
    const sum = a + b;
    if (sum > limits.u8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u8: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u8(sum));
}
export function add_u16(a, b) {
    const sum = a + b;
    if (sum > limits.u16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u16: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u16(sum));
}
export function add_u32(a, b) {
    const sum = a + b;
    if (sum > limits.u32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u32: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u32(sum));
}
export function add_i8(a, b) {
    const sum = a + b;
    if (sum < limits.i8[0] || sum > limits.i8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow i8: ${a} + ${b} = ${sum}`)));
    }
    return Ok(i8(sum));
}
export function add_i16(a, b) {
    const sum = a + b;
    if (sum < limits.i16[0] || sum > limits.i16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow i16: ${a} + ${b} = ${sum}`)));
    }
    return Ok(i16(sum));
}
export function add_i32(a, b) {
    const sum = a + b;
    if (sum < limits.i32[0] || sum > limits.i32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow i32: ${a} + ${b} = ${sum}`)));
    }
    return Ok(i32(sum));
}
export function sub_u8(a, b) {
    const diff = a - b;
    if (diff < limits.u8[0]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would underflow u8: ${a} - ${b} = ${diff}`)));
    }
    return Ok(u8(diff));
}
export function sub_u16(a, b) {
    const diff = a - b;
    if (diff < limits.u16[0]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would underflow u16: ${a} - ${b} = ${diff}`)));
    }
    return Ok(u16(diff));
}
export function sub_u32(a, b) {
    const diff = a - b;
    if (diff < limits.u32[0]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b} = ${diff}`)));
    }
    return Ok(u32(diff));
}
export function sub_i8(a, b) {
    const diff = a - b;
    if (diff < limits.i8[0] || diff > limits.i8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would overflow i8: ${a} - ${b} = ${diff}`)));
    }
    return Ok(i8(diff));
}
export function sub_i16(a, b) {
    const diff = a - b;
    if (diff < limits.i16[0] || diff > limits.i16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would overflow i16: ${a} - ${b} = ${diff}`)));
    }
    return Ok(i16(diff));
}
export function sub_i32(a, b) {
    const diff = a - b;
    if (diff < limits.i32[0] || diff > limits.i32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would overflow i32: ${a} - ${b} = ${diff}`)));
    }
    return Ok(i32(diff));
}
export function mul_u8(a, b) {
    const product = a * b;
    if (product > limits.u8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow u8: ${a} * ${b} = ${product}`)));
    }
    return Ok(u8(product));
}
export function mul_u16(a, b) {
    const product = a * b;
    if (product > limits.u16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow u16: ${a} * ${b} = ${product}`)));
    }
    return Ok(u16(product));
}
export function mul_u32(a, b) {
    const product = a * b;
    if (product > limits.u32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow u32: ${a} * ${b} = ${product}`)));
    }
    return Ok(u32(product));
}
export function mul_i8(a, b) {
    const product = a * b;
    if (product < limits.i8[0] || product > limits.i8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow i8: ${a} * ${b} = ${product}`)));
    }
    return Ok(i8(product));
}
export function mul_i16(a, b) {
    const product = a * b;
    if (product < limits.i16[0] || product > limits.i16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow i16: ${a} * ${b} = ${product}`)));
    }
    return Ok(i16(product));
}
export function mul_i32(a, b) {
    const product = a * b;
    if (product < limits.i32[0] || product > limits.i32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow i32: ${a} * ${b} = ${product}`)));
    }
    return Ok(i32(product));
}
export function div_u8(a, b) {
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    return Ok(u8(Math.floor(a / bValue)));
}
export function div_u16(a, b) {
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    return Ok(u16(Math.floor(a / bValue)));
}
export function div_u32(a, b) {
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    return Ok(u32(Math.floor(a / bValue)));
}
export function div_i8(a, b) {
    const aValue = a;
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    if (aValue === limits.i8[0] && bValue === -1) {
        return Err(new ValidationError(Str.fromRaw("Division would overflow")));
    }
    return Ok(i8(Math.trunc(aValue / bValue)));
}
export function div_i16(a, b) {
    const aValue = a;
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    if (aValue === limits.i16[0] && bValue === -1) {
        return Err(new ValidationError(Str.fromRaw("Division would overflow")));
    }
    return Ok(i16(Math.trunc(aValue / bValue)));
}
export function div_i32(a, b) {
    const aValue = a;
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    if (aValue === limits.i32[0] && bValue === -1) {
        return Err(new ValidationError(Str.fromRaw("Division would overflow")));
    }
    return Ok(i32(Math.trunc(aValue / bValue)));
}
export function to_binary(value) {
    return value.toString(2);
}
export function to_hex(value) {
    return value.toString(16);
}
export function to_octal(value) {
    return value.toString(8);
}
export const Byte = u8;
export const Short = i16;
export const Int = i32;
export const Long = i64;
export const UInt = u32;
export const ULong = u64;
export const Float = f32;
export const Double = f64;
