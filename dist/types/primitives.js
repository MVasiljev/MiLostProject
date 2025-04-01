import { ValidationError, Ok, Err } from "../core/index.js";
import { Str } from "./string.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
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
        }
        catch (error) {
            console.warn(`WASM validation failed, falling back to JS implementation: ${error}`);
        }
    }
    const [min, max] = limits[name];
    return name.startsWith("f")
        ? isFiniteNum(value)
        : isInt(value) && value >= min && value <= max;
}
function wrap(name, value) {
    if (!validate(name, value)) {
        throw new ValidationError(Str.fromRaw(`Invalid value for type: ${name}`));
    }
    return value;
}
function safeWrap(name, value) {
    return validate(name, value)
        ? Ok(value)
        : Err(new ValidationError(Str.fromRaw(`Invalid value for type: ${name}`)));
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
export async function initPrimitives() {
    if (!isWasmInitialized()) {
        try {
            await initWasm();
        }
        catch (error) {
            console.warn(`WASM module not available, using JS implementation: ${error}`);
        }
    }
}
export function format_bin(v) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return Str.fromRaw(primitives.formatBin(v));
        }
        catch (error) {
            console.warn(`WASM formatBin failed, using JS fallback: ${error}`);
        }
    }
    return Str.fromRaw(v.toString(2));
}
export function format_hex(v) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return Str.fromRaw(primitives.formatHex(v));
        }
        catch (error) {
            console.warn(`WASM formatHex failed, using JS fallback: ${error}`);
        }
    }
    return Str.fromRaw(v.toString(16));
}
export function format_oct(v) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return Str.fromRaw(primitives.formatOct(v));
        }
        catch (error) {
            console.warn(`WASM formatOct failed, using JS fallback: ${error}`);
        }
    }
    return Str.fromRaw(v.toString(8));
}
export function format_int(v, radix, pad) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return Str.fromRaw(primitives.formatInt(v, radix, pad));
        }
        catch (error) {
            console.warn(`WASM formatInt failed, using JS fallback: ${error}`);
        }
    }
    const raw = v.toString(radix);
    return Str.fromRaw(raw.padStart(pad, "0"));
}
export function format_float(v, digits = u8(2)) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return Str.fromRaw(primitives.formatFloat(v, digits));
        }
        catch (error) {
            console.warn(`WASM formatFloat failed, using JS fallback: ${error}`);
        }
    }
    return Str.fromRaw(v.toFixed(digits));
}
export function is_power_of_two(v) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return primitives.isPowerOfTwo(v);
        }
        catch (error) {
            console.warn(`WASM isPowerOfTwo failed, using JS fallback: ${error}`);
        }
    }
    const raw = v;
    return raw > 0 && (raw & (raw - 1)) === 0;
}
export function next_power_of_two(v) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return u32(primitives.nextPowerOfTwo(v));
        }
        catch (error) {
            console.warn(`WASM nextPowerOfTwo failed, using JS fallback: ${error}`);
        }
    }
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
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return u32(primitives.leadingZeros(v));
        }
        catch (error) {
            console.warn(`WASM leadingZeros failed, using JS fallback: ${error}`);
        }
    }
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
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return u32(primitives.trailingZeros(v));
        }
        catch (error) {
            console.warn(`WASM trailingZeros failed, using JS fallback: ${error}`);
        }
    }
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
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            return u32(primitives.countOnes(v));
        }
        catch (error) {
            console.warn(`WASM countOnes failed, using JS fallback: ${error}`);
        }
    }
    let raw = v;
    let count = 0;
    while (raw !== 0) {
        count += raw & 1;
        raw >>>= 1;
    }
    return u32(count);
}
export function add_u8(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.addU8(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw(`Addition would overflow u8: ${a} + ${b}`)));
            }
            return Ok(u8(result));
        }
        catch (error) {
            console.warn(`WASM addU8 failed, using JS fallback: ${error}`);
        }
    }
    const sum = a + b;
    if (sum > limits.u8[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u8: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u8(sum));
}
export function add_u16(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.addU16(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw(`Addition would overflow u16: ${a} + ${b}`)));
            }
            return Ok(u16(result));
        }
        catch (error) {
            console.warn(`WASM addU16 failed, using JS fallback: ${error}`);
        }
    }
    const sum = a + b;
    if (sum > limits.u16[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u16: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u16(sum));
}
export function add_u32(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.addU32(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw(`Addition would overflow u32: ${a} + ${b}`)));
            }
            return Ok(u32(result));
        }
        catch (error) {
            console.warn(`WASM addU32 failed, using JS fallback: ${error}`);
        }
    }
    const sum = a + b;
    if (sum > limits.u32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Addition would overflow u32: ${a} + ${b} = ${sum}`)));
    }
    return Ok(u32(sum));
}
export function sub_u32(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.subU32(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b}`)));
            }
            return Ok(u32(result));
        }
        catch (error) {
            console.warn(`WASM subU32 failed, using JS fallback: ${error}`);
        }
    }
    const diff = a - b;
    if (diff < limits.u32[0]) {
        return Err(new ValidationError(Str.fromRaw(`Subtraction would underflow u32: ${a} - ${b} = ${diff}`)));
    }
    return Ok(u32(diff));
}
export function mul_u32(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.mulU32(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow u32: ${a} * ${b}`)));
            }
            return Ok(u32(result));
        }
        catch (error) {
            console.warn(`WASM mulU32 failed, using JS fallback: ${error}`);
        }
    }
    const product = a * b;
    if (product > limits.u32[1]) {
        return Err(new ValidationError(Str.fromRaw(`Multiplication would overflow u32: ${a} * ${b} = ${product}`)));
    }
    return Ok(u32(product));
}
export function div_u32(a, b) {
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const primitives = wasmModule.Primitives;
            const result = primitives.divU32(a, b);
            if (result === null || result === undefined) {
                return Err(new ValidationError(Str.fromRaw("Division by zero")));
            }
            return Ok(u32(result));
        }
        catch (error) {
            console.warn(`WASM divU32 failed, using JS fallback: ${error}`);
        }
    }
    const bValue = b;
    if (bValue === 0) {
        return Err(new ValidationError(Str.fromRaw("Division by zero")));
    }
    return Ok(u32(Math.floor(a / bValue)));
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
export const Byte = u8;
export const Short = i16;
export const Int = i32;
export const Long = i64;
export const UInt = u32;
export const ULong = u64;
export const Float = f32;
export const Double = f64;
export function to_binary(value) {
    return value.toString(2);
}
export function to_hex(value) {
    return value.toString(16);
}
export function to_octal(value) {
    return value.toString(8);
}
//# sourceMappingURL=primitives.js.map